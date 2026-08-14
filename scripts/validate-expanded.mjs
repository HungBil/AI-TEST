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
    const essays = questions.filter((q) => q.type === 'essay');
    const codes = questions.filter((q) => q.type === 'code');
    if (essays.length !== 3 || !essays.every((q) => q.module === 'C')) fail(`${label}: cần 3 essay C`);
    if (codes.length !== 2 || !codes.every((q) => q.module === 'B')) fail(`${label}: cần 2 code B`);
    const number = Number(exam.id.slice(-2));
    if (number >= 11 && essays.some((q) => !Array.isArray(q.hint) || q.hint.length < 3 || !String(q.modelAnswer).includes('Ví dụ'))) fail(`${label}: đề mở rộng cần gợi ý và ví dụ`);
  }
  console.log(`✅ ${label}: 60 câu, 100 điểm`);
}

const legacy = entries.filter((e) => !e.crown);
const crown = entries.filter((e) => e.crown);
if (legacy.length !== 10 || crown.length !== 13) fail(`Cần 10 legacy và 13 Crown, hiện có ${legacy.length}/${crown.length}`);
if (failed) process.exit(1);
console.log('\n✅ Toàn repo: 23 đề, 1.380 câu.');
