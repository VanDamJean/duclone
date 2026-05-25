# DUO — UI Polish Execution Plan (P0 Only)

05_IMPLEMENTATION_GAP.md에서 식별된 P0 항목 + 360px 대응만 1차 범위로 실행합니다.
P1/P2는 본 문서 끝 Appendix에만 기록하고 이번에 건드리지 않습니다.

---

## 1차 범위 요약

| Task | 파일 | 요약 |
|---|---|---|
| T1 | style.css, wordbook.js | 검색 인풋 인라인 → CSS 클래스 |
| T2 | style.css, wordbook.js | Word Detail Modal 인라인 33개 → CSS 클래스 |
| T3 | style.css, lesson.js | "새 단어" 뱃지 중복 인라인 → 공통 CSS 클래스 |
| T4 | style.css, review.js | "복습" 라벨 인라인 → CSS 클래스 |
| T5 | style.css | 360px 반응형 패치 (매칭/레이팅/리그 행) |

수정 파일 총 4개: `src/style.css`, `src/screens/wordbook.js`, `src/screens/lesson.js`, `src/screens/review.js`

---

## 절대 보존 목록 (ID / data-* / class selectors)

작업 중 아래 속성을 이름 변경하거나 삭제하면 이벤트 핸들러가 깨집니다.

### wordbook.js

| 속성 | 행 | 접근하는 코드 |
|---|---|---|
| `id="word-search"` | 28 | getElementById (62행) |
| `id="category-filters"` | 36 | getElementById (51행) |
| `id="word-list"` | 44 | getElementById (69행) |
| `data-cat="..."` | 37, 39 | dataset.cat (57행) |
| `data-word-id="..."` | 102, 108 | dataset.wordId (118행, 126행) |
| `id="speak-detail"` | 203 | querySelector (215행) |
| `id="close-detail"` | 204 | querySelector (214행) |
| `class="filter-chip"` | 37~39 | querySelectorAll (55행) |
| `class="wli-speak"` | 108 | querySelectorAll (115행) |
| `class="word-list-item"` | 102 | querySelectorAll (124행) |

### lesson.js

| 속성 | 행 | 접근하는 코드 |
|---|---|---|
| `id="quiz-close"` | 89 | getElementById (121행) |
| `id="quiz-body"` | 95 | getElementById (100행) |
| `id="quiz-footer"` | 96 | getElementById (468행) |
| `id="flashcard"` | 139 | getElementById (165행) |
| `id="speak-btn"` | 145, 230 | getElementById (178행, 244행) |
| `id="flashcard-actions"` | 158 | getElementById (172행) |
| `id="rating-buttons"` | 160 | getElementById (188행) |
| `id="quiz-options"` | 232 | — (미사용이나 보존) |
| `id="option-${i}"` | 234 | getElementById (273행) |
| `data-index="..."` | 234 | dataset.index (258행) |
| `data-rating="..."` | 199 | dataset.rating (207행) |
| `data-id="..."` | 363, 368 | dataset.id (383행) |
| `data-type="..."` | 363, 368 | dataset.type (382행) |
| `id="fill-input"` | 305 | getElementById (316행) |
| `id="fill-submit"` | 313 | getElementById (317행) |
| `id="fill-sentence"` | 301 | — (보존) |
| `id="blank-display"` | 302 | getElementById (333행) |
| `id="fill-hint"` | 308 | — (보존) |
| `id="matching-words"` | 361 | — (보존) |
| `id="matching-meanings"` | 366 | — (보존) |
| `id="next-btn"` | 483, 496 | getElementById (503행) |
| `id="complete-ad"` | 572 | getElementById (587행) |
| `id="complete-home"` | 576 | getElementById (595행) |
| `id="complete-more"` | 577 | getElementById (596행) |
| `id="back-home"` | 71 | getElementById (74행) |
| `class="quiz-option"` | 233 | querySelectorAll (254행, 263행) |
| `class="rating-btn"` | 199 | querySelectorAll (205행) |
| `class="matching-item"` | 362, 367 | querySelectorAll (376행) |
| `class="word-item"` | 362 | querySelector (394행) |

### review.js

| 속성 | 행 | 접근하는 코드 |
|---|---|---|
| `id="review-close"` | 70 | getElementById (120행) |
| `id="review-flashcard"` | 80 | getElementById (105행) |
| `id="speak-btn"` | 86 | getElementById (113행) |
| `id="review-footer"` | 98 | getElementById (133행) |
| `id="to-lesson"` | 37 | getElementById (41행) |
| `id="to-home"` | 38 | getElementById (42행) |
| `id="review-home"` | 231 | getElementById (235행) |
| `data-rating="..."` | 141~153 | dataset → parseInt (161행) |
| `class="rating-btn"` | 141~153 | querySelectorAll (160행) |

