import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { copyFile, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const publicTestPassword = 'ci-test-password-only';
const sourceScript = join(dirname(fileURLToPath(import.meta.url)), 'generate-crown-lock.mjs');
const tempRoot = await mkdtemp(join(tmpdir(), 'crown-lock-'));
const testScript = join(tempRoot, 'scripts', 'generate-crown-lock.mjs');
const generatedFile = join(tempRoot, 'src', 'generated', 'crown-lock.ts');

before(async () => {
  await mkdir(dirname(testScript), { recursive: true });
  await copyFile(sourceScript, testScript);
});

after(() => rm(tempRoot, { recursive: true, force: true }));

test('generator fails clearly without CROWN_PASSWORD', () => {
  const env = { ...process.env };
  delete env.CROWN_PASSWORD;
  const result = spawnSync(process.execPath, [testScript], { cwd: tempRoot, env, encoding: 'utf8' });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /CROWN_PASSWORD is required/);
});

test('generator output contains only verifier fields, not the password', async () => {
  const result = spawnSync(process.execPath, [testScript], {
    cwd: tempRoot,
    env: { ...process.env, CROWN_PASSWORD: publicTestPassword },
    encoding: 'utf8'
  });
  assert.equal(result.status, 0);

  const output = await readFile(generatedFile, 'utf8');
  assert.equal(output.includes(publicTestPassword), false);
  assert.equal(output.includes('AI_TEST_CROWN_ACCESS'), false);
  assert.equal(output.includes('nonce'), false);
  assert.deepEqual(
    [...output.matchAll(/^\s+(version|iterations|salt|iv|ciphertext):/gm)].map((match) => match[1]),
    ['version', 'iterations', 'salt', 'iv', 'ciphertext']
  );
});
