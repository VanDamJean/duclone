# DUO Screen Specifications

모든 화면은 390×844px 프레임 기준입니다.
Bottom Nav(72px)가 있는 화면은 콘텐츠 영역이 상단에서 nav 위까지입니다.

---

## Screen 1: Home (홈)

**Nav 표시**: O (active: 홈)
**진입**: 앱 시작, 레슨/복습 완료 후 돌아옴

### Layout (위→아래)

```
┌─ 390px ──────────────────────────────┐
│ [padding-top: 8px]                    │
│                    [🇺🇸 English · 200] │ ← Language Selector (우측 정렬)
│                                       │
│ 좋은 아침이에요!                        │ ← Greeting (0.9rem, text-secondary)
│ 오늘도 단어를 배워볼까요? 💪             │ ← Title (1.6rem/800)
│                                       │
│ ┌──────────┐ ┌──────────┐             │
│ │ 🔥 7     │ │ ⚡ 1,250 │             │ ← Stat Cards (2-col grid)
│ │  일 연속  │ │   총 XP  │             │
│ └──────────┘ └──────────┘             │
│                                       │
│ ┌─ gradient/today ──────────────────┐ │
│ │ 오늘의 학습                        │ │ ← Today Card
│ │ 5개 남았어요                       │ │
│ │ ████████░░░░░░░░  7/15 완료       │ │
│ └───────────────────────────────────┘ │
│                                       │
│ ┌─ gradient/cta ────────────────────┐ │
│ │      🚀  학습 시작하기              │ │ ← CTA Button
│ └───────────────────────────────────┘ │
│                                       │
│ ┌───────────────────────────────────┐ │
│ │ 🌱 Lv.3 성장 학습자                │ │ ← Level Card
│ │     다음 레벨까지 120 XP           │ │
│ │     ██████░░░░░░░░░               │ │
│ └───────────────────────────────────┘ │
│                                       │
│ ┌──────────┐ ┌──────────┐             │
│ │    🔄    │ │    📖    │             │ ← Quick Action Cards
│ │ 복습하기  │ │  단어장   │             │
│ │ 12개 대기 │ │ 85/200   │             │
│ └──────────┘ └──────────┘             │
│                                       │
│▓▓▓▓▓▓▓▓▓ Bottom Nav ▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└───────────────────────────────────────┘
```

### State Variants

| State | 변경사항 |
|---|---|
| **학습 전** (기본) | CTA: "🚀 학습 시작하기" |
| **복습 대기** | CTA: "📝 복습 시작하기", nav lesson탭에 빨간 뱃지 |
| **학습 완료** | Today Card title: "🎉 오늘 학습 완료!", 프로그레스 100%, CTA: "🔄 추가 학습하기" |

### Greeting Logic (시간대별)

| 시간 | 텍스트 |
|---|---|
| 00:00–11:59 | 좋은 아침이에요! |
| 12:00–17:59 | 좋은 오후예요! |
| 18:00–23:59 | 좋은 저녁이에요! |

### Animation Sequence

| 순서 | 요소 | Delay |
|---|---|---|
| 0 | Greeting | 0ms |
| 1 | Stat Cards | 50ms |
| 2 | Today Card | 100ms |
| 3 | CTA | 150ms |
| 4 | Level Card | 200ms |
| 5 | Quick Actions | 250ms |

프로그레스 바는 렌더 후 rAF로 0% → 실제값 애니메이션.

---

## Screen 2: Lesson (학습)

**Nav 표시**: X (숨김)
**진입**: Home CTA 클릭, Quick Action "복습하기" 클릭

### 2.1 Quiz Container (공통 프레임)

```
┌─ 390px ──────────────────────────────┐
│ [✕]  ████████░░░░░  3/8              │ ← Progress Row
│                                       │
│                                       │
│         [Quiz Body]                   │ ← flex: 1, center
│                                       │
│                                       │
│         [Quiz Footer]                 │ ← 하단 고정
│ [safe-area-bottom]                    │
└───────────────────────────────────────┘
```

| 영역 | 설명 |
|---|---|
| Progress Row | [✕ close 36×36] [progress bar flex:1] [3/8 text], gap 12px |
| Quiz Body | flex:1, column center, gap 24px, padding 20px 0 |
| Quiz Footer | padding 16px 0 + safe area |

### 2.2 Quiz Type A: Flashcard

**Body 내용:**

