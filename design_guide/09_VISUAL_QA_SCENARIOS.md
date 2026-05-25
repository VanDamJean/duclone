# DUO — Visual QA Scenarios

P0 polish 후 수동으로 걸어봐야 하는 시나리오입니다.
07 체크리스트의 "수동 검증" 부분을 구체적인 시나리오로 풀어놓은 것입니다.

DevTools → Device Toolbar에서 390px(기본) + 360px(스몰) 두 가지로 실행하세요.
`npm run dev` 후 localhost:5173에서 진행합니다.

---

## Scenario 1: 첫 방문 (Fresh State)

**준비**: LocalStorage 전부 삭제 (DevTools → Application → Clear site data)

| Step | Action | Expected |
|---|---|---|
| 1 | 앱 로드 | 홈 화면, 인사말, streak 0, XP 0, 프로그레스 0/15 |
| 2 | 언어 확인 | 기본값 EN 선택됨, "🇺🇸 English · 200" |
| 3 | CTA 클릭 | Lesson 진입, nav 숨김, 퀴즈 시작 |
| 4 | 첫 카드 확인 | "✨ 새 단어" 뱃지 표시 (T3 검증) |
| 5 | 플래시카드 탭 | 플립 애니메이션, 뒷면에 뜻/예문 |
| 6 | 레이팅 "알겠음" | 피드백 표시 → 다음 퀴즈 |
| 7 | 8문제 완료 | 완료 화면: 통계 + XP + LP + 버튼 3개 |
| 8 | "홈으로" 클릭 | 홈 복귀, streak 1, XP > 0, 프로그레스 갱신 |

**검증 포인트**: T3 뱃지가 CSS 클래스로 렌더링되는지 (DevTools Elements 패널에서 `class="new-word-badge"` 확인, `style=""` 없어야 함)

---

## Scenario 2: 복습 플로우

**준비**: Scenario 1 완료 상태 (학습 이력 있음)

| Step | Action | Expected |
|---|---|---|
| 1 | 홈에서 "복습하기" 클릭 | Review 또는 Lesson 진입 |
| 2 | "🔄 복습" 라벨 확인 | 카드 상단에 라벨 표시 (T4 검증) |
| 3 | 카드 탭 | 플립 → 레이팅 4버튼 표시 |
| 4 | "모름" 클릭 | 다음 카드로 전환 |
| 5 | 모든 카드 완료 | 복습 완료 화면 |
| 6 | "홈으로" | 홈 복귀 |

**검증 포인트**: T4 라벨이 `class="review-label"`로 렌더링되는지 확인

---

## Scenario 3: 단어장 검색 + 모달

| Step | Action | Expected |
|---|---|---|
| 1 | 네비 "단어장" 탭 | Wordbook 화면 진입 |
| 2 | 검색창 확인 | 돋보기 아이콘 + placeholder "단어 검색..." (T1 검증) |
| 3 | 검색창 포커스 | border → primary/500, glow ring |
| 4 | "eph" 입력 | 실시간 필터, "ephemeral" 등 매칭 결과 |
| 5 | 검색어 전부 삭제 | 전체 리스트 복원 |
| 6 | "일상" 필터칩 클릭 | 칩 active, 리스트 필터 |
| 7 | 단어 아이템 클릭 | bottom sheet 모달 올라옴 (T2 검증) |
| 8 | 모달 내용 확인 | 단어/발음/품사태그/숙달태그/뜻/예문/카테고리/레벨 |
| 9 | "🔊 발음 듣기" 클릭 | TTS 재생 |
| 10 | "닫기" 클릭 | 모달 사라짐 |
| 11 | 다른 단어 🔊 버튼 | TTS만 재생, 모달 안 열림 |
| 12 | 매칭 안 되는 검색어 ("zzz") | empty state: "검색 결과가 없어요" |

**검증 포인트**: 검색 인풋에 `style=""` 없음 + 모달 내부에 `style=""` 없거나 최소

---

## Scenario 4: 객관식 + 빈칸채우기

