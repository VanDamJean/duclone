# DUO Product Roadmap

## Product Goal

Build a low-friction daily vocabulary routine: 15-20 words per day, minimal conscious effort, FSRS-backed memorization, and one optional rewarded ad per day.

## Next Milestones

### 1. Language Data Schema

Status: done.

- Keep `word` as the clean target-language form.
- Add language-specific fields before expanding content.
- Japanese: `reading`, `romaji`, optional `ttsText`.
- French: `gender`, `article`, optional `plural`.
- English: keep `pronunciation`, optionally add `phonetic` later.
- Make quiz, review, wordbook, search, and TTS use presentation helpers instead of hardcoding `word`.

### 2. Language-Specific Quiz Behavior

Status: done.

- Japanese: separate kanji/kana display, accept kana/kanji where useful.
- French: show article for nouns, keep bare-word answers acceptable where useful.
- TTS: prefer clean speakable text per language.
- Avoid English-specific copy and assumptions in quiz internals.

### 3. Content Expansion

Status: in progress.

- Expand French and Japanese toward the first 300-word target.
- Add category and difficulty coverage for daily sessions.
- Validate sample sentences and translations before scaling further.
- Track import sources in `docs/CONTENT_PIPELINE.md`.
- Run `npm run vocab:check` before each content batch.
- Batch 1 complete: French 20 -> 70, Japanese 20 -> 70.

### 4. Weekly League Loop

Status: in progress.

- Add weekly rollover, result screen, promotion/stay/demotion handling.
- Keep bot league first; real global users can come after auth/backend.
- Tie daily rewarded ad to a small league push, not forced progress.
- Weekly rollover MVP complete: previous-week result is stored, tier changes are applied, and a dismissible result card appears in the league screen.

## Later

- Full app redesign in Figma.
- Real ad SDK integration.
- Backend/auth/sync for global league and multi-device progress.
