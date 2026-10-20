# Final-review handoff

The current scope is **L34 Phase 1, days 01–15 only**. Phase 2 was not reviewed and is not published. The earlier 20-exam plan remains in the schema and completion validator; it is not the scope or delivery claim of this update.

## Content status and sources

The encrypted catalog contains one original practice exam: 85 questions, with 60 multiple-choice and 25 open responses (19 short answers, one system prompt, five scenarios), plus two Phase 1 cheat sheets with three pages each. Private-catalog and decrypted-vault validation passed. This is content marked published inside the catalog; a production release requires a separately verified merge and Pages deployment.

Course material comes from `vinuni-vlearn/AI20k-data` at commit `4085fd309e916226311e192c8360a19ec00ff00f`. The review covers 44 selected Phase 1 files; the source-review evidence records the selected paths and page or heading locators. This is a bounded review, not a claim that the whole repository was read.

The authored questions and sheets cite days 01–14. Day 15 orientation was reviewed but has no dedicated question in this exam. Answer positions A/B/C/D each occur 15 times. There is only one exam, so cross-exam overlap is not applicable.

Questions are original practice material grounded in those sources. The 90-minute, 85-question format and reported topics are provisional learner recollections, not an official examination specification. The latest learner feedback includes a small code-diagnosis or function-fix exercise; it may be represented as an open response with a model answer and rubric rather than requiring a code runner.

Each question and cheat-sheet section must retain source references and a real page, slide or heading locator. Use namespaced `final-p1-*` question and exam IDs so progress stays separate from Crown. Publish authored material only after checking factual correctness, source coverage, answer choices, hints, rubrics and model answers.

## Encryption and private authoring

Read [FINAL_REVIEW_SECURITY.md](FINAL_REVIEW_SECURITY.md) for the password boundary and publishing procedure. `src/finals/lock.json` is the public encrypted vault. No plaintext catalog is imported by the frontend; the private authoring catalog, extracted source material and key file belong outside the public checkout. Never recreate a public `src/finals/content.json` question bank.

The gate must decrypt the catalog before entering. A stored unlock flag alone cannot unlock it. Decrypted content stays in page memory; refreshing requires the key again, and “Khóa khu này” clears the active catalog. Answers and self-grades use the existing browser progress storage. Shared-key users can extract decrypted questions, and offline password guessing remains possible.

The following paths are placeholders for private files, not repository files:

```powershell
node scripts/validate-finals.mjs --catalog "E:\Private\AI-TEST\phase1-catalog.json"
npm run generate:final-lock -- "E:\Private\AI-TEST\phase1-catalog.json" "E:\Private\AI-TEST\final-review-key.txt"
node scripts/validate-finals.mjs --key-file "E:\Private\AI-TEST\final-review-key.txt"
```

Packing replaces only the public encrypted vault. Ordinary builds must not rotate the final key. Keep an independent private backup of both the authoring catalog and key. Do not put keys or plaintext course content into source, fixtures, documentation, logs, `VITE_*` variables or build artifacts.

## Validation and release evidence

Ordinary CI checks the vault envelope plus synthetic schema, encryption, gate and quiz-review tests. Without the private key it cannot certify the actual encrypted content. Validate the actual decrypted vault locally before publishing, then run `npm run validate` and the normal build with the repository's existing Crown build configuration.

`validate:finals:complete` still requires the earlier 20-exam plan, four confirmed Phase 2 tracks and their cheat sheets. It intentionally fails for this Phase 1-only delivery. Do not weaken that contract or report all 20 exams complete.

Before release, verify the actual Phase 1 exam and two sheets, correct and incorrect keys, forged session-flag rejection, Crown isolation, saved progress, 85-question navigation, timer stop after submission, answer review, self-grading, hint and model-answer buttons, mobile layout and absence of private plaintext or keys from the repository and bundle. Local checks do not prove a GitHub merge or Pages deployment; verify those separately before claiming publication.

This update does not change the public README or the Crown password and deployment configuration. Legacy and Crown question banks remain outside the encrypted final-review catalog.
