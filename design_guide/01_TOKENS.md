# DUO Design Tokens

모든 수치는 피그마 Variables / Styles로 등록합니다.
`Light`와 `Dark` 두 컬렉션으로 나누고, 컴포넌트는 시맨틱 토큰만 참조합니다.

---

## 1. Color Palette

### 1.1 Primary — Emerald Green

| Token | Light Hex | Dark Hex | 용도 |
|---|---|---|---|
| `primary/50` | `#ECFDF5` | — | 뱃지 배경, 선택 힌트 |
| `primary/100` | `#D1FAE5` | — | 포커스 링 |
| `primary/200` | `#A7F3D0` | — | 히트맵 Level 1 |
| `primary/300` | `#6EE7B7` | — | 히트맵 Level 2 |
| `primary/400` | `#34D399` | — | 그라디언트 밝은 쪽, 히트맵 Level 3 |
| `primary/500` | `#10B981` | `#10B981` | 메인 액센트, CTA, 활성 필터칩, 히트맵 Level 4 |
| `primary/600` | `#059669` | `#059669` | 그라디언트 어두운 쪽, 텍스트 on primary-bg |
| `primary/700` | `#047857` | `#047857` | 버튼 하단 그림자 |
| `primary/800` | `#065F46` | — | — |
| `primary/900` | `#064E3B` | — | — |

### 1.2 Accent — Warm Amber

| Token | Hex | 용도 |
|---|---|---|
| `accent/400` | `#FBBF24` | — |
| `accent/500` | `#F59E0B` | 리그 히어로, 광고 버튼, 학습중 뱃지 |
| `accent/600` | `#D97706` | 리그 LP 텍스트, 버튼 하단 그림자 |

### 1.3 Semantic Colors

| Token | Hex | 용도 |
|---|---|---|
| `correct` | `#22C55E` | 정답 테두리, 매칭 완료, 승급 도트 |
| `correct-bg` | `#DCFCE7` (Light) / `#052E16` (Dark) | 정답 피드백 배경 |
| `wrong` | `#EF4444` | 오답 테두리, 강등 도트, 네비 뱃지 |
| `wrong-bg` | `#FEE2E2` (Light) / `#450A0A` (Dark) | 오답 피드백 배경 |
| `streak` | `#F97316` | 스트릭 아이콘 배경 |
| `xp` | `#8B5CF6` | XP 아이콘 배경, XP 프로그레스 |
| `info` | `#3B82F6` | 잔류 도트, 기본 리그 행 보더 |

### 1.4 Neutral (Light / Dark)

| Token | Light | Dark | 용도 |
|---|---|---|---|
| `bg` | `#F8FAF9` | `#0F1419` | 페이지 배경 |
| `bg-card` | `#FFFFFF` | `#1A2332` | 카드, 모달, 인풋 배경 |
| `bg-nav` | `rgba(255,255,255,0.92)` | `rgba(26,35,50,0.95)` | 네비바 (블러) |
| `bg-overlay` | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.4)` | 모달 오버레이 |
| `text` | `#1A1A2E` | `#F0F4F8` | 기본 텍스트 |
| `text-secondary` | `#6B7280` | `#94A3B8` | 보조 텍스트 |
| `text-muted` | `#9CA3AF` | `#64748B` | 힌트, 캡션 |
| `border` | `#E5E7EB` | `#2D3748` | 카드/인풋 테두리 |
| `divider` | `#F3F4F6` | `#1E293B` | 구분선, 약한 배경 |

### 1.5 Gradient Presets

| 이름 | 값 | 사용처 |
|---|---|---|
| `gradient/cta` | `135deg, primary/500 → primary/400` | CTA 버튼 |
| `gradient/today` | `135deg, primary/600 → primary/700` | 오늘의 학습 카드 |
| `gradient/league` | `135deg, accent/500 → accent/600` | 리그 히어로 |
| `gradient/xp` | `90deg, #7C3AED → #8B5CF6` | XP 프로그레스 바 |
| `gradient/xp-card` | `135deg, #F5F3FF → #EDE9FE` | XP 획득 카드 |
| `gradient/lp-card` | `135deg, #FFFBEB → #FEF3C7` | LP 획득 카드 |
| `gradient/streak-icon` | `135deg, #FFF7ED → #FFEDD5` | 스트릭 아이콘 배경 |
| `gradient/xp-icon` | `135deg, #F5F3FF → #EDE9FE` | XP 아이콘 배경 |

