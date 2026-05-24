/**
 * quizEngine.js — 퀴즈 생성 엔진
 * 카드 상태에 따라 적절한 퀴즈 타입을 선택하고 문제를 생성합니다.
 */

import { wordData } from '../data/wordData.js';
import { getAllCards } from './storage.js';
import { State } from 'ts-fsrs';

/**
 * 퀴즈 타입 enum
 */
export const QuizType = {
  FLASHCARD: 'flashcard',
  MULTIPLE_CHOICE: 'multiple_choice',
  FILL_BLANK: 'fill_blank',
  MATCHING: 'matching',
};

/**
 * 카드 상태에 따라 적절한 퀴즈 타입 선택
 * @param {Object} cardState - FSRS 카드 상태 (null이면 신규)
 * @param {boolean} isNew - 이 세션에서 처음 보는 단어인지
 * @returns {string} QuizType
 */
export function selectQuizType(cardState, isNew) {
  if (isNew || !cardState) {
    // 신규 단어: 플래시카드 → 객관식 순서
    return Math.random() < 0.6 ? QuizType.FLASHCARD : QuizType.MULTIPLE_CHOICE;
  }

  const state = cardState.state;

  if (state === State.Learning || state === State.Relearning) {
    // 아직 배우는 중: 객관식 위주
    return Math.random() < 0.7 ? QuizType.MULTIPLE_CHOICE : QuizType.FLASHCARD;
  }

  if (state === State.Review) {
    const stability = cardState.stability || 0;
    
    if (stability < 7) {
      // 안정도 낮음: 객관식 / 빈칸
      return Math.random() < 0.5 ? QuizType.MULTIPLE_CHOICE : QuizType.FILL_BLANK;
    }
    
    // 잘 아는 단어: 빈칸 채우기 위주 (더 어려운 테스트)
    const r = Math.random();
    if (r < 0.5) return QuizType.FILL_BLANK;
    if (r < 0.8) return QuizType.MULTIPLE_CHOICE;
    return QuizType.FLASHCARD;
  }

  return QuizType.MULTIPLE_CHOICE;
}

/**
 * 객관식 퀴즈 생성
 * @param {Object} targetWord - 정답 단어 객체
 * @returns {{ question: string, options: Array, correctIndex: number, word: Object }}
 */
export function generateMultipleChoice(targetWord) {
  // 방향 결정: 영어→한국어 vs 한국어→영어
  const isEnToKo = Math.random() < 0.6;

  // 오답 보기 3개 생성 (같은 품사에서 우선 선택)
  const distractors = getDistractors(targetWord, 3);

  // 보기 배열 구성
  const options = [...distractors, targetWord];
  shuffleArray(options);

  const correctIndex = options.findIndex(o => o.id === targetWord.id);

  if (isEnToKo) {
    return {
      type: QuizType.MULTIPLE_CHOICE,
      direction: 'en_to_ko',
      question: targetWord.word,
      questionSub: targetWord.pronunciation,
      options: options.map(o => o.meaning),
      correctIndex,
      word: targetWord,
    };
  } else {
    return {
      type: QuizType.MULTIPLE_CHOICE,
      direction: 'ko_to_en',
      question: targetWord.meaning,
      questionSub: null,
      options: options.map(o => o.word),
      correctIndex,
      word: targetWord,
    };
  }
}

/**
 * 플래시카드 퀴즈 생성
 */
export function generateFlashcard(targetWord) {
  return {
    type: QuizType.FLASHCARD,
    word: targetWord,
    front: {
      text: targetWord.word,
      sub: targetWord.pronunciation,
      partOfSpeech: targetWord.partOfSpeech,
    },
    back: {
      meaning: targetWord.meaning,
      example: targetWord.example,
      exampleKo: targetWord.exampleKo,
    },
  };
}

/**
 * 빈칸 채우기 퀴즈 생성
 */
