/**
 * stats.js — 통계 화면
 * 학습 히트맵, 진행 현황, 정확도 등 통계 표시
 */

import { getUser, getStats } from '../lib/storage.js';
import { getOverallProgress } from '../lib/scheduler.js';
import { calculateLevel, getLevelBadge, getLevelTitle, getAccuracy } from '../lib/gamification.js';
import { createHeatmap } from '../components/heatmap.js';
import { createProgressBar } from '../components/progressBar.js';

export function renderStats(container, navigate) {
  const user = getUser();
  const progress = getOverallProgress();
  const level = calculateLevel(user.xp);
  const accuracy = getAccuracy();
  const stats = getStats();

  // 최근 7일 학습 데이터 계산
  const weekData = getWeekData(stats);
  const totalStudyDays = Object.keys(stats).length;

  container.innerHTML = `
    <div class="stats-screen">
      <div class="screen-header">
        <h1>📊 학습 통계</h1>
      </div>

      <!-- 요약 -->
      <div class="stats-overview animate-in">
        <div class="stat-box">
          <div class="sb-value" style="color: var(--primary-600)">${progress.learned}</div>
          <div class="sb-label">학습한 단어</div>
        </div>
        <div class="stat-box">
          <div class="sb-value" style="color: var(--correct)">${progress.mastered}</div>
          <div class="sb-label">숙달 단어</div>
        </div>
        <div class="stat-box">
          <div class="sb-value" style="color: var(--streak)">${user.streak || 0}일</div>
          <div class="sb-label">현재 스트릭</div>
        </div>
        <div class="stat-box">
          <div class="sb-value" style="color: var(--info)">${accuracy}%</div>
          <div class="sb-label">정답률</div>
        </div>
      </div>

      <!-- 전체 진행률 -->
      <div class="card animate-in animate-in-delay-1" style="margin: 16px 0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
          <span style="font-weight:700; font-size:0.9rem">📚 전체 진행률</span>
          <span style="font-size:0.85rem; color:var(--text-secondary); font-weight:600">${progress.percentage}%</span>
        </div>
        <div id="overall-progress"></div>
        <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.75rem; color:var(--text-muted)">
          <span>${progress.learned}개 학습</span>
          <span>${progress.total}개 전체</span>
        </div>
      </div>

      <!-- 히트맵 -->
      <div class="animate-in animate-in-delay-2" id="heatmap-area"></div>

      <!-- 주간 활동 -->
      <div class="card animate-in animate-in-delay-3" style="margin: 16px 0;">
        <div style="font-weight:700; font-size:0.9rem; margin-bottom:16px">📈 이번 주 활동</div>
        <div id="week-chart" style="display:flex; align-items:flex-end; gap:8px; height:100px; padding:0 8px"></div>
        <div style="display:flex; gap:8px; padding:0 8px; margin-top:6px">
          ${weekData.map(d => `<div style="flex:1; text-align:center; font-size:0.6rem; color:var(--text-muted); font-weight:600">${d.label}</div>`).join('')}
        </div>
      </div>

      <!-- 상세 통계 -->
      <div class="card animate-in animate-in-delay-4" style="margin: 16px 0;">
        <div style="font-weight:700; font-size:0.9rem; margin-bottom:16px">📋 상세 통계</div>
        <div style="display:flex; flex-direction:column; gap:12px">
          ${statRow('총 복습 횟수', `${user.totalReviews || 0}회`)}
          ${statRow('총 정답 수', `${user.totalCorrect || 0}회`)}
          ${statRow('총 XP', `${user.xp || 0} XP`)}
          ${statRow('레벨', `Lv.${level} ${getLevelBadge(level)} ${getLevelTitle(level)}`)}
          ${statRow('최고 스트릭', `${user.longestStreak || 0}일`)}
          ${statRow('총 학습 일수', `${totalStudyDays}일`)}
        </div>
      </div>
    </div>
  `;

  // 전체 진행률 바
  const progressArea = document.getElementById('overall-progress');
  if (progressArea) {
    progressArea.appendChild(createProgressBar(progress.percentage / 100, { height: 10 }));
  }

  // 히트맵
  const heatmapArea = document.getElementById('heatmap-area');
  if (heatmapArea) {
    heatmapArea.appendChild(createHeatmap(12));
  }

  // 주간 차트
  const weekChart = document.getElementById('week-chart');
  if (weekChart) {
    const maxVal = Math.max(...weekData.map(d => d.reviews), 1);
    weekData.forEach(d => {
      const height = Math.max(4, (d.reviews / maxVal) * 80);
      const bar = document.createElement('div');
      bar.style.cssText = `
        flex: 1;
        height: ${height}px;
        background: linear-gradient(180deg, var(--primary-400), var(--primary-500));
        border-radius: 6px 6px 2px 2px;
        transition: height 0.5s var(--ease-out);
        position: relative;
      `;
      if (d.reviews > 0) {
        bar.innerHTML = `<div style="position:absolute; top:-18px; left:50%; transform:translateX(-50%); font-size:0.65rem; font-weight:700; color:var(--text-secondary)">${d.reviews}</div>`;
      }
      weekChart.appendChild(bar);
    });
  }
}

function statRow(label, value) {
  return `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--divider)">
      <span style="font-size:0.85rem; color:var(--text-secondary)">${label}</span>
      <span style="font-size:0.85rem; font-weight:700">${value}</span>
    </div>
  `;
}

function getWeekData(stats) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const result = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayStat = stats[key];
    result.push({
      label: days[d.getDay()],
      reviews: dayStat?.reviews || 0,
      date: key,
    });
  }
  
  return result;
}
