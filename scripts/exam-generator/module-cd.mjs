import { qid } from './shared.mjs';
import { cFactories } from './module-c-core.mjs';
import { essayQuestion } from './module-c-essays.mjs';
export { buildModuleD } from './module-d.mjs';

export function buildModuleC(examNo, blueprint) {
  const questions = blueprint.cMcq.map((skill, index) => {
    const factory = cFactories[skill];
    if (!factory) throw new Error(`Không có factory Module C: ${skill}`);
    return factory(examNo, qid(examNo, 'C', index + 1));
  });
  blueprint.cEssays.forEach((skill, index) => {
    questions.push(essayQuestion(skill, examNo, qid(examNo, 'C', 10 + index)));
  });
  return questions;
}
