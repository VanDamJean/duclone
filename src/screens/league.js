/**
 * league.js — weekly ranking screen
 */

import { canClaimAdReward, claimAdReward, clearLastLeagueResult, getLastLeagueResult, getLeaderboard, getLeague, getLeagueCoach, getLeagueName, getUserRank } from '../lib/league.js';
import { showToast } from '../components/toast.js';

export function renderLeague(container) {
  const league = getLeague();
  const rows = getLeaderboard();
  const user = getUserRank();
  const lastResult = getLastLeagueResult();
  const coach = getLeagueCoach();

  container.innerHTML = `
    <div class="league-screen">
      <div class="screen-header">
        <h1>🏆 리그</h1>
      </div>

      <div class="league-hero animate-in">
        <div>
          <div class="league-eyebrow">이번 주</div>
          <div class="league-title">${getLeagueName(league.tier)} League</div>
          <div class="league-subtitle">상위 5명 승급 · 하위 5명 강등</div>
        </div>
        <div class="league-rank">
          <span>${user.rank}</span>
          <small>위</small>
        </div>
      </div>

      ${lastResult ? `
        <div class="league-result animate-in">
          <div>
            <div class="league-eyebrow">지난 주 결과</div>
            <div class="league-title">${getResultTitle(lastResult)}</div>
            <div class="league-subtitle">${getResultBody(lastResult)}</div>
          </div>
          <button class="league-ad-btn" id="dismiss-league-result">확인</button>
        </div>
      ` : ''}

      <div class="league-coach ${coach.tone} animate-in animate-in-delay-1">
        <div>
          <div class="league-eyebrow">이번 주 목표</div>
          <div class="league-title">${coach.title}</div>
          <div class="league-subtitle">${coach.body}</div>
        </div>
      </div>

      <div class="league-summary animate-in animate-in-delay-2">
        <div>
          <div class="summary-label">내 LP</div>
          <div class="summary-value">${user.lp}</div>
        </div>
        <div>
          <div class="summary-label">오늘 1회 선택 보상</div>
          <button class="league-ad-btn" id="league-ad-btn" ${canClaimAdReward() ? '' : 'disabled'}>
            ${canClaimAdReward() ? coach.adCopy : '오늘 완료'}
          </button>
        </div>
      </div>

      <div class="league-zones animate-in animate-in-delay-3">
        <span><b class="promotion-dot"></b>승급</span>
        <span><b class="stay-dot"></b>잔류</span>
        <span><b class="demotion-dot"></b>강등</span>
      </div>

      <div class="league-list animate-in animate-in-delay-3">
        ${rows.map(row => `
          <div class="league-row ${row.isUser ? 'is-user' : ''} ${row.zone}">
            <div class="rank">${row.rank}</div>
            <div class="avatar">${row.avatar}</div>
            <div class="name">${row.name}</div>
            <div class="lp">${row.lp} LP</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('league-ad-btn')?.addEventListener('click', () => {
    const result = claimAdReward();
    if (result.claimed) {
      showToast(`오늘 부스터 +${result.amount} LP`, '🎁');
      renderLeague(container);
    }
  });

  document.getElementById('dismiss-league-result')?.addEventListener('click', () => {
    clearLastLeagueResult();
    renderLeague(container);
  });
}

function getResultTitle(result) {
  if (result.tierDelta > 0) return '승급했어요!';
  if (result.tierDelta < 0) return '강등됐어요';
  return '잔류했어요';
}

function getResultBody(result) {
  if (result.tierDelta > 0) {
    return `${result.rank}위 · ${result.lp} LP · ${result.nextTierName} 리그로 올라갔어요`;
  }
  if (result.tierDelta < 0) {
    return `${result.rank}위 · ${result.lp} LP · ${result.nextTierName} 리그에서 다시 시작해요`;
  }
  return `${result.rank}위 · ${result.lp} LP · ${result.tierName} 리그를 지켰어요`;
}
