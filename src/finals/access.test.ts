import { beforeAll, describe, expect, it } from 'vitest';
import { FINAL_MARKER, verifyFinalPassword, type FinalLock } from './access';

const password = 'unit-test-final-key-only';
let lock: FinalLock;
let crownMarkerLock: FinalLock;
const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
async function fixture(marker: string): Promise<FinalLock> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const input = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', iterations: 600_000, salt }, input, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify({ version: 1, marker, nonce: 'fixture-nonce' })));
  return { version: 1, iterations: 600_000, salt: b64(salt), iv: b64(iv), ciphertext: b64(new Uint8Array(ciphertext)) };
}
beforeAll(async () => { lock = await fixture(FINAL_MARKER); crownMarkerLock = await fixture('AI_TEST_CROWN_ACCESS'); });
describe('Final-review password verifier', () => {
  it('accepts a correct trimmed key', async () => {
    await expect(verifyFinalPassword(` ${password} `, lock)).resolves.toBe(true);
  });
  it('rejects wrong passwords and empty input', async () => {
    await expect(verifyFinalPassword('wrong', lock)).resolves.toBe(false);
    await expect(verifyFinalPassword('', lock)).resolves.toBe(false);
  });
  it('rejects Crown payloads even with a matching key', async () => {
    await expect(verifyFinalPassword(password, crownMarkerLock)).resolves.toBe(false);
  });
  it('rejects altered ciphertext', async () => {
    const changed = { ...lock, ciphertext: `${lock.ciphertext[0] === 'A' ? 'B' : 'A'}${lock.ciphertext.slice(1)}` };
    await expect(verifyFinalPassword(password, changed)).resolves.toBe(false);
  });
  it('rejects unbounded PBKDF2 configuration', async () => {
    await expect(verifyFinalPassword(password, { ...lock, iterations: 100_000_000 })).resolves.toBe(false);
  });
});
