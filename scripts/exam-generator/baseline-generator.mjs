import fs from 'node:fs';
import path from 'node:path';
import { MODULE_LABELS, DISCLAIMER, EXAM_BLUEPRINTS, qid } from './shared.mjs';
import { EXTRA_EXAM_BLUEPRINTS } from './extra-blueprints.mjs';
import { buildModuleA } from './module-a.mjs';
import { buildModuleB } from './module-b.mjs';
import { buildModuleC, buildModuleD } from './module-cd.mjs';
import { ESSAY_PLAN } from './module-c-essays.mjs';

const BLUEPRINTS = [...EXAM_BLUEPRINTS, ...EXTRA_EXAM_BLUEPRINTS];

function renumberQuestions(questions, examNo) {
  const counters = { A: 0, B: 0, C: 0, D: 0 };
  return questions.map((question) => {
    counters[question.module] += 1;
    return { ...question, id: qid(examNo, question.module, counters[question.module]) };
  });
}

function buildExam(blueprint) {
  const examNo = blueprint.no;
  const dataExamNo = blueprint.variantOf ?? examNo;
  const essayPlan = ESSAY_PLAN[examNo] ?? blueprint.cEssays;
  if (!essayPlan || essayPlan.length !== 3) throw new Error(`Thiếu 3 câu tự luận cho Đề ${examNo}`);
  const effectiveBlueprint = { ...blueprint, cEssays: essayPlan };
  const generated = [
    ...buildModuleA(dataExamNo, effectiveBlueprint),
    ...buildModuleB(dataExamNo, effectiveBlueprint),
    ...buildModuleC(dataExamNo, effectiveBlueprint, examNo),
    ...buildModuleD(dataExamNo, effectiveBlueprint)
  ];
  const questions = renumberQuestions(generated, examNo);
  return {
    id: `new-2026-${String(examNo).padStart(2, '0')}`,
    title: `Bộ mô phỏng khóa mới 2026 · Đề ${String(examNo).padStart(2, '0')}`,
    description: blueprint.description,
    durationMinutes: 90,
    totalPoints: 100,
    disclaimer: DISCLAIMER,
    moduleLabels: MODULE_LABELS,
    moduleOverview: [
      'Module 1 · A: 20 câu xác suất và ma trận; giải bằng giấy nháp.',
      'Module 2 · B: 20 câu Euclid, Python API và NumPy; gồm 2 câu code.',
      'Module 3 · C: 12 câu ML/RAG cơ bản; gồm 3 câu tự luận có ràng buộc.',
      'Module 4 · D: 8 câu đạo đức AI, banking, privacy và phân quyền.'
    ],
    coverageProfile: {
      title: blueprint.title,
      sfiaOrientation: 'Level 3 Apply là trọng tâm; tự luận quan sát mức sẵn sàng lên Level 4 Enable',
      variationPolicy: examNo >= 11 ? 'Mở rộng có giới hạn, đáp án và ví dụ dễ hiểu' : 'Cùng nền tảng, khác chủ yếu ở tự luận',
      source: 'Learner-reported topics plus limited adjacent fundamentals'
    },
    questions
  };
}

export function buildBaselineExams() {
  return BLUEPRINTS.map(buildExam);
}

export function materializeBaselineExams(outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  const exams = buildBaselineExams();
  const expectedFiles = new Set(exams.map((exam) => `${exam.id}.json`));
  let changed = 0;
  for (const file of fs.readdirSync(outputDir)) {
    if (/^new-2026-\d{2}\.json$/.test(file) && !expectedFiles.has(file)) {
      fs.rmSync(path.join(outputDir, file));
      changed += 1;
    }
  }
  for (const exam of exams) {
    const target = path.join(outputDir, `${exam.id}.json`);
    const content = `${JSON.stringify(exam, null, 2)}\n`;
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    if (current !== content) {
      fs.writeFileSync(target, content, 'utf8');
      changed += 1;
    }
  }
  return { exams, changed };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outputDir = process.argv[2] ?? path.resolve('src/data/new-exams');
  const result = materializeBaselineExams(outputDir);
  console.log(`Generated ${result.exams.length} exams (${result.changed} changed).`);
}
