/**
 * sounds.js — Web Audio API 기반 효과음
 * 정답, 오답, 레벨업, 클릭 등의 효과음을 생성합니다.
 */

import { getSettings } from './storage.js';

let audioContext = null;

function getContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function isSoundEnabled() {
  return getSettings().soundEnabled;
}

/**
 * 톤 생성 유틸리티
 */
function playTone(frequency, duration, type = 'sine', volume = 0.3, delay = 0) {
  if (!isSoundEnabled()) return;
  
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch {
    // Audio context may not be available
  }
}

/**
 * 정답 효과음 — 밝은 상승 멜로디
 */
export function playCorrect() {
  playTone(523.25, 0.12, 'sine', 0.25, 0);      // C5
  playTone(659.25, 0.12, 'sine', 0.25, 0.08);    // E5
  playTone(783.99, 0.2, 'sine', 0.25, 0.16);     // G5
}

/**
 * 오답 효과음 — 낮은 하강 톤
 */
export function playWrong() {
  playTone(311.13, 0.15, 'square', 0.15, 0);     // Eb4
  playTone(233.08, 0.25, 'square', 0.12, 0.12);  // Bb3
}

/**
 * 버튼 클릭
 */
export function playClick() {
  playTone(800, 0.05, 'sine', 0.1, 0);
}

/**
 * 레슨 완료 — 축하 팡파레
 */
export function playComplete() {
  playTone(523.25, 0.15, 'sine', 0.2, 0);
  playTone(659.25, 0.15, 'sine', 0.2, 0.12);
  playTone(783.99, 0.15, 'sine', 0.2, 0.24);
  playTone(1046.5, 0.35, 'sine', 0.3, 0.36);
}

/**
 * 레벨업 — 화려한 아르페지오
 */
export function playLevelUp() {
  const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  notes.forEach((freq, i) => {
    playTone(freq, 0.15, 'sine', 0.2, i * 0.08);
  });
}

/**
 * 스트릭 — 불꽃 효과음
 */
export function playStreak() {
  playTone(440, 0.1, 'sine', 0.15, 0);
  playTone(554.37, 0.1, 'sine', 0.15, 0.06);
  playTone(659.25, 0.1, 'sine', 0.2, 0.12);
  playTone(880, 0.25, 'triangle', 0.25, 0.18);
}

/**
 * 카드 플립
 */
export function playFlip() {
  playTone(600, 0.06, 'sine', 0.08, 0);
  playTone(900, 0.04, 'sine', 0.06, 0.04);
}

/**
 * TTS (Text-to-Speech) — 단어 발음 재생
 */
export function speakWord(word, lang = 'en-US') {
  if (!getSettings().ttsEnabled) return;
  
  if ('speechSynthesis' in window) {
    // 기존 발화 중지
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * AudioContext 초기화 (사용자 인터랙션 시 호출)
 */
export function initAudio() {
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch {
    // Silently fail
  }
}
