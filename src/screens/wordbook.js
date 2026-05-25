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
      <div class="animate-in" style="padding: 0 0 8px">
        <div style="position:relative">
          <input type="text" id="word-search" placeholder="단어 검색..." 
                 style="width:100%; padding:12px 16px 12px 40px; border:2px solid var(--border); border-radius:var(--radius-lg); font-size:0.9rem; font-weight:500; background:var(--bg-card); color:var(--text);"
                 autocomplete="off">
          <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:1rem; color:var(--text-muted)">🔍</span>
        </div>
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
      
      <div style="text-align:center; margin-bottom:24px">
        <div style="font-size:2rem; font-weight:800; margin-bottom:4px">${getDisplayWord(word)}</div>
        <div style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:4px">${getWordSub(word)}</div>
        <div style="display:inline-flex; gap:8px">
          <span style="font-size:0.75rem; padding:3px 10px; border-radius:var(--radius-full); background:var(--primary-50); color:var(--primary-600); font-weight:600">${word.partOfSpeech}</span>
          <span style="font-size:0.75rem; padding:3px 10px; border-radius:var(--radius-full); background:var(--divider); color:var(--text-secondary); font-weight:600">${label}</span>
        </div>
      </div>

      <div style="margin-bottom:20px">
        <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.05em">뜻</div>
        <div style="font-size:1.2rem; font-weight:700">${word.meaning}</div>
      </div>

      <div style="margin-bottom:20px; padding:16px; background:var(--divider); border-radius:var(--radius-lg)">
        <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.05em">예문</div>
        <div style="font-size:0.95rem; line-height:1.6; margin-bottom:4px">${word.example}</div>
        <div style="font-size:0.85rem; color:var(--text-secondary)">${word.exampleKo}</div>
      </div>

      <div style="display:flex; gap:8px; margin-bottom:16px">
        <div style="flex:1; padding:12px; background:var(--bg); border-radius:var(--radius-md); text-align:center">
          <div style="font-size:0.7rem; color:var(--text-muted); font-weight:600">카테고리</div>
          <div style="font-size:0.85rem; font-weight:700; margin-top:2px">${getCategories()[word.category]}</div>
        </div>
        <div style="flex:1; padding:12px; background:var(--bg); border-radius:var(--radius-md); text-align:center">
          <div style="font-size:0.7rem; color:var(--text-muted); font-weight:600">레벨</div>
          <div style="font-size:0.85rem; font-weight:700; margin-top:2px">${'⭐'.repeat(word.level)}</div>
        </div>
      </div>

      ${card ? `
        <div style="padding:12px; background:var(--bg); border-radius:var(--radius-md)">
          <div style="font-size:0.7rem; color:var(--text-muted); font-weight:600; margin-bottom:6px">학습 상태</div>
          <div style="display:flex; justify-content:space-between; font-size:0.8rem">
            <span>복습 횟수: <strong>${card.reps || 0}</strong></span>
            <span>안정도: <strong>${(card.stability || 0).toFixed(1)}</strong></span>
          </div>
          ${card.due ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px">다음 복습: ${new Date(card.due).toLocaleDateString('ko-KR')}</div>` : ''}
        </div>
      ` : ''}

      <button class="btn btn-primary btn-full" style="margin-top:16px" id="speak-detail">🔊 발음 듣기</button>
      <button class="btn btn-secondary btn-full" style="margin-top:8px" id="close-detail">닫기</button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.querySelector('#close-detail')?.addEventListener('click', () => overlay.remove());
  overlay.querySelector('#speak-detail')?.addEventListener('click', () => speakWord(getSpeakText(word)));
}
