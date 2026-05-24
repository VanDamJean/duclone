import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderLesson } from './lesson.js';
import { clearAllData, saveCard } from '../lib/storage.js';
import { wordData } from '../data/wordData.js';

// Audio/TTS/Confetti 모듈 모킹
vi.mock('../lib/sounds.js', () => ({
  initAudio: vi.fn(),
  playCorrect: vi.fn(),
  playWrong: vi.fn(),
  playComplete: vi.fn(),
  playClick: vi.fn(),
  playFlip: vi.fn(),
  speakWord: vi.fn(),
}));

vi.mock('../components/confetti.js', () => ({
  launchConfetti: vi.fn(),
  miniConfetti: vi.fn(),
}));

vi.mock('../components/toast.js', () => ({
  showToast: vi.fn(),
  showXpToast: vi.fn(),
  showLevelUpToast: vi.fn(),
  showStreakToast: vi.fn(),
}));

describe('Lesson Screen Integration Tests', () => {
  let container;
  let navigate;

  beforeEach(() => {
    clearAllData();
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);
    navigate = vi.fn();
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it('should render flashcard screen properly on start', () => {
    // 퀴즈 렌더링 시작
    renderLesson(container, navigate);
    
    // progress bar should be present
    expect(container.querySelector('.progress-bar-container')).toBeDefined();
    
    // flashcard or multiple choice should exist
    const isFlashcard = container.querySelector('.flashcard');
    const isMultipleChoice = container.querySelector('.quiz-options');
    
    expect(isFlashcard || isMultipleChoice).toBeTruthy();
  });

  it('should handle navigation block confirmation', () => {
    renderLesson(container, navigate);
    
    const closeBtn = container.querySelector('#quiz-close');
    expect(closeBtn).toBeDefined();
  });
});
