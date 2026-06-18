// =====================================================================
// The Polyglot's Atlas — the dictionary · data-access layer
//
// THE SEAM. Every instrument that needs words goes through loadVocab();
// nothing imports the raw data modules directly anymore. When a backend base
// URL is configured (VITE_API_URL), loadVocab reads the dictionary from the
// homelab API; otherwise it serves the bundled local data. Because the
// signature is already async and the API returns the same DictionaryEntry
// shape, the swap is invisible upstream — the whole promise of "the schema is
// the contract": the backend lands here, and only here.
// =====================================================================

import koDict from './ko.json';
import { KO_VOCAB_LANG } from '../koreanVocab.js';
import { JA_VOCAB, JA_VOCAB_LANG } from '../japaneseVocab.js';
import { normalizeEntry } from './schema.js';
import { api, API_ENABLED } from '../../api/client.js';

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

// Fetch a language's entries from the backend. Returns null (→ local fallback)
// on any error or when the backend has no entries for that language yet.
async function entriesFromBackend(langId) {
  try {
    const { data, error } = await api.GET('/v1/dictionary/{lang}', {
      params: { path: { lang: langId } },
    });
    if (error || !data || !data.entries || data.entries.length === 0) return null;
    return data.entries;
  } catch {
    return null;
  }
}

// Normalize the local seed for a language (the offline source of truth).
function localEntries(seed) {
  return seed.normalized
    ? seed.entries
    : seed.entries.map((e) => normalizeEntry(e, { source: seed.source }));
}

/**
 * Load a language's dictionary slice. Presentation config (strata, font…) is
 * always the local lang config; only the entries may come from the backend.
 * @param {string} langId
 * @returns {Promise<{ lang: object, entries: import('./schema.js').DictionaryEntry[] }>}
 */
export async function loadVocab(langId) {
  const seed = SEEDS[langId] || SEEDS.ko;
  if (API_ENABLED) {
    const remote = await entriesFromBackend(langId);
    if (remote) return { lang: seed.lang, entries: remote };
  }
  return { lang: seed.lang, entries: localEntries(seed) };
}

/** Languages the dictionary currently serves. */
export const DICTIONARY_LANGS = Object.keys(SEEDS);
