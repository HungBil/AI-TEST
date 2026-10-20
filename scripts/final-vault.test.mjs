import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { encryptFinalCatalog } from './generate-final-lock.mjs';
import { decryptFinalVault, validateFinalVault, validateFinals } from './validate-finals.mjs';

const plan = JSON.parse(await fs.readFile(new URL('../src/finals/plan.json', import.meta.url), 'utf8'));
const password = 'public-synthetic-test-key-only-2026';
const emptyCatalog = () => ({ schemaVersion: 1, sources: [], trackDefinitions: [], exams: [], cheatSheets: [] });

function fixture() {
  const catalog = emptyCatalog();
  catalog.sources.push({ id: 'synthetic', repo: plan.sourceRepository, path: 'TEST_ONLY.md', revision: 'a'.repeat(40), phase: 'phase1', reviewed: true });
  catalog.exams.push({
    id: 'final-p1-01', phase: 'phase1', status: 'published', title: 'Synthetic fixture only',
    description: 'Never course content', disclaimer: 'Test fixture', durationMinutes: 90, totalPoints: 100,
    questions: Array.from({ length: 85 }, (_, i) => {
      const common = {
        id: `final-p1-01-${i + 1}`, module: 'A', points: i < 80 ? 1 : 4,
        prompt: `Synthetic question ${i + 1}`, intentId: `synthetic.${i + 1}`,
        sourceRefs: [{ sourceId: 'synthetic', locator: `Line ${i + 1}` }]
      };
      return i < 60 ? {
        ...common, type: 'mcq', options: ['A', 'B', 'C', 'D'].map(key => ({ key, text: `Choice ${key}` })),
        answer: 'A', explanation: 'Synthetic explanation for the correct fixture answer.'
      } : {
        ...common, type: 'essay', responseKind: 'scenario', hint: ['One', 'Two', 'Three'], rubric: ['Reason', 'Example', 'Check'],
        modelAnswer: 'This is synthetic test content only and is never published as course material. Ví dụ: compare a controlled test input with its expected output.'
      };
    })
  });
  return catalog;
}

let vault;
before(async () => {
  assert.deepEqual(validateFinals(fixture(), plan).errors, []);
  vault = await encryptFinalCatalog(fixture(), password);
});

test('validated 85-question catalog roundtrips without plaintext in its envelope', async () => {
  validateFinalVault(vault);
  assert.deepEqual(await decryptFinalVault(vault, password), fixture());
  const serialized = JSON.stringify(vault);
  assert.equal(serialized.includes(password), false);
  assert.equal(serialized.includes('Synthetic question'), false);
  assert.deepEqual(Object.keys(vault).sort(), ['ciphertext', 'iterations', 'iv', 'salt', 'version']);
});

test('wrong key and tampered ciphertext fail authenticated decryption', async () => {
  await assert.rejects(decryptFinalVault(vault, 'another-public-fixture-password'));
  const ciphertext = Buffer.from(vault.ciphertext, 'base64');
  ciphertext[0] ^= 1;
  await assert.rejects(decryptFinalVault({ ...vault, ciphertext: ciphertext.toString('base64') }, password));
});

test('packing refuses weak keys, unpublished catalogs, and malformed content', async () => {
  for (const weak of [undefined, '', 'short', ' '.repeat(25), 'x'.repeat(257)]) {
    await assert.rejects(encryptFinalCatalog(fixture(), weak), /20–256 characters/);
  }
  await assert.rejects(encryptFinalCatalog(emptyCatalog(), password), /at least one validated exam/);
  await assert.rejects(encryptFinalCatalog({ schemaVersion: 1 }, password), /sources must be an array/);
  const unread = fixture();
  unread.sources[0].reviewed = false;
  await assert.rejects(encryptFinalCatalog(unread, password), /source not read\/reviewed/);
});

test('invalid envelope fields and unbounded KDF work are refused before decryption', async () => {
  const invalid = [
    null, {}, { ...vault, version: 2 },
    ...[0, 599_999, 2_000_001, Number.MAX_SAFE_INTEGER, Infinity, 600_000.5, '600000'].map(iterations => ({ ...vault, iterations })),
    { ...vault, salt: Buffer.alloc(15).toString('base64') },
    { ...vault, iv: Buffer.alloc(13).toString('base64') },
    { ...vault, ciphertext: Buffer.alloc(15).toString('base64') },
    ...['salt', 'iv', 'ciphertext'].flatMap(key => ['', '!!!'].map(value => ({ ...vault, [key]: value })))
  ];
  for (const envelope of invalid) {
    assert.throws(() => validateFinalVault(envelope), /Invalid encrypted/);
    await assert.rejects(decryptFinalVault(envelope, password), /Invalid encrypted/);
  }
  for (const missingKey of [undefined, '', '   ', 'x'.repeat(257)]) {
    await assert.rejects(decryptFinalVault(vault, missingKey), /private final-review key/);
  }
});

test('large bounded ciphertext validates without a regex stack overflow', () => {
  assert.doesNotThrow(() => validateFinalVault({ ...vault, ciphertext: 'A'.repeat(10_000_000) }));
  assert.throws(() => validateFinalVault({ ...vault, ciphertext: 'A'.repeat(32_000_004) }), /Invalid encrypted/);
});

let tempRoot;
after(async () => {
  if (!tempRoot) return;
  assert.equal(path.dirname(tempRoot), path.resolve(tmpdir()));
  assert.ok(path.basename(tempRoot).startsWith('final-vault-test-'));
  await fs.rm(tempRoot, { recursive: true, force: true });
});

test('CLI missing private input leaves an existing vault byte-for-byte unchanged', async () => {
  tempRoot = await fs.mkdtemp(path.join(tmpdir(), 'final-vault-test-'));
  const repo = path.join(tempRoot, 'repo');
  const scripts = path.join(repo, 'scripts');
  const finals = path.join(repo, 'src', 'finals');
  await fs.mkdir(scripts, { recursive: true });
  await fs.mkdir(finals, { recursive: true });
  for (const name of ['generate-final-lock.mjs', 'validate-finals.mjs']) {
    await fs.copyFile(fileURLToPath(new URL(name, import.meta.url)), path.join(scripts, name));
  }
  await fs.writeFile(path.join(finals, 'plan.json'), JSON.stringify(plan));
  const target = path.join(finals, 'lock.json');
  const sentinel = 'existing vault must survive\n';
  await fs.writeFile(target, sentinel);
  const env = { ...process.env };
  delete env.FINAL_REVIEW_PASSWORD;
  for (const args of [[], [path.join(tempRoot, 'missing-private-catalog.json')]]) {
    const result = spawnSync(process.execPath, [path.join(scripts, 'generate-final-lock.mjs'), ...args], {
      cwd: repo, env, encoding: 'utf8', timeout: 10_000
    });
    assert.equal(result.status, 1, result.stderr);
    assert.equal(await fs.readFile(target, 'utf8'), sentinel);
    assert.equal((await fs.readdir(finals)).includes('lock.json.tmp'), false);
  }
});
