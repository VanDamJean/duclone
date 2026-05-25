/**
 * league.js — weekly ranking screen
 */

import { canClaimAdReward, claimAdReward, clearLastLeagueResult, getLastLeagueResult, getLeaderboard, getLeague, getLeagueName, getLeagueRewards, getUserRank } from '../lib/league.js';
import { showToast } from '../components/toast.js';

export function renderLeague(container) {
  const league = getLeague();
  const rows = getLeaderboard();
  const user = getUserRank();
  const reward = getLeagueRewards();
  const lastResult = getLastLeagueResult();

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
            <div class="league-subtitle">${lastResult.rank}위 · ${lastResult.lp} LP · ${lastResult.tierName} → ${lastResult.nextTierName}</div>
          </div>
          <button class="league-ad-btn" id="dismiss-league-result">확인</button>
        </div>
      ` : ''}

      <div class="league-summary animate-in animate-in-delay-1">
        <div>
          <div class="summary-label">내 LP</div>
          <div class="summary-value">${user.lp}</div>
        </div>
        <div>
          <div class="summary-label">광고 보너스</div>
          <button class="league-ad-btn" id="league-ad-btn" ${canClaimAdReward() ? '' : 'disabled'}>
            ${canClaimAdReward() ? `+${reward.ad} LP` : '오늘 완료'}
          </button>
        </div>
      </div>

      <div class="league-zones animate-in animate-in-delay-2">
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
      showToast(`광고 보너스 +${result.amount} LP`, '🎁');
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
