import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const NEW_DIR = path.join(ROOT, 'src', 'data', 'new-exams');
const EXPECTED_IDS = Array.from({ length: 10 }, (_, index) => `new-2026-${String(index + 1).padStart(2, '0')}`);
const REQUIRED_SKILL_PREFIXES = [
  'probability.bayes',
  'probability.conditional',
  'matrix.inverse',
  'matrix.multiplication',
  'euclid.',
  'api.',
  'numpy.',
  'ml.metrics.',
  'ml.svm.',
  'ml.backprop.',
  'rag.',
  'privacy.',
  'essay.'
];
const SPECIALIZED_ML_PREFIXES = ['ml.metrics.', 'ml.svm.', 'ml.backprop.'];

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
const collectionSkills = new Set();
const essayCombinationKeys = new Set();

for (const exam of exams) {
  const questions = Array.isArray(exam.questions) ? exam.questions : [];
  const essays = questions.filter((question) => question.type === 'essay');
  const codeQuestions = questions.filter((question) => question.type === 'code');
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  const skillIds = new Set();
  let l3ToL4Count = 0;

  for (const question of questions) {
    if (question.module in counts) counts[question.module] += 1;
    if (globalIds.has(question.id)) fail(`Trùng question.id toàn bộ collection: ${question.id}`);
    globalIds.add(question.id);

    if (typeof question.skillId !== 'string' || !question.skillId.trim()) {
      fail(`${question.id}: thiếu skillId`);
    } else {
      skillIds.add(question.skillId);
      collectionSkills.add(question.skillId);
    }
    if (!['L3', 'L3-L4'].includes(question.sfiaBand)) {
      fail(`${question.id}: sfiaBand phải là L3 hoặc L3-L4`);
    }
    if (question.sfiaBand === 'L3-L4') l3ToL4Count += 1;
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
  if (skillIds.size < 48) {
    fail(`${exam.id}: chỉ có ${skillIds.size} skillId khác nhau; đề đang lặp kỹ năng quá nhiều trong chính nó`);
  }
  if (l3ToL4Count !== 5) {
    fail(`${exam.id}: phải có đúng 5 câu L3-L4 (2 code + 3 tự luận), hiện có ${l3ToL4Count}`);
  }

  const examNo = Number(exam.id.slice(-2));
  if (examNo >= 3) {
    const specializedCount = questions.filter((question) =>
      SPECIALIZED_ML_PREFIXES.some((prefix) => question.skillId?.startsWith(prefix))
    ).length;
    if (specializedCount < 2) {
      fail(`${exam.id}: cần ít nhất 2 câu confusion matrix/SVM/backprop để phản ánh dữ liệu khóa trước`);
    }
  }

  const essayKey = essays.map((question) => question.skillId).sort().join('|');
  if (essayCombinationKeys.has(essayKey)) {
    fail(`${exam.id}: bộ ba tự luận trùng hoàn toàn với một đề trước`);
  }
  essayCombinationKeys.add(essayKey);

  totalQuestions += questions.length;
  totalEssays += essays.length;
  totalCodeQuestions += codeQuestions.length;
}

for (const prefix of REQUIRED_SKILL_PREFIXES) {
  if (![...collectionSkills].some((skill) => skill.startsWith(prefix))) {
    fail(`Collection thiếu nhóm kỹ năng bắt buộc: ${prefix}`);
  }
}

for (let left = 0; left < exams.length; left += 1) {
  for (let right = left + 1; right < exams.length; right += 1) {
    const leftSkills = new Set(exams[left].questions.map((question) => question.skillId));
    const rightSkills = new Set(exams[right].questions.map((question) => question.skillId));
    const overlap = [...leftSkills].filter((skill) => rightSkills.has(skill)).length;
    const union = new Set([...leftSkills, ...rightSkills]).size;
    const jaccard = overlap / union;
    const rightPrompts = new Set(exams[right].questions.map((question) => question.prompt));
    const exactPromptOverlap = exams[left].questions.filter((question) => rightPrompts.has(question.prompt)).length;

    if (jaccard > 0.9) {
      fail(`${exams[left].id}/${exams[right].id}: skill overlap quá cao (${(jaccard * 100).toFixed(1)}%)`);
    }
    if (exactPromptOverlap > 30) {
      fail(`${exams[left].id}/${exams[right].id}: có ${exactPromptOverlap} prompt giống nguyên văn`);
    }
  }
}

if (exams.length !== 10) fail(`Bộ Crown phải có đúng 10 đề, hiện có ${exams.length}`);
if (totalQuestions !== 600) fail(`Bộ Crown phải có đúng 600 câu, hiện có ${totalQuestions}`);
if (totalEssays !== 30) fail(`Bộ Crown phải có đúng 30 câu tự luận, hiện có ${totalEssays}`);
if (totalCodeQuestions !== 20) fail(`Bộ Crown phải có đúng 20 câu code, hiện có ${totalCodeQuestions}`);

if (process.exitCode) process.exit(process.exitCode);
console.log(`✅ Crown balanced set: ${exams.length} đề, ${totalQuestions} câu, ${totalEssays} tự luận, ${totalCodeQuestions} câu code.`);
