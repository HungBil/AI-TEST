import fs from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPTS_DIR, '..');
const GENERATOR_DIR = path.join(SCRIPTS_DIR, 'exam-generator');
const TEMP_GENERATOR = path.join(SCRIPTS_DIR, '.expanded-exam-generator.tmp.mjs');
const OUTPUT_DIR = path.join(ROOT, 'src', 'data', 'new-exams');

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const parts = fs.readdirSync(GENERATOR_DIR)
  .filter((file) => /^generator\.mjs\.gz\.b64\.part-\d+$/.test(file))
  .sort();

if (parts.length === 0) fail('Không tìm thấy các phần của bộ sinh đề khóa mới.');

let source;
try {
  const encoded = parts
    .map((file) => fs.readFileSync(path.join(GENERATOR_DIR, file), 'utf8'))
    .join('')
    .replace(/\s+/g, '');
  source = gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8');
} catch (error) {
  fail(`Không thể giải nén bộ sinh đề: ${error.message}`);
}

try {
  fs.writeFileSync(TEMP_GENERATOR, source, 'utf8');
  const moduleUrl = `${pathToFileURL(TEMP_GENERATOR).href}?v=${Date.now()}`;
  const generator = await import(moduleUrl);
  if (typeof generator.materializeExpandedExams !== 'function') {
    fail('Bộ sinh đề không export materializeExpandedExams().');
  }
  const { exams, changed } = generator.materializeExpandedExams(OUTPUT_DIR);
  console.log(`✅ Materialized ${exams.length} expanded exams (${changed} file(s) changed).`);
} finally {
  fs.rmSync(TEMP_GENERATOR, { force: true });
}
