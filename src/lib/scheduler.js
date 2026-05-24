/**
 * scheduler.js — FSRS 기반 스케줄링 엔진
 * ts-fsrs를 래핑하여 오늘 학습/복습할 카드를 관리합니다.
 */

import { createEmptyCard, fsrs, Rating, State } from 'ts-fsrs';
import { getAllCards, saveCard, getUser, updateUser, getSettings } from './storage.js';
import { wordData } from '../data/wordData.js';

// FSRS 스케줄러 인스턴스 (앱 시작 시 초기화)
let scheduler = null;

function getScheduler() {
  if (!scheduler) {
    const settings = getSettings();
    scheduler = fsrs({
      request_retention: settings.targetRetention || 0.9,
      maximum_interval: 365,
      enable_fuzz: true,
    });
  }
  return scheduler;
}

/**
 * 새 카드 생성 (FSRS 초기 상태)
 */
function createNewCard(wordId) {
  const card = createEmptyCard(new Date());
  return {
    ...card,
    wordId,
    firstSeen: new Date().toISOString(),
  };
}

/**
 * 오늘 복습해야 할 카드 목록 가져오기
 * @returns {Array<{ wordId: string, card: Object, word: Object }>}
 */
export function getDueCards() {
  const allCards = getAllCards();
  const now = new Date();
  const dueCards = [];

  for (const [wordId, cardState] of Object.entries(allCards)) {
    // 아직 학습 중(Learning/Relearning)이거나, 복습 예정일이 지난 카드
    const dueDate = new Date(cardState.due);
    if (dueDate <= now) {
      const word = wordData.find(w => w.id === wordId);
      if (word) {
        dueCards.push({ wordId, card: cardState, word });
      }
    }
  }

  // 긴급도 순으로 정렬 (오래 전에 복습 예정이었던 것 먼저)
  dueCards.sort((a, b) => new Date(a.card.due) - new Date(b.card.due));

  return dueCards;
}

/**
 * 아직 한 번도 본 적 없는 신규 단어 가져오기
 * @param {number} count - 가져올 개수
 * @returns {Array<Object>} 단어 객체 배열
 */
export function getNewWords(count = 10) {
  const allCards = getAllCards();
  const unseenWords = wordData.filter(w => !allCards[w.id]);

  // 레벨 순으로 정렬 (쉬운 것부터)
  unseenWords.sort((a, b) => a.level - b.level);

  return unseenWords.slice(0, count);
}

/**
 * 오늘의 학습 세션 카드 구성
 * 신규 단어 + 복습 단어를 합쳐 15~20개 반환
 * @returns {{ cards: Array, newCount: number, reviewCount: number }}
 */
export function getTodaySession() {
  const user = getUser();
  const settings = getSettings();
  const dailyGoal = settings.dailyGoal || 15;
  const dailyNewLimit = user.dailyNewWordsLimit || 10;

  // 복습 카드 먼저
  const dueCards = getDueCards();
  const reviewCount = Math.min(dueCards.length, dailyGoal);

  // 남은 자리에 신규 단어 채우기
  const remainingSlots = Math.max(0, dailyGoal - reviewCount);
  const newWordCount = Math.min(remainingSlots, dailyNewLimit);
  const newWords = getNewWords(newWordCount);

  // 신규 단어에 대해 FSRS 카드 생성
  const newCards = newWords.map(word => ({
    wordId: word.id,
    card: createNewCard(word.id),
    word,
    isNew: true,
  }));

  // 복습 카드에 단어 정보 합치기
  const reviewCards = dueCards.slice(0, reviewCount).map(c => ({
    ...c,
    isNew: false,
  }));

  // 섞기: 신규 단어를 중간중간 배치 (처음 2개는 항상 신규)
  const allCards = interleaveCards(newCards, reviewCards);

  return {
    cards: allCards,
    newCount: newCards.length,
    reviewCount: reviewCards.length,
    totalDue: dueCards.length,
  };
}

/**
 * 신규 카드와 복습 카드를 자연스럽게 섞기
 */
