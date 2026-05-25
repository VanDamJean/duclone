# DUO Project Handoff

## Current State

This is a Vite vanilla JS vocabulary learning PWA. The product goal is a low-friction daily routine: 15-20 words per day, FSRS-backed memorization, minimal conscious effort, and one optional rewarded ad per day.

Repository:

- `/Users/a1/Desktop/manus/duo`
- Branch: `main`

## Recently Completed

- Multilingual data proxy:
  - English, French, and Japanese data files.
  - Per-language FSRS/review storage keys.
  - Global XP/streak remains shared.
- Language-neutral quiz copy:
  - Removed English-specific labels from user-facing quiz text.
- Weekly league MVP:
  - Local bot league, LP scoring, tiers, and once-per-day mock ad reward.
- Language data schema cleanup:
  - Japanese `word`, `reading`, `romaji` are now separated.
  - French nouns can carry `article` and `gender`.
  - Shared presentation helper added in `src/lib/wordPresentation.js`.
- Language-specific answer behavior:
  - Japanese fill-blank accepts kanji, kana, and romaji.
  - French fill-blank accepts both article+noun and bare noun.
  - TTS uses clean speakable text.
- Vocabulary expansion pipeline:
  - `docs/CONTENT_PIPELINE.md`
  - `data/vocab-import/sources.json`
  - `scripts/validate-vocab.mjs`
  - `scripts/import-vocab-batch.mjs`
  - `npm run vocab:check`
  - `npm run vocab:import -- <batch.json>`
- Small visible UI status:
  - Home language selector now shows word counts.

## Validation Commands

Run these before committing or handing off:

```bash
npm run vocab:check
npm test -- --run
npm run build
git diff --check
```

Expected current vocab check summary:

- EN: 200 words, 100 short of 300.
- FR: 20 words, 280 short of 300.
- JA: 20 words, 280 short of 300.
- Existing words still lack source metadata; this is tracked as warning debt.

## What To Do Next

Recommended order:

1. Commit the current pipeline/schema work.
2. Let Gemini/Antigravity do UI-only polish using `docs/UI_POLISH_BRIEF.md`.
3. Review Gemini's diff carefully.
4. Create reviewed FR/JA batches of 50 words each.
5. Dry-run each batch with `npm run vocab:import -- <batch>`.
6. Apply with `--apply`, then run full validation.
7. After content starts moving, implement weekly league rollover/result screen.

## Do Not Let UI Agents Touch

- `src/lib/scheduler.js`
- `src/lib/quizEngine.js`
- `src/lib/storage.js`
- `src/lib/league.js`
- `src/data/*`
- `scripts/*`
- `data/vocab-import/*`
- `package.json`

UI-only agents may touch:

- `src/style.css`
- `src/screens/home.js`
- `src/screens/lesson.js`
- `src/screens/wordbook.js`
- `src/screens/league.js`
- `src/components/*`

## Notes

- Current app still looks visually rough because recent work was mostly data/model/quiz plumbing.
- The content expansion should use reviewed batches, not direct one-off edits to word data.
- Avoid copying from Duolingo, Naver Dictionary, paid dictionaries, or commercial apps.
- Keep source metadata for new imported words.
