# Final-review content on a public repository

The final-review entry uses its own password, separate from Crown. The public `src/finals/lock.json` contains the encrypted catalog: questions, correct answers, explanations and cheat sheets. No plaintext catalog is imported by Vite.

PBKDF2-SHA-256 (600,000 iterations, random 16-byte salt) derives an AES-GCM 256-bit key. Each publication uses a fresh 12-byte IV. Authenticated decryption must succeed and the payload must contain the final-review marker and catalog. A sessionStorage flag alone cannot open the space.

The decrypted catalog stays in memory. Refresh requires the password again; “Khóa khu ôn” clears the in-memory catalog. The password and catalog are never written to browser storage. Answers, self-grades and per-exam run state (position, timer, flags and submission) use local progress storage. A storage failure warns before leaving, including from results. Users on a shared device should clear that browser data after studying.

## Intended boundary

This supports a study space with a shared password and intentional resistance to casual inspection. Anyone can download the ciphertext and try password guesses offline; the five-attempt UI delay does not limit offline guessing. A weak password weakens the entire protection. Anyone who knows the password can extract or share the decrypted questions.

A public repository is suitable for that goal. Supabase is unnecessary for this static version. Revocable per-user access, server-enforced attempt limits or withholding answers until submission would require a server with authorization checks. Moving plaintext into a publicly readable database would not provide that boundary.

The existing legacy and Crown collections remain outside this encrypted catalog.

## Author and republish

Keep the authoring catalog, extracted source files and password **outside the public checkout**. Back up the private catalog and key securely; the public repo does not contain an editable plaintext question bank.

Validate private authored material:

```powershell
node scripts/validate-finals.mjs --catalog <private-catalog.json> --phase1-complete
```

Encrypt and replace the public vault atomically:

```powershell
npm run generate:final-lock -- <private-catalog.json> <private-key-file>
```

Alternatively provide `FINAL_REVIEW_PASSWORD` privately in the shell and omit the key-file argument. Never use a `VITE_*` variable, shell command-line password, source file or log. The packer requires 20–256 trimmed characters and refuses private inputs located inside the public checkout.

Validate the actual encrypted content locally:

```powershell
node scripts/validate-finals.mjs --key-file <private-key-file> --phase1-complete
```

Ordinary CI without the private key checks the encrypted envelope plus synthetic encryption, schema, gate and review tests. It cannot certify the actual encrypted content. Run the private-content validation before committing a new vault. An ordinary build never changes the final-review password or vault.

`validate:finals:phase1` checks all ten Phase 1 exam IDs and a published Phase 1 sheet using private input. `validate:finals:complete` retains the earlier 20-exam completion contract. The current Phase 1 publication does not fulfill that earlier plan; passing ordinary validation is not a claim that all 20 exams exist.