| Step | Action | Expected |
|---|---|---|
| 1 | 홈 → CTA "학습 시작" | Lesson 진입 |
| 2 | 객관식 도달 | 단어 + 4개 옵션 표시 |
| 3 | 정답 클릭 | green + ✓, 피드백 "✅ 정답!", "다음" 버튼 |
| 4 | 오답 클릭 (다음 문제에서) | red + ✗, 정답 green 표시, 피드백 "❌ 오답" |
| 5 | 빈칸채우기 도달 | 문장 + 빈칸 + 인풋 + "확인" 버튼 |
| 6 | 인풋에 정답 입력 + Enter | 인풋 green, 빈칸에 단어 green 표시 |
| 7 | 인풋에 오답 입력 + "확인" | 인풋 red, 빈칸에 정답 표시 |

---

## Scenario 5: 매칭 퀴즈

| Step | Action | Expected |
|---|---|---|
| 1 | 매칭 퀴즈 도달 | 2열 그리드: 좌 단어 / 우 뜻 |
| 2 | 좌측 단어 탭 | primary border + scale(1.03) |
| 3 | 올바른 뜻 탭 | 양쪽 matched (green), miniConfetti |
| 4 | 다른 단어 → 잘못된 뜻 | 빨간 shake, 400ms 후 복원 |
| 5 | 전부 매칭 완료 | 600ms 후 자동 다음 퀴즈 |

**360px 추가 확인**: 각 열 텍스트가 컨테이너 밖으로 넘치지 않는지 (T5 검증)

---

## Scenario 6: 리그

| Step | Action | Expected |
|---|---|---|
| 1 | 네비 "리그" 탭 | League 화면 |
| 2 | 리더보드 표시 | 순위 리스트, 유저 행 하이라이트 |
| 3 | 닉네임 확인 | 긴 이름이 ... 으로 잘림 (T5 검증) |
| 4 | 존 색상 | 상위 green, 중간 blue, 하위 red 좌측 보더 |
| 5 | 광고 버튼 클릭 (활성 시) | toast "🎁 광고 보너스 +30 LP", 버튼 disabled |

---

## Scenario 7: 360px 스트레스 테스트

DevTools → 360px 너비로 전환.

| Step | Verify |
|---|---|
| 1 | 홈 전체 | 텍스트 겹침 없음, 인사 제목 줄바꿈 OK |
| 2 | 검색 인풋 | 돋보기와 텍스트 겹치지 않음 |
| 3 | 매칭 퀴즈 | 2열 텍스트 overflow 없음 (word-break 적용) |
| 4 | 레이팅 버튼 | **2×2 그리드로 전환됨** (4열 아닌 2열) |
| 5 | 리그 닉네임 | ellipsis 적용 |
| 6 | Word Detail 모달 | 2열 info (카테고리/레벨)가 좁지만 깨지지 않음 |
| 7 | 객관식 옵션 | 긴 텍스트 줄바꿈, 패딩 유지 |

---

## Scenario 8: 언어 전환

| Step | Action | Expected |
|---|---|---|
| 1 | 셀렉트에서 🇫🇷 Français 선택 | 페이지 리로드 |
| 2 | 홈 확인 | 단어 수 변경 (170) |
| 3 | 단어장 진입 | 프랑스어 단어 리스트 |
| 4 | 단어 모달 열기 | 프랑스어 단어 + 뜻 + 예문 정상 표시 |
| 5 | 🇯🇵 日本語 전환 | 리로드, 일본어 단어 표시 |
| 6 | 플래시카드 확인 | 한자/가나/로마자 표시, TTS 재생 |

---

## Pass / Fail Summary Template

```
Date: ____
Tester: ____
Device: Chrome DevTools (390px / 360px)
Build: npm run build ✅/❌
Tests: npm test ✅/❌

| Scenario | 390px | 360px | Notes |
|---|---|---|---|
| S1 첫 방문 | ✅/❌ | ✅/❌ | |
| S2 복습 | ✅/❌ | ✅/❌ | |
| S3 단어장 | ✅/❌ | ✅/❌ | |
| S4 객관식/빈칸 | ✅/❌ | ✅/❌ | |
| S5 매칭 | ✅/❌ | ✅/❌ | |
| S6 리그 | ✅/❌ | ✅/❌ | |
| S7 360px 스트레스 | — | ✅/❌ | |
| S8 언어 전환 | ✅/❌ | — | |

Blocking issues: ____
Non-blocking issues: ____
```
