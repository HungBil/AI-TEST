# Final-review workspace — implementation and content handoff

## Actual state

The application shell is implemented. The course content is NOT complete.

- A separate cap-shaped entry opens the final-review space using its own client-side verifier.
- The existing Crown key, Crown session, legacy questions, Crown questions, cat popups and public README are unchanged.
- Final content is lazy-loaded after unlocking; progress IDs begin with `final-`.
- Phase 1 has 10 planned exam slots. Phase 2 has 10 planned slots across four provisional track slots (3/3/2/2). This is 20 exams total, NOT 10 per track.
- `src/finals/content.json` deliberately has no published questions or course cheat sheets.
- Unpublished slots have disabled Start buttons. A visible notice states that the source has not been read.
- The source repository `vinuni-vlearn/AI20k-data` returned 404 in the connector during preparation. This does not prove it is deleted; the remaining work must use an authorized local checkout or authorized GitHub access.
- Do not claim the 20 exams exist simply because the UI has 20 slots.

## Files and contracts

- `src/finals/plan.json`: provisional format and track-slot allocations.
- `src/finals/catalog.ts`: TypeScript contracts, planned slot IDs, source-backed track names.
- `src/finals/content.json`: registry of reviewed sources, track definitions, exams and cheat sheets.
- `src/finals/FinalGate.tsx`, `access.ts`, `lock.json`: independent access gate.
- `src/finals/FinalReview.tsx`: phase/track selectors, study cards, cheat-sheet viewer and existing QuizRunner integration.
- `scripts/validate-finals.mjs`: provenance, count, schema and overlap checks.
- `scripts/index-final-sources.mjs`: local Git-tree inventory without downloading blobs.
- `scripts/generate-final-lock.mjs`: optional maintainer-initiated key rotation.

## Password boundary

The requested final-review key is already represented by a random-salt PBKDF2-SHA256/AES-GCM verifier in `lock.json`; plaintext is not committed. Marker `AI_TEST_FINAL_REVIEW` and session keys `ai-test:finals:*` are independent from Crown.

This is a GitHub Pages client-side gate, not authentication. A technical user can bypass UI state or attempt offline guesses. That limitation is intentional. Do not add a backend, Worker or API key. Do not overwrite the verifier with the CI key. Do not reveal or copy the owner's key into source, tests, documentation, logs or VITE variables.

Rotation, ONLY when the owner requests it: set `FINAL_REVIEW_PASSWORD` privately in the shell and run `npm run generate:final-lock`. Commit only the resulting verifier. Ordinary builds do not regenerate it or require this variable.

## Provisional exam format

Based on the learner's message dated 04/09/2026: 90 minutes, roughly 85 questions of which 25 are open responses; no handwritten code; examples include writing system prompts and explaining a solution to a situation. These are learner-reported assumptions, NOT official school specifications.

The current mock format is 60 MCQs + 25 open questions, 90 minutes, 100 points. A practical point allocation is 60 MCQs x 1, 20 concise open responses x 1, 5 longer scenarios x 4. A system prompt is natural-language writing, not a coding exercise. Do not make all 25 open responses lengthy architecture essays.

A/B/C/D are renderer section identifiers, not a verified final-course syllabus. Set exam.moduleLabels and moduleOverview to honest section names after reviewing the course. Do not copy the entrance-exam math/Python/RAG blueprint blindly. Check the existing QuestionCard header rendering if labels need to be passed through.

## Read the large source repository incrementally

Prefer a local checkout supplied by the owner. Do not download a full repository ZIP or all videos, weights, datasets, archives or LFS assets.

For authorized remote access when a checkout is not available:

```bash
GIT_LFS_SKIP_SMUDGE=1 git clone --filter=blob:none --no-checkout --depth=1 --single-branch --no-tags https://github.com/vinuni-vlearn/AI20k-data.git ../AI20k-data
# Run from the AI-TEST application repository:
node scripts/index-final-sources.mjs ../AI20k-data
```

The script writes an ignored `.study-cache/source-inventory.json`. Its records are UNREVIEWED. Listing a filename is not reading a source.

1. Read README/syllabus/schedule/index files first. Establish the official names and boundaries of Phase 1 and all four Phase 2 tracks. Do not invent track names.
2. Pin the exact source commit SHA. Use `git ls-tree -r --name-only HEAD` to list paths without reading bodies.
3. Read selected text blobs using `git show 'HEAD:<exact-path>'`; use small batches of slides/PDF/PPTX only when needed. Handle LFS pointers explicitly; do not bulk-fetch LFS.
4. Extract text locally, preserving page/slide/heading labels. Inspect diagrams/tables where extracted text is insufficient; do not assume empty extraction means an empty slide. Do not run blanket OCR or dump thousands of pages into the context.
5. Store extraction caches outside source control. Commit only authored practice material and source metadata/references, not raw course documents or confidential data.
6. Build a topic map: phase, track, lesson, keywords, easily confused terms, example skills, suitable question forms, source path and locator, review status.
7. Work lesson-by-lesson and track-by-track, saving a progress checkpoint after each batch. Do not state that the entire source has been read when only its README has been read.

