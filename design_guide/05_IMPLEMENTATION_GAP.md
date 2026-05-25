# DUO — UI Implementation Gap Analysis

design_guide/ 명세와 실제 src/ 코드를 항목별로 대조한 결과입니다.
코드 수정 없이 문서만 작성합니다.

---

## 1. 이미 코드와 일치하는 디자인 규칙

가이드 기준으로 이미 구현이 완료되어 건드릴 필요가 없는 항목들.

### 1.1 Design Tokens (style.css ↔ 01_TOKENS.md)

| 항목 | 상태 | 근거 |
|---|---|---|
| Primary 색상 (50~900) | ✅ 완전 일치 | style.css :root 10~21행 |
| Accent 색상 | ✅ 일치 | style.css 24~26행 |
| Semantic 색상 (correct, wrong, streak, xp, info) | ✅ 일치 | style.css 29~35행 |
| Neutral 팔레트 (Light) | ✅ 일치 | style.css 38~46행 |
| Dark mode 오버라이드 | ✅ 일치 | style.css 82~97행 |
| Shadow 토큰 전체 | ✅ 일치 | style.css 49~54행 |
| Border Radius 토큰 | ✅ 일치 | style.css 57~63행 |
| Layout 상수 (nav 72px, header 56px, max-width 480px) | ✅ 일치 | style.css 65~67행 |
| Animation easing/duration | ✅ 일치 | style.css 69~74행 |
| Font (Inter + fallback) | ✅ 일치 | style.css 77행 |
| Typography scale (.text-xs ~ .text-4xl) | ✅ 일치 | style.css 149~156행 |

### 1.2 Components (style.css ↔ 02_COMPONENTS.md)

| 컴포넌트 | 상태 | 근거 |
|---|---|---|
| btn-primary (3D shadow 포함) | ✅ 일치 | style.css 283~316행 |
| btn-secondary | ✅ 일치 | style.css 318~327행 |
| btn-correct / btn-wrong | ✅ 일치 | style.css 329~339행 |
| CTA 버튼 (gradient + 6px shadow) | ✅ 일치 | style.css 997~1017행 |
| Rating 버튼 (4-grid, 4색) | ✅ 일치 | style.css 658~709행 |
| Quiz option 전체 상태 (default/selected/correct/wrong/disabled) | ✅ 일치 | style.css 477~527행 |
| Flashcard (flip, front/back, perspective) | ✅ 일치 | style.css 567~655행 |
| Fill blank (sentence, input, hint) | ✅ 일치 | style.css 712~781행 |
| Matching (item, selected, matched, wrong-match) | ✅ 일치 | style.css 785~831행 |
| Bottom nav (blur backdrop, badge) | ✅ 일치 | style.css 200~264행 |
| Screen header (sticky) | ✅ 일치 | style.css 165~197행 |
| Progress bar (gradient fill + highlight) | ✅ 일치 | style.css 360~391행 |
| Toast (enter/exit anim) | ✅ 일치 | style.css 1710~1741행 |
| Modal bottom sheet (overlay + handle) | ✅ 일치 | style.css 1658~1688행 |
| Stat card (icon + value + label) | ✅ 일치 | style.css 892~933행 |
| Today card (gradient + decorative circle) | ✅ 일치 | style.css 936~990행 |
| Level card (XP bar) | ✅ 일치 | style.css 1023~1077행 |
| Quick action cards | ✅ 일치 | style.css 1080~1120행 |
| League hero | ✅ 일치 | style.css 1231~1288행 |
| League row (zone border) | ✅ 일치 | style.css 1392~1439행 |
| Filter chip | ✅ 일치 | style.css 1544~1564행 |
| Word list item + mastery badge | ✅ 일치 | style.css 1572~1627행 |
| Empty state | ✅ 일치 | style.css 1632~1654행 |
| Lesson complete (stats grid, XP/LP earned cards) | ✅ 일치 | style.css 1122~1227행 |
| Entry animations (slideUp + stagger) | ✅ 일치 | style.css 1829~1837행 |
| Confetti | ✅ 일치 | style.css 1692~1706행 |
| Heatmap | ✅ 일치 | style.css 1476~1522행 |
| Loading spinner | ✅ 일치 | style.css 1744~1753행 |

