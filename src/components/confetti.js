/**
 * confetti.js — 축하 이펙트
 * 레슨 완료, 레벨업 등에 사용되는 파티클 효과
 */

const CONFETTI_COLORS = [
  '#10b981', '#34d399', '#6ee7b7', // 그린
  '#f59e0b', '#fbbf24',             // 골드
  '#8b5cf6', '#a78bfa',             // 퍼플
  '#f97316',                         // 오렌지
  '#ef4444',                         // 레드
  '#3b82f6',                         // 블루
];

/**
 * 컨페티 이펙트 실행
 * @param {number} count - 파티클 수 (기본 40)
 * @param {number} duration - 지속 시간 ms (기본 2000)
 */
export function launchConfetti(count = 40, duration = 2500) {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const left = Math.random() * 100;
    const size = Math.random() * 8 + 6;
    const animDuration = Math.random() * 1500 + 1500;
    const delay = Math.random() * 500;
    const shape = Math.random() > 0.5 ? '50%' : '2px';

    piece.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${shape};
      --duration: ${animDuration}ms;
      animation-delay: ${delay}ms;
    `;

    container.appendChild(piece);
  }

  setTimeout(() => {
    container.remove();
  }, duration + 500);
}

/**
 * 미니 컨페티 (정답 시 작은 이펙트)
 */
export function miniConfetti(element) {
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: ${rect.left}px;
    top: ${rect.top}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    pointer-events: none;
    z-index: 300;
    overflow: visible;
  `;
  document.body.appendChild(container);

  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    const angle = (i / 8) * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

    sparkle.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: 6px;
      height: 6px;
      background: ${color};
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: sparkleOut 0.5s ease forwards;
      --tx: ${Math.cos(angle) * distance}px;
      --ty: ${Math.sin(angle) * distance}px;
    `;
    container.appendChild(sparkle);
  }

  // sparkleOut 애니메이션 동적 추가
  if (!document.getElementById('sparkle-style')) {
    const style = document.createElement('style');
    style.id = 'sparkle-style';
    style.textContent = `
      @keyframes sparkleOut {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => container.remove(), 600);
}
