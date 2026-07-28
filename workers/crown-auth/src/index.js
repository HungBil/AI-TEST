const encoder = new TextEncoder();
const decoder = new TextDecoder();

function allowedOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return null;
  const allowed = String(env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return allowed.includes(origin) ? origin : null;
}

function responseHeaders(origin) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Crown-Device',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin'
  };
}

function json(origin, status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders(origin)
  });
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function textToBase64Url(value) {
  return bytesToBase64Url(encoder.encode(value));
}

function base64UrlToText(value) {
  return decoder.decode(base64UrlToBytes(value));
}

async function sha256(value) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

function timingSafeEqual(left, right) {
  if (!(left instanceof Uint8Array) || !(right instanceof Uint8Array) || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

async function passwordMatches(candidate, expected) {
  const [candidateDigest, expectedDigest] = await Promise.all([
    sha256(candidate),
    sha256(expected)
  ]);
  return timingSafeEqual(candidateDigest, expectedDigest);
}

async function createToken(secret, ttlSeconds) {
  const payload = {
    v: 1,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    nonce: crypto.randomUUID()
  };
  const encodedPayload = textToBase64Url(JSON.stringify(payload));
  const signature = await hmac(secret, encodedPayload);
  return {
    token: `${encodedPayload}.${bytesToBase64Url(signature)}`,
    expiresAt: payload.exp * 1000
  };
}

async function verifyToken(token, secret) {
  if (typeof token !== 'string' || token.length > 2048) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [encodedPayload, encodedSignature] = parts;
  let suppliedSignature;
  let payload;
  try {
    suppliedSignature = base64UrlToBytes(encodedSignature);
    payload = JSON.parse(base64UrlToText(encodedPayload));
  } catch {
    return false;
  }

  const expectedSignature = await hmac(secret, encodedPayload);
  if (!timingSafeEqual(suppliedSignature, expectedSignature)) return false;
  if (!payload || payload.v !== 1 || !Number.isInteger(payload.exp)) return false;
  return payload.exp > Math.floor(Date.now() / 1000);
}

async function enforceRateLimits(request, env) {
  if (env.CROWN_GLOBAL_LIMITER) {
    const globalResult = await env.CROWN_GLOBAL_LIMITER.limit({ key: 'crown-unlock' });
    if (!globalResult.success) return false;
  }

  if (env.CROWN_CLIENT_LIMITER) {
    const device = (request.headers.get('X-Crown-Device') ?? 'no-device').slice(0, 80);
    const clientResult = await env.CROWN_CLIENT_LIMITER.limit({ key: device });
    if (!clientResult.success) return false;
  }

  return true;
}

async function readJson(request) {
  const text = await request.text();
  if (encoder.encode(text).byteLength > 4096) throw new Error('body-too-large');
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error('invalid-json');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('invalid-json');
  return body;
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env);
    if (!origin) {
      return new Response(JSON.stringify({ ok: false, error: 'origin-not-allowed' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: responseHeaders(origin) });
    }
    if (request.method !== 'POST') return json(origin, 405, { ok: false, error: 'method-not-allowed' });

    const url = new URL(request.url);
    if (!env.CROWN_PASSWORD || !env.CROWN_TOKEN_SECRET || String(env.CROWN_TOKEN_SECRET).length < 32) {
      return json(origin, 503, { ok: false, error: 'auth-not-configured' });
    }

    if (url.pathname === '/unlock') {
      if (!await enforceRateLimits(request, env)) {
        return json(origin, 429, { ok: false, error: 'rate-limited' });
      }

      let body;
      try {
        body = await readJson(request);
      } catch {
        return json(origin, 400, { ok: false, error: 'invalid-request' });
      }

      const candidate = typeof body.password === 'string' ? body.password.trim() : '';
      if (!candidate || candidate.length > 256) {
        await sleep(250);
        return json(origin, 401, { ok: false, error: 'invalid-credentials' });
      }

      const valid = await passwordMatches(candidate, env.CROWN_PASSWORD);
      if (!valid) {
        const jitter = crypto.getRandomValues(new Uint16Array(1))[0] % 250;
        await sleep(300 + jitter);
        return json(origin, 401, { ok: false, error: 'invalid-credentials' });
      }

      const configuredTtl = Number(env.TOKEN_TTL_SECONDS ?? 21600);
      const ttlSeconds = Number.isFinite(configuredTtl)
        ? Math.min(Math.max(Math.trunc(configuredTtl), 300), 86400)
        : 21600;
      const result = await createToken(env.CROWN_TOKEN_SECRET, ttlSeconds);
      return json(origin, 200, { ok: true, ...result });
    }

    if (url.pathname === '/verify') {
      let body;
      try {
        body = await readJson(request);
      } catch {
        return json(origin, 400, { ok: false, error: 'invalid-request' });
      }
      const valid = await verifyToken(body.token, env.CROWN_TOKEN_SECRET);
      return valid
        ? json(origin, 200, { ok: true })
        : json(origin, 401, { ok: false, error: 'invalid-token' });
    }

    return json(origin, 404, { ok: false, error: 'not-found' });
  }
};
