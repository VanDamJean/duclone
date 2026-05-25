# DUO — UI Polish QA Checklist (P0)

06_UI_POLISH_EXECUTION_PLAN.md의 T1~T5 작업 완료 후 검수용.
통과 기준: 모든 `[MUST]` 항목 pass, `[SHOULD]` 항목 80% 이상 pass.

---

## 1. 자동 검사 명령

순서대로 실행합니다. 하나라도 실패하면 코드 리뷰 진행하지 않습니다.

```bash
# ── Gate 1: 빌드 ──
npm run build
# 기대: exit 0, dist/ 생성

# ── Gate 2: 테스트 ──
npm test -- --run
# 기대: exit 0, 전체 pass

# ── Gate 3: 인라인 스타일 감소 확인 ──
echo "=== wordbook.js inline styles ==="
grep -c 'style="' src/screens/wordbook.js
# 기대: ≤ 3  (작업 전 33)

echo "=== lesson.js inline styles ==="
grep -c 'style="' src/screens/lesson.js
# 기대: ≤ 8  (작업 전 10, 뱃지 2개 제거)

echo "=== review.js inline styles ==="
grep -c 'style="' src/screens/review.js
# 기대: ≤ 7  (작업 전 8, 라벨 1개 제거)

# ── Gate 4: 새 CSS 클래스 존재 확인 ──
echo "=== new classes in style.css ==="
grep -c 'wordbook-search' src/style.css    # 기대: ≥ 3
grep -c 'word-detail' src/style.css        # 기대: ≥ 10
grep -c 'new-word-badge' src/style.css     # 기대: ≥ 1
grep -c 'review-label' src/style.css       # 기대: ≥ 1
grep -c 'max-width: 374px' src/style.css   # 기대: ≥ 1
```

---

## 2. 금지 파일 수정 여부 확인

```bash
# 변경 파일 목록 추출
git diff --name-only

# 허용 파일 (이 4개만 변경되어야 함)
#   src/style.css
#   src/screens/wordbook.js
#   src/screens/lesson.js
#   src/screens/review.js

# 금지 파일 수정 감지 (출력이 있으면 FAIL)
git diff --name-only | grep -E \
  '^src/lib/|^src/data/|^scripts/|^data/|^src/app\.js|^src/main\.js|^package|^vite\.config' \
  && echo "❌ FAIL: 금지 파일 수정됨" \
  || echo "✅ PASS: 금지 파일 안전"

# 이번 범위 밖 화면 파일 수정 감지
git diff --name-only | grep -E \
  'src/screens/(home|league|stats)\.js' \
  && echo "⚠️ WARN: 범위 밖 화면 파일 수정됨 — 의도된 변경인지 확인" \
  || echo "✅ PASS: 범위 내 파일만 수정"
```

**판정 기준:**
- 금지 파일 수정 → 즉시 revert, 작업 재지시
- 범위 밖 화면 수정 → diff 내용 확인 후 판단

---

## 3. 보존 ID / data-* grep 검증

아래 명령을 모두 실행해서 각 줄의 출력이 1 이상이면 PASS.
0이면 해당 id가 삭제되었으므로 FAIL.

### wordbook.js

```bash
echo "── wordbook.js ID 보존 ──"
grep -c 'id="word-search"'       src/screens/wordbook.js   # ≥ 1
grep -c 'id="category-filters"'  src/screens/wordbook.js   # ≥ 1
grep -c 'id="word-list"'         src/screens/wordbook.js   # ≥ 1
grep -c 'id="speak-detail"'      src/screens/wordbook.js   # ≥ 1
grep -c 'id="close-detail"'      src/screens/wordbook.js   # ≥ 1

echo "── wordbook.js data-* 보존 ──"
grep -c 'data-cat='              src/screens/wordbook.js   # ≥ 2
grep -c 'data-word-id='          src/screens/wordbook.js   # ≥ 2

echo "── wordbook.js class 보존 ──"
grep -c 'class="filter-chip'     src/screens/wordbook.js   # ≥ 1
grep -c 'class="wli-speak'       src/screens/wordbook.js   # ≥ 1
grep -c 'class="word-list-item'  src/screens/wordbook.js   # ≥ 1
```

