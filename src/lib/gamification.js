/**
 * gamification.js — XP, 레벨, 스트릭 시스템
 * 사용자의 학습 동기를 유지하는 게이미피케이션 로직
 */

import { getUser, saveUser, getTodayKey, getTodayStats, saveTodayStats } from './storage.js';

// ─── Level System ───────────────────────────────────────

/**
 * 레벨별 필요 XP 테이블 (누적)
 * 레벨 1: 0 XP, 레벨 2: 50 XP, 레벨 3: 120 XP, ...
 * 공식: XP = 30 * level^1.5 (반올림)
 */
function getXpForLevel(level) {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += Math.round(30 * Math.pow(i, 1.5));
  }
  return total;
}

/**
 * XP로부터 현재 레벨 계산
 */
export function calculateLevel(xp) {
  let level = 1;
  while (getXpForLevel(level + 1) <= xp && level < 50) {
    level++;
  }
  return level;
}

/**
 * 현재 레벨 진행률 (0~1)
 */
export function getLevelProgress(xp) {
  const level = calculateLevel(xp);
  if (level >= 50) return 1;
  
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  const progress = (xp - currentLevelXp) / (nextLevelXp - currentLevelXp);
  return Math.min(1, Math.max(0, progress));
}

/**
 * 다음 레벨까지 필요한 XP
 */
export function getXpToNextLevel(xp) {
  const level = calculateLevel(xp);
  if (level >= 50) return 0;
  return getXpForLevel(level + 1) - xp;
}

// ─── XP Rewards ─────────────────────────────────────────

const XP_REWARDS = {
  CORRECT_ANSWER: 10,
  COMBO_BONUS: 5,       // 연속 정답 보너스 (per streak)
  LESSON_COMPLETE: 30,
  PERFECT_LESSON: 50,   // 틀린 문제 없이 레슨 완료
  DAILY_FIRST: 20,      // 오늘 첫 학습
  STREAK_BONUS: 10,     // 스트릭 일수당 보너스
};

/**
 * 정답 시 XP 계산
 * @param {number} combo - 연속 정답 수
 * @returns {{ xp: number, breakdown: Object }}
 */
export function calculateCorrectXp(combo = 0) {
  let xp = XP_REWARDS.CORRECT_ANSWER;
  const breakdown = { base: XP_REWARDS.CORRECT_ANSWER };
  
  if (combo >= 3) {
    const comboBonus = Math.min(combo - 2, 5) * XP_REWARDS.COMBO_BONUS;
    xp += comboBonus;
    breakdown.combo = comboBonus;
  }
  
  return { xp, breakdown };
}

/**
 * 레슨 완료 XP 계산
 */
export function calculateLessonCompleteXp(correctCount, totalCount) {
  let xp = XP_REWARDS.LESSON_COMPLETE;
  const breakdown = { lessonComplete: XP_REWARDS.LESSON_COMPLETE };
  
  if (correctCount === totalCount) {
    xp += XP_REWARDS.PERFECT_LESSON;
    breakdown.perfect = XP_REWARDS.PERFECT_LESSON;
  }
  
  return { xp, breakdown };
}

// ─── XP Award ───────────────────────────────────────────

/**
 * XP 부여 및 레벨업 체크
 * @returns {{ newXp: number, newLevel: number, leveledUp: boolean, oldLevel: number }}
 */
export function awardXp(amount) {
  const user = getUser();
  const oldLevel = calculateLevel(user.xp);
  
  user.xp += amount;
  const newLevel = calculateLevel(user.xp);
  user.level = newLevel;
  
  // 오늘 통계에도 반영
  const todayStats = getTodayStats();
  todayStats.xpEarned = (todayStats.xpEarned || 0) + amount;
  saveTodayStats(todayStats);
  
  saveUser(user);
  
  return {
    newXp: user.xp,
    newLevel,
    leveledUp: newLevel > oldLevel,
    oldLevel,
  };
}

// ─── Streak System ──────────────────────────────────────

/**
 * 스트릭 업데이트
 * 매일 학습 완료 시 호출
 * @returns {{ streak: number, isNew: boolean, longestStreak: number }}
 */
export function updateStreak() {
  const user = getUser();
  const today = getTodayKey();
  
  // 이미 오늘 스트릭이 업데이트되었는지 확인
  if (user.lastStudyDate === today) {
    return {
      streak: user.streak,
      isNew: false,
      longestStreak: user.longestStreak,
    };
  }
  
  // 어제 날짜 계산
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  
  if (user.lastStudyDate === yesterdayKey) {
    // 어제 했으면 스트릭 연장
    user.streak += 1;
  } else if (user.lastStudyDate !== today) {
    // 어제 안 했으면 리셋
    user.streak = 1;
  }
  
  user.lastStudyDate = today;
  user.longestStreak = Math.max(user.longestStreak, user.streak);
  
  saveUser(user);
  
  return {
    streak: user.streak,
    isNew: true,
    longestStreak: user.longestStreak,
  };
}

/**
 * 오늘 첫 학습인지 확인
 */
export function isFirstStudyToday() {
  const user = getUser();
  return user.lastStudyDate !== getTodayKey();
}

/**
 * 스트릭 보너스 XP 계산
 */
export function getStreakBonusXp() {
  const user = getUser();
  return Math.min(user.streak, 30) * XP_REWARDS.STREAK_BONUS;
}

// ─── Stats Helpers ──────────────────────────────────────

/**
 * 정답률 계산
 */
export function getAccuracy() {
  const user = getUser();
  if (user.totalReviews === 0) return 0;
  return Math.round((user.totalCorrect / user.totalReviews) * 100);
}

/**
 * 레벨 뱃지 이모지
 */
export function getLevelBadge(level) {
  if (level >= 40) return '👑';
  if (level >= 30) return '💎';
  if (level >= 20) return '🏆';
  if (level >= 10) return '⭐';
  if (level >= 5) return '🌟';
  return '🌱';
}

/**
 * 레벨 타이틀
 */
export function getLevelTitle(level) {
  if (level >= 45) return '어학 마스터';
  if (level >= 40) return '단어 대왕';
  if (level >= 35) return '어휘 달인';
  if (level >= 30) return '언어 전문가';
  if (level >= 25) return '숙련 학습자';
  if (level >= 20) return '중급 학습자';
  if (level >= 15) return '열심 학습자';
  if (level >= 10) return '도전 학습자';
  if (level >= 5) return '성장 학습자';
  return '초보 학습자';
}