function interleaveCards(newCards, reviewCards) {
  if (newCards.length === 0) return [...reviewCards];
  if (reviewCards.length === 0) return [...newCards];

  const result = [];
  let ni = 0, ri = 0;
  const total = newCards.length + reviewCards.length;
  const ratio = newCards.length / total;

  for (let i = 0; i < total; i++) {
    // 처음 2개는 신규 단어로 시작
    if (i < 2 && ni < newCards.length) {
      result.push(newCards[ni++]);
    } else if (ni >= newCards.length) {
      result.push(reviewCards[ri++]);
    } else if (ri >= reviewCards.length) {
      result.push(newCards[ni++]);
    } else {
      // 비율에 따라 배치
      if (Math.random() < ratio) {
        result.push(newCards[ni++]);
      } else {
        result.push(reviewCards[ri++]);
      }
    }
  }

  return result;
}

/**
 * 사용자 응답 처리 → FSRS로 다음 복습일 계산
 * @param {string} wordId - 단어 ID
 * @param {number} rating - 1(Again) / 2(Hard) / 3(Good) / 4(Easy)
 * @returns {{ card: Object, log: Object, scheduledDays: number }}
 */
export function processReview(wordId, rating) {
  const s = getScheduler();
  const allCards = getAllCards();

  let card = allCards[wordId];
  if (!card) {
    card = createNewCard(wordId);
  }

  // FSRS Rating 매핑
  const fsrsRating = mapRating(rating);

  // FSRS 스케줄링 실행
  const now = new Date();
  const result = s.next(card, now, fsrsRating);

  // 카드 상태 저장
  const updatedCard = {
    ...result.card,
    wordId,
    firstSeen: card.firstSeen || now.toISOString(),
    lastReview: now.toISOString(),
  };

  saveCard(wordId, updatedCard);

  // 사용자 통계 업데이트
  const user = getUser();
  user.totalReviews += 1;
  if (rating >= 3) {
    user.totalCorrect += 1;
  }
  // 신규 단어 카운트
  if (!card.lastReview) {
    user.totalWordsLearned += 1;
  }
  updateUser(user);

  return {
    card: updatedCard,
    log: result.log,
    scheduledDays: updatedCard.scheduled_days || 0,
  };
}

/**
 * Rating 매핑 (앱 내부 → FSRS)
 */
function mapRating(rating) {
  switch (rating) {
    case 1: return Rating.Again;
    case 2: return Rating.Hard;
    case 3: return Rating.Good;
    case 4: return Rating.Easy;
    default: return Rating.Good;
  }
}

/**
 * 카드 미리보기 — 각 Rating에 따른 다음 복습일 표시
 */
export function previewSchedule(wordId) {
  const s = getScheduler();
  const allCards = getAllCards();

  let card = allCards[wordId];
  if (!card) {
    card = createNewCard(wordId);
  }

  const now = new Date();
  const preview = s.repeat(card, now);

  return {
    again: formatInterval(preview[Rating.Again].card),
    hard: formatInterval(preview[Rating.Hard].card),
    good: formatInterval(preview[Rating.Good].card),
    easy: formatInterval(preview[Rating.Easy].card),
  };
}

/**
 * 간격을 읽기 쉬운 문자열로 변환
 */
function formatInterval(card) {
  const days = card.scheduled_days || 0;
  if (days === 0) {
    // Learning 상태 — 분 단위
    const due = new Date(card.due);
    const now = new Date();
    const mins = Math.max(1, Math.round((due - now) / 60000));
    if (mins < 60) return `${mins}분`;
    return `${Math.round(mins / 60)}시간`;
  }
  if (days === 1) return '내일';
  if (days < 7) return `${days}일`;
  if (days < 30) return `${Math.round(days / 7)}주`;
  if (days < 365) return `${Math.round(days / 30)}개월`;
  return `${Math.round(days / 365)}년`;
}

/**
 * 전체 학습 진행률
 */
export function getOverallProgress() {
  const allCards = getAllCards();
  const total = wordData.length;
  const learned = Object.keys(allCards).length;
  const mastered = Object.values(allCards).filter(
    c => c.state === State.Review && (c.stability || 0) > 21
  ).length;

  return {
    total,
    learned,
    mastered,
    percentage: Math.round((learned / total) * 100),
    masteredPercentage: Math.round((mastered / total) * 100),
  };
}

/**
 * 카드 상태 라벨
 */
export function getCardStateLabel(card) {
  if (!card) return '미학습';
  switch (card.state) {
    case State.New: return '신규';
    case State.Learning: return '학습중';
    case State.Review: return '복습';
    case State.Relearning: return '재학습';
    default: return '미학습';
  }
}