### lesson.js

```bash
echo "── lesson.js ID 보존 ──"
grep -c 'id="quiz-close"'        src/screens/lesson.js     # ≥ 1
grep -c 'id="quiz-body"'         src/screens/lesson.js     # ≥ 1
grep -c 'id="quiz-footer"'       src/screens/lesson.js     # ≥ 1
grep -c 'id="flashcard"'         src/screens/lesson.js     # ≥ 1
grep -c 'id="speak-btn"'         src/screens/lesson.js     # ≥ 1
grep -c 'id="flashcard-actions"' src/screens/lesson.js     # ≥ 1
grep -c 'id="rating-buttons"'    src/screens/lesson.js     # ≥ 1
grep -c 'id="fill-input"'        src/screens/lesson.js     # ≥ 1
grep -c 'id="fill-submit"'       src/screens/lesson.js     # ≥ 1
grep -c 'id="blank-display"'     src/screens/lesson.js     # ≥ 1
grep -c 'id="next-btn"'          src/screens/lesson.js     # ≥ 1
grep -c 'id="complete-ad"'       src/screens/lesson.js     # ≥ 1
grep -c 'id="complete-home"'     src/screens/lesson.js     # ≥ 1
grep -c 'id="complete-more"'     src/screens/lesson.js     # ≥ 1
grep -c 'id="back-home"'         src/screens/lesson.js     # ≥ 1

echo "── lesson.js data-* 보존 ──"
grep -c 'data-rating='           src/screens/lesson.js     # ≥ 1
grep -c 'data-index='            src/screens/lesson.js     # ≥ 1
grep -c 'data-id='               src/screens/lesson.js     # ≥ 2
grep -c 'data-type='             src/screens/lesson.js     # ≥ 2

echo "── lesson.js class 보존 ──"
grep -c 'class="quiz-option"'    src/screens/lesson.js     # ≥ 1
grep -c 'class="rating-btn '     src/screens/lesson.js     # ≥ 1
grep -c 'class="matching-item '  src/screens/lesson.js     # ≥ 1
```

### review.js

```bash
echo "── review.js ID 보존 ──"
grep -c 'id="review-close"'      src/screens/review.js     # ≥ 1
grep -c 'id="review-flashcard"'  src/screens/review.js     # ≥ 1
grep -c 'id="speak-btn"'         src/screens/review.js     # ≥ 1
grep -c 'id="review-footer"'     src/screens/review.js     # ≥ 1
grep -c 'id="to-lesson"'         src/screens/review.js     # ≥ 1
grep -c 'id="to-home"'           src/screens/review.js     # ≥ 1
grep -c 'id="review-home"'       src/screens/review.js     # ≥ 1

echo "── review.js data-* 보존 ──"
grep -c 'data-rating='           src/screens/review.js     # ≥ 4
```

### 한 번에 실행하는 통합 스크립트