### 1.3 Screens (screens/*.js ↔ 03_SCREENS.md)

| 화면 | 상태 | 비고 |
|---|---|---|
| Home 레이아웃 순서 (topbar → greeting → stats → today → cta → level → quick) | ✅ 일치 | home.js 44~123행 |
| Home 3 state variants (학습전/복습대기/완료) | ✅ 일치 | home.js 81, 91~92행 |
| Greeting 시간대별 분기 | ✅ 일치 | home.js 30~33행 |
| Lesson quiz container (progress row + body + footer) | ✅ 일치 | lesson.js 86~98행 |
| 4종 퀴즈 렌더링 (flashcard/MC/fillblank/matching) | ✅ 일치 | lesson.js 103~118행 |
| Lesson complete (stats + XP + LP + 3 buttons) | ✅ 일치 | lesson.js 541~578행 |
| Review (flashcard + rating + complete) | ✅ 일치 | review.js 전체 |
| League (hero + result + summary + zones + list) | ✅ 일치 | league.js 15~73행 |
| Wordbook (header + search + filters + list) | ✅ 일치 | wordbook.js 19~45행 |

### 1.4 Flows (04_FLOWS.md)

| 플로우 | 상태 |
|---|---|
| Tab 네비게이션 (즉시 전환, nav 상태 관리) | ✅ 일치 — app.js 54~82행 |
| Lesson/Review 진입 시 nav 숨김 | ✅ 일치 — lesson.js 32행, review.js 23행 |
| Quiz 진행 → Complete → Home 흐름 | ✅ 일치 |
| 오디오 이벤트 매핑 | ✅ 일치 |
| Badge 로직 (dueCards > 0) | ✅ 일치 — app.js 88~90행 |
| 언어 변경 시 reload | ✅ 일치 — home.js 162행 |

**결론: 토큰, CSS 클래스 기반 컴포넌트, 화면 구조, 플로우는 거의 100% 일치합니다.**

---

## 2. 코드가 가이드와 다른 부분 (Gap)

### Gap-01: 인라인 스타일 범벅 (wordbook.js showWordDetail)

**위치**: wordbook.js 152~206행, showWordDetail() 함수
**문제**: Word Detail Modal 내부가 33개 인라인 style="" 로 되어있음. CSS 클래스 0개.
**가이드 대비**: 02_COMPONENTS.md §11 Modal, 03_SCREENS.md Word Detail Modal 섹션에 명시된 구조가 CSS로 재현되지 않음.
**영향**: 수정/유지보수 어려움, 다크모드에서 일부 값 누락 가능성.

### Gap-02: 인라인 스타일 (wordbook.js 검색 인풋)

**위치**: wordbook.js 27~31행
**문제**: 검색 인풋과 돋보기 아이콘이 전부 인라인 스타일. CSS에 `.wordbook-search` 같은 클래스 없음.
**가이드 대비**: 02_COMPONENTS.md에 별도 Search Input 컴포넌트를 명시하지 않았으나, 디자인 토큰(border, radius, font)을 인라인으로 하드코딩함.

### Gap-03: "새 단어" 뱃지가 인라인 (lesson.js)

**위치**: lesson.js 135행, 222행
**문제**: `✨ 새 단어` 뱃지가 긴 인라인 style 문자열로 두 번 중복 정의됨.
**가이드 대비**: 02_COMPONENTS.md §18에 New Word Badge 스펙이 있으나 style.css에 대응하는 클래스 없음.

### Gap-04: Review 라벨 인라인 (review.js)

**위치**: review.js 78행
**문제**: `🔄 복습` 라벨이 인라인 스타일.
**가이드 대비**: 03_SCREENS.md §3.1에 명시된 "복습 라벨"이 CSS 클래스 없이 구현.

### Gap-05: Stats 화면이 라우터에 미등록

