/**
 * storage.js — LocalStorage 기반 영속 저장소
 * 카드 상태, 사용자 진행상황, 통계 데이터를 관리합니다.
 */

const STORAGE_PREFIX = 'duo_';

export function getCurrentLanguage() {
  return safeGet(`${STORAGE_PREFIX}current_lang`, 'en');
}

export function setCurrentLanguage(lang) {
  safeSet(`${STORAGE_PREFIX}current_lang`, lang);
}

const KEYS = {
  get CARDS() { return `${STORAGE_PREFIX}${getCurrentLanguage()}_cards`; },
  USER: `${STORAGE_PREFIX}user`,
  STATS: `${STORAGE_PREFIX}stats`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  get REVIEW_LOG() { return `${STORAGE_PREFIX}${getCurrentLanguage()}_review_log`; },
};

/**
 * JSON 안전 직렬화/역직렬화
 */
function safeGet(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw, (k, v) => {
      // Date 문자열 자동 복원
      if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)) {
        const d = new Date(v);
        if (!isNaN(d.getTime())) return d;
      }
      return v;
    });
  } catch {
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.error('LocalStorage write failed');
    return false;
  }
}

// ─── Card State ─────────────────────────────────────────

/**
 * 모든 카드 상태 가져오기
 * @returns {Object<string, Object>} cardId -> FSRS card state
 */
export function getAllCards() {
  return safeGet(KEYS.CARDS, {});
}

/**
 * 특정 카드 상태 가져오기
 */
export function getCard(cardId) {
  const cards = getAllCards();
  return cards[cardId] || null;
}

/**
 * 카드 상태 저장 (단일)
 */
export function saveCard(cardId, cardState) {
  const cards = getAllCards();
  cards[cardId] = cardState;
  safeSet(KEYS.CARDS, cards);
}

/**
 * 여러 카드 상태 일괄 저장
 */
export function saveCards(cardStates) {
  const cards = getAllCards();
  Object.assign(cards, cardStates);
  safeSet(KEYS.CARDS, cards);
}

// ─── User Data ──────────────────────────────────────────

const DEFAULT_USER = {
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  totalWordsLearned: 0,
  totalReviews: 0,
  totalCorrect: 0,
  dailyNewWordsLimit: 10,
  createdAt: new Date().toISOString(),
};

export function getUser() {
  return safeGet(KEYS.USER, { ...DEFAULT_USER });
}

export function saveUser(userData) {
  safeSet(KEYS.USER, userData);
}

export function updateUser(partial) {
  const user = getUser();
  Object.assign(user, partial);
  safeSet(KEYS.USER, user);
  return user;
}

// ─── Daily Stats ────────────────────────────────────────

/**
 * 일별 통계 구조
 * { "2025-05-24": { newWords: 5, reviews: 12, correct: 10, xpEarned: 150, minutes: 8 } }
 */
export function getStats() {
  return safeGet(KEYS.STATS, {});
}

export function getTodayStats() {
  const stats = getStats();
  const today = getTodayKey();
  return stats[today] || { newWords: 0, reviews: 0, correct: 0, xpEarned: 0, minutes: 0, completed: false };
}

export function saveTodayStats(todayStats) {
  const stats = getStats();
  const today = getTodayKey();
  stats[today] = todayStats;
  safeSet(KEYS.STATS, stats);
}

export function updateTodayStats(partial) {
  const stats = getTodayStats();
  Object.assign(stats, partial);
  saveTodayStats(stats);
  return stats;
}

// ─── Review Log ─────────────────────────────────────────

export function getReviewLogs() {
  return safeGet(KEYS.REVIEW_LOG, []);
}

export function addReviewLog(log) {
  const logs = getReviewLogs();
  logs.push({
    ...log,
    timestamp: new Date().toISOString(),
  });
  // 최근 2000개만 유지
  if (logs.length > 2000) {
    logs.splice(0, logs.length - 2000);
  }
  safeSet(KEYS.REVIEW_LOG, logs);
}

// ─── Settings ───────────────────────────────────────────

const DEFAULT_SETTINGS = {
  theme: 'light',
  soundEnabled: true,
  ttsEnabled: true,
  dailyGoal: 15,
  targetRetention: 0.9,
};

export function getSettings() {
  return safeGet(KEYS.SETTINGS, { ...DEFAULT_SETTINGS });
}

export function saveSettings(settings) {
  safeSet(KEYS.SETTINGS, settings);
}

export function updateSettings(partial) {
  const settings = getSettings();
  Object.assign(settings, partial);
  safeSet(KEYS.SETTINGS, settings);
  return settings;
}

// ─── Helpers ────────────────────────────────────────────

export function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function clearAllData() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

/**
 * 전체 스토리지 사이즈 체크 (대략적)
 */
export function getStorageSize() {
  let total = 0;
  Object.values(KEYS).forEach((key) => {
    const item = localStorage.getItem(key);
    if (item) total += item.length * 2; // UTF-16
  });
  return total;
}