```bash
#!/bin/bash
FAIL=0

check() {
  local file=$1 pattern=$2 min=$3
  local count=$(grep -c "$pattern" "$file" 2>/dev/null || echo 0)
  if [ "$count" -lt "$min" ]; then
    echo "❌ FAIL: $file — '$pattern' found $count times (need ≥ $min)"
    FAIL=1
  fi
}

# wordbook
check src/screens/wordbook.js 'id="word-search"'       1
check src/screens/wordbook.js 'id="category-filters"'  1
check src/screens/wordbook.js 'id="word-list"'         1
check src/screens/wordbook.js 'id="speak-detail"'      1
check src/screens/wordbook.js 'id="close-detail"'      1
check src/screens/wordbook.js 'data-cat='              2
check src/screens/wordbook.js 'data-word-id='          2

# lesson
check src/screens/lesson.js 'id="quiz-close"'          1
check src/screens/lesson.js 'id="quiz-body"'           1
check src/screens/lesson.js 'id="quiz-footer"'         1
check src/screens/lesson.js 'id="flashcard"'           1
check src/screens/lesson.js 'id="speak-btn"'           1
check src/screens/lesson.js 'id="flashcard-actions"'   1
check src/screens/lesson.js 'id="rating-buttons"'      1
check src/screens/lesson.js 'id="fill-input"'          1
check src/screens/lesson.js 'id="fill-submit"'         1
check src/screens/lesson.js 'id="blank-display"'       1
check src/screens/lesson.js 'id="next-btn"'            1
check src/screens/lesson.js 'id="complete-ad"'         1
check src/screens/lesson.js 'id="complete-home"'       1
check src/screens/lesson.js 'id="complete-more"'       1
check src/screens/lesson.js 'id="back-home"'           1
check src/screens/lesson.js 'data-rating='             1
check src/screens/lesson.js 'data-index='              1
check src/screens/lesson.js 'data-id='                 2
check src/screens/lesson.js 'data-type='               2

# review
check src/screens/review.js 'id="review-close"'        1
check src/screens/review.js 'id="review-flashcard"'    1
check src/screens/review.js 'id="speak-btn"'           1
check src/screens/review.js 'id="review-footer"'       1
check src/screens/review.js 'id="to-lesson"'           1
check src/screens/review.js 'id="to-home"'             1
check src/screens/review.js 'id="review-home"'         1
check src/screens/review.js 'data-rating='             4

# new classes
check src/style.css 'wordbook-search'   3
check src/style.css 'word-detail'       10
check src/style.css 'new-word-badge'    1
check src/style.css 'review-label'      1
check src/style.css '374px'             1

if [ $FAIL -eq 0 ]; then
  echo ""
  echo "✅ ALL CHECKS PASSED"
else
  echo ""
  echo "❌ SOME CHECKS FAILED — review above"
  exit 1
fi
```

---

## 4. 반응형 수동 확인 (360 / 390 / 480px)

Chrome DevTools → Device Toolbar에서 테스트.

### 360px (Galaxy S small)

| # | 항목 | 확인 방법 | [MUST] |
|---|---|---|---|
| R-1 | 매칭 퀴즈 텍스트 | 레슨 진행 → 매칭 퀴즈 도달. 좌/우 열의 텍스트가 컨테이너 밖으로 넘치지 않는지 확인 | MUST |
| R-2 | 레이팅 버튼 2×2 | 플래시카드 플립 후 레이팅 버튼이 2열 2행으로 표시되는지 확인 | MUST |
| R-3 | 리그 닉네임 | 리그 화면에서 긴 닉네임이 ... 으로 잘리는지 확인 | MUST |
| R-4 | 홈 인사 제목 | "오늘도 단어를 배워볼까요?" 줄바꿈은 OK, 잘림은 FAIL | SHOULD |
| R-5 | 검색 인풋 | 단어장 검색 인풋이 화면 너비에 맞는지, 돋보기 아이콘이 겹치지 않는지 | MUST |
| R-6 | Word Detail Modal | 모달 내부 2열 info(카테고리/레벨)가 깨지지 않는지 | SHOULD |
| R-7 | 퀴즈 옵션 | 객관식 옵션 텍스트가 줄바꿈되더라도 패딩/테두리가 유지되는지 | SHOULD |

### 390px (iPhone 15 기준)

| # | 항목 | [MUST] |
|---|---|---|
| R-8 | 모든 화면 기본 레이아웃 | 홈/레슨/복습/리그/단어장 순회, 텍스트 겹침 없음 | MUST |
| R-9 | 레이팅 버튼 4열 유지 | 390px에서는 4열 그리드 유지 (2×2 전환 안 됨) | MUST |
| R-10 | 네비 바 4탭 | 아이콘+라벨 모두 표시, 겹침 없음 | MUST |

### 480px (max-width 도달)

