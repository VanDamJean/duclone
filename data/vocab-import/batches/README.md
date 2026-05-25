# Vocabulary Import Batches

Put reviewed batch files here, then run:

```bash
node scripts/import-vocab-batch.mjs data/vocab-import/batches/fr-001.json
node scripts/import-vocab-batch.mjs data/vocab-import/batches/fr-001.json --apply
npm run vocab:check
```

Use dry-run first. Only apply batches that have source metadata and pass validation.
