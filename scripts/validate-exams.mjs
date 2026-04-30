import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const EXAMS_DIR = path.join(ROOT, 'src', 'data', 'exams');
const EXPECTED_COUNTS = { A: 10, B: 22, C: 20, D: 8 };
const EXPECTED_QUESTIONS = 60;
const EXPECTED_POINTS = 100;
const VALID_MODULES = new Set(['A', 'B', 'C', 'D']);
const VALID_TYPES = new Set(['mcq', 'code', 'essay']);
const VALID_ANSWERS = new Set(['A', 'B', 'C', 'D']);

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${path.basename(file)} is not valid JSON: ${error.message}`);
    return null;
  }
}

const files = fs.readdirSync(EXAMS_DIR)
  .filter((file) => file.endsWith('.json'))
  .sort();

assert(files.length >= 10, `Expected at least 10 exam JSON files, found ${files.length}`);

const examIds = new Set();
let totalQuestions = 0;

for (const file of files) {
  const fullPath = path.join(EXAMS_DIR, file);
  const exam = readJson(fullPath);
  if (!exam) continue;

  assert(typeof exam.id === 'string' && exam.id.length > 0, `${file}: missing id`);
  assert(!examIds.has(exam.id), `${file}: duplicate exam id ${exam.id}`);
  examIds.add(exam.id);
  assert(typeof exam.title === 'string' && exam.title.length > 0, `${file}: missing title`);
  assert(Array.isArray(exam.questions), `${file}: questions must be an array`);
  assert(exam.questions.length === EXPECTED_QUESTIONS, `${file}: expected ${EXPECTED_QUESTIONS} questions, found ${exam.questions.length}`);

  const questionIds = new Set();
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  let points = 0;

  for (const [idx, question] of exam.questions.entries()) {
    const location = `${file} question #${idx + 1}`;
    assert(typeof question.id === 'string' && question.id.length > 0, `${location}: missing id`);
    assert(!questionIds.has(question.id), `${location}: duplicate question id ${question.id}`);
    questionIds.add(question.id);
    assert(VALID_MODULES.has(question.module), `${location}: invalid module ${question.module}`);
    assert(VALID_TYPES.has(question.type), `${location}: invalid type ${question.type}`);
    assert(typeof question.points === 'number' && question.points > 0, `${location}: points must be positive number`);
    assert(typeof question.prompt === 'string' && question.prompt.trim().length >= 8, `${location}: prompt too short`);

    counts[question.module] += 1;
    points += question.points;

    if (question.type === 'mcq') {
      assert(Array.isArray(question.options) && question.options.length === 4, `${location}: MCQ must have exactly 4 options`);
      const keys = question.options.map((option) => option.key);
      assert(keys.join('') === 'ABCD', `${location}: option keys must be A/B/C/D`);
      assert(VALID_ANSWERS.has(question.answer), `${location}: answer must be A/B/C/D`);
      assert(question.options.some((option) => option.key === question.answer), `${location}: answer key not found in options`);
      assert(typeof question.explanation === 'string' && question.explanation.trim().length >= 8, `${location}: explanation too short`);
      for (const option of question.options) {
        assert(typeof option.text === 'string' && option.text.trim().length > 0, `${location}: option text missing`);
      }
    } else {
      assert(typeof question.modelAnswer === 'string' && question.modelAnswer.trim().length >= 12, `${location}: open question needs modelAnswer`);
      assert(Array.isArray(question.rubric) && question.rubric.length >= 3, `${location}: open question needs at least 3 rubric items`);
    }
  }

  for (const [module, expected] of Object.entries(EXPECTED_COUNTS)) {
    assert(counts[module] === expected, `${file}: module ${module} expected ${expected}, found ${counts[module]}`);
  }
  assert(Math.abs(points - EXPECTED_POINTS) < 0.001, `${file}: expected ${EXPECTED_POINTS} points, found ${points}`);
  totalQuestions += exam.questions.length;
  console.log(`✅ ${file}: ${exam.questions.length} questions, ${points} points`);
}

if (process.exitCode) {
  console.error('\nValidation failed. Fix the errors above.');
  process.exit(process.exitCode);
}

console.log(`\nAll ${files.length} exam files are valid. Total questions: ${totalQuestions}.`);
