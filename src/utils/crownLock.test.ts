import { describe, expect, it } from 'vitest';
import { crownLock } from '../generated/crown-lock';
import { verifyCrownPassword, type CrownLockData } from './crownLock';

const password = (globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
}).process?.env?.CROWN_PASSWORD ?? '';
const decodeBase64 = (value: string) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
const encodeBase64 = (value: Uint8Array) =>
  btoa(String.fromCharCode(...value));
const alter = (value: string) => {
  const bytes = decodeBase64(value);
  bytes[0] ^= 1;
  return encodeBase64(bytes);
};

async function withPayload(payload: Record<string, unknown>): Promise<CrownLockData> {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password.trim()),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: decodeBase64(crownLock.salt),
      iterations: crownLock.iterations
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: decodeBase64(crownLock.iv) },
    key,
    new TextEncoder().encode(JSON.stringify(payload))
  );
  return { ...crownLock, ciphertext: encodeBase64(new Uint8Array(ciphertext)) };
}

describe('verifyCrownPassword', () => {
  it('accepts the correct trimmed password', async () => {
    expect(password).not.toBe('');
    await expect(verifyCrownPassword(`  ${password.trim()}  `)).resolves.toBe(true);
  });

  it('rejects a wrong password', async () => {
    await expect(verifyCrownPassword('definitely-not-the-crown-password')).resolves.toBe(false);
  });

  it.each([
    ['ciphertext', { ...crownLock, ciphertext: alter(crownLock.ciphertext) }],
    ['salt', { ...crownLock, salt: alter(crownLock.salt) }],
    ['iv', { ...crownLock, iv: alter(crownLock.iv) }]
  ])('rejects altered %s', async (_field, lock) => {
    await expect(verifyCrownPassword(password, lock)).resolves.toBe(false);
  });

  it('rejects a decrypted payload with the wrong marker', async () => {
    const lock = await withPayload({ version: 1, marker: 'WRONG', nonce: 'present' });
    await expect(verifyCrownPassword(password, lock)).resolves.toBe(false);
  });
});
