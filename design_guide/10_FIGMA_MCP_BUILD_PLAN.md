# DUO — Figma MCP Build Plan

P0 UI polish가 끝난 뒤, Figma MCP로 디자인 파일을 생성하는 실행 계획입니다.
무료 MCP 호출 제한을 고려해 **최소 호출 수로 최대 결과물**을 뽑는 순서입니다.

---

## Strategy: 3-Phase, 8 Calls

| Phase | 호출 수 | 산출물 |
|---|---|---|
| A. Foundation | 2 | Variables + Component Library |
| B. Screens | 4 | 5개 메인 화면 (상태 포함) |
| C. Prototype | 2 | Flow 연결 + Export |

총 **~8회** MCP 호출. 여유분 2회 포함해도 10회 이내.

---

## Phase A: Foundation (2 calls)

### Call A-1: Variables & Styles

01_TOKENS.md를 기반으로 Figma Variables를 등록합니다.

**프롬프트에 포함할 것:**

```
Create a Figma Variables collection for a mobile learning app "DUO".
Frame: 390×844 (iPhone 15).

Color modes: Light / Dark

Primitives:
- primary/50 #ECFDF5 through primary/900 #064E3B
- accent/400 #FBBF24, accent/500 #F59E0B, accent/600 #D97706
- correct #22C55E, wrong #EF4444, streak #F97316, xp #8B5CF6, info #3B82F6

Semantic (Light / Dark):
- bg: #F8FAF9 / #0F1419
- bg-card: #FFFFFF / #1A2332
- text: #1A1A2E / #F0F4F8
- text-secondary: #6B7280 / #94A3B8
- text-muted: #9CA3AF / #64748B
- border: #E5E7EB / #2D3748
- divider: #F3F4F6 / #1E293B

Typography (Inter):
- heading-1: 25.6px/800, heading-2: 23.2px/900, heading-3: 20.8px/800
- body-large: 17.6px/700, body: 16px/600, body-small: 14.4px/600
- caption: 12.8px/700, micro: 11.2px/600

Spacing: 4, 8, 12, 16, 20, 24, 32, 40px
Radius: sm 8, md 12, lg 16, xl 20, 2xl 24, full 9999
```

### Call A-2: Component Library

02_COMPONENTS.md를 기반으로 핵심 컴포넌트 생성.

**한 번에 넣을 컴포넌트 (우선순위순):**

1. **Button** — Primary / Secondary / Correct / Wrong variants, 3D bottom shadow
2. **CTA Button** — gradient, 6px shadow
3. **Rating Button** — Again(red) / Hard(yellow) / Good(green) / Easy(blue)
4. **Stat Card** — icon(44×44) + value + label
5. **Today Card** — gradient bg, progress bar, decorative circle
6. **Quiz Option** — Default / Selected / Correct / Wrong states
7. **Nav Bar** — 4 tabs, active state, badge dot
8. **Filter Chip** — Default / Active
9. **Toast** — icon + message
10. **Flashcard** — front face only (back is variant)

**프롬프트 팁**: "Create as a Component Set with variants" 를 명시하면 Figma가 variant property로 관리합니다.

---

## Phase B: Screens (4 calls)

### Call B-1: Home (3 variants)

03_SCREENS.md Screen 1을 기반으로:

| Variant | 차이점 |
|---|---|
| Home — Default | CTA "학습 시작", 프로그레스 중간 |
| Home — Review Pending | CTA "복습 시작", nav badge |
| Home — Complete | Today card "🎉 완료!", 프로그레스 100% |

**구성 요소** (위→아래):
Language selector → Greeting → Stat cards (2-col) → Today card → CTA → Level card → Quick actions (2-col) → Nav bar

### Call B-2: Lesson — All Quiz Types

한 프레임에 4종 퀴즈 + 피드백 + 완료를 배치합니다.

| Frame | 내용 |
|---|---|
| Lesson/Flashcard — Front | progress bar + 카드 앞면 + "새 단어" 뱃지 |
| Lesson/Flashcard — Back | 카드 뒷면 + 레이팅 4버튼 |
| Lesson/MC — Default | 질문 + 4옵션 |
| Lesson/MC — Correct | 정답 green + 피드백 배너 + "다음" 버튼 |
| Lesson/MC — Wrong | 오답 red + 정답 green + 피드백 + "다음" |
| Lesson/FillBlank | 문장 + 인풋 + "확인" |
| Lesson/Matching | 2열 그리드 (일부 matched) |
| Lesson/Complete | 통계 + XP + LP + 3 버튼 |

### Call B-3: Wordbook + Review

| Frame | 내용 |
|---|---|
| Wordbook — Default | header + search + filters + word list |
| Wordbook — Detail Modal | bottom sheet overlay |
| Review — Card | progress + "복습" 라벨 + 플래시카드 앞면 |
| Review — Complete | 통계 + "홈으로" |

### Call B-4: League + Empty States

| Frame | 내용 |
|---|---|
| League — Default | hero + summary + zone legend + leaderboard |
| League — Result | previous week result card 포함 |
| Empty — No Cards | "오늘 학습 완료!" |
| Empty — No Review | "복습할 단어가 없어요!" |
| Empty — No Search | "검색 결과가 없어요" |

---

## Phase C: Prototype (2 calls)

### Call C-1: Flow Connections

04_FLOWS.md를 기반으로 프로토타입 연결:

```
Home [CTA] → Lesson/Flashcard Front
Lesson/Flashcard Front [tap] → Lesson/Flashcard Back
Lesson/Flashcard Back [rate] → Lesson/MC Default
Lesson/MC Correct [다음] → Lesson/FillBlank
Lesson/Complete [홈으로] → Home Complete

Home [Quick Action 단어장] → Wordbook Default
Wordbook [item tap] → Wordbook Detail Modal
Wordbook Detail [닫기] → Wordbook Default

Home [Nav 리그] → League Default
```

### Call C-2: Dark Mode Variants (선택)

호출 여유가 있을 때만. Home + Lesson MC + Wordbook 3개 화면만 다크모드 variant.

---

## MCP 호출 시 팁

1. **한 호출에 최대한 많이 넣기**: "Create the following 10 components as a component set" 처럼 배치 요청
2. **Variables 먼저**: A-1에서 만든 Variables를 이후 호출에서 참조 가능
3. **정확한 수치 제공**: "padding: 24px" 처럼 px 단위로 명시하면 재작업 없음
4. **Variant naming**: `State=Default`, `State=Correct` 형식으로 Figma variant property 지정
5. **불필요한 설명 제거**: 코드/기술 맥락 없이 디자인 스펙만 전달

---

## Figma File Structure (최종)

```
📄 Cover — 앱 이름 + 프레임 기준 + 날짜
📄 Variables — Color / Type / Spacing tokens
📄 Components — Button set + Card set + Nav + Toast + Quiz elements
📄 Home — 3 variants (Default / Review / Complete)
📄 Lesson — 8 frames (4 quiz types × states + Complete)
📄 Wordbook + Review — 4 frames
📄 League + Empty — 5 frames
📄 [Optional] Dark Mode — 3 frames
```

총 프레임 수: ~23개 (다크모드 포함 시 ~26개)

---

## Fallback: MCP 한도 초과 시

호출이 부족하면 Phase C를 건너뛰고 A+B만 완성합니다.
프로토타입 연결은 Figma 수동으로 5분이면 되므로 MCP 불필요.

최소 실행 플랜:
- A-1 (Variables) → A-2 (Components) → B-1 (Home) → B-2 (Lesson) = **4 calls**
- 이 4개만 있으면 나머지 화면은 컴포넌트 조합으로 수동 구성 가능
