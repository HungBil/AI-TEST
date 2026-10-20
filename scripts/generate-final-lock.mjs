import { webcrypto, randomBytes } from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const password = process.env.FINAL_REVIEW_PASSWORD?.trim();
if (!password || password.length > 256) {
  console.error('Set FINAL_REVIEW_PASSWORD in a private shell; it must contain 1–256 trimmed characters. Never put it in a VITE_* variable.');
  process.exit(1);
}
const salt = randomBytes(16), iv = randomBytes(12), iterations = 600_000;
const input = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, input, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const payload = { version: 1, marker: 'AI_TEST_FINAL_REVIEW', nonce: randomBytes(32).toString('hex') };
const ciphertext = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(payload)));
const output = { version: 1, iterations, salt: salt.toString('base64'), iv: iv.toString('base64'), ciphertext: Buffer.from(ciphertext).toString('base64') };
const target = fileURLToPath(new URL('../src/finals/lock.json', import.meta.url));
fs.writeFileSync(target, JSON.stringify(output, null, 2) + '\n', { mode: 0o644 });
console.log('Updated src/finals/lock.json. Only a public client-side verifier was written; the key was not stored.');
