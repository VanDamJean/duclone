import { wordData as wordDataEn, categories as categoriesEn } from '../src/data/wordData_en.js';
import { wordData_fr as wordDataFr, categories_fr as categoriesFr } from '../src/data/wordData_fr.js';
import { wordData_ja as wordDataJa, categories_ja as categoriesJa } from '../src/data/wordData_ja.js';

const datasets = {
  en: { words: wordDataEn, categories: categoriesEn, minTarget: 300 },
  fr: { words: wordDataFr, categories: categoriesFr, minTarget: 300 },
  ja: { words: wordDataJa, categories: categoriesJa, minTarget: 300 },
};

let hasErrors = false;
let warningCount = 0;

for (const [lang, dataset] of Object.entries(datasets)) {
  validateDataset(lang, dataset);
}

if (hasErrors) {
  process.exitCode = 1;
}

function validateDataset(lang, { words, categories, minTarget }) {
  const ids = new Set();
  const duplicateIds = new Set();
  const errors = [];
  const warnings = [];
  let missingSourceCount = 0;
  const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  words.forEach((word, index) => {
    const label = `${lang}[${index}] ${word.id || '(missing id)'}`;

    for (const field of ['id', 'word', 'meaning', 'partOfSpeech', 'category', 'level', 'example', 'exampleKo']) {
      if (!word[field]) errors.push(`${label}: missing ${field}`);
    }

    if (word.id && ids.has(word.id)) duplicateIds.add(word.id);
    if (word.id) ids.add(word.id);

    if (word.category && !categories[word.category]) {
      errors.push(`${label}: unknown category "${word.category}"`);
    }

    if (typeof word.level !== 'number' || word.level < 1 || word.level > 5) {
      errors.push(`${label}: level must be 1-5`);
    } else {
      levelCounts[word.level]++;
    }

    if (lang === 'ja') {
      if (!word.reading) warnings.push(`${label}: Japanese word missing reading`);
      if (!word.romaji) warnings.push(`${label}: Japanese word missing romaji`);
    }

    if (lang === 'fr' && word.partOfSpeech === 'n') {
      if (!word.article) warnings.push(`${label}: French noun missing article`);
      if (!word.gender) warnings.push(`${label}: French noun missing gender`);
    }

    if (!word.source) missingSourceCount++;
  });

  for (const id of duplicateIds) {
    errors.push(`${lang}: duplicate id ${id}`);
  }

  const gap = Math.max(minTarget - words.length, 0);
  const status = gap === 0 ? 'ready' : `${gap} short of ${minTarget}`;
  console.log(`${lang}: ${words.length} words, ${Object.keys(categories).length} categories, ${status}`);
  console.log(`  levels: L1=${levelCounts[1]}, L2=${levelCounts[2]}, L3=${levelCounts[3]}, L4=${levelCounts[4]}, L5=${levelCounts[5]}`);

  if (errors.length) {
    hasErrors = true;
    for (const error of errors) console.error(`  error: ${error}`);
  }

  if (warnings.length) {
    warningCount += warnings.length;
    for (const warning of warnings.slice(0, 12)) console.warn(`  warn: ${warning}`);
    if (warnings.length > 12) console.warn(`  warn: ${warnings.length - 12} more warnings`);
  }

  if (missingSourceCount > 0) {
    warningCount += missingSourceCount;
    console.warn(`  warn: ${missingSourceCount} words missing source metadata`);
  }
}

if (warningCount > 0) {
  console.warn(`vocab check completed with ${warningCount} warnings`);
}