| # | 항목 | [MUST] |
|---|---|---|
| R-11 | 콘텐츠 센터 정렬 | 480px 이상에서 앱이 중앙 정렬되고 좌우 그림자 표시 | SHOULD |
| R-12 | 모달 max-width | Word Detail Modal이 480px 넘지 않음 | SHOULD |

---

## 5. 화면별 기능 체크

### Home

| # | 항목 | 확인 방법 | [MUST] |
|---|---|---|---|
| H-1 | 언어 셀렉트 | EN/FR/JA 전환 → 페이지 리로드 → 단어 수 변경 확인 | MUST |
| H-2 | CTA 버튼 | 클릭 → Lesson 화면 진입, nav 숨김 | MUST |
| H-3 | 복습하기 | Quick Action 클릭 → Review 또는 Lesson 진입 | MUST |
| H-4 | 단어장 | Quick Action 클릭 → Wordbook 진입 | MUST |
| H-5 | 프로그레스 바 애니메이션 | 페이지 로드 시 0% → 실제값으로 채워지는 애니메이션 | SHOULD |
| H-6 | XP 바 애니메이션 | 레벨 카드 XP 바 동일 | SHOULD |

### Lesson

| # | 항목 | 확인 방법 | [MUST] |
|---|---|---|---|
| L-1 | 프로그레스 표시 | 상단 바 + "1/8" 텍스트 표시 | MUST |
| L-2 | ✕ 닫기 | 클릭 → confirm 대화상자 → "확인" 시 홈 복귀 | MUST |
| L-3 | 플래시카드 플립 | 탭 → rotateY 애니메이션 → 뒷면(뜻/예문) 표시 | MUST |
| L-4 | 레이팅 버튼 | 4개 모두 클릭 가능, 클릭 후 다음 퀴즈로 전환 | MUST |
| L-5 | 객관식 정답 | 정답 클릭 → green + ✓, 피드백 "정답!", +XP 표시 | MUST |
| L-6 | 객관식 오답 | 오답 클릭 → red + ✗, 정답 green 표시, 피드백 "오답" | MUST |
| L-7 | 빈칸 채우기 | 입력 + Enter/확인 → 정답/오답 표시 | MUST |
| L-8 | 매칭 | 단어 선택 → 뜻 매칭 → 전부 완료 시 자동 전환 | MUST |
| L-9 | 세션 완료 | 통계(정답/정답률/콤보) + XP + LP + 3 버튼 표시 | MUST |
| L-10 | 완료 → 홈 | "홈으로" 클릭 → 홈 복귀, nav 표시 | MUST |
| L-11 | 추가 학습 | "추가 학습하기" 클릭 → 새 세션 시작 | MUST |
| L-12 | 카드 없음 | 학습할 카드가 0일 때 empty state + "홈으로" 버튼 | SHOULD |

### Review

| # | 항목 | 확인 방법 | [MUST] |
|---|---|---|---|
| V-1 | 플래시카드 플립 | 탭 → 뒷면 표시 | MUST |
| V-2 | 레이팅 4버튼 | 플립 후 표시, 클릭 시 다음 카드 전환 | MUST |
| V-3 | 복습 완료 | 통계(복습단어/기억률/XP) + "홈으로" 버튼 | MUST |
| V-4 | 복습 없음 | dueCards 0일 때 empty state + 두 버튼 | SHOULD |
| V-5 | TTS 자동 재생 | 카드 표시 300ms 후 발음 재생 | SHOULD |

### Wordbook

| # | 항목 | 확인 방법 | [MUST] |
|---|---|---|---|
| W-1 | 검색 | 텍스트 입력 → 실시간 필터링 | MUST |
| W-2 | 카테고리 필터 | 칩 클릭 → active 스타일 + 리스트 필터 | MUST |
| W-3 | 단어 클릭 → 모달 | 아이템 클릭 → bottom sheet 모달 표시 | MUST |
| W-4 | 모달 닫기 | "닫기" 버튼 또는 overlay 클릭 → 모달 사라짐 | MUST |
| W-5 | 모달 발음 | "🔊 발음 듣기" 클릭 → TTS 재생 | MUST |
| W-6 | 모달 내용 | 단어/발음/품사/뜻/예문/카테고리/레벨/학습상태 모두 표시 | MUST |
| W-7 | 리스트 TTS | 각 아이템의 🔊 버튼 → TTS 재생, 모달 열리지 않음 | MUST |
| W-8 | 검색 없음 | 매칭 안 되는 검색어 → empty state | SHOULD |
| W-9 | 숙달도 뱃지 | 새/학습/복습/숙달 4가지 색상 구분 | SHOULD |

