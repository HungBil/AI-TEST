import { webcrypto } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const password = process.env.CROWN_PASSWORD?.trim();

if (!password) {
  console.error('CROWN_PASSWORD is required to generate the Crown lock.');
  process.exit(1);
}

const iterations = 600_000;
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const iv = webcrypto.getRandomValues(new Uint8Array(12));
const nonce = webcrypto.getRandomValues(new Uint8Array(32));
const encoder = new TextEncoder();
const passwordKey = await webcrypto.subtle.importKey(
  'raw',
  encoder.encode(password),
  'PBKDF2',
  false,
  ['deriveKey']
);
const key = await webcrypto.subtle.deriveKey(
  { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
  passwordKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt']
);
const payload = encoder.encode(JSON.stringify({
  version: 1,
  marker: 'AI_TEST_CROWN_ACCESS',
  nonce: Buffer.from(nonce).toString('base64')
}));
const ciphertext = new Uint8Array(await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, payload));
const output = `export const crownLock = {
  version: 1,
  iterations: ${iterations},
  salt: '${Buffer.from(salt).toString('base64')}',
  iv: '${Buffer.from(iv).toString('base64')}',
  ciphertext: '${Buffer.from(ciphertext).toString('base64')}'
} as const;
`;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(root, 'src/generated/crown-lock.ts');

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, output, 'utf8');
console.log('Generated src/generated/crown-lock.ts.');
