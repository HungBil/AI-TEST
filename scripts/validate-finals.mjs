import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const text = value => typeof value === 'string' && value.trim().length > 0;
const list = value => Array.isArray(value) ? value : [];
const normalize = value => String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();

export function validateFinals(catalog, plan, { complete = false, phase1Complete = false } = {}) {
  const errors = [];
  const check = (ok, message) => { if (!ok) errors.push(message); };
  check(catalog?.schemaVersion === 1, 'content.schemaVersion must be 1');
  for (const key of ['sources', 'trackDefinitions', 'exams', 'cheatSheets']) check(Array.isArray(catalog?.[key]), `${key} must be an array`);
  const sources = list(catalog?.sources), exams = list(catalog?.exams), sheets = list(catalog?.cheatSheets);
  const tracks = list(catalog?.trackDefinitions), trackSlots = list(plan?.trackSlots);
  check(plan?.phase1Count === 10 && plan?.phase2Count === 10, 'Plan must allocate 10 + 10 exams');
  check(trackSlots.length === 4 && new Set(trackSlots.map(t => t.id)).size === 4, 'Plan must have four distinct track slots');
  check(trackSlots.every(t => Number.isInteger(t.examCount) && t.examCount > 0), 'Track allocations must be positive integers');
  check(trackSlots.reduce((n, t) => n + t.examCount, 0) === 10, 'Phase 2 allocations must sum to 10');
  const slots = new Map();
  for (let i = 1; i <= 10; i++) slots.set(`final-p1-${String(i).padStart(2, '0')}`, { phase: 'phase1' });
  trackSlots.forEach((t, n) => {
    for (let i = 1; i <= t.examCount; i++) slots.set(`final-p2-t${n + 1}-${String(i).padStart(2, '0')}`, { phase: 'phase2', trackId: t.id });
  });
  const trackIds = new Set(trackSlots.map(t => t.id));
  const sourceMap = new Map();
  for (const s of sources) {
    check(text(s.id) && !sourceMap.has(s.id), `Duplicate/missing source id: ${s.id}`);
    sourceMap.set(s.id, s);
    check(s.repo === plan.sourceRepository, `${s.id}: source must come from the declared course repository`);
    check(text(s.path) && !s.path.startsWith('/') && !s.path.split('/').includes('..'), `${s.id}: invalid relative path`);
    check(/^[0-9a-f]{40}$/i.test(s.revision ?? ''), `${s.id}: source needs pinned 40-character commit SHA`);
    check(['phase1', 'phase2'].includes(s.phase), `${s.id}: invalid phase`);
    check(s.phase !== 'phase2' || trackIds.has(s.trackId), `${s.id}: missing Phase 2 track`);
    check(s.phase !== 'phase1' || !s.trackId, `${s.id}: Phase 1 cannot have a track`);
  }
  function refs(items, context, owner) {
    check(Array.isArray(items) && items.length > 0, `${context}: sourceRefs required`);
    for (const ref of list(items)) {
      const source = sourceMap.get(ref.sourceId);
      check(Boolean(source) && source.reviewed === true, `${context}: source not read/reviewed: ${ref.sourceId}`);
      check(text(ref.locator), `${context}: page/slide/heading/line locator required`);
      if (source && owner) {
        check(owner.phase !== 'phase1' || source.phase === 'phase1', `${context}: Phase 1 cannot use Phase 2 material`);
        check(source.phase !== 'phase2' || source.trackId === owner.trackId, `${context}: source belongs to a different track`);
      }
    }
  }
  const definedTracks = new Set();
  for (const track of tracks) {
    check(trackIds.has(track.id) && !definedTracks.has(track.id), `Invalid/duplicate track definition: ${track.id}`);
    check(text(track.title), `${track.id}: source-confirmed track title required`);
    definedTracks.add(track.id); refs(track.sourceRefs, `track ${track.id}`, { phase: 'phase2', trackId: track.id });
  }
  const examIds = new Set(), questionIds = new Set(), published = [];
  for (const exam of exams) {
    const slot = slots.get(exam.id);
    check(slot && !examIds.has(exam.id), `Invalid/duplicate exam slot: ${exam.id}`);
    examIds.add(exam.id);
    check(slot && slot.phase === exam.phase && slot.trackId === exam.trackId, `${exam.id}: phase/track does not match slot`);
    check(['draft', 'published'].includes(exam.status), `${exam.id}: invalid publication status`);
    if (exam.status !== 'published') continue;
    published.push(exam);
    check(exam.phase !== 'phase2' || definedTracks.has(exam.trackId), `${exam.id}: track title not confirmed`);
    for (const field of ['title', 'description', 'disclaimer']) check(text(exam[field]), `${exam.id}: ${field} required`);
    check(exam.durationMinutes === plan.format.durationMinutes && exam.totalPoints === 100, `${exam.id}: duration/points mismatch`);
    const questions = list(exam.questions);
    check(questions.length === plan.format.totalQuestions, `${exam.id}: expected 85 questions`);
    check(questions.filter(q => q.type === 'mcq').length === plan.format.mcqCount, `${exam.id}: expected 60 MCQ`);
    check(questions.filter(q => q.type === 'essay').length === plan.format.openCount, `${exam.id}: expected 25 open questions`);
    check(questions.every(q => ['mcq', 'essay'].includes(q.type)), `${exam.id}: no handwritten code questions`);
    check(Math.abs(questions.reduce((n, q) => n + (Number(q.points) || 0), 0) - 100) < 0.001, `${exam.id}: question points must sum to 100`);
    const localIntents = new Set(), localPrompts = new Set();
    for (const q of questions) {
      check(text(q.id) && q.id.startsWith(`${exam.id}-`) && !questionIds.has(q.id), `${exam.id}: missing/non-namespaced/duplicate question id`);
      questionIds.add(q.id);
      check(['A', 'B', 'C', 'D'].includes(q.module), `${q.id}: invalid section ID`);
      check(Number.isFinite(q.points) && q.points > 0, `${q.id}: invalid points`);
      check(text(q.prompt) && !localPrompts.has(normalize(q.prompt)), `${q.id}: empty/repeated prompt within exam`);
      localPrompts.add(normalize(q.prompt));
      check(text(q.intentId) && !localIntents.has(q.intentId), `${q.id}: duplicate/missing intentId within exam`);
      localIntents.add(q.intentId); refs(q.sourceRefs, q.id, exam);
      if (q.type === 'mcq') {
        check(list(q.options).map(o => o.key).join('') === 'ABCD', `${q.id}: four ordered choices required`);
        check(list(q.options).every(o => text(o.text)) && new Set(list(q.options).map(o => normalize(o.text))).size === 4, `${q.id}: duplicate/empty choices`);
        check(['A', 'B', 'C', 'D'].includes(q.answer), `${q.id}: invalid correct answer`);
        check(text(q.explanation) && q.explanation.length >= 20, `${q.id}: meaningful explanation required`);
      } else if (q.type === 'essay') {
        check(['short-answer', 'system-prompt', 'scenario'].includes(q.responseKind), `${q.id}: responseKind required`);
        check(list(q.hint).length >= 3 && q.hint.every(text), `${q.id}: three useful hints required`);
        check(list(q.rubric).length >= 3 && q.rubric.every(text), `${q.id}: at least three rubric points required`);
        check(text(q.modelAnswer) && q.modelAnswer.length >= 80 && /ví dụ/i.test(q.modelAnswer), `${q.id}: plain-language model answer with an example required`);
      }
    }
  }
  const sheetIds = new Set(), publishedDays = new Set();
  for (const sheet of sheets) {
    check(text(sheet.id) && !sheetIds.has(sheet.id), 'Cheat sheet IDs must be unique'); sheetIds.add(sheet.id);
    check(['draft', 'published'].includes(sheet.status), `${sheet.id}: invalid publication status`);
    check(['phase1', 'phase2'].includes(sheet.phase), `${sheet.id}: invalid phase`);
    check(sheet.phase !== 'phase1' || !sheet.trackId, `${sheet.id}: Phase 1 cannot have track`);
    check(sheet.phase !== 'phase2' || trackIds.has(sheet.trackId), `${sheet.id}: Phase 2 track required`);
    if (sheet.day !== undefined) check(sheet.phase === 'phase1' && Number.isInteger(sheet.day) && sheet.day >= 1 && sheet.day <= 15, `${sheet.id}: invalid Phase 1 handbook day`);
    if (sheet.status !== 'published') continue;
    if (sheet.day !== undefined) {
      check(!publishedDays.has(sheet.day), `${sheet.id}: duplicate published handbook day`);
      publishedDays.add(sheet.day);
    }
    check(sheet.phase !== 'phase2' || definedTracks.has(sheet.trackId), `${sheet.id}: track not confirmed`);
    check(text(sheet.title), `${sheet.id}: title required`);
    check(list(sheet.pages).length >= 2 && sheet.pages.length <= 3, `${sheet.id}: expected 2–3 pages`);
    for (const page of list(sheet.pages)) {
      check(text(page.title) && list(page.sections).length > 0, `${sheet.id}: page must contain content`);
      for (const section of list(page.sections)) {
        for (const key of ['title', 'explanation', 'example', 'commonMistake']) check(text(section[key]), `${sheet.id}: section missing ${key}`);
        check(list(section.keywords).length > 0 && section.keywords.every(text), `${sheet.id}: keywords required`);
        refs(section.sourceRefs, sheet.id, sheet);
      }
    }
  }
  // Deterministic checks complement, but cannot replace, semantic editorial review.
  for (let i = 0; i < published.length; i++) for (let j = i + 1; j < published.length; j++) {
    const a = published[i], b = published[j];
    const ea = a.questions.filter(q => q.type === 'essay'), eb = b.questions.filter(q => q.type === 'essay');
    const intents = new Set(eb.map(q => q.intentId));
    check(ea.filter(q => intents.has(q.intentId)).length <= 12, `${a.id}/${b.id}: open-question intent overlap exceeds 50%`);
    const prompts = new Set(eb.map(q => normalize(q.prompt)));
    check(!ea.some(q => prompts.has(normalize(q.prompt))), `${a.id}/${b.id}: exact duplicate open question`);
    if (a.phase === b.phase && a.trackId === b.trackId) {
      const mcq = new Set(b.questions.filter(q => q.type === 'mcq').map(q => normalize(q.prompt)));
      check(a.questions.filter(q => q.type === 'mcq' && mcq.has(normalize(q.prompt))).length <= 15, `${a.id}/${b.id}: too many identical MCQs`);
    }
  }
  if (complete) {
    check(published.length === 20, 'Completion requires all 20 published exams');
    check(definedTracks.size === 4, 'Completion requires four source-confirmed tracks');
    for (const id of slots.keys()) check(published.some(e => e.id === id), `Unpublished slot: ${id}`);
    const readySheets = sheets.filter(s => s.status === 'published');
    check(readySheets.some(s => s.phase === 'phase1'), 'Missing Phase 1 cheat sheet');
    for (const id of trackIds) check(readySheets.some(s => s.phase === 'phase2' && s.trackId === id), `Missing cheat sheet for ${id}`);
  }
  if (phase1Complete) {
    check(published.filter(exam => exam.phase === 'phase1').length === 10, 'Phase 1 completion requires ten published exams');
    for (let i = 1; i <= 10; i++) check(published.some(exam => exam.id === `final-p1-${String(i).padStart(2, '0')}`), `Missing Phase 1 exam ${i}`);
    for (let day = 1; day <= 15; day++) check(sheets.some(sheet => sheet.phase === 'phase1' && sheet.status === 'published' && sheet.day === day), `Missing published Phase 1 handbook day ${day}`);
  }
  return { errors, published: published.length, planned: slots.size };
}

