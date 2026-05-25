# DUO Design Guide — Overview

## Purpose

이 가이드는 DUO 단어 반복학습 앱의 Figma 리디자인을 위한 완전한 설계 명세입니다.
Figma MCP 호출 시 이 문서들을 참조하면 최소한의 API 호출로 전체 디자인을 생성할 수 있습니다.

## App Identity

- **이름**: DUO (듀오)
- **태그라인**: 하루 15분, 과학적 간격 반복으로 단어를 자동으로
- **카테고리**: 모바일 우선 단어 학습 앱
- **디자인 방향**: 듀오링고의 인체공학 + 프리미엄 미니멀리즘. 밝고 친근하지만 듀오링고 브랜딩은 복사하지 않음.

## Frame & Platform

| 속성 | 값 |
|---|---|
| Base Frame | 390 × 844 (iPhone 15 기준) |
| Max Content Width | 480px |
| Safe Area Top | 59px (Dynamic Island) |
| Safe Area Bottom | 34px (Home Indicator) |
| Orientation | Portrait only |
| Platform | Mobile-first PWA |

## Document Structure

| 파일 | 내용 |
|---|---|
| `01_TOKENS.md` | 색상, 타이포, 간격, 그림자, 라운드, 애니메이션 토큰 전체 |
| `02_COMPONENTS.md` | 버튼, 카드, 입력, 네비바, 토스트, 모달 등 모든 재사용 컴포넌트 사양 |
| `03_SCREENS.md` | Home, Lesson(4종 퀴즈), Review, Wordbook, League — 화면별 레이아웃/상태 변형 |
| `04_FLOWS.md` | 화면 간 네비게이션 흐름, 상태 전이, 애니메이션 타이밍 |

## Screen Map (총 5개 메인 + 서브 상태)

```
Home ─────┬── Lesson ──── Quiz (Flashcard / MC / FillBlank / Matching)
          │                 └── Feedback (Correct / Wrong)
          │                 └── Session Complete
          ├── Review ──── Flashcard + Rating
          │                 └── Review Complete
          ├── League ──── Leaderboard + Ad Reward
          │                 └── Previous Week Result
          └── Wordbook ── Word List + Search/Filter
                           └── Word Detail Modal
```

## Design Principles

1. **Finger-first**: 모든 터치 타겟 최소 44×44px. 엄지 영역(하단 60%)에 주요 액션 배치.
2. **Progressive disclosure**: 한 화면에 하나의 주요 액션. 세부 정보는 모달/확장으로.
3. **Feedback is instant**: 정답/오답 0.15s 내 시각 피드백. 틀려도 좌절하지 않는 톤.
4. **Consistent elevation**: 카드 → 모달 → 토스트 순으로 z-index 상승. 그림자로 깊이 표현.
5. **Gamification is gentle**: XP/스트릭/레벨은 보상이지 압박이 아님. 컬러 힌트 + 미니 애니메이션.
