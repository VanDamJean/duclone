/**
 * toast.js — 토스트 알림 컴포넌트
 */

let toastTimeout = null;

/**
 * 토스트 메시지 표시
 * @param {string} message - 메시지 텍스트
 * @param {string} icon - 이모지 아이콘
 * @param {number} duration - 표시 시간 ms
 */
export function showToast(message, icon = '✅', duration = 2500) {
  // 기존 토스트 제거
  const existing = document.querySelector('.toast-container');
  if (existing) existing.remove();
  if (toastTimeout) clearTimeout(toastTimeout);

  const container = document.createElement('div');
  container.className = 'toast-container';

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);
  document.body.appendChild(container);

  toastTimeout = setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => container.remove(), 300);
  }, duration);
}

/**
 * XP 획득 토스트
 */
export function showXpToast(xp) {
  showToast(`+${xp} XP 획득!`, '⚡', 2000);
}

/**
 * 레벨업 토스트
 */
export function showLevelUpToast(level) {
  showToast(`🎉 레벨 ${level} 달성!`, '🎊', 3000);
}

/**
 * 스트릭 토스트
 */
export function showStreakToast(streak) {
  showToast(`${streak}일 연속 학습! 대단해요!`, '🔥', 3000);
}
