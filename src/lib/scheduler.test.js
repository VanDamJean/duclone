import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getDueCards, 
  getNewWords, 
  getTodaySession, 
  processReview, 
  previewSchedule,
  getOverallProgress
} from './scheduler.js';
import { clearAllData, getAllCards, saveCard } from './storage.js';
import { wordData } from '../data/wordData.js';

describe('FSRS Scheduler Tests', () => {
  beforeEach(() => {
    clearAllData();
  });

  describe('getNewWords', () => {
    it('should return default limit of new words sorted by level', () => {
      const limit = 5;
      const list = getNewWords(limit);
      expect(list.length).toBe(limit);
      
      // Ensure sorted by level
      for (let i = 0; i < list.length - 1; i++) {
        expect(list[i].level).toBeLessThanOrEqual(list[i+1].level);
      }
    });
  });

  describe('getDueCards', () => {
    it('should return empty list when no cards exist', () => {
      expect(getDueCards().length).toBe(0);
    });

    it('should return cards that are due now or past due', () => {
      const wordId = wordData[0].id;
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 10); // 10 minutes ago
      
      saveCard(wordId, {
        wordId,
        due: pastDate.toISOString(),
        state: 0,
      });

      const due = getDueCards();
      expect(due.length).toBe(1);
      expect(due[0].wordId).toBe(wordId);
    });

    it('should exclude cards that are due in the future', () => {
      const wordId = wordData[0].id;
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() + 10); // 10 minutes in the future
      
      saveCard(wordId, {
        wordId,
        due: futureDate.toISOString(),
        state: 0,
      });

      expect(getDueCards().length).toBe(0);
    });
  });

  describe('getTodaySession', () => {
    it('should mix new words and review words appropriately', () => {
      const session = getTodaySession();
      expect(session.cards.length).toBeGreaterThan(0);
      expect(session.newCount).toBeGreaterThan(0);
      expect(session.reviewCount).toBe(0); // No review cards yet
    });
  });

  describe('processReview', () => {
    it('should schedule next review date using FSRS rating', () => {
      const wordId = wordData[0].id;
      const result = processReview(wordId, 3); // "Good"
      
      expect(result.card).toBeDefined();
      expect(result.card.wordId).toBe(wordId);
      expect(result.card.reps).toBe(1);
      
      const allCards = getAllCards();
      expect(allCards[wordId]).toBeDefined();
      expect(allCards[wordId].due).toBeDefined();
    });
  });
});
