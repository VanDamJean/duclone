/**
 * app.js — 앱 라우터 & 상태 관리
 * 화면 전환, 네비게이션, 앱 초기화를 담당합니다.
 */

import { renderNavbar, setActiveTab, showNavbar } from './components/navbar.js';
import { renderHome } from './screens/home.js';
import { renderLesson } from './screens/lesson.js';
import { renderReview } from './screens/review.js';
import { renderLeague } from './screens/league.js';
import { renderWordbook } from './screens/wordbook.js';
import { getDueCards } from './lib/scheduler.js';
import { setNavBadge } from './components/navbar.js';
import { getSettings } from './lib/storage.js';

let currentScreen = 'home';
let appContainer = null;

const screens = {
  home: renderHome,
  lesson: renderLesson,
  review: renderReview,
  league: renderLeague,
  wordbook: renderWordbook,
};

/**
 * 앱 초기화
 */
export function initApp() {
  appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('App container #app not found');
    return;
  }

  // 테마 적용
  const settings = getSettings();
  document.documentElement.setAttribute('data-theme', settings.theme || 'light');

  // 네비게이션 바 렌더링
  renderNavbar(navigate, 'home');

  // 복습 대기 뱃지
  updateBadges();

  // 홈 화면 렌더
  navigate('home');
}

/**
 * 화면 전환
 */
export function navigate(screenId) {
  const renderFn = screens[screenId];
  if (!renderFn) {
    console.warn(`Unknown screen: ${screenId}`);
    return;
  }

  currentScreen = screenId;
  
  // 네비바 탭 업데이트 (lesson/review 중에는 숨김)
  if (['home', 'league', 'wordbook'].includes(screenId)) {
    showNavbar();
    setActiveTab(screenId);
  } else if (screenId === 'lesson' || screenId === 'review') {
    // lesson/review 화면은 자체적으로 네비바 숨김 처리
    setActiveTab('lesson');
  }

  // 컨테이너 초기화
  appContainer.innerHTML = '';
  appContainer.scrollTop = 0;
  window.scrollTo(0, 0);

  // 화면 렌더링
  renderFn(appContainer, navigate);

  // 뱃지 업데이트
  updateBadges();
}

/**
 * 복습 대기 뱃지 업데이트
 */
function updateBadges() {
  const dueCards = getDueCards();
  setNavBadge('lesson', dueCards.length > 0);
}

/**
 * 현재 화면 ID 가져오기
 */
export function getCurrentScreen() {
  return currentScreen;
}