**위치**: app.js screens 객체 (19~25행) — stats 없음
**존재하는 파일**: src/screens/stats.js, src/components/heatmap.js
**문제**: stats.js와 heatmap.js가 작성되어있지만, app.js 라우터와 navbar.js NAV_ITEMS 어디에도 등록되어 있지 않음. 죽은 코드.
**가이드 대비**: 03_SCREENS.md에 Stats 화면을 포함하지 않았고, heatmap은 컴포넌트로만 명세됨. 의도적으로 미포함인지 실수인지 확인 필요.

### Gap-06: 다크모드 전환 UI 없음

**위치**: app.js 39행 (설정에서 읽기만 함)
**문제**: `settings.theme`을 읽어 적용하지만, 사용자가 테마를 변경할 수 있는 UI(토글/설정 화면)가 없음.
**가이드 대비**: 01_TOKENS.md에 Light/Dark 두 컬렉션을 정의했으나, 전환 UI를 명세하지 않음.
**현실**: LocalStorage를 수동 편집하지 않는 한 항상 Light.

### Gap-07: 이모지 아이콘 vs SVG

**위치**: 모든 화면/컴포넌트
**문제**: 네비바, 스트릭, XP, 스피커 등 모든 아이콘이 이모지. OS/브라우저별 렌더링 차이 발생.
**가이드 대비**: 01_TOKENS.md §8에 "이모지 → SVG" 매핑 테이블을 제공했으나, 이는 리디자인 시 교체 대상이지 현재 구현과의 gap.
**과한 부분**: 전면 SVG 교체는 피그마 리디자인 + 에셋 파이프라인이 필요. 현 단계에서 이모지는 충분히 작동함.

### Gap-08: progressBar.js 컴포넌트가 실제로 안 쓰임

**위치**: src/components/progressBar.js
**문제**: Home에서 `import { createProgressBar }` 하지만 실제 DOM에 삽입하지 않음. 프로그레스 바는 전부 인라인 HTML로 렌더됨.
**영향**: 컴포넌트가 존재하지만 사장 상태.

### Gap-09: 레이팅 버튼 interval 텍스트가 하드코딩

**위치**: lesson.js 472~473행
**문제**: 플래시카드 피드백에서 `1분 뒤 / 6분 뒤 / 10분 뒤 / 6일 뒤`가 하드코딩. 실제 FSRS previewSchedule 결과와 불일치할 수 있음.
**가이드 대비**: 03_SCREENS.md는 "레이팅 interval"을 FSRS에서 동적으로 받는 것으로 기술. lesson.js 188~203행의 레이팅 버튼은 동적이지만, 472행의 피드백 메시지는 정적.
**분류**: UI gap이지만 수정 시 quizEngine/scheduler 연동이 필요 → 위험.

---

## 3. 바꾸면 위험한 부분

UI처럼 보이지만, 로직이 깊게 결합되어 있어 손대면 버그가 나는 영역.

| 파일:행 | 위험 요소 | 이유 |
|---|---|---|
| lesson.js 전체 | handleAnswer() (424~512행) | XP 계산, FSRS processReview, 콤보, LP 부여, 통계 업데이트가 모두 여기서 발생. HTML 수정 시 `#quiz-footer`, `#next-btn` 등의 ID가 바뀌면 이벤트 핸들러 전부 깨짐. |
| lesson.js 516~605 | renderComplete() | awardXp, awardLessonCompleteLp, updateTodayStats, canClaimAdReward가 렌더 함수 내부에서 호출됨. DOM 구조 변경 시 `#complete-ad`, `#complete-home`, `#complete-more` ID 의존. |
| lesson.js 184~213 | renderRatingButtons() | previewSchedule(quiz.wordId) 호출 후 동적 interval 표시. `data-rating` 속성 의존. |
| review.js 132~201 | showRatingButtons() | 위와 동일 패턴. |
| league.js 76~88 | 광고/결과 이벤트 | claimAdReward(), clearLastLeagueResult() 호출. `#league-ad-btn`, `#dismiss-league-result` ID 의존. |
| home.js 138~163 | 이벤트 바인딩 | `#start-lesson-btn`, `#qa-review`, `#qa-wordbook`, `#lang-select` ID 의존. 구조 변경 시 네비게이션 깨짐. |
| wordbook.js 51~65 | 필터/검색 이벤트 | `#category-filters`, `#word-search` ID 의존. |
| lesson.js 135, 222 | newBadge 조건 분기 | `quiz.isNew` 로직이 quizEngine에서 오므로 뱃지 표시 조건 변경 시 학습 흐름 영향. |

