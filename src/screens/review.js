/**
 * review.js — 복습 전용 화면
 * FSRS가 추천한 복습 카드만 표시하는 플래시카드 모드
 */

import { getDueCards, processReview, previewSchedule } from '../lib/scheduler.js';
import { awardXp, calculateCorrectXp, updateStreak, isFirstStudyToday } from '../lib/gamification.js';
import { updateTodayStats, addReviewLog } from '../lib/storage.js';
import { playCorrect, playWrong, playComplete, playFlip, speakWord, initAudio } from '../lib/sounds.js';
import { launchConfetti } from '../components/confetti.js';
import { showStreakToast, showXpToast, showLevelUpToast } from '../components/toast.js';
import { hideNavbar, showNavbar } from '../components/navbar.js';

let currentIndex = 0;
let dueCards = [];
let reviewCorrect = 0;
let reviewXp = 0;
let flipped = false;

export function renderReview(container, navigate) {
  initAudio();
  hideNavbar();

  dueCards = getDueCards();
  currentIndex = 0;
  reviewCorrect = 0;
  reviewXp = 0;

  if (dueCards.length === 0) {
    showNavbar();
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✅</div>
        <div class="empty-title">복습할 단어가 없어요!</div>
        <div class="empty-desc">모든 복습을 완료했습니다. 새로운 단어를 배워보세요!</div>
        <button class="btn btn-primary btn-full" style="margin-top:24px" id="to-lesson">새 단어 학습하기</button>
        <button class="btn btn-secondary btn-full" style="margin-top:12px" id="to-home">홈으로</button>
      </div>
    `;
    document.getElementById('to-lesson')?.addEventListener('click', () => navigate('lesson'));
    document.getElementById('to-home')?.addEventListener('click', () => navigate('home'));
    return;
  }

  // 스트릭
  if (isFirstStudyToday()) {
    const streak = updateStreak();
    if (streak.isNew && streak.streak > 1) {
      setTimeout(() => showStreakToast(streak.streak), 500);
    }
  }

  renderCard(container, navigate);
}

function renderCard(container, navigate) {
  if (currentIndex >= dueCards.length) {
    renderReviewComplete(container, navigate);
    return;
  }

  flipped = false;
  const { word, card } = dueCards[currentIndex];
  const progress = currentIndex / dueCards.length;

  container.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-progress">
        <button class="back-btn" id="review-close">✕</button>
        <div class="progress-bar-container" style="flex:1">
          <div class="progress-bar-fill" style="width: ${progress * 100}%"></div>
        </div>
        <span class="quiz-progress-text">${currentIndex + 1}/${dueCards.length}</span>
      </div>

      <div class="quiz-body">
        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-bottom:8px">🔄 복습</div>
        
        <div class="flashcard" id="review-flashcard">
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <div class="word">${word.word}</div>
              <div class="pronunciation">${word.pronunciation}</div>
              <div class="pos">${word.partOfSpeech}</div>
              <button class="speaker-btn" id="speak-btn">🔊</button>
              <div class="tap-hint">탭해서 뜻 확인</div>
            </div>
            <div class="flashcard-back">
              <div class="meaning">${word.meaning}</div>
              <div class="example">${word.example}</div>
              <div class="example-ko">${word.exampleKo}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="quiz-footer" id="review-footer">
        <div style="text-align:center; font-size:0.85rem; color:var(--text-muted)">카드를 탭해서 뜻을 확인하세요</div>
      </div>
    </div>
  `;

  // 플래시카드 플립
  const flashcard = document.getElementById('review-flashcard');
  flashcard?.addEventListener('click', () => {
    if (flipped) return;
    flipped = true;
    flashcard.classList.add('flipped');
    playFlip();
    showRatingButtons(word, navigate);
  });

  // TTS
  document.getElementById('speak-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    speakWord(word.word);
  });

  // 닫기
  document.getElementById('review-close')?.addEventListener('click', () => {
    if (confirm('복습을 중단하시겠어요?')) {
      showNavbar();
      navigate('home');
    }
  });

  // 자동 TTS
  setTimeout(() => speakWord(word.word), 300);
}

function showRatingButtons(word, navigate) {
  const footer = document.getElementById('review-footer');
  if (!footer) return;

  const preview = previewSchedule(word.id);

  footer.innerHTML = `
    <div style="text-align:center; margin-bottom:12px; font-size:0.85rem; color:var(--text-secondary); font-weight:600">얼마나 기억하고 있었나요?</div>
    <div class="flashcard-ratings">
      <button class="rating-btn again" data-rating="1">
        <span>모름</span>
        <span class="rating-interval">${preview.again}</span>
      </button>
      <button class="rating-btn hard" data-rating="2">
        <span>어려움</span>
        <span class="rating-interval">${preview.hard}</span>
      </button>
      <button class="rating-btn good" data-rating="3">
        <span>알겠음</span>
        <span class="rating-interval">${preview.good}</span>
      </button>
      <button class="rating-btn easy" data-rating="4">
        <span>쉬움</span>
        <span class="rating-interval">${preview.easy}</span>
      </button>
    </div>
  `;

  footer.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rating = parseInt(btn.dataset.rating);
      const isCorrect = rating >= 3;

      if (isCorrect) {
        reviewCorrect++;
        playCorrect();
      } else {
        playWrong();
      }

      // FSRS 처리
      const result = processReview(word.id, rating);
      addReviewLog({
        wordId: word.id,
        rating,
        isCorrect,
        quizType: 'review_flashcard',
        scheduledDays: result.scheduledDays,
      });

      // XP
      if (isCorrect) {
        const xp = calculateCorrectXp(0);
        const award = awardXp(xp.xp);
        reviewXp += xp.xp;
        if (award.leveledUp) {
          setTimeout(() => showLevelUpToast(award.newLevel), 300);
        }
      }

      updateTodayStats({
        reviews: currentIndex + 1,
        correct: reviewCorrect,
      });

      currentIndex++;
      setTimeout(() => renderCard(document.getElementById('app'), navigate), 300);
    });
  });
}

function renderReviewComplete(container, navigate) {
  showNavbar();
  playComplete();
  setTimeout(() => launchConfetti(30), 200);

  const accuracy = dueCards.length > 0 ? Math.round((reviewCorrect / dueCards.length) * 100) : 0;

  container.innerHTML = `
    <div class="lesson-complete">
      <div class="complete-emoji">✅</div>
      <div class="complete-title">복습 완료!</div>
      <div class="complete-subtitle">잘하고 있어요! 기억이 더 단단해졌습니다</div>

      <div class="complete-stats">
        <div class="complete-stat">
          <div class="cs-value">${dueCards.length}</div>
          <div class="cs-label">복습 단어</div>
        </div>
        <div class="complete-stat">
          <div class="cs-value">${accuracy}%</div>
          <div class="cs-label">기억률</div>
        </div>
        <div class="complete-stat">
          <div class="cs-value">+${reviewXp}</div>
          <div class="cs-label">XP</div>
        </div>
      </div>

      <button class="btn btn-primary btn-full" style="margin-bottom:12px" id="review-home">홈으로</button>
    </div>
  `;

  document.getElementById('review-home')?.addEventListener('click', () => navigate('home'));
}
