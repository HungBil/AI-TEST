import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { FINAL_MARKER, FINAL_SESSION_KEY, decryptFinalCatalog, finalUnlocked, lockFinalSession, rememberFinalUnlock, verifyFinalPassword, type FinalLock } from './access';
import { finalCatalog, setFinalCatalog, type FinalCatalog } from './catalog';

const password = 'unit-test-final-key-only';
let lock: FinalLock;
let crownMarkerLock: FinalLock;
let catalogLock: FinalLock;
let malformedCatalogLock: FinalLock;
const catalog: FinalCatalog = {
  schemaVersion: 1,
  sources: [{ id: 'synthetic-private-source', repo: 'test-only', path: 'synthetic.md', revision: 'a'.repeat(40), phase: 'phase1', reviewed: true }],
  trackDefinitions: [], exams: [], cheatSheets: []
};
const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
async function fixture(marker: string, content?: unknown): Promise<FinalLock> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const input = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', iterations: 600_000, salt }, input, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify({ version: 1, marker, nonce: 'fixture-nonce', catalog: content })));
  return { version: 1, iterations: 600_000, salt: b64(salt), iv: b64(iv), ciphertext: b64(new Uint8Array(ciphertext)) };
}
beforeAll(async () => {
  lock = await fixture(FINAL_MARKER);
  crownMarkerLock = await fixture('AI_TEST_CROWN_ACCESS', catalog);
  catalogLock = await fixture(FINAL_MARKER, catalog);
  malformedCatalogLock = await fixture(FINAL_MARKER, { ...catalog, exams: null });
});
beforeEach(() => {
  setFinalCatalog(null);
  const stored = new Map<string, string>();
  vi.stubGlobal('sessionStorage', {
    getItem: vi.fn((key: string) => stored.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => stored.set(key, value)),
    removeItem: vi.fn((key: string) => stored.delete(key))
  });
});
afterEach(() => { setFinalCatalog(null); vi.unstubAllGlobals(); });
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

describe('Encrypted final catalog', () => {
  it('decrypts the catalog only with the correct key', async () => {
    await expect(decryptFinalCatalog(` ${password} `, catalogLock)).resolves.toEqual(catalog);
    await expect(decryptFinalCatalog('wrong', catalogLock)).resolves.toBeNull();
    expect(finalUnlocked()).toBe(false);
  });
  it('does not unlock marker-only, Crown, or malformed catalog payloads', async () => {
    for (const invalid of [lock, crownMarkerLock, malformedCatalogLock]) {
      await expect(decryptFinalCatalog(password, invalid)).resolves.toBeNull();
    }
  });
  it('ignores a forged stored unlock flag and requires the decrypted catalog', () => {
    sessionStorage.setItem(FINAL_SESSION_KEY, 'true');
    expect(finalUnlocked()).toBe(false);
    setFinalCatalog(catalog);
    expect(finalUnlocked()).toBe(true);
    lockFinalSession();
    expect(finalUnlocked()).toBe(false);
    expect(finalCatalog.sources).toEqual([]);
    expect(finalCatalog.exams).toEqual([]);
    expect(sessionStorage.getItem(FINAL_SESSION_KEY)).toBeNull();
  });
  it('stores only a flag after loading and never stores the catalog or password', () => {
    rememberFinalUnlock();
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
    setFinalCatalog(catalog);
    rememberFinalUnlock();
    expect(sessionStorage.setItem).toHaveBeenCalledExactlyOnceWith(FINAL_SESSION_KEY, 'true');
  });
});
