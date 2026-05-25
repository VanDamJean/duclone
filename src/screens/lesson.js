/**
 * lesson.js — 레슨 화면
 * 신규 단어 학습 + 복습을 하나의 세션으로 진행
 */

import { getTodaySession, processReview, previewSchedule } from '../lib/scheduler.js';
import { generateSessionQuizzes, QuizType } from '../lib/quizEngine.js';
import { calculateCorrectXp, calculateLessonCompleteXp, awardXp, updateStreak, isFirstStudyToday } from '../lib/gamification.js';
import { awardAnswerLp, awardLessonCompleteLp, canClaimAdReward, claimAdReward, getLeagueRewards } from '../lib/league.js';
import { updateTodayStats, addReviewLog } from '../lib/storage.js';
import { playCorrect, playWrong, playComplete, playClick, playFlip, speakWord, initAudio } from '../lib/sounds.js';
import { isAcceptedAnswer, getDisplayWord, getSpeakText } from '../lib/wordPresentation.js';
import { launchConfetti, miniConfetti } from '../components/confetti.js';
import { showToast, showXpToast, showLevelUpToast, showStreakToast } from '../components/toast.js';
import { hideNavbar, showNavbar } from '../components/navbar.js';

let currentSession = null;
let currentQuizIndex = 0;
let combo = 0;
let sessionCorrect = 0;
let sessionTotal = 0;
let sessionXp = 0;
let sessionLp = 0;
let sessionCompleteAwarded = false;
let answered = false;

/**
 * 레슨 화면 렌더링
 */
export function renderLesson(container, navigate) {
  initAudio();
  hideNavbar();

  // 세션 구성
  const session = getTodaySession();
  
  if (session.cards.length === 0) {
    renderNoCards(container, navigate);
    return;
  }

  currentSession = session;
  const quizzes = generateSessionQuizzes(session.cards);
  currentQuizIndex = 0;
  combo = 0;
  sessionCorrect = 0;
  sessionTotal = quizzes.length;
  sessionXp = 0;
  sessionLp = 0;
  sessionCompleteAwarded = false;
  answered = false;

  // 첫 학습 스트릭 업데이트
  if (isFirstStudyToday()) {
    const streakResult = updateStreak();
    if (streakResult.isNew && streakResult.streak > 1) {
      setTimeout(() => showStreakToast(streakResult.streak), 500);
    }
  }

  renderQuiz(container, navigate, quizzes);
}

function renderNoCards(container, navigate) {
  showNavbar();
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">🎉</div>
      <div class="empty-title">오늘 학습 완료!</div>
      <div class="empty-desc">내일 새로운 단어가 준비됩니다</div>
      <button class="btn btn-primary btn-full" style="margin-top: 24px" id="back-home">홈으로</button>
    </div>
  `;
  document.getElementById('back-home')?.addEventListener('click', () => navigate('home'));
}

function renderQuiz(container, navigate, quizzes) {
  if (currentQuizIndex >= quizzes.length) {
    renderComplete(container, navigate);
    return;
  }

  const quiz = quizzes[currentQuizIndex];
  const progress = (currentQuizIndex) / quizzes.length;

  container.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-progress">
        <button class="back-btn" id="quiz-close" aria-label="닫기">✕</button>
        <div class="progress-bar-container" style="flex:1">
          <div class="progress-bar-fill" style="width: ${progress * 100}%"></div>
        </div>
        <span class="quiz-progress-text">${currentQuizIndex + 1}/${quizzes.length}</span>
      </div>
      <div class="quiz-body" id="quiz-body"></div>
      <div class="quiz-footer" id="quiz-footer"></div>
    </div>
  `;

  const body = document.getElementById('quiz-body');
  const footer = document.getElementById('quiz-footer');

  switch (quiz.type) {
    case QuizType.FLASHCARD:
      renderFlashcardQuiz(container, body, footer, quiz, navigate, quizzes);
      break;
    case QuizType.MULTIPLE_CHOICE:
      renderMultipleChoiceQuiz(container, body, footer, quiz, navigate, quizzes);
      break;
    case QuizType.FILL_BLANK:
      renderFillBlankQuiz(container, body, footer, quiz, navigate, quizzes);
      break;
    case QuizType.MATCHING:
      renderMatchingQuiz(container, body, footer, quiz, navigate, quizzes);
      break;
    default:
      renderMultipleChoiceQuiz(container, body, footer, quiz, navigate, quizzes);
  }

  // 닫기 버튼
  document.getElementById('quiz-close')?.addEventListener('click', () => {
    if (confirm('학습을 중단하시겠어요? 진행 상황은 저장됩니다.')) {
      showNavbar();
      navigate('home');
    }
  });
}