**핵심 규칙**: HTML 템플릿의 `id="..."` 속성과 `data-*` 속성은 절대 이름을 바꾸지 마세요. CSS 클래스명 추가/수정은 안전합니다.

---

## 4. UI polish 때 건드려도 되는 파일

HANDOFF.md의 "UI-only agents may touch" + 실제 의존도 분석 결과.

| 파일 | 안전도 | 주의사항 |
|---|---|---|
| `src/style.css` | ✅ 안전 | 기존 클래스 삭제 금지 (rename OK). 새 클래스 추가 자유. |
| `src/screens/home.js` | ⚠️ 조건부 | HTML 템플릿 수정 OK, 단 id 속성 유지. 이벤트 핸들러(138~163행) 건드리지 말 것. |
| `src/screens/lesson.js` | ⚠️ 조건부 | HTML 템플릿/클래스 수정 OK, 단 모든 id/data 속성 보존. handleAnswer, renderComplete 함수의 로직 라인 건드리지 말 것. |
| `src/screens/wordbook.js` | ⚠️ 조건부 | 인라인 스타일→CSS 클래스 전환은 안전. id 속성 보존. showWordDetail() 내 DOM 구조 변경 시 이벤트 핸들러(210~215행) 확인. |
| `src/screens/league.js` | ⚠️ 조건부 | HTML 템플릿 수정 OK. `#league-ad-btn`, `#dismiss-league-result` ID 보존. |
| `src/screens/review.js` | ⚠️ 조건부 | lesson.js와 동일 패턴. ID 보존 필수. |
| `src/components/navbar.js` | ✅ 안전 | NAV_ITEMS 배열 순서/id는 유지. 스타일 변경 자유. |
| `src/components/toast.js` | ✅ 안전 | DOM 구조 변경 자유. |
| `src/components/progressBar.js` | ✅ 안전 | 현재 미사용 상태이므로 수정/삭제 모두 안전. |
| `src/components/confetti.js` | ✅ 안전 | 순수 시각 효과. |
| `src/components/heatmap.js` | ✅ 안전 | 현재 미사용. 살리려면 stats 화면 등록 필요. |

---

## 5. 절대 건드리면 안 되는 파일

| 파일/디렉토리 | 이유 |
|---|---|
| `src/lib/scheduler.js` | FSRS 알고리즘 코어. 복습 타이밍 전체를 제어. |
| `src/lib/quizEngine.js` | 퀴즈 타입 결정, 세션 구성, 옵션 생성 로직. |
| `src/lib/storage.js` | LocalStorage CRUD. 키 이름/구조 변경 시 사용자 데이터 소실. |
| `src/lib/league.js` | 리그 점수, 봇 생성, 티어 승강 로직. |
| `src/lib/gamification.js` | XP/레벨/스트릭 계산. |
| `src/lib/sounds.js` | 오디오 재생 로직. |
| `src/lib/wordPresentation.js` | 다국어 표시 헬퍼. |
| `src/data/*` | 단어 데이터 전체 (en/fr/ja). |
| `scripts/*` | 어휘 검증/임포트 스크립트. |
| `data/vocab-import/*` | 배치 파일, 소스 메타데이터. |
| `package.json` | 의존성/스크립트 정의. |
| `package-lock.json` | 잠금 파일. |
| `vite.config.js` | 빌드 설정. |

---

## 6. 우선순위별 UI 개선 목록

### P0 — 즉시 수정 (사용성/기능 결함)

