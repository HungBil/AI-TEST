import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const NEW_DIR = path.join(ROOT, 'src', 'data', 'new-exams');
const EXPECTED_IDS = Array.from({ length: 10 }, (_, index) => `new-2026-${String(index + 1).padStart(2, '0')}`);

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${path.relative(ROOT, file)}: ${error.message}`);
    return null;
  }
}

const exams = EXPECTED_IDS
  .map((id) => readJson(path.join(NEW_DIR, `${id}.json`)))
  .filter(Boolean);

const ids = exams.map((exam) => exam.id).sort();
if (ids.join('|') !== EXPECTED_IDS.join('|')) {
  fail(`Bộ Crown phải có đúng các ID ${EXPECTED_IDS.join(', ')}; hiện có ${ids.join(', ') || 'không có'}`);
}

let totalQuestions = 0;
let totalEssays = 0;
let totalCodeQuestions = 0;
const globalIds = new Set();

for (const exam of exams) {
  const questions = Array.isArray(exam.questions) ? exam.questions : [];
  const essays = questions.filter((question) => question.type === 'essay');
  const codeQuestions = questions.filter((question) => question.type === 'code');
  const counts = { A: 0, B: 0, C: 0, D: 0 };

  for (const question of questions) {
    if (question.module in counts) counts[question.module] += 1;
    if (globalIds.has(question.id)) fail(`Trùng question.id toàn bộ collection: ${question.id}`);
    globalIds.add(question.id);
  }

  if (questions.length !== 60) fail(`${exam.id}: phải có 60 câu, hiện có ${questions.length}`);
  if (counts.A !== 20 || counts.B !== 20 || counts.C !== 12 || counts.D !== 8) {
    fail(`${exam.id}: phân bố module phải là 20/20/12/8, hiện là ${counts.A}/${counts.B}/${counts.C}/${counts.D}`);
  }
  if (essays.length !== 3 || !essays.every((question) => question.module === 'C')) {
    fail(`${exam.id}: phải có đúng 3 câu essay và tất cả nằm ở Module C`);
  }
  if (codeQuestions.length !== 2 || !codeQuestions.every((question) => question.module === 'B')) {
    fail(`${exam.id}: phải có đúng 2 câu code và tất cả nằm ở Module B`);
  }

  totalQuestions += questions.length;
  totalEssays += essays.length;
  totalCodeQuestions += codeQuestions.length;
}

if (exams.length !== 10) fail(`Bộ Crown phải có đúng 10 đề, hiện có ${exams.length}`);
if (totalQuestions !== 600) fail(`Bộ Crown phải có đúng 600 câu, hiện có ${totalQuestions}`);
if (totalEssays !== 30) fail(`Bộ Crown phải có đúng 30 câu tự luận, hiện có ${totalEssays}`);
if (totalCodeQuestions !== 20) fail(`Bộ Crown phải có đúng 20 câu code, hiện có ${totalCodeQuestions}`);

if (process.exitCode) process.exit(process.exitCode);
console.log(`✅ Crown baseline: ${exams.length} đề, ${totalQuestions} câu, ${totalEssays} tự luận, ${totalCodeQuestions} câu code.`);
