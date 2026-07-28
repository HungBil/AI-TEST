import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const LEGACY_DIR = path.join(ROOT, 'src', 'data', 'exams');
const NEW_DIR = path.join(ROOT, 'src', 'data', 'new-exams');
const MODULE_FILES = ['module-a.json', 'module-b.json', 'module-c.json', 'module-d.json'];
const VALID_MODULES = new Set(['A', 'B', 'C', 'D']);
const VALID_TYPES = new Set(['mcq', 'code', 'essay']);
const VALID_ANSWERS = new Set(['A', 'B', 'C', 'D']);
const EXPECTED_NEW_IDS = Array.from({ length: 10 }, (_, index) => `new-2026-${String(index + 1).padStart(2, '0')}`);

let failed = false;
const fail = (message) => { failed = true; console.error(`❌ ${message}`); };
const check = (condition, message) => { if (!condition) fail(message); };

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${path.relative(ROOT, file)}: JSON không hợp lệ: ${error.message}`);
    return null;
  }
}

function loadLegacy() {
  check(fs.existsSync(LEGACY_DIR), 'Thiếu thư mục src/data/exams');
  if (!fs.existsSync(LEGACY_DIR)) return [];
  return fs.readdirSync(LEGACY_DIR)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => ({ label: `legacy/${file}`, exam: readJson(path.join(LEGACY_DIR, file)), isNew: false }))
    .filter((entry) => entry.exam);
}

function loadNew() {
  check(fs.existsSync(NEW_DIR), 'Thiếu thư mục src/data/new-exams');
  if (!fs.existsSync(NEW_DIR)) return [];
  const entries = [];

  for (const directoryName of fs.readdirSync(NEW_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^new-\d{4}-\d+$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort()) {
    const directory = path.join(NEW_DIR, directoryName);
    const metadata = readJson(path.join(directory, 'exam.json'));
    if (!metadata) continue;
    check(metadata.questions === undefined, `new/${directoryName}/exam.json không được chứa questions`);
    const questions = [];
    for (const file of MODULE_FILES) {
      const modulePath = path.join(directory, file);
      check(fs.existsSync(modulePath), `new/${directoryName}: thiếu ${file}`);
      const moduleQuestions = fs.existsSync(modulePath) ? readJson(modulePath) : null;
      check(Array.isArray(moduleQuestions), `new/${directoryName}/${file} phải là mảng câu hỏi`);
      const expectedModule = file.at(7).toUpperCase();
      for (const [index, question] of (Array.isArray(moduleQuestions) ? moduleQuestions : []).entries()) {
        check(question?.module === expectedModule, `new/${directoryName}/${file} câu ${index + 1}: module phải là ${expectedModule}`);
        questions.push(question);
      }
    }
    entries.push({ label: `new/${directoryName}`, exam: { ...metadata, questions }, isNew: true });
  }

  for (const file of fs.readdirSync(NEW_DIR).filter((name) => /^new-\d{4}-\d+\.json$/i.test(name)).sort()) {
    const exam = readJson(path.join(NEW_DIR, file));
    if (exam) entries.push({ label: `new/${file}`, exam, isNew: true });
  }
  return entries;
}

function validateExam(entry, globalQuestionIds, newPromptKeys) {
  const { exam, label, isNew } = entry;
  const expected = isNew ? { A: 20, B: 20, C: 12, D: 8 } : { A: 10, B: 22, C: 20, D: 8 };
  check(typeof exam.id === 'string' && exam.id, `${label}: thiếu id`);
  check(typeof exam.title === 'string' && exam.title.trim(), `${label}: thiếu title`);
  check(typeof exam.description === 'string' && exam.description.trim(), `${label}: thiếu description`);
  check(Number.isFinite(exam.durationMinutes) && exam.durationMinutes > 0, `${label}: durationMinutes không hợp lệ`);
  check(exam.totalPoints === 100, `${label}: totalPoints phải là 100`);
  check(typeof exam.disclaimer === 'string' && exam.disclaimer.trim(), `${label}: thiếu disclaimer`);
  check(Array.isArray(exam.questions), `${label}: questions phải là mảng`);
  if (!Array.isArray(exam.questions)) return;
  check(exam.questions.length === 60, `${label}: phải có 60 câu, hiện có ${exam.questions.length}`);

  const counts = { A: 0, B: 0, C: 0, D: 0 };
  const localIds = new Set();
  let points = 0;
  for (const [index, question] of exam.questions.entries()) {
    const location = `${label} câu ${index + 1}`;
    check(question && typeof question === 'object' && !Array.isArray(question), `${location}: câu hỏi phải là object`);
    if (!question || typeof question !== 'object' || Array.isArray(question)) continue;
    check(typeof question.id === 'string' && question.id, `${location}: thiếu id`);
    check(!localIds.has(question.id), `${location}: trùng id trong đề ${question.id}`);
    check(!globalQuestionIds.has(question.id), `${location}: trùng id toàn repo ${question.id}`);
    localIds.add(question.id);
    globalQuestionIds.add(question.id);
    check(VALID_MODULES.has(question.module), `${location}: module không hợp lệ`);
    check(VALID_TYPES.has(question.type), `${location}: type không hợp lệ`);
    check(Number.isFinite(question.points) && question.points > 0, `${location}: points không hợp lệ`);
    check(typeof question.prompt === 'string' && question.prompt.trim().length >= 8, `${location}: prompt quá ngắn`);
    if (VALID_MODULES.has(question.module)) counts[question.module] += 1;
    if (Number.isFinite(question.points)) points += question.points;

    if (question.type === 'mcq') {
      check(Array.isArray(question.options) && question.options.length === 4, `${location}: MCQ phải có 4 lựa chọn`);
      if (Array.isArray(question.options)) {
        check(question.options.map((option) => option?.key).join('') === 'ABCD', `${location}: key phải theo A/B/C/D`);
        const texts = question.options.map((option) => String(option?.text ?? '').trim());
        check(texts.every(Boolean), `${location}: lựa chọn rỗng`);
        if (isNew) check(new Set(texts.map((text) => text.toLowerCase())).size === 4, `${location}: lựa chọn bị trùng`);
      }
      check(VALID_ANSWERS.has(question.answer), `${location}: answer không hợp lệ`);
      check(typeof question.explanation === 'string' && question.explanation.trim().length >= 8, `${location}: thiếu explanation`);
    } else if (question.type === 'code' || question.type === 'essay') {
      check(typeof question.modelAnswer === 'string' && question.modelAnswer.trim().length >= 12, `${location}: thiếu modelAnswer`);
      check(Array.isArray(question.rubric) && question.rubric.length >= 3 && question.rubric.every((item) => typeof item === 'string' && item.trim()), `${location}: rubric phải có ít nhất 3 ý`);
    }

    if (isNew) {
      const promptKey = question.prompt.replace(/\s+/g, ' ').trim().toLowerCase();
      check(!newPromptKeys.has(promptKey), `${location}: trùng prompt giữa các đề mới`);
      newPromptKeys.add(promptKey);
    }
  }

  for (const module of Object.keys(expected)) check(counts[module] === expected[module], `${label}: module ${module} phải có ${expected[module]} câu, hiện có ${counts[module]}`);
  check(Math.abs(points - 100) < 0.001, `${label}: tổng điểm phải là 100, hiện có ${points}`);
  if (isNew) {
    const essays = exam.questions.filter((question) => question.type === 'essay');
    const codeQuestions = exam.questions.filter((question) => question.type === 'code');
    check(essays.length === 3 && essays.every((question) => question.module === 'C'), `${label}: phải có đúng 3 essay ở Module C`);
    check(codeQuestions.length === 2 && codeQuestions.every((question) => question.module === 'B'), `${label}: phải có đúng 2 code ở Module B`);
  }
  console.log(`✅ ${label}: ${exam.questions.length} câu, ${points} điểm`);
}

const legacy = loadLegacy();
const newExams = loadNew();
check(legacy.length === 10, `Bộ cũ phải có đúng 10 đề, hiện có ${legacy.length}`);
check(newExams.length === 10, `Bộ mới phải có đúng 10 đề, hiện có ${newExams.length}`);
check(newExams.map(({ exam }) => exam.id).sort().join('|') === EXPECTED_NEW_IDS.join('|'), `ID bộ mới phải là ${EXPECTED_NEW_IDS.join(', ')}`);

const examIds = new Set();
const globalQuestionIds = new Set();
const newPromptKeys = new Set();
for (const entry of [...legacy, ...newExams]) {
  check(!examIds.has(entry.exam.id), `${entry.label}: trùng exam id ${entry.exam.id}`);
  examIds.add(entry.exam.id);
  validateExam(entry, globalQuestionIds, newPromptKeys);
}

check(legacy.reduce((sum, entry) => sum + entry.exam.questions.length, 0) === 600, 'Bộ cũ phải có 600 câu');
check(newExams.reduce((sum, entry) => sum + entry.exam.questions.length, 0) === 600, 'Bộ mới phải có 600 câu');
if (failed) process.exit(1);
console.log(`\n✅ Toàn repo: ${legacy.length + newExams.length} đề, 1.200 câu; collection Crown có đúng 10 đề và 600 câu.`);
