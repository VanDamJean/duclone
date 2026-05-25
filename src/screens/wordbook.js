/**
 * wordbook.js — 단어장 화면
 * 전체 단어 목록, 카테고리 필터, 숙달도 표시
 */

import { getWordData, getCategories } from '../data/wordData.js';
import { getAllCards } from '../lib/storage.js';
import { getCardStateLabel } from '../lib/scheduler.js';
import { speakWord } from '../lib/sounds.js';
import { getDisplayWord, getSearchText, getSpeakText, getWordSub } from '../lib/wordPresentation.js';
import { State } from 'ts-fsrs';

let currentCategory = 'all';
let searchQuery = '';

export function renderWordbook(container, navigate) {
  const allCards = getAllCards();

  container.innerHTML = `
    <div class="wordbook-screen">
      <div class="screen-header">
        <h1>📖 단어장</h1>
      </div>

      <!-- 검색 -->
      <div class="wordbook-search-wrap animate-in">
        <input type="text" id="word-search" class="wordbook-search-input"
               placeholder="단어 검색..." autocomplete="off">
        <span class="wordbook-search-icon">🔍</span>
      </div>

      <!-- 카테고리 필터 -->
      <div class="wordbook-filters animate-in animate-in-delay-1" id="category-filters">
        <button class="filter-chip active" data-cat="all">전체</button>
        ${Object.entries(getCategories()).map(([id, label]) => 
          `<button class="filter-chip" data-cat="${id}">${label}</button>`
        ).join('')}
      </div>

      <!-- 단어 목록 -->
      <div class="word-list" id="word-list"></div>
    </div>
  `;

  renderWordList(allCards);

  // 카테고리 필터 이벤트
  document.getElementById('category-filters')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;

    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentCategory = chip.dataset.cat;
    renderWordList(allCards);
  });

  // 검색 이벤트
  document.getElementById('word-search')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderWordList(allCards);
  });
}

function renderWordList(allCards) {
  const list = document.getElementById('word-list');
  if (!list) return;

  let filtered = [...getWordData()];

  // 카테고리 필터
  if (currentCategory !== 'all') {
    filtered = filtered.filter(w => w.category === currentCategory);
  }

  // 검색 필터
  if (searchQuery) {
    filtered = filtered.filter(w => 
      getSearchText(w).includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state" style="padding:40px 0">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">검색 결과가 없어요</div>
        <div class="empty-desc">다른 키워드로 검색해보세요</div>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map((word, index) => {
    const card = allCards[word.id];
    const { label, cls } = getMasteryInfo(card);

    return `
      <div class="word-list-item animate-in" style="animation-delay:${Math.min(index * 0.03, 0.3)}s" data-word-id="${word.id}">
        <div class="wli-mastery ${cls}">${label}</div>
        <div class="wli-content">
          <div class="wli-word">${getDisplayWord(word)}</div>
          <div class="wli-meaning">${word.meaning}</div>
        </div>
        <button class="wli-speak" data-word-id="${word.id}" style="font-size:1.2rem; padding:8px; border-radius:var(--radius-full); background:none; border:none; cursor:pointer;">🔊</button>
        <span class="wli-arrow">›</span>
      </div>
    `;
  }).join('');

  // TTS 이벤트
  list.querySelectorAll('.wli-speak').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const word = getWordData().find(w => w.id === btn.dataset.wordId);
      speakWord(getSpeakText(word));
    });
  });

  // 단어 상세 모달
  list.querySelectorAll('.word-list-item').forEach(item => {
    item.addEventListener('click', () => {
      const wordId = item.dataset.wordId;
      const word = getWordData().find(w => w.id === wordId);
      if (word) showWordDetail(word, allCards[wordId]);
    });
  });
}

function getMasteryInfo(card) {
  if (!card) return { label: '새', cls: 'new' };
  
  switch (card.state) {
    case State.New:
      return { label: '새', cls: 'new' };
    case State.Learning:
    case State.Relearning:
      return { label: '학습', cls: 'learning' };
    case State.Review:
      if ((card.stability || 0) > 21) {
        return { label: '숙달', cls: 'mastered' };
      }
      return { label: '복습', cls: 'review' };
    default:
      return { label: '새', cls: 'new' };
  }
}

function showWordDetail(word, card) {
  const { label } = getMasteryInfo(card);

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-handle"></div>
      
      <div class="word-detail-header">
        <div class="word-detail-word">${getDisplayWord(word)}</div>
        <div class="word-detail-sub">${getWordSub(word)}</div>
        <div class="word-detail-tags">
          <span class="word-detail-tag word-detail-tag--pos">${word.partOfSpeech}</span>
          <span class="word-detail-tag word-detail-tag--state">${label}</span>
        </div>
      </div>

      <div class="word-detail-section">
        <div class="word-detail-label">뜻</div>
        <div class="word-detail-meaning">${word.meaning}</div>
      </div>

      <div class="word-detail-example-box">
        <div class="word-detail-label">예문</div>
        <div class="word-detail-example">${word.example}</div>
        <div class="word-detail-example-ko">${word.exampleKo}</div>
      </div>

      <div class="word-detail-info-grid">
        <div class="word-detail-info-item">
          <div class="word-detail-info-label">카테고리</div>
          <div class="word-detail-info-value">${getCategories()[word.category]}</div>
        </div>
        <div class="word-detail-info-item">
          <div class="word-detail-info-label">레벨</div>
          <div class="word-detail-info-value">${'⭐'.repeat(word.level)}</div>
        </div>
      </div>

      ${card ? `
        <div class="word-detail-study-box">
          <div class="word-detail-info-label">학습 상태</div>
          <div class="word-detail-study-row">
            <span>복습 횟수: <strong>${card.reps || 0}</strong></span>
            <span>안정도: <strong>${(card.stability || 0).toFixed(1)}</strong></span>
          </div>
          ${card.due ? `<div class="word-detail-study-due">다음 복습: ${new Date(card.due).toLocaleDateString('ko-KR')}</div>` : ''}
        </div>
      ` : ''}

      <button class="btn btn-primary btn-full" id="speak-detail">🔊 발음 듣기</button>
      <button class="btn btn-secondary btn-full" id="close-detail">닫기</button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.querySelector('#close-detail')?.addEventListener('click', () => overlay.remove());
  overlay.querySelector('#speak-detail')?.addEventListener('click', () => speakWord(getSpeakText(word)));
}
