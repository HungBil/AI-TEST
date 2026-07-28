import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NEW_EXAMS_DIR = path.join(ROOT, 'src', 'data', 'new-exams');
const BUNDLE_DIR = path.join(NEW_EXAMS_DIR, 'bundle');
const BINARY_BUNDLE = path.join(BUNDLE_DIR, 'exams-02-10.json.gz');
const EXPECTED_FILES = Array.from({ length: 9 }, (_, index) => `new-2026-${String(index + 2).padStart(2, '0')}.json`);

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function readCompressedArchive() {
  if (fs.existsSync(BINARY_BUNDLE)) return fs.readFileSync(BINARY_BUNDLE);

  const partFiles = fs.readdirSync(BUNDLE_DIR)
    .filter((file) => /^exams-02-10\.json\.gz\.b64\.part-\d+$/i.test(file))
    .sort();
  if (partFiles.length === 0) fail('Không tìm thấy bundle câu hỏi khóa mới.');

  const encoded = partFiles
    .map((file) => fs.readFileSync(path.join(BUNDLE_DIR, file), 'utf8'))
    .join('')
    .replace(/\s+/g, '');
  return Buffer.from(encoded, 'base64');
}

let archive;
try {
  archive = JSON.parse(gunzipSync(readCompressedArchive()).toString('utf8'));
} catch (error) {
  fail(`Bundle đề không hợp lệ: ${error.message}`);
}

const archiveFiles = Object.keys(archive).sort();
if (archiveFiles.join('|') !== EXPECTED_FILES.join('|')) {
  fail(`Bundle phải chứa đúng ${EXPECTED_FILES.join(', ')}`);
}

let changed = 0;
for (const file of EXPECTED_FILES) {
  const exam = archive[file];
  if (!exam || typeof exam !== 'object' || !Array.isArray(exam.questions)) {
    fail(`${file}: dữ liệu đề không hợp lệ`);
  }

  const target = path.join(NEW_EXAMS_DIR, file);
  const content = `${JSON.stringify(exam, null, 2)}\n`;
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (current !== content) {
    fs.writeFileSync(target, content, 'utf8');
    changed += 1;
  }
}

console.log(`✅ Materialized ${EXPECTED_FILES.length} expanded exams (${changed} file(s) changed).`);
