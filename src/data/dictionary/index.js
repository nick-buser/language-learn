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

import koDict from './ko.json';
import { KO_VOCAB_LANG } from '../koreanVocab.js';
import { JA_VOCAB, JA_VOCAB_LANG } from '../japaneseVocab.js';
import { normalizeEntry } from './schema.js';

// Korean reads the generated, KRDICT-backed dictionary (ko.json) — built by
// tools/seed-dictionary.mjs, frequency-ranked, merged with the hand-checked
// bank's bridges + specimens, already v2-normalized. Definitions, readings,
// hanja, and learner grades are from the 국립국어원 「한국어기초사전」 (KRDICT)
// Open API — credited loudly in the folio and the README.
// Japanese is still the hand bank, normalized on read.
const SEEDS = {
  ko: { lang: KO_VOCAB_LANG, entries: koDict.entries, normalized: true },
  ja: { lang: JA_VOCAB_LANG, entries: JA_VOCAB, normalized: false, source: 'atlas-seed' },
};

// Source credit, surfaced in the UI.
export const DICTIONARY_CREDIT = {
  ko: {
    name: '국립국어원 「한국어기초사전」',
    latin: 'KRDICT — National Institute of Korean Language, Basic Korean Dictionary',
    url: 'https://krdict.korean.go.kr',
  },
};

/**
 * Load a language's dictionary slice.
 * @param {string} langId
 * @returns {Promise<{ lang: object, entries: import('./schema.js').DictionaryEntry[] }>}
 */
export async function loadVocab(langId) {
  const seed = SEEDS[langId] || SEEDS.ko;
  const entries = seed.normalized
    ? seed.entries
    : seed.entries.map((e) => normalizeEntry(e, { source: seed.source }));
  return { lang: seed.lang, entries };
}

/** Languages the dictionary currently serves. */
export const DICTIONARY_LANGS = Object.keys(SEEDS);