### League

| # | 항목 | 확인 방법 | [MUST] |
|---|---|---|---|
| G-1 | 리더보드 표시 | 순위 리스트 렌더링, 유저 행 하이라이트 | MUST |
| G-2 | 광고 버튼 | 활성 시 클릭 → toast + LP 증가, 버튼 disabled | MUST |
| G-3 | 존 색상 | 승급(green)/잔류(blue)/강등(red) 좌측 보더 구분 | MUST |
| G-4 | 닉네임 ellipsis | 긴 이름 ... 으로 잘림 (T5 결과) | MUST |

---

## 6. T1~T5 개별 검수 항목

### T1: wordbook 검색 인풋

| # | 항목 | [MUST] |
|---|---|---|
| T1-1 | `style="..."` 속성이 검색 인풋 영역에서 제거됨 | MUST |
| T1-2 | `class="wordbook-search-input"` 적용됨 | MUST |
| T1-3 | `class="wordbook-search-icon"` 적용됨 | MUST |
| T1-4 | `id="word-search"` 보존됨 | MUST |
| T1-5 | 포커스 시 border가 primary로 변경됨 | SHOULD |
| T1-6 | 다크모드에서 배경/텍스트 색상 정상 (var 토큰 사용) | SHOULD |

### T2: Word Detail Modal

| # | 항목 | [MUST] |
|---|---|---|
| T2-1 | showWordDetail() 내 `style="..."` 속성이 0개 또는 margin-top 등 레이아웃용만 잔류 | MUST |
| T2-2 | `.word-detail-*` 클래스가 style.css에 10개 이상 존재 | MUST |
| T2-3 | `id="speak-detail"` 보존, 클릭 시 TTS 재생 | MUST |
| T2-4 | `id="close-detail"` 보존, 클릭 시 모달 닫힘 | MUST |
| T2-5 | `.modal-overlay`, `.modal-content`, `.modal-handle` 유지 | MUST |
| T2-6 | 모달 내 단어/발음/태그/뜻/예문/카테고리/레벨 모두 표시 | MUST |
| T2-7 | 학습 상태(복습 횟수/안정도/다음 복습)가 카드 있을 때 표시 | MUST |
| T2-8 | 다크모드에서 모달 배경/텍스트 정상 (var 토큰) | SHOULD |

### T3: 새 단어 뱃지

| # | 항목 | [MUST] |
|---|---|---|
| T3-1 | lesson.js 135행 인라인 제거, `class="new-word-badge"` 적용 | MUST |
| T3-2 | lesson.js 222행 인라인 제거, `class="new-word-badge"` 적용 | MUST |
| T3-3 | `.new-word-badge` 가 style.css에 존재 | MUST |
| T3-4 | 새 단어일 때 "✨ 새 단어" 뱃지 표시 | MUST |
| T3-5 | 기존 단어일 때 뱃지 미표시 | MUST |
| T3-6 | 뱃지 스타일: primary/600 텍스트, primary/50 배경, pill shape | SHOULD |

### T4: 복습 라벨

| # | 항목 | [MUST] |
|---|---|---|
| T4-1 | review.js 78행 인라인 제거, `class="review-label"` 적용 | MUST |
| T4-2 | `.review-label` 이 style.css에 존재 | MUST |
| T4-3 | 복습 카드 상단에 "🔄 복습" 텍스트 표시 | MUST |
| T4-4 | 0.75rem / 600 weight / text-muted 색상 | SHOULD |

