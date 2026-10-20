import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateFinals } from './validate-finals.mjs';
const plan = JSON.parse(fs.readFileSync(new URL('../src/finals/plan.json', import.meta.url), 'utf8'));
const empty = () => ({ schemaVersion: 1, sources: [], trackDefinitions: [], exams: [], cheatSheets: [] });
function fixture() {
  const catalog = empty();
  catalog.sources.push({ id: 'test-only', repo: plan.sourceRepository, path: 'TEST_FIXTURE.md', revision: 'a'.repeat(40), phase: 'phase1', reviewed: true });
  const exam = {
    id: 'final-p1-01', phase: 'phase1', status: 'published', title: 'TEST ONLY', description: 'Synthetic test, never included in production',
    durationMinutes: 90, totalPoints: 100, disclaimer: 'Synthetic fixture only',
    questions: Array.from({ length: 85 }, (_, i) => {
      const common = { id: `final-p1-01-${i + 1}`, module: 'A', points: i < 80 ? 1 : 4, prompt: `Synthetic test prompt ${i}`, intentId: `fixture.${i}`, sourceRefs: [{ sourceId: 'test-only', locator: `Line ${i + 1}` }] };
      return i < 60 ? { ...common, type: 'mcq', options: ['A','B','C','D'].map(key => ({ key, text: `Test option ${key}` })), answer: 'A', explanation: 'This explanation is for synthetic validation tests only.' }
        : { ...common, type: 'essay', responseKind: i < 80 ? 'short-answer' : 'scenario', hint: ['Hint one', 'Hint two', 'Hint three'], rubric: ['Reason', 'Example', 'Validation'], modelAnswer: 'This is synthetic content for tests, not course material. Ví dụ: a test input has a controlled expected output, so we can validate the schema.' };
    })
  };
  catalog.exams.push(exam); return catalog;
}
test('empty scaffold passes ordinary checks but fails completion', () => {
  assert.deepEqual(validateFinals(empty(), plan).errors, []);
  assert.ok(validateFinals(empty(), plan, { complete: true }).errors.length > 0);
});
test('source-grounded synthetic 85/60/25 structure validates', () => {
  assert.deepEqual(validateFinals(fixture(), plan).errors, []);
});
test('missing source references block publishing', () => {
  const c = fixture(); c.exams[0].questions[0].sourceRefs = [];
  assert.ok(validateFinals(c, plan).errors.some(e => e.includes('sourceRefs')));
});
test('an unread source cannot support a published question', () => {
  const c = fixture(); c.sources[0].reviewed = false;
  assert.ok(validateFinals(c, plan).errors.some(e => e.includes('not read/reviewed')));
});
test('handwritten code and missing open-answer hints are rejected', () => {
  const c = fixture(); c.exams[0].questions[60].type = 'code'; c.exams[0].questions[61].hint = [];
  const errors = validateFinals(c, plan).errors;
  assert.ok(errors.some(e => e.includes('no handwritten code')));
  assert.ok(errors.some(e => e.includes('three useful hints')));
});
test('copying essays into a different exam fails overlap checks', () => {
  const c = fixture(), second = structuredClone(c.exams[0]);
  second.id = 'final-p1-02'; second.questions.forEach(q => { q.id = q.id.replace('final-p1-01-', 'final-p1-02-'); });
  c.exams.push(second);
  const errors = validateFinals(c, plan).errors;
  assert.ok(errors.some(e => e.includes('overlap exceeds 50%')));
  assert.ok(errors.some(e => e.includes('duplicate open question')));
});
test('Crown IDs cannot leak into final-review storage namespace', () => {
  const c = fixture(); c.exams[0].questions[0].id = 'N26E01-A01';
  assert.ok(validateFinals(c, plan).errors.some(e => e.includes('non-namespaced')));
});

test('Phase 1 completion requires all ten source-checked exams and a published sheet', () => {
  const catalog = fixture();
  assert.ok(validateFinals(catalog, plan, { phase1Complete: true }).errors.some(error => error.includes('ten published')));
  const prototype = catalog.exams[0];
  catalog.exams = Array.from({ length: 10 }, (_, index) => {
    const exam = structuredClone(prototype); exam.id = `final-p1-${String(index + 1).padStart(2, '0')}`;
    exam.questions.forEach((question, n) => { question.id = `${exam.id}-${n}`; question.intentId = `synthetic-${index}-${n}`; question.prompt = `Synthetic completion fixture ${index} question ${n}`; });
    return exam;
  });
  const section = { title: 'Synthetic only', keywords: ['fixture'], explanation: 'Synthetic', example: 'Synthetic', commonMistake: 'Synthetic', sourceRefs: [{ sourceId: 'test-only', locator: 'Fixture heading' }] };
  catalog.cheatSheets.push({ id: 'final-fixture-sheet', phase: 'phase1', status: 'published', title: 'Synthetic sheet', pages: [1, 2].map(n => ({ title: `Fixture ${n}`, sections: [section] })) });
  assert.deepEqual(validateFinals(catalog, plan, { phase1Complete: true }).errors, []);
  assert.ok(validateFinals(catalog, plan, { complete: true }).errors.length > 0);
});
