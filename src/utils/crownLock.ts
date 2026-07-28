import { crownLock } from '../generated/crown-lock';

export interface CrownLockData {
  version: number;
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
}

const decodeBase64 = (value: string) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

export async function verifyCrownPassword(
  password: string,
  lock: CrownLockData = crownLock
): Promise<boolean> {
  try {
    const candidate = password.trim();
    if (!candidate || lock.version !== 1 || !Number.isInteger(lock.iterations) || lock.iterations < 600_000) {
      return false;
    }

    const passwordKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(candidate),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: decodeBase64(lock.salt),
        iterations: lock.iterations
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: decodeBase64(lock.iv) },
      key,
      decodeBase64(lock.ciphertext)
    );
    const payload = JSON.parse(new TextDecoder().decode(plaintext)) as Record<string, unknown>;

    return payload.version === 1
      && payload.marker === 'AI_TEST_CROWN_ACCESS'
      && typeof payload.nonce === 'string'
      && payload.nonce.length > 0;
  } catch {
    return false;
  }
}
