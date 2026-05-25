import { describe, it, expect, beforeEach } from 'vitest';
import {
  addLeaguePoints,
  awardAnswerLp,
  awardLessonCompleteLp,
  canClaimAdReward,
  claimAdReward,
  getLeaderboard,
  getLeague,
  getLeagueName,
  getLeagueRewards,
  getUserRank,
  saveLeague,
} from './league.js';

describe('League system', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a weekly league with user plus 19 bots', () => {
    const league = getLeague();
    const leaderboard = getLeaderboard();

    expect(league.weekKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(leaderboard).toHaveLength(20);
    expect(leaderboard.some(entry => entry.isUser)).toBe(true);
  });

  it('adds answer and completion LP separately from XP', () => {
    expect(awardAnswerLp(true)).toBe(2);
    expect(awardAnswerLp(false)).toBe(0);
    expect(awardLessonCompleteLp({ perfect: true })).toBe(20);

    expect(getUserRank().lp).toBe(22);
  });

  it('allows rewarded ad LP once per day', () => {
    const rewards = getLeagueRewards();
    expect(canClaimAdReward()).toBe(true);

    const first = claimAdReward();
    const second = claimAdReward();

    expect(first.claimed).toBe(true);
    expect(first.amount).toBe(rewards.ad);
    expect(second.claimed).toBe(false);
    expect(getUserRank().lp).toBe(rewards.ad);
  });

  it('calculates rank after LP changes', () => {
    addLeaguePoints(10000);

    expect(getUserRank().rank).toBe(1);
    expect(getLeagueName(0)).toBe('Bronze');
    expect(getLeagueName(4)).toBe('Ruby');
  });

  it('rolls weekly results into the next league', () => {
    const league = getLeague();
    league.weekKey = '2000-01-03';
    league.tier = 0;
    league.userLp = 10000;
    saveLeague(league);

    const nextLeague = getLeague();

    expect(nextLeague.weekKey).not.toBe('2000-01-03');
    expect(nextLeague.tier).toBe(1);
    expect(nextLeague.lastResult.rank).toBe(1);
    expect(nextLeague.lastResult.tierDelta).toBe(1);
  });
});
