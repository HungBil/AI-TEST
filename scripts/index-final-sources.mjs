import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Run from AI-TEST. The source repository must already be accessible locally.
// Reads only Git trees; does not cat-file, checkout, extract, or download file contents.
const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error('Usage: node scripts/index-final-sources.mjs /path/to/AI20k-data');
  process.exit(1);
}
try {
  const git = args => execFileSync('git', ['-C', path.resolve(sourceDir), ...args], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 30_000
  });
  const revision = git(['rev-parse', 'HEAD']).trim();
  const paths = git(['ls-tree', '-r', '--name-only', '-z', 'HEAD']).split('\0').filter(Boolean);
  const readable = new Set(['.md', '.txt', '.pdf', '.pptx', '.docx', '.ipynb', '.csv', '.json', '.html']);
  const heavy = new Set(['.mp4', '.mkv', '.mov', '.avi', '.zip', '.rar', '.7z', '.tar', '.gz', '.parquet', '.pt', '.pth', '.bin', '.safetensors']);
  const files = paths.map(file => {
    const extension = path.extname(file).toLowerCase();
    return { path: file, extension, reviewCandidate: readable.has(extension), skipByDefault: heavy.has(extension), phase: null, trackId: null, reviewed: false };
  });
  const directory = path.resolve('.study-cache');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, '.gitignore'), '*\n');
  const result = { repository: 'vinuni-vlearn/AI20k-data', revision, contentRead: false, files };
  fs.writeFileSync(path.join(directory, 'source-inventory.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(`Indexed ${files.length} paths at ${revision}. No file contents were read. Output: .study-cache/source-inventory.json`);
  console.log('Classify Phase/track only after reviewing syllabus. Do not publish this inventory as reviewed sources.');
} catch (error) {
  console.error(`Cannot index local source repository: ${error.message}`);
  process.exitCode = 1;
}