export function validateFinalVault(lock) {
  const base64 = value => typeof value === 'string' && value.length > 0 && value.length <= 32_000_000
    && value.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(value);
  if (lock?.version !== 1 || !Number.isInteger(lock.iterations) || lock.iterations < 600_000 || lock.iterations > 2_000_000
    || !['salt', 'iv', 'ciphertext'].every(key => base64(lock[key]))
    || Buffer.from(lock.salt, 'base64').length !== 16 || Buffer.from(lock.iv, 'base64').length !== 12
    || Buffer.from(lock.ciphertext, 'base64').length < 16 || lock.ciphertext.length > 32_000_000) {
    throw new Error('Invalid encrypted final-review vault.');
  }
}

export async function decryptFinalVault(lock, password) {
  validateFinalVault(lock);
  if (typeof password !== 'string' || !password.trim() || password.trim().length > 256) throw new Error('A private final-review key is required.');
  const input = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password.trim()), 'PBKDF2', false, ['deriveKey']);
  const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: Buffer.from(lock.salt, 'base64'), iterations: lock.iterations }, input, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  const bytes = await webcrypto.subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(lock.iv, 'base64') }, key, Buffer.from(lock.ciphertext, 'base64'));
  const payload = JSON.parse(new TextDecoder().decode(bytes));
  if (payload?.version !== 1 || payload.marker !== 'AI_TEST_FINAL_REVIEW' || !payload.nonce || !payload.catalog) throw new Error('Vault does not contain a final-review catalog.');
  return payload.catalog;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
    const keyPath = option('--key-file'), catalogPath = option('--catalog');
    const password = keyPath ? fs.readFileSync(keyPath, 'utf8').trim() : process.env.FINAL_REVIEW_PASSWORD;
    const lock = JSON.parse(fs.readFileSync(path.join(root, 'src/finals/lock.json'), 'utf8'));
    validateFinalVault(lock);
    if (!catalogPath && !password) {
      if (args.includes('--complete') || args.includes('--phase1-complete')) throw new Error('Completion requires --catalog <private-json> or --key-file <private-key> to validate all decrypted content.');
      console.log('Encrypted final vault: envelope valid. Content validation requires a private key or private catalog; no publication count was inferred.');
    } else {
    const catalog = catalogPath ? JSON.parse(fs.readFileSync(catalogPath, 'utf8')) : await decryptFinalVault(lock, password);
    const plan = JSON.parse(fs.readFileSync(path.join(root, 'src/finals/plan.json'), 'utf8'));
    const result = validateFinals(catalog, plan, { complete: args.includes('--complete'), phase1Complete: args.includes('--phase1-complete') });
    for (const error of result.errors) console.error(`FAIL: ${error}`);
    console.log(`Final review: ${result.published}/${result.planned} published. The earlier 20-exam plan is not a completion claim.`);
    if (result.errors.length) process.exitCode = 1;
    }
  } catch { console.error('Final-review validation failed. Check the vault, private key/catalog, and content schema.'); process.exitCode = 1; }
}