---

## 2. Typography

Font: **Inter** (fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)

### 2.1 Type Scale

| Token | Size | Weight | Line Height | 용도 |
|---|---|---|---|---|
| `display` | 2.25rem (36px) | 800 | 1.2 | — (예비) |
| `heading-1` | 1.6rem (25.6px) | 800 | 1.25 | 홈 인사, 완료 타이틀 |
| `heading-2` | 1.45rem (23.2px) | 900 | 1.2 | 리그 타이틀 |
| `heading-3` | 1.3rem (20.8px) | 800 | 1.3 | 오늘의 학습 타이틀, stat-value |
| `heading-4` | 1.25rem (20px) | 700 | 1.4 | 화면 헤더 h1 |
| `body-large` | 1.1rem (17.6px) | 600~800 | 1.5 | CTA 텍스트, 질문 프롬프트 |
| `body` | 1rem (16px) | 600 | 1.6 | 퀴즈 옵션, 피드백 타이틀 |
| `body-small` | 0.9rem (14.4px) | 500~700 | 1.5 | 인사 텍스트, 언어 셀렉트, 예문 |
| `caption` | 0.8rem (12.8px) | 600~700 | 1.4 | 라벨, eyebrow, 힌트 |
| `caption-small` | 0.75rem (12px) | 700~800 | 1.4 | 뱃지, 레이팅 간격, 리그 존 |
| `micro` | 0.7rem (11.2px) | 500~600 | 1.3 | stat-label, 카테고리 라벨, 히트맵 범례 |
| `nano` | 0.65rem (10.4px) | 500~600 | 1.3 | 네비 라벨, 레이팅 interval |

### 2.2 Special Text Styles

| 이름 | Size | Weight | 추가 속성 |
|---|---|---|---|
| `word-display` | 2.2rem | 800 | letter-spacing: -0.02em (플래시카드 단어) |
| `word-quiz` | 2rem | 800 | letter-spacing: -0.02em (퀴즈 질문 단어) |
| `complete-emoji` | 4rem | — | 이모지 전용 (완료 화면) |
| `league-rank-number` | 2rem | 900 | 리그 히어로 순위 숫자 |
| `stat-value-large` | 1.5rem | 800 | 완료 화면 통계 숫자 |

---

## 3. Spacing

8px 기반 스케일.

| Token | Value | 주요 사용처 |
|---|---|---|
| `space/2` | 2px | gap(아주 작은) |
| `space/4` | 4px | 인라인 갭, 내부 마진 |
| `space/6` | 6px | 네비 아이콘-라벨 갭 |
| `space/8` | 8px | 카드 간 갭, 칩 갭, 작은 마진 |
| `space/10` | 10px | 퀴즈 옵션 갭, 리그 행 갭, 리그 행 패딩 |
| `space/12` | 12px | 카드 내 아이콘-텍스트 갭, 그리드 갭, 스크린 헤더 패딩 |
| `space/14` | 14px | 단어 리스트 아이템 패딩, 레벨 카드 아이콘 갭 |
| `space/16` | 16px | 카드 패딩(작은), 피드백 패딩, 마진 |
| `space/20` | 20px | 스크린 좌우 패딩, 퀴즈 컨테이너 패딩, 카드 패딩 |
| `space/24` | 24px | 카드 패딩(큰), 모달 패딩, 플래시카드 내부 패딩 |
| `space/32` | 32px | 플래시카드 상하 패딩, 완료 스탯-버튼 간 마진 |
| `space/40` | 40px | 완료 화면 상하 패딩 |
| `space/60` | 60px | 빈 상태 패딩 |

---

## 4. Border Radius

| Token | Value | 용도 |
|---|---|---|
| `radius/sm` | 8px | — |
| `radius/md` | 12px | 퀴즈 옵션, 레이팅 버튼, 매칭 아이템, 통계 박스 |
| `radius/lg` | 16px | 버튼, 피드백, 리그 행, 인풋, 단어 아이템, 토스트 |
| `radius/xl` | 20px | 메인 카드, 오늘 카드, 리그 히어로, 스탯 카드, 플래시카드 |
| `radius/2xl` | 24px | 모달 상단 라운드 |
| `radius/full` | 9999px | 필터칩, 뱃지, 아바타, 프로그레스 바, 네비 뱃지, 언어 셀렉트 |

