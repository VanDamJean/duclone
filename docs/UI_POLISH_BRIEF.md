# UI Polish Brief for Gemini / Antigravity

## Goal

Polish the existing DUO vocabulary app shell so it feels more like a real mobile-first learning app. Keep the product as an actual app screen, not a landing page.

## Scope

You may edit:

- `src/style.css`
- `src/screens/home.js`
- `src/screens/lesson.js`
- `src/screens/wordbook.js`
- `src/screens/league.js`
- `src/components/*`

Do not edit:

- `src/lib/scheduler.js`
- `src/lib/quizEngine.js`
- `src/lib/storage.js`
- `src/lib/league.js`
- `src/data/*`
- `scripts/*`
- `data/vocab-import/*`
- `package.json`
- `package-lock.json`

## Design Direction

- Mobile-first learning app.
- Quiet Duolingo-like ergonomics without copying Duolingo branding.
- More polished spacing, cards, buttons, typography, empty states, and progress treatment.
- Make the home, lesson, wordbook, and league screens feel like one coherent app.
- Keep controls obvious and finger-friendly.
- Keep text from overlapping at 390px mobile width.
- Avoid a marketing hero or landing page.
- Avoid touching the learning algorithm, storage, vocabulary data, import scripts, or league scoring logic.

## Specific Opportunities

- Home:
  - Make the daily progress card feel more premium.
  - Make language selector and counts look intentional.
  - Improve quick actions and level card hierarchy.
- Lesson:
  - Improve flashcard polish and feedback state.
  - Make multiple-choice buttons feel tappable and stable.
  - Keep speaker button accessible.
- Wordbook:
  - Improve list item density and detail modal.
  - Make search/filter feel native.
- League:
  - Make rank zones and player rows clearer.
  - Make the reward ad button feel like a daily optional boost.

## Acceptance Criteria

Run:

```bash
npm test -- --run
npm run build
```

Manual check:

- App opens at mobile width around 390px.
- No obvious text overlap.
- Home, lesson, wordbook, and league still navigate.
- Language selector still works.
- No data files or algorithm files changed.

## Final Response Needed

Summarize:

- Files changed.
- Screens polished.
- Tests/build result.
- Any known visual compromises.