### T5: 360px 반응형

| # | 항목 | [MUST] |
|---|---|---|
| T5-1 | `@media (max-width: 374px)` 블록이 style.css에 존재 | MUST |
| T5-2 | 374px 이하에서 `.flashcard-ratings` 가 2열 | MUST |
| T5-3 | 374px 이하에서 `.matching-item` 폰트 축소 | MUST |
| T5-4 | `.league-row .name`에 overflow/ellipsis 추가됨 (모든 너비) | MUST |
| T5-5 | 390px에서 레이팅 4열 유지 (2열 전환 안 됨) | MUST |

---

## 7. 실패 시 되돌리기 기준

### Revert 즉시 (작업 전체를 되돌림)

| 조건 | 이유 |
|---|---|
| `npm run build` 실패 | 구문 에러 — 배포 불가 |
| `npm test -- --run` 실패 | 로직 깨짐 |
| 금지 파일 수정됨 (§2 체크) | lib/data/scripts 오염 |
| 보존 ID 1개라도 누락 (§3 체크) | 이벤트 핸들러 깨짐 — 기능 장애 |

```bash
# 전체 되돌리기
git checkout -- src/style.css src/screens/wordbook.js src/screens/lesson.js src/screens/review.js
```

### 부분 수정 후 재검수

| 조건 | 대응 |
|---|---|
| MUST 항목 1~2개 실패 | 해당 항목만 수정 후 §1~§3 재실행 |
| SHOULD 항목 실패 | 기록 후 머지 가능 — P1으로 이관 |
| 360px에서만 깨짐 | T5 CSS만 수정, 다른 파일 건드리지 않음 |
| 인라인 스타일 기대치 초과 | 추가 인라인이 T1~T4 범위 밖이면 허용 (범위 밖은 이번 대상 아님) |

---

## 8. 리뷰 요청 요약 템플릿

Gemini/Antigravity 작업 완료 후, 아래 템플릿을 채워서 리뷰 요청합니다.

---

```markdown
## UI Polish P0 — Review Request

### 변경 파일
- [ ] src/style.css
- [ ] src/screens/wordbook.js
- [ ] src/screens/lesson.js
- [ ] src/screens/review.js

### 금지 파일 체크
- [ ] `git diff --name-only`에 금지 파일 없음

### 자동 검증
- [ ] `npm run build` — pass / fail
- [ ] `npm test -- --run` — pass / fail
- [ ] ID 보존 grep — all pass / __ fail

### 변경 요약
| Task | 제거한 인라인 수 | 추가한 CSS 클래스 수 |
|---|---|---|
| T1 검색 인풋 | __개 | __개 |
| T2 Word Detail | __개 | __개 |
| T3 새 단어 뱃지 | __개 | __개 |
| T4 복습 라벨 | __개 | __개 |
| T5 360px 패치 | — | __개 미디어 쿼리 규칙 |

### 수동 검증
- [ ] 390px 전체 화면 순회 — 텍스트 겹침 없음
- [ ] 360px 매칭/레이팅/리그 닉네임 확인
- [ ] 단어장 모달 열기/닫기/발음 듣기

### 알려진 이슈
(있으면 기술, 없으면 "없음")

### 스크린샷
(390px 기준 Before/After 첨부)
```

---

## Quick Reference: 전체 검수 순서

```
1. git diff --name-only          → 금지 파일 체크 (§2)
2. npm run build                 → 빌드 (§1)
3. npm test -- --run             → 테스트 (§1)
4. ID 보존 grep 스크립트 실행     → 보존 검증 (§3)
5. 인라인 스타일 카운트           → 감소 확인 (§1)
6. npm run dev                   → dev 서버 시작
7. 390px 수동 검증               → 화면별 체크 (§5)
8. 360px 수동 검증               → 반응형 체크 (§4)
9. T1~T5 개별 검수               → 작업별 체크 (§6)
10. 템플릿 작성 → 리뷰 요청       → (§8)
```