// ─── Flashcard Quiz ─────────────────────────────────────

function renderFlashcardQuiz(container, body, footer, quiz, navigate, quizzes) {
  answered = false;

  // 새 단어 뱃지
  const newBadge = quiz.isNew ? '<div class="new-word-badge">✨ 새 단어</div>' : '';

  body.innerHTML = `
    ${newBadge}
    <div class="flashcard" id="flashcard">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="word">${quiz.front.text}</div>
          <div class="pronunciation">${quiz.front.sub}</div>
          <div class="pos">${quiz.front.partOfSpeech}</div>
          <button class="speaker-btn" id="speak-btn">🔊</button>
          <div class="tap-hint">탭해서 뜻 확인</div>
        </div>
        <div class="flashcard-back">
          <div class="meaning">${quiz.back.meaning}</div>
          <div class="example">${quiz.back.example}</div>
          <div class="example-ko">${quiz.back.exampleKo}</div>
        </div>
      </div>
    </div>
  `;

  footer.innerHTML = `
    <div id="flashcard-actions" style="display: none">
      <div style="text-align:center; margin-bottom:12px; font-size:0.85rem; color:var(--text-secondary); font-weight:600">얼마나 알고 있었나요?</div>
      <div class="flashcard-ratings" id="rating-buttons"></div>
    </div>
  `;

  // 플래시카드 플립
  const flashcard = document.getElementById('flashcard');
  flashcard?.addEventListener('click', () => {
    if (answered) return;
    flashcard.classList.toggle('flipped');
    playFlip();
    
    if (flashcard.classList.contains('flipped')) {
      document.getElementById('flashcard-actions').style.display = 'block';
      renderRatingButtons(container, quiz, navigate, quizzes);
    }
  });

  // TTS
  document.getElementById('speak-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    speakWord(getSpeakText(quiz.word));
  });
}

function renderRatingButtons(parentContainer, quiz, navigate, quizzes) {
  if (!quiz.wordId) return;
  
  const preview = previewSchedule(quiz.wordId);
  const container = document.getElementById('rating-buttons');
  if (!container) return;

  const ratings = [
    { rating: 1, label: '모름', cls: 'again', interval: preview.again },
    { rating: 2, label: '어려움', cls: 'hard', interval: preview.hard },
    { rating: 3, label: '알겠음', cls: 'good', interval: preview.good },
    { rating: 4, label: '쉬움', cls: 'easy', interval: preview.easy },
  ];

  container.innerHTML = ratings.map(r => `
    <button class="rating-btn ${r.cls}" data-rating="${r.rating}">
      <span>${r.label}</span>
      <span class="rating-interval">${r.interval}</span>
    </button>
  `).join('');

  container.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      
      const rating = parseInt(btn.dataset.rating);
      handleAnswer(parentContainer, quiz, rating >= 3, rating, navigate, quizzes, btn);
    });
  });
}

// ─── Multiple Choice Quiz ───────────────────────────────