```
[✨ 새 단어]  ← (isNew일 때만)

┌──────────────────────────────┐
│         ephemeral            │
│        /ɪˈfɛm.ər.əl/        │
│          [형용사]             │
│           [🔊]               │
│                              │
│      탭해서 뜻 확인           │
└──────────────────────────────┘
```

**플립 후 Footer:**
```
얼마나 알고 있었나요?
[모름 1분] [어려움 6분] [알겠음 10분] [쉬움 6일]
```

**Figma Variants:**
1. Front (플립 전)
2. Back (플립 후) — 뜻/예문 표시
3. Rated — 레이팅 버튼 중 하나 선택 상태

### 2.3 Quiz Type B: Multiple Choice (객관식)

**Body 내용:**

```
[✨ 새 단어]  ← (isNew일 때만)

         ephemeral
        /ɪˈfɛm.ər.əl/
        이 단어의 뜻은?
            [🔊]

[ 덧없는, 일시적인           ]  ← option
[ 영원한                     ]  ← option
[ 구체적인                   ]  ← option
[ 추상적인                   ]  ← option
```

**Figma Variants:**
1. Unanswered (기본)
2. Correct — 정답 옵션 green + ✓, 나머지 disabled
3. Wrong — 선택 옵션 red + ✗, 정답 옵션 green + ✓, 나머지 disabled

**Footer (답변 후):**
```
┌── correct-bg ──────────────────────┐
│ ✅ 정답! (or 🔥 3연속 정답!)        │
│ +10 XP                             │
└────────────────────────────────────┘
[          다음          ]  ← btn-correct
```

```
┌── wrong-bg ────────────────────────┐
│ ❌ 오답                             │
│ 정답: 덧없는, 일시적인               │
└────────────────────────────────────┘
[          다음          ]  ← btn-wrong
```

### 2.4 Quiz Type C: Fill in the Blank (빈칸 채우기)

**Body 내용:**

```
빈칸에 알맞은 단어를 입력하세요
       덧없는, 일시적인

┌──────────────────────────────┐
│ The _______ beauty of       │
│ cherry blossoms              │
└──────────────────────────────┘

[      단어를 입력하세요       ]  ← input
     힌트: e_______l

[          확인          ]  ← btn-primary
```

**Figma Variants:**
1. Empty (입력 전)
2. Focus (입력 중 — border primary)
3. Correct (입력 후 — input green, blank에 정답 green 표시)
4. Wrong (입력 후 — input red, blank에 정답 표시)

### 2.5 Quiz Type D: Matching (매칭)

**Body 내용:**

```
단어와 뜻을 연결하세요

┌──────────┐  ┌──────────┐
│ ephemeral │  │   영원한  │
├──────────┤  ├──────────┤
│  eternal  │  │ 덧없는   │
├──────────┤  ├──────────┤
│ tangible  │  │ 구체적인  │
├──────────┤  ├──────────┤
│ abstract  │  │ 추상적인  │
└──────────┘  └──────────┘
```

**Figma Variants:**
1. Default (선택 없음)
2. Word Selected (왼쪽 1개 primary border)
3. Matched (일부 쌍 correct, 나머지 기본)
4. Wrong Attempt (뜻 1개 빨간 shake)
5. All Matched (전부 correct, 자동 전환)

### 2.6 Lesson Complete (세션 완료)

**Nav 표시**: O (다시 표시)

```
┌─ 390px ──────────────────────────────┐
│                                       │
│              🎉                        │ ← 4rem, celebrateBounce
│          레슨 완료!                     │ ← 1.6rem / 800
│  대단해요! 오늘도 한 단계 성장했어요     │ ← 0.95rem, text-secondary
│                                       │
│ ┌────────┐ ┌────────┐ ┌────────┐      │
│ │  7/8   │ │  88%   │ │   5    │      │ ← 3-col grid
│ │  정답   │ │ 정답률  │ │최고콤보│      │
│ └────────┘ └────────┘ └────────┘      │
│                                       │
│ ┌── gradient/xp-card ───────────────┐ │
│ │ ⚡  +85 XP 획득!                   │ │
│ └───────────────────────────────────┘ │
│                                       │
│ ┌── gradient/lp-card ───────────────┐ │
│ │ 🏆  +12 LP 리그 점수               │ │
│ └───────────────────────────────────┘ │
│                                       │
│ [ 광고 보고 +30 LP 받기 ] ← secondary  │
│ [       홈으로         ] ← primary     │
│ [    추가 학습하기      ] ← secondary   │
│                                       │
│▓▓▓▓▓▓▓▓▓ Bottom Nav ▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└───────────────────────────────────────┘
```