---

## 5. Shadows

| Token | Light Value | Dark Value |
|---|---|---|
| `shadow/sm` | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.2)` |
| `shadow/md` | `0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)` | `0 4px 6px rgba(0,0,0,0.3)` |
| `shadow/lg` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)` | `0 10px 15px rgba(0,0,0,0.3)` |
| `shadow/xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)` | (동일) |
| `shadow/card` | `0 2px 12px rgba(0,0,0,0.06)` | `0 2px 12px rgba(0,0,0,0.2)` |
| `shadow/glow` | `0 0 20px rgba(16,185,129,0.3)` | (동일) |

### Button Bottom Shadows (Duolingo-style 3D)

| 버튼 | 하단 그림자 |
|---|---|
| `btn-primary` | `0 4px 0 #047857` + shadow/md |
| `btn-primary:active` | `0 1px 0 #047857` (translateY: 3px) |
| `btn-secondary` | `0 4px 0 #E5E7EB` + shadow/sm |
| `btn-correct` | `0 4px 0 #16A34A` |
| `btn-wrong` | `0 4px 0 #DC2626` |
| `cta-button` | `0 6px 0 #047857, 0 6px 20px rgba(16,185,129,0.3)` |
| `cta:active` | `0 2px 0 #047857` (translateY: 4px) |
| `rating-again` | `0 3px 0 #FCA5A5` |
| `rating-hard` | `0 3px 0 #FCD34D` |
| `rating-good` | `0 3px 0 #86EFAC` |
| `rating-easy` | `0 3px 0 #93C5FD` |
| `league-ad` | `0 3px 0 #D97706` |

---

## 6. Layout Constants

| Token | Value | 비고 |
|---|---|---|
| `nav-height` | 72px | Safe area 포함 |
| `header-height` | 56px | Sticky 헤더 |
| `max-width` | 480px | 앱 콘텐츠 최대 너비 |
| `screen-padding-x` | 20px | 모든 화면 좌우 패딩 |

---

## 7. Animation Tokens

| Token | Value | 용도 |
|---|---|---|
| `ease/out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 기본 트랜지션 |
| `ease/bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 아이콘 확대 |
| `ease/spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | 바운스 효과 |
| `duration/fast` | 150ms | 버튼 hover, active |
| `duration/normal` | 250ms | 일반 트랜지션 |
| `duration/slow` | 400ms | 프로그레스 바 채우기 |

### Entry Animation (animate-in)

- Type: slideUp
- From: `translateY(30px), opacity: 0`
- To: `translateY(0), opacity: 1`
- Duration: 400ms, ease: `ease/out`
- Stagger: 50ms 간격 (delay-1 ~ delay-5)

---

## 8. Iconography

현재 이모지 기반. 리디자인에서 SVG 아이콘 도입 시 아래 매핑 참조.

| 위치 | 현재 이모지 | 권장 대체 |
|---|---|---|
| 네비 - 홈 | 🏠 | outline house icon |
| 네비 - 학습 | 📚 | outline book-open icon |
| 네비 - 리그 | 🏆 | outline trophy icon |
| 네비 - 단어장 | 📖 | outline bookmark icon |
| 스트릭 | 🔥 | filled flame icon (orange) |
| XP | ⚡ | filled lightning icon (purple) |
| 스피커 | 🔊 | outline volume-2 icon |
| 정답 | ✅ / ✓ | filled check-circle (green) |
| 오답 | ❌ / ✗ | filled x-circle (red) |
| 새 단어 | ✨ | filled sparkles |
| 완료 | 🎉 | filled party-popper |
| 검색 | 🔍 | outline search icon |

---

## 9. Z-Index Scale

| Layer | Z-Index |
|---|---|
| Base content | 0 |
| Sticky header | 50 |
| Bottom nav | 100 |
| Modal overlay | 200 |
| Confetti | 300 |
| Toast | 400 |
