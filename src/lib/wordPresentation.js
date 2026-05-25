export function getDisplayWord(word, options = {}) {
  if (!word) return '';
  const { includeArticle = true } = options;

  if (word.displayWord) return word.displayWord;
  if (includeArticle && word.article) return joinArticle(word.article, word.word);

  return word.word;
}

export function getWordSub(word) {
  if (!word) return '';

  if (word.reading && word.pronunciation) {
    return `${word.reading} · ${word.pronunciation}`;
  }

  return word.reading || word.pronunciation || '';
}

export function getSpeakText(word) {
  if (!word) return '';
  return word.ttsText || word.word;
}

export function getAnswerVariants(word) {
  if (!word) return [];

  const variants = [
    word.word,
    word.reading,
    word.romaji,
    word.displayWord,
  ];

  if (word.article) {
    variants.push(getDisplayWord(word));
  }

  return [...new Set(variants.filter(Boolean).map(normalizeAnswer))];
}

export function isAcceptedAnswer(input, word) {
  return getAnswerVariants(word).includes(normalizeAnswer(input));
}

export function normalizeAnswer(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function getSearchText(word) {
  return [
    word.word,
    word.displayWord,
    word.reading,
    word.romaji,
    word.pronunciation,
    word.article,
    word.meaning
  ].filter(Boolean).join(' ').toLowerCase();
}

function joinArticle(article, word) {
  if (article.endsWith("'")) return `${article}${word}`;
  return `${article} ${word}`;
}