function renderMultipleChoiceQuiz(container, body, footer, quiz, navigate, quizzes) {
  answered = false;

  const directionLabel = quiz.direction === 'word_to_ko' ? '이 단어의 뜻은?' : '이 뜻의 단어는?';
  const newBadge = quiz.isNew ? '<div class="new-word-badge">✨ 새 단어</div>' : '';

  body.innerHTML = `
    <div class="quiz-question">
      ${newBadge}
      <div class="word">${quiz.question}</div>
      ${quiz.questionSub ? `<div class="pronunciation">${quiz.questionSub}</div>` : ''}
      <div class="meaning-prompt">${directionLabel}</div>
      ${quiz.direction === 'word_to_ko' ? `<button class="speaker-btn" id="speak-btn">🔊</button>` : ''}
    </div>
    <div class="quiz-options" id="quiz-options">
      ${quiz.options.map((opt, i) => `
        <button class="quiz-option" data-index="${i}" id="option-${i}">
          ${opt}
        </button>
      `).join('')}
    </div>
  `;

  footer.innerHTML = '';

  // TTS
  document.getElementById('speak-btn')?.addEventListener('click', () => {
    speakWord(getSpeakText(quiz.word));
  });

  // 자동 TTS (새 단어)
  if (quiz.isNew && quiz.direction === 'word_to_ko') {
    setTimeout(() => speakWord(getSpeakText(quiz.word)), 300);
  }

  // 옵션 클릭
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;

      const index = parseInt(btn.dataset.index);
      const isCorrect = index === quiz.correctIndex;

      // 모든 옵션 비활성화
      document.querySelectorAll('.quiz-option').forEach(o => o.classList.add('disabled'));

      // 정답/오답 표시
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      btn.querySelector('.option-indicator')?.remove();
      btn.innerHTML += `<span class="option-indicator">${isCorrect ? '✓' : '✗'}</span>`;

      // 정답 항상 표시
      if (!isCorrect) {
        const correctBtn = document.getElementById(`option-${quiz.correctIndex}`);
        if (correctBtn) {
          correctBtn.classList.add('correct');
          correctBtn.innerHTML += `<span class="option-indicator">✓</span>`;
        }
      }

      const rating = isCorrect ? 3 : 1;
      handleAnswer(container, quiz, isCorrect, rating, navigate, quizzes, btn);
    });
  });
}

// ─── Fill Blank Quiz ────────────────────────────────────

function renderFillBlankQuiz(container, body, footer, quiz, navigate, quizzes) {
  // 빈칸 채우기가 아닌 경우 (폴백)
  if (quiz.type !== QuizType.FILL_BLANK) {
    renderMultipleChoiceQuiz(container, body, footer, quiz, navigate, quizzes);
    return;
  }

  answered = false;

  body.innerHTML = `
    <div class="quiz-question">
      <div class="meaning-prompt" style="margin-bottom:12px">빈칸에 알맞은 단어를 입력하세요</div>
      <div class="fill-blank-meaning">${quiz.meaning}</div>
    </div>
    <div class="fill-blank-sentence" id="fill-sentence">
      ${quiz.sentence.replace('________', '<span class="blank" id="blank-display"></span>')}
    </div>
    <div class="fill-blank-input-area">
      <input type="text" class="fill-blank-input" id="fill-input" 
             placeholder="단어를 입력하세요" 
             autocomplete="off" autocapitalize="off" spellcheck="false">
      <div class="fill-blank-hint" id="fill-hint">힌트: ${quiz.hint}</div>
    </div>
  `;

  footer.innerHTML = `
    <button class="btn btn-primary btn-full" id="fill-submit">확인</button>
  `;

  const input = document.getElementById('fill-input');
  const submitBtn = document.getElementById('fill-submit');

  input?.focus();

  const submit = () => {
    if (answered) return;
    const userAnswer = input.value.trim();
    if (!userAnswer) return;
    
    answered = true;
    const isCorrect = isAcceptedAnswer(userAnswer, quiz.word);

    input.classList.add(isCorrect ? 'correct' : 'wrong');
    input.disabled = true;

    const blankDisplay = document.getElementById('blank-display');
    if (blankDisplay) {
      blankDisplay.textContent = getDisplayWord(quiz.word);
      blankDisplay.style.color = isCorrect ? 'var(--correct)' : 'var(--wrong)';
    }

    const rating = isCorrect ? 3 : 1;
    handleAnswer(container, quiz, isCorrect, rating, navigate, quizzes);
  };

  submitBtn?.addEventListener('click', submit);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
}

// ─── Matching Quiz ──────────────────────────────────────