### home.js

| 속성 | 행 | 접근하는 코드 |
|---|---|---|
| `id="start-lesson-btn"` | 90 | getElementById (138행) |
| `id="qa-review"` | 112 | getElementById (144행) |
| `id="qa-wordbook"` | 117 | getElementById (154행) |
| `id="lang-select"` | 47 | getElementById (159행) |
| `id="today-progress-fill"` | 83 | getElementById (129행) |
| `id="level-xp-fill"` | 104 | getElementById (132행) |

### league.js

| 속성 | 행 | 접근하는 코드 |
|---|---|---|
| `id="league-ad-btn"` | 51 | getElementById (76행) |
| `id="dismiss-league-result"` | 40 | getElementById (84행) |

---

## T1: wordbook.js 검색 인풋 클래스화

### 수정 파일
- `src/style.css` — 클래스 추가
- `src/screens/wordbook.js` — 인라인 제거, 클래스 적용

### CSS 클래스 추가 (style.css, `.wordbook-screen` 블록 뒤에)

```css
/* Wordbook Search */
.wordbook-search-wrap {
  position: relative;
  padding: 0 0 8px;
}

.wordbook-search-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  font-size: 0.9rem;
  font-weight: 500;
  background: var(--bg-card);
  color: var(--text);
}

.wordbook-search-input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.wordbook-search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: var(--text-muted);
  pointer-events: none;
}
```

### wordbook.js 변경 (26~32행)

**Before:**
```html
<div class="animate-in" style="padding: 0 0 8px">
  <div style="position:relative">
    <input type="text" id="word-search" placeholder="단어 검색..."
           style="width:100%; padding:12px 16px 12px 40px; border:2px solid var(--border); border-radius:var(--radius-lg); font-size:0.9rem; font-weight:500; background:var(--bg-card); color:var(--text);"
           autocomplete="off">
    <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:1rem; color:var(--text-muted)">🔍</span>
  </div>
</div>
```

**After:**
```html
<div class="wordbook-search-wrap animate-in">
  <input type="text" id="word-search" class="wordbook-search-input"
         placeholder="단어 검색..." autocomplete="off">
  <span class="wordbook-search-icon">🔍</span>
</div>
```

**검증**: `id="word-search"` 보존됨. 62행의 getElementById 영향 없음.

---

## T2: wordbook.js Word Detail Modal 클래스화

### 수정 파일
- `src/style.css` — 클래스 추가
- `src/screens/wordbook.js` — showWordDetail() 함수 인라인→클래스

### CSS 클래스 추가

```css
/* Word Detail Modal */
.word-detail-header {
  text-align: center;
  margin-bottom: 24px;
}

.word-detail-word {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.word-detail-sub {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.word-detail-tags {
  display: inline-flex;
  gap: 8px;
}

.word-detail-tag {
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.word-detail-tag--pos {
  background: var(--primary-50);
  color: var(--primary-600);
}

.word-detail-tag--state {
  background: var(--divider);
  color: var(--text-secondary);
}

.word-detail-section {
  margin-bottom: 20px;
}

.word-detail-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.word-detail-meaning {
  font-size: 1.2rem;
  font-weight: 700;
}

.word-detail-example-box {
  margin-bottom: 20px;
  padding: 16px;
  background: var(--divider);
  border-radius: var(--radius-lg);
}

.word-detail-example {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 4px;
}

.word-detail-example-ko {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.word-detail-info-grid {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.word-detail-info-item {
  flex: 1;
  padding: 12px;
  background: var(--bg);
  border-radius: var(--radius-md);
  text-align: center;
}

.word-detail-info-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 600;
}

.word-detail-info-value {
  font-size: 0.85rem;
  font-weight: 700;
  margin-top: 2px;
}

.word-detail-study-box {
  padding: 12px;
  background: var(--bg);
  border-radius: var(--radius-md);
}

.word-detail-study-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.word-detail-study-due {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
}
```

### wordbook.js showWordDetail() 변경 순서

1. modal-content 내부의 모든 `style="..."` 속성을 제거
2. 각 요소에 위의 `.word-detail-*` 클래스를 적용
3. `id="speak-detail"`과 `id="close-detail"`은 **그대로 보존**
4. `overlay.querySelector('#close-detail')`, `overlay.querySelector('#speak-detail')` 가 계속 작동하는지 확인

**After 구조 (wordbook.js 161~205행 대체):**