Git reference: https://git-scm.com/docs/git-clone/ . `--filter=blob:none` defers blob contents; `--no-checkout` avoids a full initial checkout.

## Content data model

`content.json` has four arrays:

1. `sources`: `{id, repo, path, revision, phase, trackId?, reviewed}`. `revision` is a 40-character source commit SHA. Mark reviewed=true only after reading the actual material.
2. `trackDefinitions`: `{id, title, sourceRefs}`. IDs are track-1 through track-4; titles must be confirmed by the course sources. Phase 2 source records must match the track.
3. `exams`: existing Exam fields plus `{phase, trackId?, status}` and `questions`.
4. `cheatSheets`: `{id, phase, trackId?, status, title, pages}`.

Every question must include `intentId` and `sourceRefs: [{sourceId, locator}]`. A locator is an actual slide/page/heading/line range, not a made-up citation. For Phase 2, references may include shared Phase 1 fundamentals but must not silently import another track's syllabus.

MCQs: `type:'mcq'`, four A/B/C/D options, one answer, useful explanation. Open questions: `type:'essay'`, `responseKind:'short-answer'|'system-prompt'|'scenario'`, at least three separate hints, at least three rubric criteria, modelAnswer in accessible Vietnamese with a concrete 'Ví dụ'. No `code` question type.

Exam IDs must use planned IDs: `final-p1-01` through `final-p1-10`; Phase 2 uses `final-p2-t1-01`, etc. Each question ID starts with its exam ID plus a hyphen. The session/progress namespace must never overlap Crown.

Cheat sheets: 2–3 pages per sheet. Each page has `{title, sections}`; each section has `{title, keywords[], explanation, example, commonMistake, sourceRefs[]}`. Publish at least one Phase 1 sheet and one for each of the four tracks; add more short sheets when needed rather than compressing an entire curriculum into unreadable text.

## Authoring order and quality

1. Confirm track titles and coverage map from actual source material.
2. Author one Phase 1 exam plus its cheat sheet; review the source coverage and nontechnical clarity.
3. Finish Phase 1 exams 02–10, varying scenarios, questions and reasoning while staying within the same course.
4. Author one Phase 2 exam per confirmed track; review before filling the remaining allocated slots.
5. Build track-specific cheat sheets from the final question coverage, not generic AI summaries.
6. Do not import the owner's unrelated personal project topics. Do not increase difficulty merely to force different exams.
7. No repeated open prompt verbatim. For any pair of exams, at most 12/25 open questions may share the same intent (48%). Do not create new intent IDs to disguise equivalent prompts/rubrics. Audit semantic overlap manually as well.
8. Within the same phase/track, at most 15/60 MCQ prompts may be identical. Shuffle answer positions, avoid obvious nonsense distractors and verify one correct answer.
9. Include the common keywords and distinctions in the slides. Broad coverage matters more than advanced, obscure terminology.
10. Change draft to published only after references, answers, hints, examples and rubrics are reviewed. Unfinished exams must remain hidden from Start.

## Commands and completion criteria

For the existing Crown build dependency, use a TEST-ONLY local key, never reset the deployed Crown secret:

```bash
npm ci
export CROWN_PASSWORD=ci-test-password-only
npm run generate:crown-lock
npm run validate
npm run build
# Must fail while content is incomplete:
npm run validate:finals:complete
```

`validate:finals` intentionally permits an empty scaffold. `validate:finals:complete` requires 20 published exams, four source-confirmed tracks and published sheets for Phase 1 and each track. Do not remove/weaken this distinction to claim completion.

Before final handoff: test correct/incorrect final key, Crown/final session isolation, phase and track filters, disabled draft exams, actual published exam start, hint/sample-answer opt-in, Exam mode hiding answers, saved progress per final ID, 85-question navigation, self-grading, mobile sheets and old Crown/legacy flows.

Check that question review after submitting in Exam mode actually reveals the answers and allows self-grading: the existing QuizRunner review behavior may need a small backward-compatible fix. Do not regress Crown's independent hint and answer buttons. Tests must include this path when published content is added.

Create a focused content branch, commit in batches, open a PR, wait for CI, squash-merge if authorized, and verify the deployed Pages commit. Report the real source coverage, exam counts, sheet counts, remaining gaps and actual merge/deploy status. Never claim a merge or production release based only on a local build.