function renderMatchingQuiz(container, body, footer, quiz, navigate, quizzes) {
  answered = false;
  let selectedWord = null;
  let matchedCount = 0;
  const totalPairs = quiz.words.length;

  body.innerHTML = `
    <div class="quiz-question">
      <div class="meaning-prompt">단어와 뜻을 연결하세요</div>
    </div>
    <div class="matching-container">
      <div class="matching-column" id="matching-words">
        ${quiz.words.map(w => `
          <button class="matching-item word-item" data-id="${w.id}" data-type="word">${w.text}</button>
        `).join('')}
      </div>
      <div class="matching-column" id="matching-meanings">
        ${quiz.meanings.map(m => `
          <button class="matching-item meaning-item" data-id="${m.id}" data-type="meaning">${m.text}</button>
        `).join('')}
      </div>
    </div>
  `;

  footer.innerHTML = '';

  document.querySelectorAll('.matching-item').forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('matched')) return;

      const type = item.dataset.type;
      const id = item.dataset.id;

      if (type === 'word') {
        // 단어 선택
        document.querySelectorAll('.word-item').forEach(w => w.classList.remove('selected'));
        item.classList.add('selected');
        selectedWord = id;
        playClick();
      } else if (type === 'meaning' && selectedWord) {
        // 뜻과 매칭 시도
        if (id === selectedWord) {
          // 정답!
          const wordEl = document.querySelector(`.word-item[data-id="${id}"]`);
          wordEl?.classList.add('matched');
          wordEl?.classList.remove('selected');
          item.classList.add('matched');
          matchedCount++;
          playCorrect();
          miniConfetti(item);

          selectedWord = null;

          if (matchedCount === totalPairs) {
            // 모든 매칭 완료
            setTimeout(() => {
              handleAnswer(container, quiz, true, 3, navigate, quizzes);
            }, 600);
          }
        } else {
          // 오답
          item.classList.add('wrong-match');
          playWrong();
          setTimeout(() => {
            item.classList.remove('wrong-match');
          }, 400);
        }
      }
    });
  });
}

// ─── Common Answer Handler ──────────────────────────────

function handleAnswer(container, quiz, isCorrect, rating, navigate, quizzes, clickedEl = null) {
  if (isCorrect) {
    combo++;
    sessionCorrect++;
    playCorrect();
    if (clickedEl) miniConfetti(clickedEl);
  } else {
    combo = 0;
    playWrong();
  }

  // FSRS 리뷰 처리 (매칭 퀴즈는 제외)
  if (quiz.wordId) {
    const result = processReview(quiz.wordId, rating);
    addReviewLog({
      wordId: quiz.wordId,
      rating,
      isCorrect,
      quizType: quiz.type,
      scheduledDays: result.scheduledDays,
    });
  }

  // XP 부여
  const xpResult = calculateCorrectXp(combo);
  const earnedXp = isCorrect ? xpResult.xp : 0;
  const earnedLp = awardAnswerLp(isCorrect);
  sessionLp += earnedLp;
  if (earnedXp > 0) {
    const award = awardXp(earnedXp);
    sessionXp += earnedXp;
    
    if (award.leveledUp) {
      setTimeout(() => showLevelUpToast(award.newLevel), 500);
    }
  }

  // 오늘 통계 업데이트
  updateTodayStats({
    reviews: currentQuizIndex + 1,
    correct: sessionCorrect,
  });

  // 피드백 표시
  const footer = document.getElementById('quiz-footer');
  if (footer && quiz.type !== QuizType.MATCHING) {
    let feedbackHtml = '';
    
    if (quiz.type === QuizType.FLASHCARD) {
      const intervalStr = rating === 1 ? '1분 뒤' : rating === 2 ? '6분 뒤' : rating === 3 ? '10분 뒤' : '6일 뒤';
      const title = rating === 1 ? '🔄 복습 예정' : rating === 2 ? '⚠️ 조금 어려움' : rating === 3 ? '✅ 기억함' : '🎉 아주 쉬움';
      const detail = rating >= 3 ? `+${earnedXp} XP (${intervalStr} 복습)` : `${intervalStr} 다시 나옵니다`;
      const btnClass = rating >= 3 ? 'btn-correct' : 'btn-wrong';
      
      feedbackHtml = `
        <div class="quiz-feedback ${rating >= 3 ? 'correct' : 'wrong'}">
          <div class="feedback-title">${title}</div>
          <div class="feedback-detail">${detail}</div>
        </div>
        <button class="btn ${btnClass} btn-full" id="next-btn">
          ${currentQuizIndex + 1 >= quizzes.length ? '결과 보기' : '다음'}
        </button>
      `;
    } else {
      feedbackHtml = `
        <div class="quiz-feedback ${isCorrect ? 'correct' : 'wrong'}">
          <div class="feedback-title">${isCorrect ? (combo >= 3 ? `🔥 ${combo}연속 정답!` : '✅ 정답!') : '❌ 오답'}</div>
          <div class="feedback-detail">${isCorrect 
            ? (earnedXp > 0 ? `+${earnedXp} XP` : '') 
            : `정답: ${quiz.word?.meaning || ''}`}
          </div>
        </div>
        <button class="btn ${isCorrect ? 'btn-correct' : 'btn-wrong'} btn-full" id="next-btn">
          ${currentQuizIndex + 1 >= quizzes.length ? '결과 보기' : '다음'}
        </button>
      `;
    }
    footer.innerHTML = feedbackHtml;

    document.getElementById('next-btn')?.addEventListener('click', () => {
      currentQuizIndex++;
      renderQuiz(container, navigate, quizzes);
    });
  } else if (quiz.type === QuizType.MATCHING) {
    // 매칭은 자동 전환
    currentQuizIndex++;
    renderQuiz(container, navigate, quizzes);
  }
}

