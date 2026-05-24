/**
 * navbar.js — 하단 네비게이션 바
 */

const NAV_ITEMS = [
  { id: 'home',     icon: '🏠', label: '홈' },
  { id: 'lesson',   icon: '📚', label: '학습' },
  { id: 'stats',    icon: '📊', label: '통계' },
  { id: 'wordbook', icon: '📖', label: '단어장' },
];

let currentActive = 'home';

/**
 * 네비게이션 바 렌더링
 * @param {Function} onNavigate - 탭 클릭 시 콜백 (screenId)
 * @param {string} activeId - 현재 활성 탭
 */
export function renderNavbar(onNavigate, activeId = 'home') {
  currentActive = activeId;
  
  // 기존 네비바 제거
  const existing = document.querySelector('.bottom-nav');
  if (existing) existing.remove();

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', '메인 네비게이션');

  NAV_ITEMS.forEach(item => {
    const btn = document.createElement('button');
    btn.className = `nav-item${item.id === activeId ? ' active' : ''}`;
    btn.setAttribute('aria-label', item.label);
    btn.id = `nav-${item.id}`;

    btn.innerHTML = `
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
    `;

    btn.addEventListener('click', () => {
      // 현재 활성 탭이면 무시
      if (item.id === currentActive) return;
      
      // 활성 상태 업데이트
      nav.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      currentActive = item.id;
      
      onNavigate(item.id);
    });

    nav.appendChild(btn);
  });

  document.body.appendChild(nav);
  return nav;
}

/**
 * 네비바 뱃지 표시
 */
export function setNavBadge(tabId, show = true) {
  const tab = document.getElementById(`nav-${tabId}`);
  if (!tab) return;

  const existing = tab.querySelector('.nav-badge');
  if (show && !existing) {
    const badge = document.createElement('span');
    badge.className = 'nav-badge';
    tab.appendChild(badge);
  } else if (!show && existing) {
    existing.remove();
  }
}

/**
 * 네비바 숨기기/보이기
 */
export function hideNavbar() {
  const nav = document.querySelector('.bottom-nav');
  if (nav) nav.style.display = 'none';
}

export function showNavbar() {
  const nav = document.querySelector('.bottom-nav');
  if (nav) nav.style.display = 'flex';
}

/**
 * 활성 탭 변경 (네비게이션 없이 시각적으로만)
 */
export function setActiveTab(tabId) {
  currentActive = tabId;
  const nav = document.querySelector('.bottom-nav');
  if (!nav) return;
  
  nav.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.id === `nav-${tabId}`);
  });
}
