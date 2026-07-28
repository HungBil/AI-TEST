import fs from 'node:fs';
import path from 'node:path';
import { MODULE_LABELS, DISCLAIMER } from './shared.mjs';
import { buildModuleA } from './module-a.mjs';
import { buildModuleB } from './module-b.mjs';
import { buildModuleC, buildModuleD } from './module-cd.mjs';

function buildExam(examNo) {
  const questions = [
    ...buildModuleA(examNo),
    ...buildModuleB(examNo),
    ...buildModuleC(examNo),
    ...buildModuleD(examNo)
  ];
  return {
    id: `new-2026-${String(examNo).padStart(2, '0')}`,
    title: `Bộ mô phỏng khóa mới 2026 · Đề ${String(examNo).padStart(2, '0')}`,
    description: '60 câu bám theo baseline phản hồi người thi: xác suất và ma trận; Euclid, Python API và NumPy; AI cơ bản với 3 câu tự luận; privacy/banking.',
    durationMinutes: 90,
    totalPoints: 100,
    disclaimer: DISCLAIMER,
    moduleLabels: MODULE_LABELS,
    moduleOverview: [
      'Module 1 · A: 20 câu xác suất và đại số tuyến tính phần ma trận; giải được bằng giấy nháp.',
      'Module 2 · B: 20 câu Euclid, Python gọi API và đọc/giải thích NumPy; gồm đúng 2 câu code.',
      'Module 3 · C: 12 câu AI cơ bản/RAG/triển khai; gồm đúng 3 câu tự luận có ràng buộc.',
      'Module 4 · D: 8 câu tình huống đạo đức AI, banking, privacy và phân quyền dữ liệu.'
    ],
    questions
  };
}

export function buildBaselineExams() {
  return Array.from({ length: 10 }, (_, index) => buildExam(index + 1));
}

export function materializeBaselineExams(outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  const exams = buildBaselineExams();
  let changed = 0;
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
  console.log(`Generated ${result.exams.length} baseline exams (${result.changed} changed).`);
}