```html
<div class="modal-content">
  <div class="modal-handle"></div>

  <div class="word-detail-header">
    <div class="word-detail-word">${getDisplayWord(word)}</div>
    <div class="word-detail-sub">${getWordSub(word)}</div>
    <div class="word-detail-tags">
      <span class="word-detail-tag word-detail-tag--pos">${word.partOfSpeech}</span>
      <span class="word-detail-tag word-detail-tag--state">${label}</span>
    </div>
  </div>

  <div class="word-detail-section">
    <div class="word-detail-label">뜻</div>
    <div class="word-detail-meaning">${word.meaning}</div>
  </div>

  <div class="word-detail-example-box">
    <div class="word-detail-label">예문</div>
    <div class="word-detail-example">${word.example}</div>
    <div class="word-detail-example-ko">${word.exampleKo}</div>
  </div>

  <div class="word-detail-info-grid">
    <div class="word-detail-info-item">
      <div class="word-detail-info-label">카테고리</div>
      <div class="word-detail-info-value">${getCategories()[word.category]}</div>
    </div>
    <div class="word-detail-info-item">
      <div class="word-detail-info-label">레벨</div>
      <div class="word-detail-info-value">${'⭐'.repeat(word.level)}</div>
    </div>
  </div>

  ${card ? `
    <div class="word-detail-study-box">
      <div class="word-detail-label">학습 상태</div>
      <div class="word-detail-study-row">
        <span>복습 횟수: <strong>${card.reps || 0}</strong></span>
        <span>안정도: <strong>${(card.stability || 0).toFixed(1)}</strong></span>
      </div>
      ${card.due ? `<div class="word-detail-study-due">다음 복습: ${new Date(card.due).toLocaleDateString('ko-KR')}</div>` : ''}
    </div>
  ` : ''}

  <button class="btn btn-primary btn-full" id="speak-detail">🔊 발음 듣기</button>
  <button class="btn btn-secondary btn-full" id="close-detail">닫기</button>
</div>
```

**검증**: `#speak-detail`, `#close-detail` 보존. 기존 이벤트 (214~215행) 영향 없음.
버튼 margin은 style.css에 추가:

```css
.word-detail-study-box + .btn { margin-top: 16px; }
.word-detail-info-grid + .btn { margin-top: 16px; }
.modal-content .btn + .btn { margin-top: 8px; }
```

---

## T3: lesson.js "새 단어" 뱃지 중복 제거

### 수정 파일
- `src/style.css` — 클래스 추가
- `src/screens/lesson.js` — 135행, 222행 수정

### CSS 클래스 추가

```css
/* New Word Badge */
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
```

### lesson.js 변경

**Step 1**: 135행의 인라인 뱃지를 클래스로 교체

```
Before (135행):
const newBadge = quiz.isNew ? '<div style="margin-bottom: 12px; font-size: 0.75rem; color: var(--primary-600); background: var(--primary-50); padding: 4px 12px; border-radius: var(--radius-full); font-weight: 700; display: inline-block;">✨ 새 단어</div>' : '';

After:
const newBadge = quiz.isNew ? '<div class="new-word-badge">✨ 새 단어</div>' : '';
```

**Step 2**: 222행에 동일 적용

```
Before (222행):
const newBadge = quiz.isNew ? '<div style="margin-bottom: 8px; font-size: 0.75rem; color: var(--primary-600); background: var(--primary-50); padding: 4px 12px; border-radius: var(--radius-full); font-weight: 700; display: inline-block;">✨ 새 단어</div>' : '';

After:
const newBadge = quiz.isNew ? '<div class="new-word-badge">✨ 새 단어</div>' : '';
```

**주의**: 135행은 margin-bottom 12px, 222행은 8px이었음. CSS에 12px로 통일. 객관식 퀴즈(222행)에서 4px 차이는 시각적으로 무시 가능. 만약 구분이 필요하면:

```css
.quiz-question .new-word-badge { margin-bottom: 8px; }
```

**검증**: `quiz.isNew` 조건 로직 미변경. DOM에 id/data 없음. 안전.

---

## T4: review.js "복습" 라벨 클래스화

### 수정 파일
- `src/style.css` — 클래스 추가
- `src/screens/review.js` — 78행 수정

### CSS 클래스 추가

```css
/* Review Label */
.review-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 8px;
}
```

### review.js 변경

```
Before (78행):
<div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-bottom:8px">🔄 복습</div>

After:
<div class="review-label">🔄 복습</div>
```

**검증**: id/data 없음. 안전.

---

## T5: 360px 반응형 CSS 패치

### 수정 파일
- `src/style.css` — 미디어 쿼리 추가