| # | 항목 | 현재 상태 | 가이드 기준 | 수정 범위 |
|---|---|---|---|---|
| P0-1 | wordbook 검색 인풋 클래스화 | 전부 인라인 스타일 | CSS 토큰 사용해야 함 | style.css에 `.wordbook-search-input` 추가, wordbook.js 인라인 제거 |
| P0-2 | Word Detail Modal 클래스화 | 33개 인라인 스타일 | 02_COMPONENTS.md §11 | style.css에 `.word-detail-*` 클래스군 추가, wordbook.js 인라인→클래스 |
| P0-3 | "새 단어" 뱃지 클래스화 | 2곳 중복 인라인 | 02_COMPONENTS.md §18 | style.css에 `.new-word-badge` 추가, lesson.js 135/222행 정리 |

### P1 — 다음 스프린트 (일관성/품질)

| # | 항목 | 현재 상태 | 가이드 기준 | 수정 범위 |
|---|---|---|---|---|
| P1-1 | Review "복습" 라벨 클래스화 | 인라인 (review.js 78행) | CSS 클래스 필요 | style.css + review.js |
| P1-2 | progressBar.js 실제 사용 또는 제거 | import만 하고 미사용 | 사용하든 제거하든 | home.js에서 사용하거나 import 제거 |
| P1-3 | 다크모드 토글 UI 추가 | 설정에서 읽기만 | 전환 수단 없음 | home.js topbar에 토글 추가 + storage 연동 |
| P1-4 | Stats 화면 활성화 또는 파일 제거 | stats.js + heatmap.js 존재하나 라우터 미등록 | 가이드에 미포함 | app.js에 등록하거나, 죽은 코드 정리 |
| P1-5 | Flashcard 피드백 interval 동적화 | lesson.js 472행 하드코딩 | FSRS preview 결과 사용해야 함 | ⚠️ scheduler 연동 필요 — 주의 |
| P1-6 | 레슨 완료 화면 버튼 간격 | `style="margin-bottom: 12px"` 인라인 | CSS 클래스 사용 | style.css `.lesson-complete .btn + .btn` 등 |

### P2 — 리디자인 때 같이 (시각적 개선)

| # | 항목 | 현재 상태 | 가이드 기준 | 비고 |
|---|---|---|---|---|
| P2-1 | 이모지 → SVG 아이콘 전환 | 전체 이모지 | 01_TOKENS.md §8 매핑 | **과한 부분**: 피그마 리디자인 + 에셋 파이프라인 구축 필요. 현재 이모지도 충분히 작동하며, 이걸 먼저 하면 오히려 비효율적. 피그마 디자인 확정 후 한번에 교체하는 게 맞음. |
| P2-2 | Greeting 영역에 일러스트/캐릭터 추가 | 텍스트만 | — | **과한 부분**: 가이드에 명시 안 됨. 리디자인 시 에셋이 생기면 고려. |
| P2-3 | Today Card 원형 진행률 (circular progress) | 선형 바 | — | **과한 부분**: 가이드는 선형 바를 명시. 원형은 구현 복잡도 대비 이점 적음. |
| P2-4 | 플래시카드 스와이프 제스처 | 탭만 | — | **과한 부분**: 터치 제스처 라이브러리 필요. 현재 탭 방식이 더 안정적. |
| P2-5 | 리그 애니메이션 (순위 변동) | 정적 리스트 | — | 리디자인 시 프로토타입에서 정의 |
| P2-6 | Skeleton loading | 없음 | — | LocalStorage 기반이라 로딩이 거의 없음. 불필요. |

---

## 7. 모바일 반응형 깨짐 위험 요소

현재 미디어 쿼리: `@media (min-width: 481px)` — 데스크탑 외곽 스타일링만.
**360px 이하 전용 대응이 없음.** 아래는 360/390/480px에서 검증한 위험 항목.

### 7.1 깨짐 확인됨 (수정 필요)

