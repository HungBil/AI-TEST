import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { materializeBaselineExams } from './exam-generator/baseline-generator.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'src', 'data', 'new-exams');
const { exams, changed } = materializeBaselineExams(OUTPUT_DIR);

console.log(`✅ Materialized ${exams.length} baseline Crown exams (${changed} file(s) changed).`);