**Complete Stats Grid:**

| Stat | Value Format | Label |
|---|---|---|
| 정답 | `7/8` | 정답 |
| 정답률 | `88%` | 정답률 |
| 최고 콤보 | `5` | 최고 콤보 |

**Confetti**: 렌더 300ms 후 launchConfetti(50).

---

## Screen 3: Review (복습)

**Nav 표시**: X (숨김)
**구조**: Lesson의 Quiz Container와 동일한 프레임

### 3.1 Review Card

Flashcard와 동일하되:
- "🔄 복습" 라벨이 상단에 추가 (0.75rem, text-muted)
- 자동 TTS 재생 (300ms 딜레이)
- 플립 후 Footer에 4-rating 버튼 표시

### 3.2 Review Complete

Lesson Complete와 동일 구조이되:
- 이모지: ✅
- 타이틀: "복습 완료!"
- 서브타이틀: "잘하고 있어요! 기억이 더 단단해졌습니다"
- 통계: 복습 단어 / 기억률 / +XP (3열)
- 버튼: "홈으로" 1개만
- Confetti: 30개 (적음)

---

## Screen 4: League (리그)

**Nav 표시**: O (active: 리그)

### Layout

```
┌─ 390px ──────────────────────────────┐
│ ┌── header (sticky) ───────────────┐ │
│ │ 🏆 리그                          │ │
│ └──────────────────────────────────┘ │
│                                       │
│ ┌── gradient/league ────────────────┐ │
│ │ 이번 주                           │ │
│ │ Bronze League        ┌──────┐    │ │ ← League Hero
│ │ 상위 5명 승급 ·       │ 3 위 │    │ │
│ │ 하위 5명 강등         └──────┘    │ │
│ └───────────────────────────────────┘ │
│                                       │
│ [League Result Card — 조건부]          │ ← 지난주 결과 (있을 때만)
│                                       │
│ ┌──────────┐  ┌──────────────┐        │
│ │  내 LP   │  │  광고 보너스  │        │ ← Summary (2-col)
│ │   245    │  │  [+30 LP]   │        │
│ └──────────┘  └──────────────┘        │
│                                       │
│ ●승급  ●잔류  ●강등                     │ ← Zone Legend
│                                       │
│ ┌───┬────┬──────────┬────────┐        │
│ │ 1 │ 🦊 │  Player1 │ 380 LP │        │ ← promotion zone
│ ├───┼────┼──────────┼────────┤        │
│ │ 2 │ 🐼 │  Player2 │ 340 LP │        │
│ ├───┼────┼──────────┼────────┤        │
│ │ ...                        │        │
│ ├───┼────┼──────────┼────────┤        │
│ │ 3 │ 😎 │  나 (You) │ 245 LP │       │ ← is-user (highlight)
│ ├───┼────┼──────────┼────────┤        │
│ │ ...                        │        │
│ ├───┼────┼──────────┼────────┤        │
│ │16 │ 🐢 │ Player16 │  12 LP │        │ ← demotion zone
│ └───┴────┴──────────┴────────┘        │
│                                       │
│▓▓▓▓▓▓▓▓▓ Bottom Nav ▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└───────────────────────────────────────┘
```

### State Variants

| State | 변경사항 |
|---|---|
| **기본** | Result Card 없음, 광고 버튼 활성 |
| **광고 사용 후** | 광고 버튼 disabled, text: "오늘 완료" |
| **지난주 결과 (승급)** | Result Card 표시, title: "승급했어요!" |
| **지난주 결과 (잔류)** | title: "잔류했어요" |
| **지난주 결과 (강등)** | title: "강등됐어요" |

### League Tiers

| Tier | Name |
|---|---|
| 0 | Bronze |
| 1 | Silver |
| 2 | Gold |
| 3 | Platinum |
| 4 | Diamond |

---

## Screen 5: Wordbook (단어장)

**Nav 표시**: O (active: 단어장)

### Layout

