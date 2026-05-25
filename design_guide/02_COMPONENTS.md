# DUO Component Specifications

모든 컴포넌트는 Auto Layout 기반으로 Figma에 생성합니다.
치수는 390px 너비 기준이며, 내부 콘텐츠는 max-width 480px에서 동일하게 동작합니다.

---

## 1. Buttons

### 1.1 Primary Button (CTA)

```
[  🚀  학습 시작하기  ]
```

| 속성 | 값 |
|---|---|
| Height | 56px (padding: 18px 28px) |
| Width | 100% (full-width) |
| Background | gradient/cta (primary/500 → primary/400, 135deg) |
| Text Color | white |
| Font | 1.1rem / 800 |
| Border Radius | radius/xl (20px) |
| Bottom Shadow | 0 6px 0 primary/700, 0 6px 20px rgba(16,185,129,0.3) |
| Active State | translateY(4px), shadow → 0 2px 0 primary/700 |
| Icon | 왼쪽 1.3rem 이모지, gap 10px |
| Variants | 학습 시작(🚀) / 복습 시작(📝) / 추가 학습(🔄) |

### 1.2 Standard Button — Primary

| 속성 | 값 |
|---|---|
| Height | 48px (padding: 14px 28px) |
| Width | 100% 또는 hug |
| Background | primary/500 solid |
| Text Color | white |
| Font | 1rem / 700 |
| Border Radius | radius/lg (16px) |
| Bottom Shadow | 0 4px 0 primary/700, shadow/md |
| Active State | translateY(3px), shadow → 0 1px 0 |
| Disabled | bg: border, shadow: 0 4px 0 text-muted, text: text-muted |

### 1.3 Standard Button — Secondary

| 속성 | 값 |
|---|---|
| 동일 구조 | Primary와 동일한 패딩/사이즈 |
| Background | divider |
| Text Color | text |
| Bottom Shadow | 0 4px 0 border, shadow/sm |

### 1.4 Standard Button — Correct / Wrong

| Variant | Background | Bottom Shadow |
|---|---|---|
| Correct | #22C55E | 0 4px 0 #16A34A |
| Wrong | #EF4444 | 0 4px 0 #DC2626 |
| Text | white | |

### 1.5 Small Button

| 속성 | 값 |
|---|---|
| Height | ~40px (padding: 10px 20px) |
| Font | 0.875rem / 700 |
| Border Radius | radius/md (12px) |

### 1.6 Icon Button

| 속성 | 값 |
|---|---|
| Size | 44 × 44px |
| Border Radius | radius/full |
| Background | none (투명) |

### 1.7 Rating Buttons (4-grid)

```
[ 모름 ] [ 어려움 ] [ 알겠음 ] [ 쉬움 ]
  1분      6분       10분      6일
```

| 속성 | 값 |
|---|---|
| Layout | Grid 4열, gap 8px |
| Each Button | padding: 12px 4px |
| Border Radius | radius/md (12px) |
| Font | 0.75rem / 700 (라벨), 0.65rem / 500 (interval) |
| Content | Column: 라벨 + interval, center aligned |

| Variant | Background | Text | Bottom Shadow |
|---|---|---|---|
| Again (모름) | `#FEE2E2` | `#991B1B` | `0 3px 0 #FCA5A5` |
| Hard (어려움) | `#FEF3C7` | `#92400E` | `0 3px 0 #FCD34D` |
| Good (알겠음) | `#DCFCE7` | `#166534` | `0 3px 0 #86EFAC` |
| Easy (쉬움) | `#DBEAFE` | `#1E40AF` | `0 3px 0 #93C5FD` |

### 1.8 League Ad Button

| 속성 | 값 |
|---|---|
| Height | 34px |
| Width | 100% |
| Background | accent/500 |
| Text | white / 800 |
| Border Radius | radius/full |
| Bottom Shadow | 0 3px 0 accent/600 |
| Disabled | bg: divider, text: text-muted, no shadow |

### 1.9 Filter Chip

| 속성 | 값 |
|---|---|
| Padding | 8px 16px |
| Border Radius | radius/full |
| Border | 1.5px solid border |
| Background | bg-card |
| Font | 0.8rem / 600, text-secondary |
| Active State | bg: primary/500, text: white, border: primary/500 |
| White-space | nowrap |
| Active Anim | scale(0.95) |

---

## 2. Cards

### 2.1 Base Card

| 속성 | 값 |
|---|---|
| Background | bg-card |
| Border | 1px solid border |
| Border Radius | radius/xl (20px) |
| Padding | 20px |
| Shadow | shadow/card |

