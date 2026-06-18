// =====================================================================
// The Polyglot's Atlas — the dictionary · data-access layer
//
// THE SEAM. Every instrument that needs words goes through loadVocab();
// nothing imports the raw data modules directly anymore. Today the body
// reads the local hand-authored banks and normalizes them to the v2
// schema. Tomorrow it becomes `await fetch('https://dict.lab/api/...')`
// against the homelab dictionary service — and because the signature is
// already async and the shape is already DictionaryEntry, that swap is
// invisible upstream. That is the whole promise of "the schema is the
// contract": the backend lands here, and only here.
// =====================================================================

import { KO_VOCAB, KO_VOCAB_LANG } from '../koreanVocab.js';
import { JA_VOCAB, JA_VOCAB_LANG } from '../japaneseVocab.js';
import { normalizeEntry } from './schema.js';

// Local seed sources, keyed by language. When the backend exists this map
// becomes a base-URL lookup instead.
const SEEDS = {
  ko: { lang: KO_VOCAB_LANG, entries: KO_VOCAB, source: 'atlas-seed' },
  ja: { lang: JA_VOCAB_LANG, entries: JA_VOCAB, source: 'atlas-seed' },
};

/**
 * Load a language's dictionary slice.
 * @param {string} langId
 * @returns {Promise<{ lang: object, entries: import('./schema.js').DictionaryEntry[] }>}
 */
export async function loadVocab(langId) {
  const seed = SEEDS[langId] || SEEDS.ko;
  return {
    lang: seed.lang,
    entries: seed.entries.map((e) => normalizeEntry(e, { source: seed.source })),
  };
}

/** Languages the dictionary currently serves. */
export const DICTIONARY_LANGS = Object.keys(SEEDS);