```
┌─ 390px ──────────────────────────────┐
│ ┌── header (sticky) ───────────────┐ │
│ │ 📖 단어장                         │ │
│ └──────────────────────────────────┘ │
│                                       │
│ ┌─ 🔍 단어 검색... ────────────────┐ │ ← Search Input
│ └───────────────────────────────────┘ │
│                                       │
│ [전체] [일상] [학교] [비즈니스] [여행]... │ ← Filter Chips (횡스크롤)
│                                       │
│ ┌─────┬──────────────────┬──┬──┐      │
│ │ 새  │ ephemeral        │🔊│ ›│      │ ← Word List Items
│ │     │ 덧없는, 일시적인   │  │  │      │
│ ├─────┼──────────────────┼──┼──┤      │
│ │학습 │ eternal          │🔊│ ›│      │
│ │     │ 영원한            │  │  │      │
│ ├─────┼──────────────────┼──┼──┤      │
│ │복습 │ tangible         │🔊│ ›│      │
│ │     │ 구체적인, 만질 수  │  │  │      │
│ ├─────┼──────────────────┼──┼──┤      │
│ │숙달 │ abstract         │🔊│ ›│      │
│ │     │ 추상적인          │  │  │      │
│ └─────┴──────────────────┴──┴──┘      │
│ ... (스크롤)                           │
│                                       │
│▓▓▓▓▓▓▓▓▓ Bottom Nav ▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└───────────────────────────────────────┘
```

### State Variants

| State | 변경사항 |
|---|---|
| **기본** | 전체 카테고리, 전체 리스트 |
| **카테고리 필터** | 선택된 칩 active, 필터된 리스트 |
| **검색 활성** | 검색어 입력 중 |
| **검색 결과 없음** | Empty State: 🔍 "검색 결과가 없어요" |

### Word Detail Modal (Bottom Sheet)

아이템 클릭 시 표시.

```
┌─ modal-content ─────────────────────┐
│           [handle]                   │
│                                      │
│          ephemeral                   │ ← 2rem / 800
│         /ɪˈfɛm.ər.əl/              │ ← 0.9rem, text-secondary
│      [형용사] [학습]                  │ ← 태그 2개
│                                      │
│  뜻                                  │
│  덧없는, 일시적인                     │ ← 1.2rem / 700
│                                      │
│  ┌── divider bg ────────────────┐   │
│  │ 예문                         │   │
│  │ The ephemeral beauty of      │   │
│  │ cherry blossoms              │   │
│  │ 벚꽃의 덧없는 아름다움         │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────┐ ┌──────────┐          │
│  │ 카테고리  │ │  레벨    │          │ ← 2-col info
│  │   일상    │ │  ⭐⭐   │          │
│  └──────────┘ └──────────┘          │
│                                      │
│  ┌── 학습 상태 ─────────────────┐   │ ← 카드 있을 때만
│  │ 복습 횟수: 5   안정도: 12.3   │   │
│  │ 다음 복습: 2026. 5. 28.      │   │
│  └──────────────────────────────┘   │
│                                      │
│  [    🔊 발음 듣기    ] ← primary    │
│  [       닫기        ] ← secondary   │
└──────────────────────────────────────┘
```

---

## Empty States

| 화면 | 이모지 | 타이틀 | 설명 | 버튼 |
|---|---|---|---|---|
| Lesson (카드 없음) | 🎉 | 오늘 학습 완료! | 내일 새로운 단어가 준비됩니다 | 홈으로 |
| Review (대기 없음) | ✅ | 복습할 단어가 없어요! | 모든 복습을 완료했습니다 | 새 단어 학습하기 + 홈으로 |
| Wordbook 검색 | 🔍 | 검색 결과가 없어요 | 다른 키워드로 검색해보세요 | — |

---

## Figma Page Structure (권장)

```
📄 Cover
📄 Tokens (Color / Type / Spacing / Shadow swatches)
📄 Components (모든 컴포넌트 + Variants)
📄 Home (3 state variants + Dark Mode)
📄 Lesson — Flashcard (Front / Back / Rated)
📄 Lesson — Multiple Choice (Default / Correct / Wrong)
📄 Lesson — Fill Blank (Empty / Focus / Correct / Wrong)
📄 Lesson — Matching (Default / Selected / Matched / Wrong)
📄 Lesson — Complete
📄 Review (Card + Complete)
📄 League (Default / Ad Used / Result Variants)
📄 Wordbook (Default / Filtered / Search / Detail Modal)
📄 Empty States
📄 Toasts & Overlays
```