### 2.2 Stat Card (스트릭 / XP)

```
┌─────────────────────┐
│  [🔥]  7            │
│         일 연속       │
└─────────────────────┘
```

| 속성 | 값 |
|---|---|
| Layout | Row: icon(44×44) + Column(value + label), gap 12px |
| Size | 약 50% 너비 (2-column grid, gap 12px) |
| Padding | 16px |
| Icon Container | 44×44px, radius/lg, gradient 배경 |
| Value | 1.3rem / 800 |
| Label | 0.7rem / 600, text-muted, uppercase, letter-spacing 0.03em |

| Variant | Icon BG Gradient |
|---|---|
| Streak | gradient/streak-icon (#FFF7ED → #FFEDD5) |
| XP | gradient/xp-icon (#F5F3FF → #EDE9FE) |

### 2.3 Today Card (오늘의 학습)

```
┌─────────────────────────────┐  ← gradient/today
│  오늘의 학습                   │
│  5개 남았어요                  │
│  ████████░░░░░░░  7/15 완료   │
└─────────────────────────────┘
```

| 속성 | 값 |
|---|---|
| Background | gradient/today (primary/600 → primary/700, 135deg) |
| Border Radius | radius/xl |
| Padding | 24px |
| Text Color | white (전체) |
| Decorative | ::before 원형 그라디언트 (우상단, rgba(255,255,255,0.1)) |
| Label | 0.8rem / 600, opacity 0.85, uppercase, letter-spacing 0.05em |
| Title | 1.3rem / 800, margin: 4px 0 16px |
| Progress Bar | h:10px, bg: rgba(255,255,255,0.2), fill: white, radius/full |
| Count | 0.85rem / 600, opacity 0.9 |
| Complete Variant | 타이틀 → "🎉 오늘 학습 완료!" |

### 2.4 Level Card

```
┌──────────────────────────────────┐
│  🌱  Lv.3 성장 학습자              │
│       다음 레벨까지 120 XP          │
│       ██████░░░░░░░░░░            │
└──────────────────────────────────┘
```

| 속성 | 값 |
|---|---|
| Layout | Row: emoji(2rem) + Column(name+subtitle+bar), gap 14px |
| Padding | 16px 20px |
| Name | 0.95rem / 700 |
| Subtitle | 0.75rem / 500, text-muted |
| XP Bar | h:6px, bg: divider, fill: gradient/xp (#7C3AED → #A78BFA), margin-top 8px |

### 2.5 Quick Action Card

```
┌───────────┐
│     🔄     │
│  복습하기   │
│  12개 대기  │
└───────────┘
```

| 속성 | 값 |
|---|---|
| Layout | Column center, gap 8px |
| Size | 50% (2-column grid, gap 12px) |
| Padding | 20px 16px |
| Icon | 1.6rem |
| Label | 0.8rem / 700, text |
| Count | 0.7rem / 500, text-muted |
| Active | scale(0.96), shadow → shadow/sm |

### 2.6 League Hero Card

```
┌────────────────────────────────────┐  ← gradient/league
│  이번 주                             │
│  Bronze League          ┌────┐     │
│  상위 5명 승급 · 하위 5명 강등  │ 3위 │     │
│                          └────┘     │
└────────────────────────────────────┘
```

| 속성 | 값 |
|---|---|
| Background | gradient/league (accent/500 → accent/600) |
| Border Radius | radius/xl |
| Padding | 22px |
| Layout | Row: Column(eyebrow+title+subtitle) + Rank badge, space-between |
| Shadow | shadow/lg |
| Rank Badge | min-w:72px, h:72px, radius/xl, bg: rgba(255,255,255,0.18) |
| Rank Number | 2rem / 900, white |
| Rank Unit | 0.8rem / 800, white |

### 2.7 League Summary Card

```
┌──────────┐  ┌──────────────┐
│  내 LP    │  │  광고 보너스   │
│   245     │  │  [+30 LP]    │
└──────────┘  └──────────────┘
```

| 속성 | 값 |
|---|---|
| Layout | 2-column grid, gap 12px |
| Each | bg-card, border, radius/lg, shadow/card, padding 14px |
| Label | 0.72rem / 700, text-muted |
| Value | 1.35rem / 900, accent/600 |

### 2.8 League Row

```
┌───┬────┬──────────┬────────┐
│ 3 │ 😎 │  Player  │ 245 LP │
└───┴────┴──────────┴────────┘
```

| 속성 | 값 |
|---|---|
| Layout | Grid: 34px / 40px / 1fr / auto, gap 10px |
| Padding | 10px 12px 10px 8px |
| Background | bg-card |
| Border | 1px solid border + left 5px solid (zone color) |
| Border Radius | radius/lg |
| Shadow | shadow/sm |
| Rank | 0.9rem / 900, text-secondary, center |
| Avatar | 36×36px circle, bg: divider |
| Name | 0.92rem / 800 |
| LP | 0.82rem / 800, text-secondary |

| Zone Variant | Left Border Color | Special |
|---|---|---|
| Promotion | correct (#22C55E) | — |
| Stay | info (#3B82F6) | — |
| Demotion | wrong (#EF4444) | — |
| Is User | accent/500 (전체 border) | bg: #FFFBEB, shadow/card |

### 2.9 League Result Card

| 속성 | 값 |
|---|---|
| Layout | Grid: 1fr + auto, gap 12px, align center |
| Border | 2px solid accent/200 |
| Padding | 16px |
| Title Color | accent/600, 1.1rem / 900 |
| Contains | 확인 버튼 (League Ad Button 스타일, min-w 72px) |

---

## 3. Flashcard

### 3.1 Flashcard Container

| 속성 | 값 |
|---|---|
| Width | 100% |
| Min Height | 280px |
| Perspective | 1000px |
| Cursor | pointer |

### 3.2 Front Face

```
┌──────────────────────────────┐
│                              │
│          ephemeral           │
│          /ɪˈfɛm.ər.əl/      │
│          [형용사]             │
│          [🔊]                │
│                              │
│     탭해서 뜻 확인             │
└──────────────────────────────┘
```

| 속성 | 값 |
|---|---|
| Background | bg-card |
| Border | 1px solid border |
| Border Radius | radius/xl |
| Padding | 32px 24px |
| Shadow | shadow/lg |
| Layout | Column center, justify center |
| Word | 2.2rem / 800, letter-spacing: -0.02em |
| Pronunciation | 1rem / 500, text-secondary |
| POS Badge | 0.8rem / 600, primary/600 on primary/50, radius/full, padding 4px 12px |
| Speaker Btn | 48×48px circle, primary/50 bg, 1.3rem icon |
| Tap Hint | 0.8rem / 400, text-muted, margin-top 20px |

### 3.3 Back Face

```
┌──────────────────────────────┐
│                              │
│       덧없는, 일시적인         │
│                              │
│   The ephemeral beauty of    │
│   cherry blossoms             │
│   벚꽃의 덧없는 아름다움        │
│                              │
└──────────────────────────────┘
```

| 속성 | 값 |
|---|---|
| 동일 container | front와 동일 스타일 |
| Meaning | 1.5rem / 700, center |
| Example | 0.95rem / 400, text-secondary, center, line-height 1.6 |
| Example Ko | 0.85rem / 400, text-muted, center |

### 3.4 Flip Animation

- Duration: 600ms
- Easing: ease/out
- Transform: rotateY(180deg)
- backface-visibility: hidden

---

## 4. Quiz Option (Multiple Choice)

### 4.1 Default State

| 속성 | 값 |
|---|---|
| Width | 100% |
| Padding | 16px 20px |
| Background | bg-card |
| Border | 2.5px solid border |
| Border Radius | radius/lg (16px) |
| Font | 1rem / 600, text |
| Text Align | left |
| Min Touch Target | 52px height |

### 4.2 State Variants

| State | Border | Background | Text | Extra |
|---|---|---|---|---|
| Default | border | bg-card | text | — |
| Selected | primary/500 | primary/50 | primary/700 | — |
| Correct | correct | correct-bg | #166534 | ✓ indicator (right, 1.2rem) + correctPulse anim |
| Wrong | wrong | wrong-bg | #991B1B | ✗ indicator + wrongShake anim |
| Disabled | — | — | — | pointer-events: none, opacity 0.6 |

---

## 5. Fill Blank

### 5.1 Sentence Card

| 속성 | 값 |
|---|---|
| Padding | 20px |
| Background | bg-card |
| Border | 1px solid border |
| Border Radius | radius/xl |
| Shadow | shadow/card |
| Font | 1.1rem / 400, line-height 1.8, center |
| Blank Marker | min-w:100px, border-bottom: 3px dashed primary/400, inline-block |

### 5.2 Input Field

| 속성 | 값 |
|---|---|
| Width | 100% |
| Padding | 16px 20px |
| Border | 2.5px solid border |
| Border Radius | radius/lg |
| Font | 1.1rem / 600, center |
| Background | bg-card |
| Focus | border: primary/500, box-shadow: 0 0 0 3px rgba(16,185,129,0.1) |
| Correct | border: correct, bg: correct-bg |
| Wrong | border: wrong, bg: wrong-bg |

### 5.3 Hint

| 속성 | 값 |
|---|---|
| Font | 0.85rem / 400, text-muted, center |
| Margin Top | 8px |

---

## 6. Matching Grid

| 속성 | 값 |
|---|---|
| Layout | 2-column grid, gap 12px |
| Each Column | Column, gap 10px |

### 6.1 Matching Item

| 속성 | 값 |
|---|---|
| Padding | 14px 16px |
| Min Height | 52px |
| Background | bg-card |
| Border | 2.5px solid border |
| Border Radius | radius/md |
| Font | 0.9rem / 600, center |
| Selected | border: primary/500, bg: primary/50, scale(1.03) |
| Matched | border: correct, bg: correct-bg, opacity 0.7 |
| Wrong Match | border: wrong, bg: wrong-bg, wrongShake anim |

---

## 7. Navigation

### 7.1 Bottom Nav Bar

| 속성 | 값 |
|---|---|
| Position | Fixed bottom, center |
| Width | 100%, max 480px |
| Height | 72px |
| Background | bg-nav (blur 20px backdrop) |
| Border Top | 1px solid border |
| Layout | Row, space-around |
| Padding Bottom | env(safe-area-inset-bottom, 8px) |
| Z-Index | 100 |

### 7.2 Nav Item

| 속성 | 값 |
|---|---|
| Layout | Column center, gap 2px |
| Padding | 6px 16px |
| Border Radius | radius/lg |
| Icon | 1.5rem |
| Label | 0.65rem / 600, text-muted |
| Active Icon | scale(1.15) |
| Active Label | color: primary/600 |
| Pressed | icon scale(0.85) |

### 7.3 Nav Badge (알림 도트)

| 속성 | 값 |
|---|---|
| Size | 8×8px |
| Position | absolute, top 2px, right 8px |
| Background | wrong (#EF4444) |
| Border | 2px solid bg-nav |
| Border Radius | full |

### 7.4 Nav Tabs

| Tab | Icon | Label |
|---|---|---|
| home | 🏠 | 홈 |
| lesson | 📚 | 학습 |
| league | 🏆 | 리그 |
| wordbook | 📖 | 단어장 |

---

## 8. Screen Header

| 속성 | 값 |
|---|---|
| Height | 56px |
| Padding | 12px 20px |
| Position | sticky top 0 |
| Background | bg |
| Z-Index | 50 |
| Layout | Row, space-between, center |
| Title | 1.25rem / 700 |

### 8.1 Back Button (in header)

| 속성 | 값 |
|---|---|
| Size | 36×36px |
| Border Radius | full |
| Background | divider |
| Content | ✕ or ← |
| Active | scale(0.9), bg: border |

---

## 9. Progress Bar

### 9.1 Standard

| 속성 | 값 |
|---|---|
| Height | 12px |
| Background | divider |
| Border Radius | full |
| Fill | gradient primary/400 → primary/500 |
| Fill Radius | full |
| Fill Highlight | ::after h:50%, white 30% → transparent gradient |
| Transition | width 400ms ease/out |

### 9.2 Quiz Progress (thin)

| 속성 | 값 |
|---|---|
| 동일 구조 | flex: 1 in progress row |
| Height | 12px |
| Context | Row with [✕ close btn] [bar] [1/8 text] |

### 9.3 Level XP Bar (thin)

| 속성 | 값 |
|---|---|
| Height | 6px |
| Fill | gradient/xp |

---

## 10. Toast

| 속성 | 값 |
|---|---|
| Position | fixed, top 20px, center |
| Width | 100% - 40px, max 440px |
| Background | bg-card |
| Border | 1px solid border |
| Border Radius | radius/lg |
| Padding | 14px 20px |
| Shadow | shadow/xl |
| Layout | Row: icon(1.2rem) + message(0.9rem/600, flex 1), gap 12px |
| Z-Index | 400 |
| Enter Anim | translateY(-100%) scale(0.9) → translateY(0) scale(1), 300ms |
| Exit Anim | reverse, 300ms |
| Duration | 2500ms default |

### Toast Variants

| Type | Icon | Message Example |
|---|---|---|
| XP | ⚡ | +10 XP 획득! |
| Level Up | 🎊 | 🎉 레벨 5 달성! |
| Streak | 🔥 | 7일 연속 학습! 대단해요! |
| Ad Reward | 🎁 | 광고 보너스 +30 LP |
| Generic | ✅ | (custom) |

---

## 11. Modal (Bottom Sheet)

### 11.1 Overlay

| 속성 | 값 |
|---|---|
| Position | fixed inset 0 |
| Background | bg-overlay |
| Z-Index | 200 |
| Layout | Column, align end (bottom), center |
| Enter Anim | fadeIn 200ms |

### 11.2 Content Sheet

| 속성 | 값 |
|---|---|
| Background | bg-card |
| Border Radius | radius/2xl radius/2xl 0 0 (상단만) |
| Padding | 24px, bottom: max(24px, safe-area) |
| Width | 100%, max 480px |
| Max Height | 80dvh |
| Overflow | scroll-y |
| Enter Anim | slideUp 300ms ease/out |

### 11.3 Handle

| 속성 | 값 |
|---|---|
| Width | 40px |
| Height | 4px |
| Background | border |
| Border Radius | full |
| Margin | 0 auto 16px |

---

## 12. Quiz Feedback Banner

### 12.1 Correct

| 속성 | 값 |
|---|---|
| Background | correct-bg |
| Border Left | 4px solid correct |
| Border Radius | radius/lg |
| Padding | 16px 20px |
| Title | 1rem / 700, #166534 |
| Detail | 0.875rem / 400, text-secondary |
| Animation | slideUp 300ms |

### 12.2 Wrong

| 속성 | 값 |
|---|---|
| 구조 동일 | correct과 동일 |
| Background | wrong-bg |
| Border Left | 4px solid wrong |
| Title Color | #991B1B |

---

## 13. Empty State

| 속성 | 값 |
|---|---|
| Layout | Column center |
| Padding | 60px 24px |
| Icon | 3rem emoji |
| Title | 1.1rem / 700, margin-bottom 8px |
| Description | 0.9rem / 400, text-secondary |
| CTA | btn-primary full width, margin-top 24px |

---

## 14. Word List Item

```
┌─────┬────────────────────────┬──┬──┐
│ 학습 │  ephemeral             │🔊│ ›│
│     │  덧없는, 일시적인        │  │  │
└─────┴────────────────────────┴──┴──┘
```

| 속성 | 값 |
|---|---|
| Layout | Row: mastery(36px) + content(flex 1) + speak btn + arrow, gap 14px |
| Padding | 14px 16px |
| Background | bg-card |
| Border | 1px solid border |
| Border Radius | radius/lg |
| Shadow | shadow/sm |
| Active | bg: divider |
| Word | 0.95rem / 700 |
| Meaning | 0.8rem / 400, text-secondary, truncate |
| Arrow | 0.8rem, text-muted |

### 14.1 Mastery Badge

| 속성 | 값 |
|---|---|
| Size | 36×36px circle |
| Font | 0.7rem / 800, white |
| Variants | new(text-muted bg), learning(accent/500), review(primary/500), mastered(correct) |

---

## 15. Language Selector

| 속성 | 값 |
|---|---|
| Type | Native `<select>` |
| Height | 36px |
| Max Width | 160px |
| Padding | 0 12px |
| Border | 2px solid border |
| Border Radius | full |
| Background | bg-card |
| Font | 0.9rem / 700 |
| Shadow | shadow/sm |
| Focus | border: primary/500, box-shadow: 0 0 0 3px primary/100 |
| Options | 🇺🇸 English · 200 / 🇫🇷 Français · 170 / 🇯🇵 日本語 · 170 |

---

## 16. Heatmap (GitHub Grass Style)

| 속성 | 값 |
|---|---|
| Container | bg-card, radius/xl, padding 20px, shadow/card, border |
| Grid | 12 weeks × 7 days |
| Cell Size | 14×14px |
| Cell Gap | 3px |
| Cell Radius | 3px |
| Levels | 0: divider / 1: primary/200 / 2: primary/300 / 3: primary/400 / 4: primary/500 / 5: primary/600 |
| Day Labels | 월/수/금 (0.55rem, text-muted) |
| Legend | Row: "적음" [cells level 0-5] "많음" (0.65rem) |

---

## 17. Confetti

| 속성 | 값 |
|---|---|
| Container | fixed inset 0, pointer-events none, z-index 300 |
| Piece | 10×10px, radius 2px |
| Colors | primary/500, accent/500, correct, wrong, xp 등 랜덤 |
| Animation | top → bottom(100vh), rotate(720deg), opacity 1→0 |
| Variants | launchConfetti(50개) / miniConfetti(소규모, 버튼 위치) |

---

## 18. New Word Badge

| 속성 | 값 |
|---|---|
| Text | ✨ 새 단어 |
| Font | 0.75rem / 700 |
| Color | primary/600 on primary/50 |
| Padding | 4px 12px |
| Border Radius | full |
| Display | inline-block |
