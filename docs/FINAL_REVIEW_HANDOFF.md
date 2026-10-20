# Final-review handoff

The current scope is **L34 Phase 1, days 01–15 only**. Phase 2 was not reviewed and is not published. The earlier 20-exam plan remains in the schema and completion validator; it is not the scope or delivery claim of this update.

## Content status and sources

The encrypted catalog contains **10 original practice exams / 850 questions**, plus a **15-day Phase 1 handbook with 185 topics**. Every handbook topic has an explanation, original example, common mistake and pinned source/page or line reference. Each day has three thematic parts and can be selected or searched without Vietnamese accents. Every exam has 60 multiple-choice and 25 open responses: 20 short responses (including a system prompt and a small Python repair), and five scenarios. Each exam is 90 minutes and 100 points. Private-catalog and decrypted-vault validation must pass before repacking. Published catalog status does not establish a GitHub merge or Pages deployment.

Course material comes from `vinuni-vlearn/AI20k-data` at commit `4085fd309e916226311e192c8360a19ec00ff00f`. The handbook authoring inventory contains 69 selected cohort-4/shared teaching files within Phase 1 (40 PDFs and 29 Markdown labs); 28 sources are registered and cited in the catalog. It combines the daily core slides with relevant alternate slide/lab material, including context/loop/harness, ANN, data quality, durable approval and evaluation statistics. Image-only slide variants were visually reviewed; private evidence records file identities, source locators, daily coverage and numerical checks. This is a curriculum handbook, not a claim that every asset or cohort variant in the repository was transcribed.

The authored questions cite days 01–14; the handbook covers days 01–15, including integration, operating costs and the three track previews within Day 15. No Phase 2 contents were read. Answer positions A/B/C/D each occur 15 times per exam. Across all 45 exam pairs, overlap by canonical learning intent is at most 11/25 open responses; at most 10/60 MCQs are reused verbatim. Shared learning goals use different scenarios, inputs or reasoning tasks. The nine added exams underwent cross-author review of answers, distractors, source pages, calculations and Python solutions.

Every exam rehearses ROI, supervisor/worker feedback handling, the ReAct loop, chunking and metadata, the missing `effective_date` / 8-versus-4 RAG incident, faithfulness versus context recall, system-prompt role/output/guardrail, code repair, model-change release checks, cosine similarity and retrieval/sampling parameters. At least five short responses use fill-in, matching or process ordering. Topics follow learner recollections within Phase 1; this is not a recovered official paper.

Questions are original practice material grounded in those sources. The 90-minute, 85-question format and reported topics are provisional learner recollections, not an official examination specification. The latest learner feedback includes a small code-diagnosis or function-fix exercise; it may be represented as an open response with a model answer and rubric rather than requiring a code runner.

Each question and cheat-sheet section must retain source references and a real page, slide or heading locator. Use namespaced `final-p1-*` question and exam IDs so progress stays separate from Crown. Publish authored material only after checking factual correctness, source coverage, answer choices, hints, rubrics and model answers.

## Encryption and private authoring

Read [FINAL_REVIEW_SECURITY.md](FINAL_REVIEW_SECURITY.md) for the password boundary and publishing procedure. `src/finals/lock.json` is the public encrypted vault. No plaintext catalog is imported by the frontend; the private authoring catalog, extracted source material and key file belong outside the public checkout. Never recreate a public `src/finals/content.json` question bank.

The gate must decrypt the catalog before entering. A stored unlock flag alone cannot unlock it. Decrypted content stays in page memory; refreshing requires the key again, and “Khóa khu ôn” clears the active catalog. The encrypted vault loads only when the gate needs it. Shared-key users can extract decrypted questions, and offline password guessing remains possible.

The workspace separates exam selection from the searchable knowledge notebook. Each exam retains its own answers, self-grades, position, remaining time, flags and submitted state on the device. Changing mode/timer preserves the run; explicit restart clears it. Leaving pauses the timer. A storage failure keeps the in-memory work visible, warns on the result screen and guards leaving/reloading. Mobile uses a collapsible question map and compact navigation. Result filters include pending self-grades and all questions, including correct MCQs.

The following paths are placeholders for private files, not repository files:

```powershell
node scripts/validate-finals.mjs --catalog "E:\Private\AI-TEST\phase1-catalog.json" --phase1-complete
npm run generate:final-lock -- "E:\Private\AI-TEST\phase1-catalog.json" "E:\Private\AI-TEST\final-review-key.txt"
node scripts/validate-finals.mjs --key-file "E:\Private\AI-TEST\final-review-key.txt" --phase1-complete
```

Packing replaces only the public encrypted vault. Ordinary builds must not rotate the final key. Keep an independent private backup of both the authoring catalog and key. Do not put keys or plaintext course content into source, fixtures, documentation, logs, `VITE_*` variables or build artifacts.

## Validation and release evidence

Ordinary CI checks the vault envelope plus synthetic schema, encryption, gate and quiz-review tests. Without the private key it cannot certify the actual encrypted content. Validate the actual decrypted vault locally before publishing, then run `npm run validate` and the normal build with the repository's existing Crown build configuration.

`validate:finals:phase1` requires private input via `-- --catalog <file>` or `-- --key-file <file>` and checks all ten Phase 1 IDs plus all fifteen published handbook days. Daily sheet numbers must be unique integers from 1 to 15. Private checks additionally verify examples, common mistakes, source/page bounds, numerical examples, and byte-equivalent preservation of the ten exam objects. `validate:finals:complete` still requires the earlier 20-exam plan, four confirmed Phase 2 tracks and their cheat sheets. It intentionally fails for this Phase 1-only delivery. Do not weaken that contract or report all 20 exams complete.

Before release, verify all ten Phase 1 exams and fifteen handbook days, day-filter/search interaction, correct and incorrect keys, forged session-flag rejection, Crown isolation, saved progress, 85-question navigation, timer stop after submission, answer review, self-grading, hint and model-answer buttons, mobile layout and absence of private plaintext or keys from the repository and bundle. Include handbook explanations/examples/common mistakes in the plaintext scan. Local checks do not prove a GitHub merge or Pages deployment; verify those separately before claiming publication.

This update does not change the public README or the Crown password and deployment configuration. Legacy and Crown question banks remain outside the encrypted final-review catalog.