export function generateFillBlank(targetWord) {
  // 예문에서 단어를 빈칸으로 대체
  const sentence = targetWord.example;
  const wordRegex = new RegExp(`\\b${escapeRegex(targetWord.word)}\\b`, 'gi');
  
  // 단어의 다양한 형태도 찾기 (ing, ed, s, es 등)
  let blankSentence = sentence;
  let found = false;
  
  if (wordRegex.test(sentence)) {
    blankSentence = sentence.replace(wordRegex, '________');
    found = true;
  }
  
  if (!found) {
    // 원형이 직접 안 나오면, 부분 매칭 시도
    const stem = targetWord.word.toLowerCase();
    const words = sentence.split(' ');
    blankSentence = words.map(w => {
      if (w.toLowerCase().startsWith(stem) || stem.startsWith(w.toLowerCase().replace(/[^a-z]/g, ''))) {
        found = true;
        return '________';
      }
      return w;
    }).join(' ');
  }

  if (!found) {
    // 매칭 실패 시 객관식으로 폴백
    return generateMultipleChoice(targetWord);
  }

  // 힌트: 첫 글자와 글자 수
  const hint = `${targetWord.word[0]}${'_'.repeat(targetWord.word.length - 1)} (${targetWord.word.length}글자)`;

  return {
    type: QuizType.FILL_BLANK,
    word: targetWord,
    sentence: blankSentence,
    sentenceKo: targetWord.exampleKo,
    answer: targetWord.word.toLowerCase(),
    hint,
    meaning: targetWord.meaning,
  };
}

/**
 * 매칭 퀴즈 생성 (여러 단어 짝짓기)
 * @param {Array<Object>} words - 4~5개 단어 배열
 */
export function generateMatching(words) {
  const selected = words.slice(0, Math.min(4, words.length));

  const pairs = selected.map(w => ({
    id: w.id,
    word: w.word,
    meaning: w.meaning,
  }));

  // 뜻 순서 섞기
  const shuffledMeanings = [...pairs];
  shuffleArray(shuffledMeanings);

  return {
    type: QuizType.MATCHING,
    words: pairs.map(p => ({ id: p.id, text: p.word })),
    meanings: shuffledMeanings.map(p => ({ id: p.id, text: p.meaning })),
  };
}

/**
 * 세션의 퀴즈 목록 생성
 * @param {Array} sessionCards - getTodaySession() 결과의 cards
 * @returns {Array} 퀴즈 배열
 */
export function generateSessionQuizzes(sessionCards) {
  const quizzes = [];

  for (let i = 0; i < sessionCards.length; i++) {
    const { wordId, card, word, isNew } = sessionCards[i];
    const cardState = isNew ? null : card;
    const quizType = selectQuizType(cardState, isNew);

    let quiz;
    switch (quizType) {
      case QuizType.FLASHCARD:
        quiz = generateFlashcard(word);
        break;
      case QuizType.MULTIPLE_CHOICE:
        quiz = generateMultipleChoice(word);
        break;
      case QuizType.FILL_BLANK:
        quiz = generateFillBlank(word);
        break;
      default:
        quiz = generateMultipleChoice(word);
    }

    quiz.index = i;
    quiz.wordId = wordId;
    quiz.isNew = isNew;
    quizzes.push(quiz);
  }

  // 4개 이상 쌓이면 중간에 매칭 퀴즈 삽입
  if (sessionCards.length >= 4) {
    const matchingWords = sessionCards
      .slice(0, 4)
      .map(c => c.word);
    
    const matchingQuiz = generateMatching(matchingWords);
    matchingQuiz.index = quizzes.length;
    matchingQuiz.wordId = null; // 매칭은 여러 단어
    matchingQuiz.isNew = false;
    
    // 4번째 위치에 삽입
    quizzes.splice(3, 0, matchingQuiz);
  }

  return quizzes;
}

// ─── Helpers ────────────────────────────────────────────

/**
 * 오답 보기용 단어 선택
 */
function getDistractors(targetWord, count) {
  // 같은 품사에서 우선 선택
  const samePOS = wordData.filter(
    w => w.id !== targetWord.id && w.partOfSpeech === targetWord.partOfSpeech
  );
  const others = wordData.filter(
    w => w.id !== targetWord.id && w.partOfSpeech !== targetWord.partOfSpeech
  );

  shuffleArray(samePOS);
  shuffleArray(others);

  const result = [];
  const pool = [...samePOS, ...others];
  
  for (const w of pool) {
    if (result.length >= count) break;
    // 의미가 너무 비슷한 단어 제외 (간단한 체크)
    if (w.meaning !== targetWord.meaning) {
      result.push(w);
    }
  }

  return result;
}

/**
 * Fisher-Yates 셔플
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 정규식 이스케이프
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
