# DUO Navigation Flows & Interactions

---

## 1. Navigation Map

```
                    ┌─────────────────────────────────┐
                    │           Bottom Nav             │
                    │  [홈]  [학습]  [리그]  [단어장]    │
                    └──┬──────┬───────┬────────┬──────┘
                       │      │       │        │
                       ▼      │       ▼        ▼
                    ┌─────┐   │   ┌───────┐ ┌────────┐
                    │ Home │   │   │League │ │Wordbook│
                    └──┬──┘   │   └───────┘ └───┬────┘
                       │      │                  │
           ┌───────────┼──────┘                  │
           │           │                         │
           ▼           ▼                         ▼
      ┌─────────┐ ┌─────────┐            ┌────────────┐
      │ Review  │ │ Lesson  │            │ Word Detail │
      │(flash)  │ │(4 types)│            │  (modal)    │
      └────┬────┘ └────┬────┘            └────────────┘
           │           │
           ▼           ▼
      ┌─────────┐ ┌─────────┐
      │ Review  │ │ Lesson  │
      │Complete │ │Complete │
      └────┬────┘ └────┬────┘
           │           │
           └─────┬─────┘
                 ▼
              [Home]
```

---

## 2. Screen Transitions

### 2.1 Tab Navigation (Bottom Nav)

| From → To | Trigger | Animation | Nav State |
|---|---|---|---|
| Any tab → Home | 탭 "홈" | Instant (no transition) | Show, active: home |
| Any tab → League | 탭 "리그" | Instant | Show, active: league |
| Any tab → Wordbook | 탭 "단어장" | Instant | Show, active: wordbook |

### 2.2 Into Lesson/Review (Nav 숨김)

| From → To | Trigger | Animation | Nav State |
|---|---|---|---|
| Home → Lesson | CTA "학습 시작" | Nav hides, full render | Hidden |
| Home → Review | Quick Action "복습" (dueCards > 0) | Nav hides, full render | Hidden |
| Home → Lesson | Quick Action "복습" (dueCards = 0) | Fallback to lesson | Hidden |

### 2.3 Quiz Flow (within Lesson)

| Step | Trigger | Animation |
|---|---|---|
| Quiz N → Quiz N+1 | "다음" 버튼 or 매칭 완료 | Full re-render quiz-body |
| Last Quiz → Complete | "결과 보기" 버튼 | Nav shows, complete screen render |
| Complete → Home | "홈으로" 버튼 | Nav active: home, home render |
| Complete → Lesson | "추가 학습하기" 버튼 | Nav hides, new session |

### 2.4 Review Flow

| Step | Trigger | Animation |
|---|---|---|
| Card N → Card N+1 | 레이팅 버튼 클릭 | 300ms delay, re-render card |
| Last Card → Complete | 마지막 레이팅 | Nav shows, complete screen |
| Complete → Home | "홈으로" 버튼 | Nav active: home |

### 2.5 Modals

| Modal | Trigger | Dismiss |
|---|---|---|
| Word Detail | Wordbook 아이템 클릭 | overlay 클릭, "닫기" 버튼 |
| Confirm Dialog | lesson/review ✕ 클릭 | browser confirm() |

---

## 3. Interaction Details

### 3.1 Flashcard Flip

```
[Tap Card]
    │
    ├── Play flipSound
    ├── Card rotateY(0 → 180deg), 600ms, ease/out
    ├── Show back face (meaning, example)
    └── Show rating buttons in footer
```

### 3.2 Multiple Choice Answer

```
[Tap Option]
    │
    ├── All options → disabled (pointer-events: none, opacity 0.6)
    ├── Tapped option → correct class (green) OR wrong class (red)
    │   ├── Correct: correctPulse animation + ✓ indicator
    │   └── Wrong: wrongShake animation + ✗ indicator
    ├── If wrong → also highlight correct option in green + ✓
    ├── Play correctSound or wrongSound
    ├── If correct → miniConfetti on button
    ├── Show feedback banner in footer
    └── Show "다음" / "결과 보기" button
```

### 3.3 Fill Blank Submit

```
[Tap "확인" or Enter key]
    │
    ├── Input → disabled
    ├── Input → correct class (green border/bg) OR wrong class (red)
    ├── Blank span → filled with correct answer (green or red text)
    ├── Play correctSound or wrongSound
    ├── Show feedback + next button in footer
    └── (same as MC flow)
```

