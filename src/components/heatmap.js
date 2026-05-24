/**
 * heatmap.js — 학습 히트맵 (GitHub 잔디 스타일)
 */

import { getStats } from '../lib/storage.js';

/**
 * 히트맵 컴포넌트 생성
 * @param {number} weeks - 표시할 주 수 (기본 12)
 * @returns {HTMLElement}
 */
export function createHeatmap(weeks = 12) {
  const container = document.createElement('div');
  container.className = 'heatmap-container';

  const title = document.createElement('div');
  title.className = 'heatmap-title';
  title.textContent = '📅 학습 기록';
  container.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'heatmap-grid';
  grid.style.gridTemplateColumns = `repeat(${weeks}, 14px)`;
  grid.style.gridTemplateRows = 'repeat(7, 14px)';

  const stats = getStats();
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (weeks * 7 - 1));

  // 요일 이름 (월~일)
  const dayLabels = document.createElement('div');
  dayLabels.style.cssText = `
    display: grid;
    grid-template-rows: repeat(7, 14px);
    gap: 3px;
    margin-right: 6px;
    float: left;
  `;
  ['', '월', '', '수', '', '금', ''].forEach(label => {
    const d = document.createElement('div');
    d.style.cssText = `font-size: 0.55rem; color: var(--text-muted); display: flex; align-items: center; height: 14px;`;
    d.textContent = label;
    dayLabels.appendChild(d);
  });

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display: flex; overflow-x: auto;';
  wrapper.appendChild(dayLabels);

  // 셀 채우기
  for (let col = 0; col < weeks; col++) {
    for (let row = 0; row < 7; row++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + col * 7 + row);
      
      const dateKey = formatDateKey(date);
      const dayStats = stats[dateKey];
      
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      
      if (date > today) {
        cell.style.opacity = '0.3';
      } else if (dayStats) {
        const level = getActivityLevel(dayStats);
        cell.classList.add(`level-${level}`);
      }
      
      cell.title = `${dateKey}: ${dayStats ? `${dayStats.reviews || 0}회 학습` : '학습 없음'}`;
      grid.appendChild(cell);
    }
  }

  wrapper.appendChild(grid);
  container.appendChild(wrapper);

  // 범례
  const legend = document.createElement('div');
  legend.className = 'heatmap-legend';
  legend.innerHTML = `
    <span class="legend-label">적음</span>
    <div class="heatmap-cell" style="display:inline-block"></div>
    <div class="heatmap-cell level-1" style="display:inline-block"></div>
    <div class="heatmap-cell level-2" style="display:inline-block"></div>
    <div class="heatmap-cell level-3" style="display:inline-block"></div>
    <div class="heatmap-cell level-4" style="display:inline-block"></div>
    <div class="heatmap-cell level-5" style="display:inline-block"></div>
    <span class="legend-label">많음</span>
  `;
  container.appendChild(legend);

  return container;
}

/**
 * 활동 레벨 계산 (1~5)
 */
function getActivityLevel(dayStats) {
  const reviews = dayStats.reviews || 0;
  if (reviews >= 20) return 5;
  if (reviews >= 15) return 4;
  if (reviews >= 10) return 3;
  if (reviews >= 5) return 2;
  if (reviews >= 1) return 1;
  return 0;
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
