import { hasFinalCatalog, setFinalCatalog, type FinalCatalog } from './catalog';

export interface FinalLock {
  version: number; iterations: number; salt: string; iv: string; ciphertext: string;
}
export const FINAL_SESSION_KEY = 'ai-test:finals:unlocked:v1';
export const FINAL_ATTEMPTS_KEY = 'ai-test:finals:attempts:v1';
export const FINAL_MARKER = 'AI_TEST_FINAL_REVIEW';
const decode = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));

interface FinalPayload { version: number; marker: string; nonce: string; catalog?: unknown }
async function decryptPayload(password: string, lock: FinalLock): Promise<FinalPayload | null> {
  try {
    const candidate = password.trim();
    if (!candidate || candidate.length > 256 || lock.version !== 1
      || !Number.isInteger(lock.iterations) || lock.iterations < 600_000 || lock.iterations > 2_000_000
      || typeof lock.ciphertext !== 'string' || lock.ciphertext.length > 32_000_000) return null;
    const salt = decode(lock.salt), iv = decode(lock.iv), ciphertext = decode(lock.ciphertext);
    if (salt.length !== 16 || iv.length !== 12 || ciphertext.length < 16) return null;
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(candidate), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: lock.iterations },
      base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );
    const bytes = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    return payload?.version === 1 && payload.marker === FINAL_MARKER
      && typeof payload.nonce === 'string' && payload.nonce.length > 0 ? payload : null;
  } catch { return null; }
}

export async function verifyFinalPassword(password: string, lock?: FinalLock): Promise<boolean> {
  return (await decryptPayload(password, lock ?? (await import('./lock.json')).default)) !== null;
}

export async function decryptFinalCatalog(password: string, lock?: FinalLock): Promise<FinalCatalog | null> {
  const payload = await decryptPayload(password, lock ?? (await import('./lock.json')).default);
  const catalog = payload?.catalog;
  if (!catalog || typeof catalog !== 'object') return null;
  const value = catalog as Partial<FinalCatalog>;
  if (value.schemaVersion !== 1 || !Array.isArray(value.sources) || !Array.isArray(value.trackDefinitions)
    || !Array.isArray(value.exams) || !Array.isArray(value.cheatSheets)) return null;
  return value as FinalCatalog;
}

export function finalUnlocked(): boolean {
  return hasFinalCatalog();
}
export function rememberFinalUnlock(): void {
  if (!finalUnlocked()) return;
  try { sessionStorage.setItem(FINAL_SESSION_KEY, 'true'); } catch { /* Current page still works. */ }
}
export function lockFinalSession(): void {
  setFinalCatalog(null);
  try { sessionStorage.removeItem(FINAL_SESSION_KEY); } catch { /* No stored session. */ }
}
