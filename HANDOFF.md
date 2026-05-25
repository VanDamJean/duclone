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
- Content batch 1:
  - French increased from 20 to 70 words.
  - Japanese increased from 20 to 70 words.
  - Batch files saved in `data/vocab-import/batches/fr-001.json` and `data/vocab-import/batches/ja-001.json`.
- Content batch 2:
  - French increased from 70 to 120 words.
  - Japanese increased from 70 to 120 words.
  - Batch files saved in `data/vocab-import/batches/fr-002.json` and `data/vocab-import/batches/ja-002.json`.
- Content batch 3:
  - French increased from 120 to 170 words.
  - Japanese increased from 120 to 170 words.
  - Batch files saved in `data/vocab-import/batches/fr-003.json` and `data/vocab-import/batches/ja-003.json`.
- Content batch 4:
  - French increased from 170 to 220 words.
  - Japanese increased from 170 to 220 words.
  - Batch files saved in `data/vocab-import/batches/fr-004.json` and `data/vocab-import/batches/ja-004.json`.
- Content batch 5:
  - French increased from 220 to 300 words.
  - Japanese increased from 220 to 300 words.
  - Batch files saved in `data/vocab-import/batches/fr-005.json` and `data/vocab-import/batches/ja-005.json`.
- English content batch 1:
  - English increased from 200 to 300 words.
  - Batch file saved in `data/vocab-import/batches/en-001.json`.
- Weekly league rollover MVP:
  - Week changes finalize the old league.
  - Promotion/stay/demotion tier changes apply to the new week.
  - League screen shows a dismissible previous-week result card.
- League reward copy:
  - League screen shows rank-zone coaching for promotion, stay, and demotion zones.
  - Daily ad reward copy changes by context, such as booster for promotion or staying out of demotion.
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

- EN: 300 words, ready.
- FR: 300 words, ready.
- JA: 300 words, ready.
- Source metadata warnings are cleared.

## What To Do Next

Recommended order:

1. Add a small content QA pass for imported examples before broader release.
2. Tune difficulty/category mix after real usage data.
3. Continue app-shell polish in Figma/Gemini without touching learning logic.

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
