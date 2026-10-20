import finalLock from './lock.json';

export interface FinalLock {
  version: number; iterations: number; salt: string; iv: string; ciphertext: string;
}
export const FINAL_SESSION_KEY = 'ai-test:finals:unlocked:v1';
export const FINAL_ATTEMPTS_KEY = 'ai-test:finals:attempts:v1';
export const FINAL_MARKER = 'AI_TEST_FINAL_REVIEW';
const decode = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));

// A client-side study gate, not authentication or protection of public exam data.
export async function verifyFinalPassword(password: string, lock: FinalLock = finalLock): Promise<boolean> {
  try {
    const candidate = password.trim();
    if (!candidate || candidate.length > 256 || lock.version !== 1
      || !Number.isInteger(lock.iterations) || lock.iterations < 600_000 || lock.iterations > 2_000_000) return false;
    const salt = decode(lock.salt), iv = decode(lock.iv);
    if (salt.length !== 16 || iv.length !== 12) return false;
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(candidate), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: lock.iterations },
      base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );
    const bytes = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, decode(lock.ciphertext));
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    return payload?.version === 1 && payload.marker === FINAL_MARKER
      && typeof payload.nonce === 'string' && payload.nonce.length > 0;
  } catch { return false; }
}

export function finalUnlocked(): boolean {
  try { return sessionStorage.getItem(FINAL_SESSION_KEY) === 'true'; } catch { return false; }
}
export function rememberFinalUnlock(): void {
  try { sessionStorage.setItem(FINAL_SESSION_KEY, 'true'); } catch { /* Current page still works. */ }
}
export function lockFinalSession(): void {
  try { sessionStorage.removeItem(FINAL_SESSION_KEY); } catch { /* No stored session. */ }
}
