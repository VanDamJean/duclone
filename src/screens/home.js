/**
 * home.js — 홈 화면
 * 오늘의 학습 현황, 스트릭, XP, 레벨 표시
 */

import { getUser, getTodayStats, getSettings, getCurrentLanguage, setCurrentLanguage } from '../lib/storage.js';
import { getDueCards, getNewWords, getOverallProgress } from '../lib/scheduler.js';
import { getLanguageSummaries } from '../data/wordData.js';
import { calculateLevel, getLevelProgress, getXpToNextLevel, getLevelBadge, getLevelTitle, getAccuracy } from '../lib/gamification.js';
import { createProgressBar } from '../components/progressBar.js';
import { initAudio } from '../lib/sounds.js';

/**
 * 홈 화면 렌더링
 * @param {HTMLElement} container
 * @param {Function} navigate - 화면 전환 함수
 */
export function renderHome(container, navigate) {
  const user = getUser();
  const todayStats = getTodayStats();
  const settings = getSettings();
  const dueCards = getDueCards();
  const newWords = getNewWords(user.dailyNewWordsLimit || 10);
  const progress = getOverallProgress();
  const level = calculateLevel(user.xp);
  const levelProgress = getLevelProgress(user.xp);
  const xpToNext = getXpToNextLevel(user.xp);

  // 인사 메시지
  const hour = new Date().getHours();
  let greeting = '좋은 아침이에요!';
  if (hour >= 12 && hour < 18) greeting = '좋은 오후예요!';
  if (hour >= 18) greeting = '좋은 저녁이에요!';

  const todayTotal = dueCards.length + newWords.length;
  const todayDone = todayStats.reviews || 0;
  const todayGoal = settings.dailyGoal || 15;
  const todayProgress = Math.min(1, todayDone / todayGoal);
  const isComplete = todayStats.completed || todayDone >= todayGoal;

  const lang = getCurrentLanguage();
  const languages = getLanguageSummaries();

  container.innerHTML = `
    <div class="home-screen">
      <div class="home-topbar">
        <select class="language-select" id="lang-select" aria-label="학습 언어 선택">
          <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English · ${languages.en.wordCount}</option>
          <option value="fr" ${lang === 'fr' ? 'selected' : ''}>🇫🇷 Français · ${languages.fr.wordCount}</option>
          <option value="ja" ${lang === 'ja' ? 'selected' : ''}>🇯🇵 日本語 · ${languages.ja.wordCount}</option>
        </select>
      </div>

      <!-- 인사 -->
      <div class="home-greeting animate-in">
        <div class="greeting-text">${greeting}</div>
        <div class="greeting-title">오늘도 단어를 배워볼까요? 💪</div>
      </div>

      <!-- 스트릭 & XP -->
      <div class="home-stats-row animate-in animate-in-delay-1">
        <div class="stat-card" id="stat-streak">
          <div class="stat-icon streak">🔥</div>
          <div>
            <div class="stat-value">${user.streak || 0}</div>
            <div class="stat-label">일 연속</div>
          </div>
        </div>
        <div class="stat-card" id="stat-xp">
          <div class="stat-icon xp">⚡</div>
          <div>
            <div class="stat-value">${user.xp || 0}</div>
            <div class="stat-label">총 XP</div>
          </div>
        </div>
      </div>

      <!-- 오늘의 학습 -->
      <div class="today-card animate-in animate-in-delay-2" id="today-card">
        <div class="today-label">오늘의 학습</div>
        <div class="today-title">${isComplete ? '🎉 오늘 학습 완료!' : `${todayGoal - todayDone}개 남았어요`}</div>
        <div class="today-progress">
          <div class="today-progress-fill" id="today-progress-fill" style="width: 0%"></div>
        </div>
        <div class="today-count">${todayDone} / ${todayGoal} 완료</div>
      </div>

      <!-- CTA 버튼 -->
      <div class="home-cta animate-in animate-in-delay-3">
        <button class="cta-button" id="start-lesson-btn">
          <span class="cta-icon">${isComplete ? '🔄' : dueCards.length > 0 ? '📝' : '🚀'}</span>
          ${isComplete ? '추가 학습하기' : dueCards.length > 0 ? '복습 시작하기' : '학습 시작하기'}
        </button>
      </div>

      <!-- 레벨 -->
      <div class="level-badge-container animate-in animate-in-delay-4">
        <div class="level-card">
          <div class="level-icon">${getLevelBadge(level)}</div>
          <div class="level-info">
            <div class="level-name">Lv.${level} ${getLevelTitle(level)}</div>
            <div class="level-title">다음 레벨까지 ${xpToNext} XP</div>
            <div class="level-xp-bar">
              <div class="level-xp-fill" id="level-xp-fill" style="width: 0%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 빠른 액션 -->
      <div class="quick-actions animate-in animate-in-delay-5">
        <button class="quick-action" id="qa-review">
          <span class="qa-icon">🔄</span>
          <span class="qa-label">복습하기</span>
          <span class="qa-count">${dueCards.length}개 대기</span>
        </button>
        <button class="quick-action" id="qa-wordbook">
          <span class="qa-icon">📖</span>
          <span class="qa-label">단어장</span>
          <span class="qa-count">${progress.learned}/${progress.total}</span>
        </button>
      </div>
    </div>
  `;

  // 애니메이션: 프로그레스 바
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const fill = document.getElementById('today-progress-fill');
      if (fill) fill.style.width = `${todayProgress * 100}%`;
      
      const xpFill = document.getElementById('level-xp-fill');
      if (xpFill) xpFill.style.width = `${levelProgress * 100}%`;
    });
  });

  // 이벤트: 학습 시작
  document.getElementById('start-lesson-btn')?.addEventListener('click', () => {
    initAudio();
    navigate('lesson');
  });

  // 이벤트: 복습
  document.getElementById('qa-review')?.addEventListener('click', () => {
    initAudio();
    if (dueCards.length > 0) {
      navigate('review');
    } else {
      navigate('lesson');
    }
  });

  // 이벤트: 단어장
  document.getElementById('qa-wordbook')?.addEventListener('click', () => {
    navigate('wordbook');
  });

  // 이벤트: 언어 변경
  document.getElementById('lang-select')?.addEventListener('change', (e) => {
    if (e.target.value === getCurrentLanguage()) return;
    setCurrentLanguage(e.target.value);
    window.location.reload(); // 강제 리로드로 전체 상태 리셋 및 렌더링
  });
}
