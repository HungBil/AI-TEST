import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const LEGACY_DIR = path.join(ROOT, 'src', 'data', 'exams');
const NEW_DIR = path.join(ROOT, 'src', 'data', 'new-exams');
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
    fail(`${path.relative(ROOT, file)} is not valid JSON: ${error.message}`);
    return null;
  }
}

function loadLegacyExams() {
  assert(fs.existsSync(LEGACY_DIR), `Missing exam directory: ${path.relative(ROOT, LEGACY_DIR)}`);
  if (!fs.existsSync(LEGACY_DIR)) return [];

  const files = fs.readdirSync(LEGACY_DIR)
    .filter((file) => file.endsWith('.json'))
    .sort();

  assert(files.length >= 10, `legacy: expected at least 10 exam JSON files, found ${files.length}`);
  return files
    .map((file) => ({ displayFile: `legacy/${file}`, exam: readJson(path.join(LEGACY_DIR, file)) }))
    .filter(({ exam }) => Boolean(exam));
}

function loadNewExams() {
  assert(fs.existsSync(NEW_DIR), `Missing exam directory: ${path.relative(ROOT, NEW_DIR)}`);
  if (!fs.existsSync(NEW_DIR)) return [];

  const directories = fs.readdirSync(NEW_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  assert(directories.length >= 1, `new: expected at least 1 exam directory, found ${directories.length}`);

  return directories.flatMap((directoryName) => {
    const directory = path.join(NEW_DIR, directoryName);
    const manifestPath = path.join(directory, 'exam.json');
    if (!fs.existsSync(manifestPath)) {
      fail(`new/${directoryName}: missing exam.json`);
      return [];
    }

    const metadata = readJson(manifestPath);
    if (!metadata) return [];

    const moduleFiles = fs.readdirSync(directory)
      .filter((file) => /^module-[a-d]\.json$/i.test(file))
      .sort();

    assert(moduleFiles.length === 4, `new/${directoryName}: expected module-a.json through module-d.json`);
    const questions = moduleFiles.flatMap((file) => {
      const parsed = readJson(path.join(directory, file));
      if (!Array.isArray(parsed)) {
        fail(`new/${directoryName}/${file}: module file must contain a question array`);
        return [];
      }
      return parsed;
    });

    return [{
      displayFile: `new/${directoryName}`,
      exam: { ...metadata, questions }
    }];
  });
}

function validateExam({ exam, displayFile }, expectedCounts, extraChecks) {
  assert(typeof exam.id === 'string' && exam.id.length > 0, `${displayFile}: missing id`);
  assert(typeof exam.title === 'string' && exam.title.length > 0, `${displayFile}: missing title`);
  assert(typeof exam.description === 'string' && exam.description.trim().length > 0, `${displayFile}: missing description`);
  assert(typeof exam.disclaimer === 'string' && exam.disclaimer.trim().length > 0, `${displayFile}: missing disclaimer`);
  assert(Array.isArray(exam.questions), `${displayFile}: questions must be an array`);
  assert(exam.questions.length === EXPECTED_QUESTIONS, `${displayFile}: expected ${EXPECTED_QUESTIONS} questions, found ${exam.questions.length}`);

  if (exam.moduleOverview !== undefined) {
    assert(
      Array.isArray(exam.moduleOverview) &&
        exam.moduleOverview.length === 4 &&
        exam.moduleOverview.every((item) => typeof item === 'string' && item.trim().length > 0),
      `${displayFile}: moduleOverview must contain 4 non-empty strings`
    );
  }

  if (exam.moduleLabels !== undefined) {
    assert(exam.moduleLabels && typeof exam.moduleLabels === 'object' && !Array.isArray(exam.moduleLabels), `${displayFile}: moduleLabels must be an object`);
    for (const module of VALID_MODULES) {
      assert(typeof exam.moduleLabels[module] === 'string' && exam.moduleLabels[module].trim().length > 0, `${displayFile}: moduleLabels.${module} must be a non-empty string`);
    }
  }

  const questionIds = new Set();
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  let points = 0;

  for (const [idx, question] of exam.questions.entries()) {
    const location = `${displayFile} question #${idx + 1}`;
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

  for (const [module, expected] of Object.entries(expectedCounts)) {
    assert(counts[module] === expected, `${displayFile}: module ${module} expected ${expected}, found ${counts[module]}`);
  }
  assert(Math.abs(points - EXPECTED_POINTS) < 0.001, `${displayFile}: expected ${EXPECTED_POINTS} points, found ${points}`);
  extraChecks?.(exam, displayFile);

  console.log(`✅ ${displayFile}: ${exam.questions.length} questions, ${points} points`);
}

const legacyExams = loadLegacyExams();
const newExams = loadNewExams();
const examIds = new Set();
let totalQuestions = 0;

for (const entry of [...legacyExams, ...newExams]) {
  const id = entry.exam.id;
  assert(!examIds.has(id), `${entry.displayFile}: duplicate exam id ${id}`);
  examIds.add(id);
}

for (const entry of legacyExams) {
  validateExam(entry, { A: 10, B: 22, C: 20, D: 8 });
  totalQuestions += entry.exam.questions.length;
}

for (const entry of newExams) {
  validateExam(entry, { A: 20, B: 20, C: 12, D: 8 }, (exam, displayFile) => {
    const essays = exam.questions.filter((question) => question.type === 'essay');
    const codeQuestions = exam.questions.filter((question) => question.type === 'code');
    assert(essays.length === 3, `${displayFile}: expected exactly 3 essay questions, found ${essays.length}`);
    assert(essays.every((question) => question.module === 'C'), `${displayFile}: all essay questions must be in module C`);
    assert(codeQuestions.length === 2, `${displayFile}: expected exactly 2 code questions, found ${codeQuestions.length}`);
    assert(codeQuestions.every((question) => question.module === 'B'), `${displayFile}: all code questions must be in module B`);
  });
  totalQuestions += entry.exam.questions.length;
}

if (process.exitCode) {
  console.error('\nValidation failed. Fix the errors above.');
  process.exit(process.exitCode);
}

console.log(`\nAll ${legacyExams.length + newExams.length} exams are valid. Total questions: ${totalQuestions}.`);
