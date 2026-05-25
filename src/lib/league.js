/**
 * league.js — weekly league ranking and rewarded ad state
 */

import { getTodayKey } from './storage.js';

const STORAGE_PREFIX = 'duo_';
const LEAGUE_KEY = `${STORAGE_PREFIX}league`;
const AD_REWARD_LP = 20;
const COMPLETE_LP = 10;
const PERFECT_LP = 10;
const CORRECT_LP = 2;

export const LEAGUES = ['Bronze', 'Silver', 'Gold', 'Sapphire', 'Ruby'];

const BOT_NAMES = [
  'Mina', 'Leo', 'Sofia', 'Ken', 'Ava', 'Noah', 'Yuna', 'Hugo', 'Emma', 'Luca',
  'Nina', 'Owen', 'Mika', 'Ivy', 'Theo', 'Lina', 'Kai', 'Zoe', 'Eli', 'Sara',
];
const BOT_AVATARS = ['🧑', '👩', '👨', '🧕', '👱', '🧔', '👩‍🦱', '👨‍🦱'];

function safeGet(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? defaultValue : JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('League storage write failed');
  }
}

export function getWeekKey(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diffToMonday);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededNumber(seed, min, max) {
  const x = Math.sin(seed) * 10000;
  const ratio = x - Math.floor(x);
  return Math.round(min + ratio * (max - min));
}

function createBots(weekKey) {
  const seedBase = hashString(weekKey);
  return BOT_NAMES.slice(0, 19).map((name, index) => {
    const seed = seedBase + index * 97;
    const styleRoll = seededNumber(seed, 1, 100);
    const pace = styleRoll > 88
      ? seededNumber(seed + 1, 70, 120)
      : styleRoll > 35
        ? seededNumber(seed + 2, 30, 60)
        : seededNumber(seed + 3, 10, 25);

    return {
      id: `bot_${index + 1}`,
      name,
      avatar: BOT_AVATARS[index % BOT_AVATARS.length],
      lp: seededNumber(seed + 4, 0, 25),
      pace,
    };
  });
}

function normalizeBots(league) {
  league.bots = (league.bots || []).map((bot, index) => ({
    ...bot,
    avatar: BOT_AVATARS[index % BOT_AVATARS.length],
  }));
  return league;
}

function createLeague({ tier = 0, weekKey = getWeekKey(), lastResult = null } = {}) {
  return {
    weekKey,
    tier,
    userLp: 0,
    adRewardClaimedDate: null,
    bots: createBots(weekKey),
    lastSimulatedAt: new Date().toISOString(),
    lastResult,
  };
}

function simulateBots(league) {
  const now = new Date();
  const last = new Date(league.lastSimulatedAt || now);
  const elapsedDays = Math.max(0, (now - last) / 86400000);
  if (elapsedDays <= 0) return league;

  league.bots = league.bots.map((bot, index) => {
    const drift = 0.75 + ((index % 5) * 0.12);
    return {
      ...bot,
      lp: Math.round(bot.lp + bot.pace * elapsedDays * drift),
    };
  });
  league.lastSimulatedAt = now.toISOString();
  return league;
}

function getLeaderboardForLeague(league) {
  const rows = [
    { id: 'user', name: 'You', avatar: '🧠', lp: league.userLp || 0, isUser: true },
    ...league.bots,
  ].sort((a, b) => b.lp - a.lp);

  return rows.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    zone: index < 5 ? 'promotion' : index >= 15 ? 'demotion' : 'stay',
  }));
}

function getTierDelta(zone, tier) {
  if (zone === 'promotion' && tier < LEAGUES.length - 1) return 1;
  if (zone === 'demotion' && tier > 0) return -1;
  return 0;
}

function finalizeWeek(league, nextWeekKey) {
  const leaderboard = getLeaderboardForLeague(league);
  const user = leaderboard.find((entry) => entry.isUser);
  const tierDelta = getTierDelta(user.zone, league.tier);
  const nextTier = Math.min(Math.max((league.tier || 0) + tierDelta, 0), LEAGUES.length - 1);

  return {
    weekKey: league.weekKey,
    nextWeekKey,
    rank: user.rank,
    lp: user.lp,
    zone: user.zone,
    tier: league.tier || 0,
    tierName: getLeagueName(league.tier || 0),
    nextTier,
    nextTierName: getLeagueName(nextTier),
    tierDelta,
  };
}