// ─── Lesson Complete Screen ─────────────────────────────

function renderComplete(container, navigate) {
  let award = { leveledUp: false };
  if (!sessionCompleteAwarded) {
    const completeXp = calculateLessonCompleteXp(sessionCorrect, sessionTotal);
    award = awardXp(completeXp.xp);
    sessionXp += completeXp.xp;
    const completeLp = awardLessonCompleteLp({ perfect: sessionCorrect === sessionTotal });
    sessionLp += completeLp;
    sessionCompleteAwarded = true;
  }
  const leagueReward = getLeagueRewards();

  // 통계 최종 업데이트
  updateTodayStats({
    reviews: sessionTotal,
    correct: sessionCorrect,
    xpEarned: sessionXp,
    completed: true,
  });

  playComplete();
  setTimeout(() => launchConfetti(50), 300);

  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;

  container.innerHTML = `
    <div class="lesson-complete">
      <div class="complete-emoji">🎉</div>
      <div class="complete-title">레슨 완료!</div>
      <div class="complete-subtitle">대단해요! 오늘도 한 단계 성장했어요</div>

      <div class="complete-stats">
        <div class="complete-stat">
          <div class="cs-value">${sessionCorrect}/${sessionTotal}</div>
          <div class="cs-label">정답</div>
        </div>
        <div class="complete-stat">
          <div class="cs-value">${accuracy}%</div>
          <div class="cs-label">정답률</div>
        </div>
        <div class="complete-stat">
          <div class="cs-value">${combo}</div>
          <div class="cs-label">최고 콤보</div>
        </div>
      </div>

      <div class="xp-earned">
        <span class="xp-icon">⚡</span>
        <span class="xp-text">+${sessionXp} XP 획득!</span>
      </div>

      <div class="lp-earned">
        <span class="lp-icon">🏆</span>
        <span class="lp-text">+${sessionLp} LP 리그 점수</span>
      </div>

      <button class="btn btn-secondary btn-full" id="complete-ad" ${canClaimAdReward() ? '' : 'disabled'} style="margin-bottom: 12px">
        ${canClaimAdReward() ? `광고 보고 +${leagueReward.ad} LP 받기` : '오늘 광고 보상 완료'}
      </button>

      <button class="btn btn-primary btn-full" id="complete-home" style="margin-bottom: 12px">홈으로</button>
      <button class="btn btn-secondary btn-full" id="complete-more">추가 학습하기</button>
    </div>
  `;

  showNavbar();

  if (award.leveledUp) {
    setTimeout(() => showLevelUpToast(award.newLevel), 1000);
  }

  document.getElementById('complete-ad')?.addEventListener('click', () => {
    const result = claimAdReward();
    if (!result.claimed) return;
    sessionLp += result.amount;
    showToast(`광고 보너스 +${result.amount} LP`, '🎁');
    renderComplete(container, navigate);
  });

  document.getElementById('complete-home')?.addEventListener('click', () => navigate('home'));
  document.getElementById('complete-more')?.addEventListener('click', () => {
    currentQuizIndex = 0;
    combo = 0;
    sessionCorrect = 0;
    sessionXp = 0;
    sessionLp = 0;
    sessionCompleteAwarded = false;
    renderLesson(container, navigate);
  });
}
