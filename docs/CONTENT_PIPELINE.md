# Vocabulary Content Pipeline

## Goal

Grow each language toward a first target of 300 high-quality words without copying from closed dictionaries or creating untraceable content.

## Target Counts

- MVP validation: 300 words per language.
- Useful beginner app: 800-1,500 words per language.
- Larger language-app feel: 2,000-3,000 words per language.

Current check:

```bash
npm run vocab:check
```

Current counts after batch 5:

- English: 200
- French: 300
- Japanese: 300

Dry-run a reviewed batch:

```bash
npm run vocab:import -- data/vocab-import/batches/fr-001.json
```

Apply it:

```bash
npm run vocab:import -- data/vocab-import/batches/fr-001.json --apply
```

## Approved Source Types

### Wiktionary / Kaikki

- Best for English and French lexical candidates.
- Use for word, part of speech, basic senses, pronunciation candidates.
- License requires attribution and may require share-alike handling depending on extracted content.
- Source registry key: `wiktionary-kaikki`.

### Tatoeba

- Best for example sentence candidates and translations.
- Prefer short, common sentences.
- Keep attribution metadata.
- Source registry key: `tatoeba`.

### JMdict / EDRDG

- Best for Japanese word, reading, and meaning candidates.
- Use as Japanese lexical seed, then produce app-specific Korean meaning and example fields.
- Source registry key: `jmdict`.

## Import Shape

Curated imports should become app records in this shape:

```json
{
  "id": "fr_w021",
  "word": "maison",
  "article": "la",
  "gender": "f",
  "meaning": "집",
  "pronunciation": "메종",
  "partOfSpeech": "n",
  "category": "daily",
  "level": 1,
  "example": "La maison est près de la gare.",
  "exampleKo": "그 집은 역 근처에 있다.",
  "source": {
    "lexical": "wiktionary-kaikki",
    "example": "curated"
  }
}
```

Japanese records should keep kanji/kana separate:

```json
{
  "id": "ja_w021",
  "word": "学校",
  "reading": "がっこう",
  "romaji": "gakko",
  "meaning": "학교",
  "pronunciation": "각코-",
  "partOfSpeech": "n",
  "category": "n",
  "level": 1,
  "example": "学校へ行きます。",
  "exampleKo": "학교에 갑니다.",
  "source": {
    "lexical": "jmdict",
    "example": "curated"
  }
}
```

## Rules

- Do not copy from Duolingo, Naver Dictionary, commercial apps, or paid dictionaries.
- Keep source metadata for imported or derived lexical data.
- Keep Korean meanings and examples app-specific and short.
- Run `npm run vocab:check` before committing content.
- Add 50-100 words per batch, then sample-review before the next batch.
