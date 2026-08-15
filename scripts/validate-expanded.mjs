import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const load = (dir, re, crown) => fs.readdirSync(path.join(root, dir)).filter((f) => re.test(f)).sort().map((f) => ({ crown, file: f, exam: JSON.parse(fs.readFileSync(path.join(root, dir, f), 'utf8')) }));
const entries = [...load('src/data/exams', /^exam-\d+\.json$/, false), ...load('src/data/new-exams', /^new-2026-\d{2}\.json$/, true)];
const examIds = new Set();
const questionIds = new Set();
let failed = false;
const fail = (message) => { failed = true; console.error(`❌ ${message}`); };

for (const { crown, file, exam } of entries) {
  const label = `${crown ? 'crown' : 'legacy'}/${file}`;
  if (!exam.id || examIds.has(exam.id)) fail(`${label}: exam id thiếu hoặc trùng`);
  examIds.add(exam.id);
  const questions = Array.isArray(exam.questions) ? exam.questions : [];
  if (questions.length !== 60 || exam.totalPoints !== 100) fail(`${label}: cần 60 câu và 100 điểm`);
  const count = { A: 0, B: 0, C: 0, D: 0 };
  let points = 0;
  for (const q of questions) {
    if (!q.id || questionIds.has(q.id)) fail(`${label}: question id thiếu hoặc trùng`);
    questionIds.add(q.id);
    if (!(q.module in count)) fail(`${q.id}: module sai`); else count[q.module] += 1;
    points += Number(q.points || 0);
    if (!q.prompt || !['mcq', 'code', 'essay'].includes(q.type)) fail(`${q.id}: prompt hoặc type sai`);
    if (q.type === 'mcq') {
      const options = Array.isArray(q.options) ? q.options : [];
      if (options.length !== 4 || options.map((o) => o.key).join('') !== 'ABCD' || !options.some((o) => o.key === q.answer) || !q.explanation) fail(`${q.id}: MCQ sai schema`);
    } else if (!q.modelAnswer || !Array.isArray(q.rubric) || q.rubric.length < 3) fail(`${q.id}: câu mở sai schema`);
    if (crown && (!q.skillId || !['L3', 'L3-L4'].includes(q.sfiaBand))) fail(`${q.id}: thiếu skill metadata`);
  }
  const expected = crown ? '20/20/12/8' : '10/22/20/8';
  if (`${count.A}/${count.B}/${count.C}/${count.D}` !== expected || Math.abs(points - 100) > 0.001) fail(`${label}: phân bố hoặc điểm sai`);
  if (crown) {
    const number = Number(exam.id.slice(-2));
    const essays = questions.filter((q) => q.type === 'essay');
    const codes = questions.filter((q) => q.type === 'code');
    const openQuestions = questions.filter((q) => q.type !== 'mcq');

    if (number >= 14) {
      const essayByModule = Object.fromEntries(['A', 'B', 'C', 'D'].map((module) => [module, essays.filter((q) => q.module === module).length]));
      if (openQuestions.length !== 10) fail(`${label}: cấu trúc ngày đầu cần đúng 10 câu điền/tự luận`);
      if (codes.length !== 3 || !codes.every((q) => q.module === 'B')) fail(`${label}: cần đúng 3 câu code Module B`);
      if (essays.length !== 7 || essayByModule.A !== 3 || essayByModule.C !== 3 || essayByModule.D !== 1) {
        fail(`${label}: essay phải phân bố A=3, C=3, D=1`);
      }
      if (exam.dayOneStructure !== true || exam.openResponseCount !== 10 || exam.catCelebration !== true) {
        fail(`${label}: thiếu metadata cấu trúc ngày đầu/cat celebration`);
      }
      if (openQuestions.some((q) => !Array.isArray(q.hint) || q.hint.length < 3 || !String(q.modelAnswer).includes('Ví dụ'))) {
        fail(`${label}: mọi câu mở cần ít nhất 3 gợi ý và đáp án mẫu có ví dụ dễ hiểu`);
      }
      const requiredSkills = [
        'matrix.determinant.written-calculation',
        'matrix.rank.written-row-dependence',
        'ml.optimization.update-bias-one-step',
        'numpy.code.matmul',
        'llm.application.common-assistant-tasks',
        'ml.metrics.prioritize-recall-costly-false-negative',
        'rag.choice.changing-knowledge-vs-finetune',
        'rag.architecture.internal-chatbot-order'
      ];
      for (const prefix of requiredSkills) {
        if (!questions.some((q) => String(q.skillId).startsWith(prefix))) fail(`${label}: thiếu coverage ${prefix}`);
      }
    } else {
      if (essays.length !== 3 || !essays.every((q) => q.module === 'C')) fail(`${label}: cần 3 essay C`);
      if (codes.length !== 2 || !codes.every((q) => q.module === 'B')) fail(`${label}: cần 2 code B`);
      if (number >= 11 && essays.some((q) => !Array.isArray(q.hint) || q.hint.length < 3 || !String(q.modelAnswer).includes('Ví dụ'))) {
        fail(`${label}: đề mở rộng cần gợi ý và ví dụ`);
      }
    }
  }
  console.log(`✅ ${label}: 60 câu, 100 điểm`);
}

const legacy = entries.filter((e) => !e.crown);
const crown = entries.filter((e) => e.crown);
if (legacy.length !== 10 || crown.length !== 16) fail(`Cần 10 legacy và 16 Crown, hiện có ${legacy.length}/${crown.length}`);
if (failed) process.exit(1);
console.log('\n✅ Toàn repo: 26 đề, 1.560 câu.');