### 3.4 Matching Interaction

```
[Tap left column word]
    │
    ├── Previous selection → deselect
    ├── This word → selected (primary border, scale 1.03)
    └── Play clickSound

[Tap right column meaning, while word is selected]
    │
    ├── If match correct:
    │   ├── Both items → matched (green, opacity 0.7, disabled)
    │   ├── Play correctSound
    │   ├── miniConfetti on meaning item
    │   ├── Clear selection
    │   └── If all matched → 600ms delay → auto advance
    │
    └── If match wrong:
        ├── Meaning item → wrong-match (red, wrongShake)
        ├── Play wrongSound
        └── 400ms → remove wrong-match class
```

### 3.5 Lesson Complete

```
[Render complete screen]
    │
    ├── Play completeSound
    ├── 300ms → launchConfetti(50)
    ├── complete-emoji → celebrateBounce animation
    ├── If leveledUp → 1000ms → showLevelUpToast
    └── Show nav bar
```

### 3.6 Ad Reward Claim

```
[Tap "광고 보고 +30 LP 받기"]
    │
    ├── claimAdReward() → { claimed: true, amount: 30 }
    ├── Show toast "🎁 광고 보너스 +30 LP"
    ├── Re-render screen (button → disabled "오늘 광고 보상 완료")
    └── LP total updated
```

### 3.7 Language Change

```
[Select language from dropdown]
    │
    ├── setCurrentLanguage(value)
    └── window.location.reload()  ← 전체 앱 리로드
```

---

## 4. Audio Events

| Event | Sound | When |
|---|---|---|
| Correct answer | playCorrect() | MC/FB 정답, 매칭 성공, 레이팅 ≥ 3 |
| Wrong answer | playWrong() | MC/FB 오답, 매칭 실패, 레이팅 < 3 |
| Session complete | playComplete() | Lesson/Review 완료 화면 |
| Card flip | playFlip() | 플래시카드 탭 |
| Button click | playClick() | 매칭 단어 선택 |
| TTS | speakWord() | 🔊 버튼, 새 단어 자동 재생, 복습 카드 자동 재생 |

---

## 5. Gamification Events (Toast Triggers)

| Event | Timing | Toast |
|---|---|---|
| 스트릭 갱신 | 레슨/복습 시작 시 (첫 학습) 500ms | 🔥 "7일 연속 학습! 대단해요!" |
| 레벨업 | 정답 XP 부여 후 즉시 (500ms delay) | 🎊 "🎉 레벨 5 달성!" |
| 레벨업 (완료 화면) | 완료 화면 렌더 후 1000ms | 동일 |
| 광고 보상 | 버튼 클릭 즉시 | 🎁 "광고 보너스 +30 LP" |

---

## 6. Badge Logic (Nav)

| Condition | Badge |
|---|---|
| dueCards.length > 0 | lesson 탭에 빨간 도트 (8×8px) |
| dueCards.length === 0 | 도트 제거 |
| Badge 업데이트 | navigate() 호출 시마다 |

---

## 7. Figma Prototype Connections (권장)

### Flow 1: Daily Learning

```
Home (학습 전)
  → [CTA] → Lesson/Flashcard (Front)
    → [tap card] → Lesson/Flashcard (Back + Ratings)
      → [rate] → Lesson/MC (Default)
        → [tap option] → Lesson/MC (Correct)
          → [다음] → Lesson/FillBlank (Empty)
            → [확인] → Lesson/FillBlank (Correct)
              → [결과 보기] → Lesson Complete
                → [홈으로] → Home (학습 완료)
```

### Flow 2: Review

```
Home (복습 대기)
  → [Quick Action 복습] → Review Card (Front)
    → [tap card] → Review Card (Back + Ratings)
      → [rate] → Review Card 2 (Front)
        → ... → Review Complete
          → [홈으로] → Home
```

### Flow 3: Wordbook Browse

```
Home → [Nav 단어장] → Wordbook (Default)
  → [tap filter chip] → Wordbook (Filtered)
  → [tap word item] → Word Detail Modal
    → [닫기 / overlay tap] → Wordbook
```

### Flow 4: League Check

```
Home → [Nav 리그] → League (Default)
  → [광고 버튼] → League (Ad Used) + Toast
```
