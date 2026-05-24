/**
 * main.js — 앱 엔트리포인트
 */

import './style.css';
import { initApp } from './app.js';

// DOM 준비 후 앱 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
