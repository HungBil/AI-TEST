import assert from 'node:assert/strict';
import worker from './src/index.js';

const ORIGIN = 'https://hungbil.github.io';
const PASSWORD = 'ci-only-password-not-used-in-production';
const headers = {
  Origin: ORIGIN,
  'Content-Type': 'application/json',
  'X-Crown-Device': 'ci-device'
};

function request(path, payload, origin = ORIGIN) {
  return new Request(`https://crown.example${path}`, {
    method: 'POST',
    headers: { ...headers, Origin: origin },
    body: JSON.stringify(payload)
  });
}

function env(overrides = {}) {
  return {
    ALLOWED_ORIGINS: `${ORIGIN},http://localhost:5173`,
    TOKEN_TTL_SECONDS: '3600',
    CROWN_PASSWORD: PASSWORD,
    CROWN_TOKEN_SECRET: 'ci-signing-key-that-is-long-enough-for-tests',
    CROWN_GLOBAL_LIMITER: { limit: async () => ({ success: true }) },
    CROWN_CLIENT_LIMITER: { limit: async () => ({ success: true }) },
    ...overrides
  };
}

let response = await worker.fetch(request('/unlock', { password: 'wrong' }), env());
assert.equal(response.status, 401);
assert.equal((await response.json()).error, 'invalid-credentials');

response = await worker.fetch(request('/unlock', { password: PASSWORD }), env());
assert.equal(response.status, 200);
const unlocked = await response.json();
assert.equal(unlocked.ok, true);
assert.equal(typeof unlocked.token, 'string');
assert.ok(unlocked.token.length > 40);

response = await worker.fetch(request('/verify', { token: unlocked.token }), env());
assert.equal(response.status, 200);
assert.deepEqual(await response.json(), { ok: true });

response = await worker.fetch(request('/verify', { token: `${unlocked.token}x` }), env());
assert.equal(response.status, 401);

response = await worker.fetch(request('/unlock', { password: PASSWORD }, 'https://evil.example'), env());
assert.equal(response.status, 403);

response = await worker.fetch(
  request('/unlock', { password: PASSWORD }),
  env({ CROWN_CLIENT_LIMITER: { limit: async () => ({ success: false }) } })
);
assert.equal(response.status, 429);

console.log('Crown Worker tests passed.');