export function getLeague() {
  let league = safeGet(LEAGUE_KEY, null);
  const weekKey = getWeekKey();
  if (!league || league.weekKey !== weekKey) {
    const previous = league ? simulateBots(normalizeBots(league)) : null;
    const lastResult = previous ? finalizeWeek(previous, weekKey) : null;
    league = createLeague({
      weekKey,
      tier: lastResult?.nextTier || 0,
      lastResult,
    });
  }
  league = normalizeBots(league);
  league = simulateBots(league);
  safeSet(LEAGUE_KEY, league);
  return league;
}

export function saveLeague(league) {
  safeSet(LEAGUE_KEY, league);
}

export function getLeagueName(tier = getLeague().tier) {
  return LEAGUES[Math.min(Math.max(tier, 0), LEAGUES.length - 1)];
}

export function getLeaderboard() {
  const league = getLeague();
  return getLeaderboardForLeague(league);
}

export function getUserRank() {
  return getLeaderboard().find((entry) => entry.isUser);
}

export function addLeaguePoints(amount) {
  const league = getLeague();
  league.userLp = Math.max(0, (league.userLp || 0) + amount);
  saveLeague(league);
  return league.userLp;
}

export function awardAnswerLp(isCorrect) {
  if (!isCorrect) return 0;
  addLeaguePoints(CORRECT_LP);
  return CORRECT_LP;
}

export function awardLessonCompleteLp({ perfect = false } = {}) {
  const amount = COMPLETE_LP + (perfect ? PERFECT_LP : 0);
  addLeaguePoints(amount);
  return amount;
}

export function canClaimAdReward() {
  const league = getLeague();
  return league.adRewardClaimedDate !== getTodayKey();
}

export function claimAdReward() {
  const league = getLeague();
  const today = getTodayKey();
  if (league.adRewardClaimedDate === today) {
    return { claimed: false, amount: 0, totalLp: league.userLp || 0 };
  }
  league.adRewardClaimedDate = today;
  league.userLp = (league.userLp || 0) + AD_REWARD_LP;
  saveLeague(league);
  return { claimed: true, amount: AD_REWARD_LP, totalLp: league.userLp };
}

export function getLeagueRewards() {
  return {
    correct: CORRECT_LP,
    complete: COMPLETE_LP,
    perfect: PERFECT_LP,
    ad: AD_REWARD_LP,
  };
}

export function getLeagueCoach() {
  const league = getLeague();
  const rows = getLeaderboardForLeague(league);
  const user = rows.find((entry) => entry.isUser);
  const rewards = getLeagueRewards();

  if (user.zone === 'promotion') {
    const challenger = rows[5];
    const buffer = challenger ? Math.max(user.lp - challenger.lp + 1, 1) : 0;
    return {
      tone: 'promotion',
      title: '승급권이에요',
      body: challenger
        ? `6위보다 ${buffer} LP 앞서요. 오늘 레슨 하나만 더 하면 훨씬 안전해요.`
        : '이번 주 흐름이 좋아요. 짧게 한 번만 더 복습해도 유지가 쉬워요.',
      adCopy: `오늘 부스터 +${rewards.ad} LP`,
    };
  }

  if (user.zone === 'demotion') {
    const stayLine = rows[14];
    const needed = stayLine ? Math.max(stayLine.lp - user.lp + 1, 1) : rewards.complete;
    return {
      tone: 'demotion',
      title: '잔류권까지 조금 남았어요',
      body: `${needed} LP만 더 얻으면 강등권 밖으로 나갈 수 있어요.`,
      adCopy: `잔류 부스터 +${rewards.ad} LP`,
    };
  }

  const promotionLine = rows[4];
  const needed = promotionLine ? Math.max(promotionLine.lp - user.lp + 1, 1) : rewards.complete;
  return {
    tone: 'stay',
    title: '안정권이에요',
    body: `승급권까지 ${needed} LP. 정답 ${Math.ceil(needed / rewards.correct)}개 정도면 따라붙어요.`,
    adCopy: `승급 부스터 +${rewards.ad} LP`,
  };
}

export function getLastLeagueResult() {
  return getLeague().lastResult || null;
}

export function clearLastLeagueResult() {
  const league = getLeague();
  league.lastResult = null;
  saveLeague(league);
}
