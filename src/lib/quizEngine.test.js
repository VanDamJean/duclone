import { describe, it, expect, beforeEach } from 'vitest';
import { 
  selectQuizType, 
  generateMultipleChoice, 
  generateFlashcard, 
  generateFillBlank, 
  generateMatching,
  QuizType
} from './quizEngine.js';
import { State } from 'ts-fsrs';

describe('Quiz Engine Tests', () => {
  const dummyWord = {
    id: 'word_999',
    word: 'accomplish',
    meaning: '달성하다, 성취하다',
    pronunciation: '/əˈkɑːmplɪʃ/',
    partOfSpeech: 'verb',
    example: 'She accomplished her goal ahead of schedule.',
    exampleKo: '그녀는 예정보다 앞서 목표를 달성했다.',
    category: 'business',
    level: 1
  };

  describe('selectQuizType', () => {
    it('should select flashcard or multiple choice for new cards', () => {
      const types = new Set();
      for (let i = 0; i < 50; i++) {
        types.add(selectQuizType(null, true));
      }
      expect(types.has(QuizType.FLASHCARD)).toBe(true);
      expect(types.has(QuizType.MULTIPLE_CHOICE)).toBe(true);
      expect(types.has(QuizType.FILL_BLANK)).toBe(false);
    });

    it('should prioritize multiple choice for learning cards', () => {
      const cardState = { state: State.Learning };
      const types = new Set();
      for (let i = 0; i < 50; i++) {
        types.add(selectQuizType(cardState, false));
      }
      expect(types.has(QuizType.MULTIPLE_CHOICE)).toBe(true);
    });
  });

  describe('generateMultipleChoice', () => {
    it('should generate valid multiple choice options with 4 unique answers', () => {
      const quiz = generateMultipleChoice(dummyWord);
      expect(quiz.options.length).toBe(4);
      
      // Target word should be in options
      if (quiz.direction === 'en_to_ko') {
        expect(quiz.options).toContain(dummyWord.meaning);
        expect(quiz.question).toBe(dummyWord.word);
      } else {
        expect(quiz.options).toContain(dummyWord.word);
        expect(quiz.question).toBe(dummyWord.meaning);
      }
      
      // Ensure all options are unique
      const uniqueOptions = new Set(quiz.options);
      expect(uniqueOptions.size).toBe(4);
    });
  });

  describe('generateFlashcard', () => {
    it('should generate correct flashcard fields', () => {
      const quiz = generateFlashcard(dummyWord);
      expect(quiz.front.text).toBe(dummyWord.word);
      expect(quiz.back.meaning).toBe(dummyWord.meaning);
    });
  });

  describe('generateFillBlank', () => {
    it('should generate a sentence with masked blank', () => {
      const quiz = generateFillBlank(dummyWord);
      expect(quiz.type).toBe(QuizType.FILL_BLANK);
      expect(quiz.sentence).toContain('________');
      expect(quiz.answer).toBe(dummyWord.word.toLowerCase());
    });
  });

  describe('generateMatching', () => {
    it('should generate a matching structure with words and meanings', () => {
      const wordList = [
        { id: 'w1', word: 'apple', meaning: '사과' },
        { id: 'w2', word: 'banana', meaning: '바나나' },
        { id: 'w3', word: 'cherry', meaning: '체리' },
        { id: 'w4', word: 'date', meaning: '대추야자' }
      ];
      
      const quiz = generateMatching(wordList);
      expect(quiz.words.length).toBe(4);
      expect(quiz.meanings.length).toBe(4);
      
      // Words and meanings should contain same IDs
      const wordIds = quiz.words.map(w => w.id).sort();
      const meaningIds = quiz.meanings.map(m => m.id).sort();
      expect(wordIds).toEqual(['w1', 'w2', 'w3', 'w4']);
      expect(meaningIds).toEqual(['w1', 'w2', 'w3', 'w4']);
    });
  });
});
