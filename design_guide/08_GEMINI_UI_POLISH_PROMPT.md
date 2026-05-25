# Gemini/Antigravity UI Polish Prompt — Copy-Paste Ready

이 문서 전체를 UI agent에게 그대로 전달하세요.
06에서 정의한 T1~T5를 실행하는 완결형 프롬프트입니다.

---

## Context

DUO is a mobile-first vocabulary learning PWA (Vanilla JS + Vite).
Current code works but has inline styles that should be CSS classes.
This task is code-quality cleanup only — no visual redesign.

## Scope

**Edit these 4 files only:**

```
src/style.css
src/screens/wordbook.js
src/screens/lesson.js
src/screens/review.js
```

**Do NOT touch:**

```
src/lib/*          ← FSRS algorithm, storage, gamification, league, sounds
src/data/*         ← word data
src/app.js         ← router
src/main.js        ← entry
src/screens/home.js
src/screens/league.js
src/screens/stats.js
src/components/*   ← leave as-is
scripts/*
data/*
package.json
package-lock.json
vite.config.js
```

## Critical: Preserved Selectors

These IDs and data attributes are bound to event handlers. Renaming or removing them breaks the app.

**wordbook.js:** `id="word-search"`, `id="category-filters"`, `id="word-list"`, `id="speak-detail"`, `id="close-detail"`, `data-cat`, `data-word-id`, `class="filter-chip"`, `class="wli-speak"`, `class="word-list-item"`

**lesson.js:** `id="quiz-close"`, `id="quiz-body"`, `id="quiz-footer"`, `id="flashcard"`, `id="speak-btn"`, `id="flashcard-actions"`, `id="rating-buttons"`, `id="option-${i}"`, `id="fill-input"`, `id="fill-submit"`, `id="blank-display"`, `id="fill-hint"`, `id="next-btn"`, `id="complete-ad"`, `id="complete-home"`, `id="complete-more"`, `id="back-home"`, `data-index`, `data-rating`, `data-id`, `data-type`, `class="quiz-option"`, `class="rating-btn"`, `class="matching-item"`, `class="word-item"`

**review.js:** `id="review-close"`, `id="review-flashcard"`, `id="speak-btn"`, `id="review-footer"`, `id="to-lesson"`, `id="to-home"`, `id="review-home"`, `data-rating`, `class="rating-btn"`

## Tasks

### T1 — Wordbook Search Input (wordbook.js 26–32)

Remove all `style="..."` from the search area.
Add to style.css:

- `.wordbook-search-wrap` — relative positioned container, padding 0 0 8px
- `.wordbook-search-input` — full width, 12px 16px 12px 40px padding, 2px border, radius-lg, 0.9rem/500, bg-card, focus: primary border + ring
- `.wordbook-search-icon` — absolute left 14px, vertically centered, 1rem, text-muted, pointer-events none

Replace the HTML with:
```html
<div class="wordbook-search-wrap animate-in">
  <input type="text" id="word-search" class="wordbook-search-input"
         placeholder="단어 검색..." autocomplete="off">
  <span class="wordbook-search-icon">🔍</span>
</div>
```

### T2 — Word Detail Modal (wordbook.js showWordDetail, 152–206)

Remove all 33 inline `style="..."` from the modal content.
Add to style.css a `.word-detail-*` class family:

| Class | Purpose |
|---|---|
| `.word-detail-header` | center text, mb 24px |
| `.word-detail-word` | 2rem/800 |
| `.word-detail-sub` | 0.9rem, text-secondary |
| `.word-detail-tags` | inline-flex, gap 8px |
| `.word-detail-tag` | 0.75rem/600, pill |
| `.word-detail-tag--pos` | primary-50/primary-600 |
| `.word-detail-tag--state` | divider/text-secondary |
| `.word-detail-section` | mb 20px |
| `.word-detail-label` | 0.8rem/700, text-muted, uppercase, letter-spacing |
| `.word-detail-meaning` | 1.2rem/700 |
| `.word-detail-example-box` | mb 20px, p 16px, divider bg, radius-lg |
| `.word-detail-example` | 0.95rem, line-height 1.6 |
| `.word-detail-example-ko` | 0.85rem, text-secondary |
| `.word-detail-info-grid` | flex, gap 8px, mb 16px |
| `.word-detail-info-item` | flex 1, p 12px, bg, radius-md, center |
| `.word-detail-info-label` | 0.7rem, text-muted, 600 |
| `.word-detail-info-value` | 0.85rem/700, mt 2px |
| `.word-detail-study-box` | p 12px, bg, radius-md |
| `.word-detail-study-row` | flex, space-between, 0.8rem |
| `.word-detail-study-due` | 0.75rem, text-muted, mt 4px |

Also add spacing helpers for buttons inside modal:
```css
.word-detail-study-box + .btn,
.word-detail-info-grid + .btn { margin-top: 16px; }
.modal-content .btn + .btn { margin-top: 8px; }
```

Keep `id="speak-detail"` and `id="close-detail"` on the buttons.

### T3 — New Word Badge (lesson.js lines 135, 222)

Replace both inline-styled badge strings with:
```js
const newBadge = quiz.isNew ? '<div class="new-word-badge">✨ 새 단어</div>' : '';
```

Add to style.css:
```css
.new-word-badge {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary-600);
  background: var(--primary-50);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}
.quiz-question .new-word-badge { margin-bottom: 8px; }
```

### T4 — Review Label (review.js line 78)

Replace:
```html
<div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-bottom:8px">🔄 복습</div>
```
With:
```html
<div class="review-label">🔄 복습</div>
```

Add to style.css:
```css
.review-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 8px;
}
```

### T5 — 360px Responsive Patch (style.css only)

Add before the existing `@media (min-width: 481px)` block:

```css
@media (max-width: 374px) {
  .matching-item {
    font-size: 0.8rem;
    padding: 12px 10px;
    min-height: 48px;
    word-break: keep-all;
    overflow-wrap: break-word;
  }
  .flashcard-ratings {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  .rating-btn {
    padding: 10px 8px;
  }
}
```

Also add to the existing `.league-row .name` block (not inside media query):
```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

## Validation

```bash
npm run build          # must exit 0
npm test -- --run      # must exit 0
```

## Report Format

When done, provide:
1. Files changed (should be exactly 4)
2. Inline styles removed (count per file)
3. CSS classes added (count)
4. Build/test result
5. Any visual regressions you noticed