### 삽입 위치
style.css 1839행 (`/* ─── Responsive */` 섹션) 앞에 삽입.

### 추가할 CSS

```css
/* ─── Small Screen Fixes (≤ 374px) ─────────────── */

@media (max-width: 374px) {
  /* R-1: 매칭 퀴즈 텍스트 오버플로 방지 */
  .matching-item {
    font-size: 0.8rem;
    padding: 12px 10px;
    min-height: 48px;
    word-break: keep-all;
    overflow-wrap: break-word;
  }

  /* R-3: 레이팅 버튼 2×2 그리드 전환 */
  .flashcard-ratings {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .rating-btn {
    padding: 10px 8px;
  }
}

/* R-6: 리그 행 이름 오버플로 (모든 너비) */
.league-row .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**주의**: R-6의 `.league-row .name` 수정은 미디어 쿼리 밖에 놓습니다.
기존 style.css 1430행에 이미 `.league-row .name`이 있으므로, 기존 블록에 3줄 추가하는 형태로 합칩니다:

```css
/* 기존 (1430행) */
.league-row .name {
  font-size: 0.92rem;
  font-weight: 800;
  /* 여기에 추가 ↓ */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 작업 순서 (권장)

```
Step 1: style.css에 모든 새 클래스 추가
        (T1 검색 → T2 모달 → T3 뱃지 → T4 라벨 → T5 반응형)
        ↓
Step 2: wordbook.js 검색 인풋 인라인 제거 (T1)
        ↓
Step 3: wordbook.js showWordDetail 인라인 제거 (T2)
        ↓
Step 4: lesson.js 135행, 222행 뱃지 교체 (T3)
        ↓
Step 5: review.js 78행 라벨 교체 (T4)
        ↓
Step 6: 검증 실행
```

---

## 작업 후 검증 명령

```bash
# 1. 빌드 확인 (syntax 에러 검출)
npm run build

# 2. 테스트 실행
npm test -- --run

# 3. dev 서버 띄워서 수동 검증
npm run dev
```

### 수동 검증 체크리스트

- [ ] **홈**: 390px에서 전체 레이아웃 정상, 언어 셀렉트 작동
- [ ] **레슨 — 플래시카드**: 새 단어 뱃지 표시, 플립, 레이팅 버튼 작동
- [ ] **레슨 — 객관식**: 새 단어 뱃지 표시, 옵션 클릭 → 정답/오답 피드백
- [ ] **레슨 — 빈칸채우기**: 인풋 포커스, 정답 확인
- [ ] **레슨 — 매칭**: 단어 선택 → 뜻 매칭, 완료 시 자동 전환
- [ ] **레슨 완료**: 통계 표시, 광고 버튼, 홈으로/추가학습 버튼 작동
- [ ] **복습**: "🔄 복습" 라벨 표시, 플래시카드 플립, 레이팅 작동
- [ ] **복습 완료**: 통계 표시, 홈으로 버튼
- [ ] **리그**: 순위 리스트 표시, 긴 닉네임 ellipsis, 광고 버튼
- [ ] **단어장**: 검색 인풋 스타일 정상, 필터칩 작동, 단어 상세 모달
- [ ] **단어장 모달**: 다크모드에서도 텍스트 색상 정상
- [ ] **360px**: 매칭 퀴즈 텍스트 안 넘침, 레이팅 2×2 전환, 리그 닉네임 잘림

### 자동 검증 (추가)

```bash
# 변경된 파일 중 금지 파일이 없는지 확인
git diff --name-only | grep -E '^src/(lib|data)/|^scripts/|^data/' && echo "FAIL: 금지 파일 수정됨" || echo "OK: 금지 파일 안전"

# 인라인 스타일 감소 확인
echo "=== 인라인 스타일 잔여 수 ==="
grep -c 'style="' src/screens/wordbook.js
grep -c 'style="' src/screens/lesson.js
grep -c 'style="' src/screens/review.js
# 기대값: wordbook ≤ 3, lesson ≤ 5, review ≤ 5
```

---

## Gemini/Antigravity에게 줄 최종 프롬프트

아래 프롬프트를 그대로 복사해서 UI agent에게 전달하세요.

---

> ### DUO UI Polish — Phase 1 (P0 Only)
>
> **Goal**: 인라인 스타일을 CSS 클래스로 전환하고, 360px 반응형 패치를 적용합니다. 디자인 변경이 아닌 코드 품질 개선입니다.
>
> **You may edit** (이 4개 파일만):
> - `src/style.css`
> - `src/screens/wordbook.js`
> - `src/screens/lesson.js`
> - `src/screens/review.js`
>
> **Do NOT edit** (절대):
> - `src/lib/*`, `src/data/*`, `scripts/*`, `data/*`
> - `package.json`, `package-lock.json`, `vite.config.js`
> - `src/screens/home.js`, `src/screens/league.js` (이번 범위 아님)
> - `src/app.js`, `src/main.js`
>
> **Critical rule**: 아래 id와 data 속성은 이름을 바꾸거나 삭제하면 안 됩니다. 이벤트 핸들러가 깨집니다:
> - wordbook.js: `id="word-search"`, `id="category-filters"`, `id="word-list"`, `id="speak-detail"`, `id="close-detail"`, `data-cat`, `data-word-id`, `class="filter-chip"`, `class="wli-speak"`, `class="word-list-item"`
> - lesson.js: `id="quiz-close"`, `id="quiz-body"`, `id="quiz-footer"`, `id="flashcard"`, `id="speak-btn"`, `id="flashcard-actions"`, `id="rating-buttons"`, `id="option-${i}"`, `id="fill-input"`, `id="fill-submit"`, `id="blank-display"`, `id="next-btn"`, `id="complete-ad"`, `id="complete-home"`, `id="complete-more"`, `id="back-home"`, `data-index`, `data-rating`, `data-id`, `data-type`, `class="quiz-option"`, `class="rating-btn"`, `class="matching-item"`, `class="word-item"`
> - review.js: `id="review-close"`, `id="review-flashcard"`, `id="speak-btn"`, `id="review-footer"`, `id="to-lesson"`, `id="to-home"`, `id="review-home"`, `data-rating`, `class="rating-btn"`
>
> **Tasks** (실행 순서 = 문서 순서):
>
> **T1 — wordbook 검색 인풋**: wordbook.js 26~32행의 인라인 스타일을 제거하고, style.css에 `.wordbook-search-wrap`, `.wordbook-search-input`, `.wordbook-search-icon` 클래스를 추가하세요. `id="word-search"` 보존.
>
> **T2 — Word Detail Modal**: wordbook.js showWordDetail() (152~206행)의 인라인 33개를 제거하고, style.css에 `.word-detail-*` 클래스군을 추가하세요. `id="speak-detail"`, `id="close-detail"` 보존. 모든 구조적 스타일을 CSS로 옮기되, 기존 `.modal-overlay`, `.modal-content`, `.modal-handle` 클래스는 유지하세요.
>
> **T3 — 새 단어 뱃지**: lesson.js 135행과 222행의 인라인 뱃지를 `<div class="new-word-badge">✨ 새 단어</div>`로 교체하세요. style.css에 `.new-word-badge` 클래스를 추가하세요.
>
> **T4 — 복습 라벨**: review.js 78행의 인라인 스타일을 `<div class="review-label">🔄 복습</div>`로 교체하세요. style.css에 `.review-label` 클래스를 추가하세요.
>
> **T5 — 360px 반응형**: style.css에 `@media (max-width: 374px)` 블록을 추가하세요: 매칭 아이템 폰트 축소, 레이팅 버튼 2×2 전환. 또한 `.league-row .name`에 text-overflow ellipsis를 추가하세요 (미디어 쿼리 밖).
>
> **After editing, run:**
> ```bash
> npm run build
> npm test -- --run
> ```
>
> **Report**: 변경 파일, 추가된 CSS 클래스 수, 제거된 인라인 스타일 수, 빌드/테스트 결과, 알려진 visual regression.

---

## Appendix: P1/P2 (이번 범위 아님)

### P1 — 다음 스프린트

| # | 항목 | 비고 |
|---|---|---|
| P1-1 | review.js 기타 인라인 (99행 등) | T4와 동일 패턴으로 처리 |
| P1-2 | progressBar.js 실제 사용 또는 제거 | home.js에서 import만 하고 미사용 |
| P1-3 | 다크모드 토글 UI | home.js topbar에 추가 |
| P1-4 | Stats 화면 활성화 또는 제거 | app.js 라우터 등록 필요 |
| P1-5 | Flashcard 피드백 interval 동적화 | scheduler 연동 필요 — 위험 |
| P1-6 | Lesson complete 버튼 간격 CSS화 | 간단하나 P0 범위 확대 방지를 위해 P1 |

### P2 — 피그마 리디자인 후

| # | 항목 |
|---|---|
| P2-1 | 이모지 → SVG 아이콘 |
| P2-2 | 일러스트/캐릭터 에셋 |
| P2-3 | 원형 프로그레스 |
| P2-4 | 스와이프 제스처 |
| P2-5 | 리그 순위 변동 애니메이션 |
| P2-6 | Skeleton loading |
