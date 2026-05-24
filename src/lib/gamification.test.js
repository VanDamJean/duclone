import { describe, it, expect, beforeEach } from 'vitest';
import { 
  calculateLevel, 
  getLevelProgress, 
  getXpToNextLevel, 
  calculateCorrectXp, 
  calculateLessonCompleteXp, 
  awardXp, 
  updateStreak, 
  isFirstStudyToday 
} from './gamification.js';
import { clearAllData, getUser } from './storage.js';

describe('Gamification System Tests', () => {
  beforeEach(() => {
    clearAllData();
  });

  describe('Level & XP Calculation', () => {
    it('should calculate correct level from XP', () => {
      expect(calculateLevel(0)).toBe(1);
      // Level 2 threshold is around 30 * 2^1.5 = 85 XP
      expect(calculateLevel(50)).toBe(1);
      expect(calculateLevel(90)).toBe(2);
    });

    it('should calculate progress towards next level', () => {
      // Level 1 progress
      expect(getLevelProgress(0)).toBe(0);
      expect(getLevelProgress(50)).toBeGreaterThan(0);
      expect(getLevelProgress(85)).toBe(0); // exactly at level 2 start (level 2 starts at 85 XP)
    });

    it('should return remaining XP to next level', () => {
      expect(getXpToNextLevel(0)).toBe(85); // level 2 is at 85 XP
    });
  });

  describe('XP Rewards Breakdown', () => {
    it('should reward correct answer XP and combo bonuses', () => {
      // Base XP
      const noCombo = calculateCorrectXp(0);
      expect(noCombo.xp).toBe(10);
      expect(noCombo.breakdown.base).toBe(10);

      // Combo >= 3
      const combo3 = calculateCorrectXp(3);
      expect(combo3.xp).toBe(15); // 10 base + 5 combo
      expect(combo3.breakdown.combo).toBe(5);

      const combo5 = calculateCorrectXp(5);
      expect(combo5.xp).toBe(25); // 10 base + 15 combo (min(5-2, 5) * 5 = 15)
      expect(combo5.breakdown.combo).toBe(15);
    });

    it('should reward lesson complete and perfect bonus', () => {
      const normalComplete = calculateLessonCompleteXp(12, 15);
      expect(normalComplete.xp).toBe(30);
      expect(normalComplete.breakdown.perfect).toBeUndefined();

      const perfectComplete = calculateLessonCompleteXp(15, 15);
      expect(perfectComplete.xp).toBe(80); // 30 complete + 50 perfect
      expect(perfectComplete.breakdown.perfect).toBe(50);
    });
  });

  describe('Streak System', () => {
    it('should detect if it is first study today', () => {
      expect(isFirstStudyToday()).toBe(true);
    });

    it('should initialize streak to 1 on first study', () => {
      const result = updateStreak();
      expect(result.streak).toBe(1);
      expect(result.isNew).toBe(true);
      expect(getUser().streak).toBe(1);
    });

    it('should prevent redundant streak updates on the same day', () => {
      updateStreak();
      const secondUpdate = updateStreak();
      expect(secondUpdate.isNew).toBe(false);
      expect(secondUpdate.streak).toBe(1);
    });
  });
});
