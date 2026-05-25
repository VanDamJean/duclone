import fs from 'node:fs';
import path from 'node:path';
import { wordData as wordDataEn, categories as categoriesEn } from '../src/data/wordData_en.js';
import { wordData_fr as wordDataFr, categories_fr as categoriesFr } from '../src/data/wordData_fr.js';
import { wordData_ja as wordDataJa, categories_ja as categoriesJa } from '../src/data/wordData_ja.js';

const [, , batchPath, maybeApply] = process.argv;

if (!batchPath) {
  console.error('Usage: node scripts/import-vocab-batch.mjs <batch.json> [--apply]');
  process.exit(1);
}

const apply = maybeApply === '--apply';
const absoluteBatchPath = path.resolve(batchPath);
const batch = JSON.parse(fs.readFileSync(absoluteBatchPath, 'utf8'));

const datasets = {
  en: {
    words: wordDataEn,
    categories: categoriesEn,
    file: path.resolve('src/data/wordData_en.js'),
    exportName: 'wordData',
  },
  fr: {
    words: wordDataFr,
    categories: categoriesFr,
    file: path.resolve('src/data/wordData_fr.js'),
    exportName: 'wordData_fr',
  },
  ja: {
    words: wordDataJa,
    categories: categoriesJa,
    file: path.resolve('src/data/wordData_ja.js'),
    exportName: 'wordData_ja',
  },
};

const dataset = datasets[batch.lang];
if (!dataset) {
  console.error(`Unsupported lang "${batch.lang}". Use en, fr, or ja.`);
  process.exit(1);
}

if (!Array.isArray(batch.words) || batch.words.length === 0) {
  console.error('Batch must include a non-empty words array.');
  process.exit(1);
}

const existingIds = new Set(dataset.words.map(word => word.id));
const batchIds = new Set();
const errors = [];

batch.words.forEach((word, index) => {
  const label = `${batch.lang}[${index}] ${word.id || '(missing id)'}`;

  for (const field of ['id', 'word', 'meaning', 'partOfSpeech', 'category', 'level', 'example', 'exampleKo', 'source']) {
    if (!word[field]) errors.push(`${label}: missing ${field}`);
  }

  if (word.id && existingIds.has(word.id)) errors.push(`${label}: duplicate existing id`);
  if (word.id && batchIds.has(word.id)) errors.push(`${label}: duplicate id in batch`);
  if (word.id) batchIds.add(word.id);

  if (word.category && !dataset.categories[word.category]) errors.push(`${label}: unknown category "${word.category}"`);
  if (typeof word.level !== 'number' || word.level < 1 || word.level > 5) errors.push(`${label}: level must be 1-5`);

  if (batch.lang === 'ja') {
    if (!word.reading) errors.push(`${label}: Japanese word missing reading`);
    if (!word.romaji) errors.push(`${label}: Japanese word missing romaji`);
  }

  if (batch.lang === 'fr' && word.partOfSpeech === 'n') {
    if (!word.article) errors.push(`${label}: French noun missing article`);
    if (!word.gender) errors.push(`${label}: French noun missing gender`);
  }
});

if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}

console.log(`${apply ? 'Applying' : 'Dry run'}: ${batch.words.length} ${batch.lang} words from ${absoluteBatchPath}`);

if (!apply) {
  console.log('Run again with --apply to append this batch.');
  process.exit(0);
}

const source = fs.readFileSync(dataset.file, 'utf8');
const insertion = batch.words.map(formatWord).join(',\n');
const updated = source.replace(/\n\];\s*$/, `,\n${insertion}\n];\n`);

if (updated === source) {
  console.error(`Could not find array ending in ${dataset.file}`);
  process.exit(1);
}

fs.writeFileSync(dataset.file, updated);
console.log(`Appended ${batch.words.length} words to ${dataset.file}`);

function formatWord(word) {
  return `  ${JSON.stringify(word, null, 2).replace(/\n/g, '\n  ')}`;
}
