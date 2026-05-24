/**
 * progressBar.js — 프로그레스 바 컴포넌트
 */

/**
 * 프로그레스 바 생성
 * @param {number} progress - 0~1 사이의 진행률
 * @param {Object} options
 * @returns {HTMLElement}
 */
export function createProgressBar(progress, options = {}) {
  const {
    height = 12,
    className = '',
    showText = false,
    animated = true,
  } = options;

  const container = document.createElement('div');
  container.className = `progress-bar-container ${className}`;
  container.style.height = `${height}px`;

  const fill = document.createElement('div');
  fill.className = `progress-bar-fill ${className}`;
  
  if (animated) {
    fill.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.width = `${Math.min(100, progress * 100)}%`;
      });
    });
  } else {
    fill.style.width = `${Math.min(100, progress * 100)}%`;
  }

  container.appendChild(fill);

  if (showText) {
    const text = document.createElement('span');
    text.className = 'progress-bar-text';
    text.textContent = `${Math.round(progress * 100)}%`;
    text.style.cssText = `
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.6rem;
      font-weight: 700;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    `;
    container.style.position = 'relative';
    container.appendChild(text);
  }

  return container;
}

/**
 * 프로그레스 바 업데이트
 */
export function updateProgressBar(container, progress) {
  const fill = container.querySelector('.progress-bar-fill');
  if (fill) {
    fill.style.width = `${Math.min(100, progress * 100)}%`;
  }
}