| # | 요소 | 문제 | 위험 너비 | 원인 |
|---|---|---|---|---|
| R-1 | 매칭 퀴즈 그리드 | 2-column에서 각 열 너비 = (화면 - 40px padding - 12px gap) / 2. **360px → 154px/열**. 긴 단어(프랑스어 복합명사, 일본어 4자 한자)가 overflow 또는 줄바꿈으로 높이 불일치 | 360px | `grid-template-columns: 1fr 1fr` + min-height 52px고정이라 텍스트가 넘침 |
| R-2 | 언어 셀렉트 | `max-width: 160px`인데 옵션 텍스트 "🇫🇷 Français · 170"이 약 155px. **360px에서 셀렉트 자체는 들어가나, 드롭다운이 잘릴 수 있음** (OS별 다름) | 360px | 네이티브 select 드롭다운은 CSS로 제어 불가 |
| R-3 | Flashcard 피드백 + 레이팅 4-grid | `grid-template-columns: repeat(4, 1fr)` → 360px에서 각 버튼 ~75px. 텍스트("어려움")는 들어가나 **interval 텍스트("10분 뒤")와 함께 좁음** | 360px | 버튼 font 0.75rem + interval 0.65rem이 겹침 |

### 7.2 잠재 위험 (테스트 권장)

| # | 요소 | 문제 | 위험 너비 |
|---|---|---|---|
| R-4 | Home greeting title | "오늘도 단어를 배워볼까요? 💪" (1.6rem/800) — 360px에서 2줄 wrap됨. 깨지진 않으나 여백 밀림 | 360px |
| R-5 | Quiz option 텍스트 | 긴 뜻("일시적인, 오래가지 않는, 덧없는")이 padding 20px 양쪽에서 300px 콘텐츠 영역 안에 wrap | 360px |
| R-6 | League row name | 긴 닉네임이 1fr 열에서 overflow 가능. text-overflow 미적용 | 360~390px |
| R-7 | Word detail modal 2-column | `display:flex; gap:8px`의 두 info 박스가 360px에서 좁아짐 (각 ~152px) | 360px |
| R-8 | Fill blank sentence | 긴 예문이 360px 카드 안에서 여러 줄 wrap → blank 위치가 2번째 줄로 밀릴 수 있음 | 360px |

### 7.3 안전 (문제 없음)

| 요소 | 이유 |
|---|---|
| Bottom nav | 4탭 × space-around, 아이콘+라벨 구조. 360px에서도 충분. |
| Today card | padding 24px 고정, 내부 텍스트 wrap 자연스러움. |
| Stat cards 2-column | `gap:12px` + `1fr 1fr`. 360px → 각 154px. 내부 콘텐츠(아이콘44px+숫자)가 충분히 들어감. |
| Filter chips 가로 스크롤 | `overflow-x: auto`, `white-space: nowrap`. 어떤 너비에서도 스크롤됨. |
| Progress bar | 100% 너비, 높이 고정. 반응형 이슈 없음. |
| 480px | max-width 480px이 앱 최대이므로 480px 이상은 센터 정렬 + 외곽 그림자. 문제 없음. |

### 7.4 권장 수정

```
/* 제안: style.css에 추가할 360px 대응 */

/* R-1: 매칭 퀴즈 */
.matching-item {
  word-break: keep-all;      /* 한국어/일본어 줄바꿈 방지 */
  overflow-wrap: break-word;  /* 긴 영단어 대응 */
  font-size: 0.85rem;         /* 360px에서 약간 축소 가능 */
}

/* R-3: 레이팅 버튼 */
@media (max-width: 374px) {
  .flashcard-ratings {
    grid-template-columns: repeat(2, 1fr);  /* 360px에서 2×2 그리드로 전환 */
    gap: 6px;
  }
}

/* R-6: 리그 행 이름 overflow */
.league-row .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 요약 매트릭스

| 영역 | 일치율 | 주요 gap | 위험도 |
|---|---|---|---|
| Design Tokens | **100%** | 없음 | — |
| CSS Components | **95%** | 인라인 스타일 3건, 미사용 컴포넌트 2건 | Low |
| Screen 구조 | **95%** | 인라인→클래스 전환 필요 | Low |
| Flow/Interaction | **98%** | interval 하드코딩 1건 | Medium |
| 반응형 360px | **75%** | 미디어 쿼리 부재, 매칭/레이팅 깨짐 | Medium |
| 리디자인 비전 (SVG 등) | **0%** | 전체 미착수 — 피그마 후 작업 | N/A |
