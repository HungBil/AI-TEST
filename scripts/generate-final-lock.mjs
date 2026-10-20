import { webcrypto, randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateFinals, validateFinalVault } from './validate-finals.mjs';

export async function encryptFinalCatalog(catalog, password) {
  if (typeof password !== 'string' || password.trim().length < 20 || password.trim().length > 256) {
    throw new Error('Use a private passphrase of 20–256 characters.');
  }
  const plan = JSON.parse(fs.readFileSync(new URL('../src/finals/plan.json', import.meta.url), 'utf8'));
  const { errors } = validateFinals(catalog, plan);
  if (errors.length) throw new Error(errors.join('\n'));
  if (!catalog.exams.some(exam => exam.status === 'published')) throw new Error('Publish at least one validated exam before packing.');
  const salt = randomBytes(16), iv = randomBytes(12), iterations = 600_000;
  const input = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password.trim()), 'PBKDF2', false, ['deriveKey']);
  const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, input, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const payload = { version: 1, marker: 'AI_TEST_FINAL_REVIEW', nonce: randomBytes(32).toString('hex'), catalog };
  const ciphertext = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(payload)));
  const output = { version: 1, iterations, salt: salt.toString('base64'), iv: iv.toString('base64'), ciphertext: Buffer.from(ciphertext).toString('base64') };
  validateFinalVault(output);
  return output;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [catalogPath, keyPath] = process.argv.slice(2);
    if (!catalogPath) throw new Error('Usage: npm run generate:final-lock -- <private-catalog.json> [private-key-file]. Keep both outside this public repository.');
    const repoRoot = fileURLToPath(new URL('../', import.meta.url));
    for (const input of [catalogPath, keyPath].filter(Boolean)) {
      const relative = path.relative(fs.realpathSync(repoRoot), fs.realpathSync(input));
      if (!relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)) throw new Error('Private input files must be outside the public repository.');
    }
    const password = keyPath ? fs.readFileSync(keyPath, 'utf8').trim() : process.env.FINAL_REVIEW_PASSWORD;
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const output = await encryptFinalCatalog(catalog, password);
    const target = new URL('../src/finals/lock.json', import.meta.url);
    const temporary = fileURLToPath(target) + '.tmp';
    fs.writeFileSync(temporary, JSON.stringify(output, null, 2) + '\n');
    fs.renameSync(temporary, target);
    console.log(`Encrypted ${catalog.exams.filter(e => e.status === 'published').length} exam(s) and ${catalog.cheatSheets.filter(s => s.status === 'published').length} cheat sheet(s). Password and plaintext were not written to the repository.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
