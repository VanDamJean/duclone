/**
 * wordData.js — 다국어 매니저 프록시
 * 현재 선택된 언어에 맞는 단어 데이터와 카테고리를 동적으로 반환합니다.
 */

import { wordData as wordData_en, categories as categories_en } from './wordData_en.js';
import { wordData_fr, categories_fr } from './wordData_fr.js';
import { wordData_ja, categories_ja } from './wordData_ja.js';
import { getCurrentLanguage } from '../lib/storage.js';

// Backward-compatible default exports for tests and older call sites.
export const wordData = wordData_en;
export const categories = categories_en;

export function getWordData() {
  const lang = getCurrentLanguage();
  switch (lang) {
    case 'fr': return wordData_fr;
    case 'ja': return wordData_ja;
    case 'en':
    default: return wordData_en;
  }
}

export function getCategories() {
  const lang = getCurrentLanguage();
  switch (lang) {
    case 'fr': return categories_fr;
    case 'ja': return categories_ja;
    case 'en':
    default: return categories_en;
  }
}
