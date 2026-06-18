// =====================================================================
// The Polyglot's Atlas — the dictionary · schema (v2)
//
// Phase 2 of docs/vocabulary-plan.md. The hand-authored word banks
// (koreanVocab.js / japaneseVocab.js) piloted a flat VocabEntry; this is
// its generalized successor — the shape a real lexicon (frequency-ranked,
// multi-sense, provenance-tagged) will hold, and the payload the future
// homelab dictionary API will return. The schema is the contract: the
// seeding pipeline writes to it, the data-access layer reads it, and the
// instruments never see anything else.
//
// v2 adds, over the pilot VocabEntry:
//   · senses[]        a headword can mean several things (말 = words/horse)
//   · freqRank        an integer rank from a frequency list (null until seeded)
//   · conjugation     inflection class for verbs/adjectives (null otherwise)
//   · source          provenance of the entry (which seed/edit produced it)
// Everything the pilot had is preserved, so existing instruments keep
// reading entry.en / entry.reading / entry.bridge / entry.ex unchanged;
// the new fields are additive and optional.
//
// /**
//  * @typedef {Object} Sense — one meaning of a headword
//  * @property {string} gloss          the English gloss (KRDICT trans_word)
//  * @property {?string} def           the Korean definition (KRDICT)
//  * @property {?string} enDef         the English definition (KRDICT trans_dfn)
//  * @property {?string} domain        coarse topic tag
//  * @property {?{head: string, html: string}} note  usage / trap footnote
//  *
//  * @typedef {Object} DictionaryEntry
//  * @property {string} id             stable slug — the primary key
//  * @property {string} head           headword in the language's own script
//  * @property {?string} hanja         Sino spelling when origin is 'sino'
//  * @property {{kana?: string, rr: string}} reading
//  * @property {'noun'|'verb'|'adj'|'adverb'|'expression'} pos
//  * @property {string} origin         lexical stratum (sino / native / loan)
//  * @property {string} en             primary gloss (= senses[0].gloss)
//  * @property {Sense[]} senses        all meanings (>=1)
//  * @property {?number} band          frequency band 1|2|3 (derived from rank)
//  * @property {?number} freqRank      rank in a frequency list (null = unseeded)
//  * @property {?string} conjugation   inflection class (verbs/adj) or null
//  * @property {string} domain         primary topic tag (= senses[0].domain)
//  * @property {?string} grade         KRDICT learner level (초급/중급/고급) or null
//  * @property {?Object} bridge        the Japanese side (see koreanVocab.js)
//  * @property {?Object} ex            specimen sentence (hand-authored; may be absent)
//  * @property {?{head: string, html: string}} note  primary usage footnote
//  * @property {string} source         provenance ('atlas-seed', 'krdict', …)
//  * @property {?string} krdictId      KRDICT target_code (provenance) or null
//  */
// =====================================================================

// Frequency-band cutoffs over a rank. Tuned for Korean: the top band is
// the survival core, the second is everyday range, the third is extended.
export function bandFromRank(rank) {
  if (rank == null) return null;
  if (rank <= 2000) return 1;
  if (rank <= 6000) return 2;
  return 3;
}

// Lift a pilot VocabEntry into a v2 DictionaryEntry without losing anything:
// derive a single sense from the flat gloss, fill the new fields with
// honest defaults (no fabricated frequency rank — the pipeline assigns it).
export function normalizeEntry(entry, { source = 'atlas-seed' } = {}) {
  const freqRank = entry.freqRank ?? null;
  return {
    ...entry,
    senses: entry.senses ?? [{ gloss: entry.en, domain: entry.domain ?? null, note: entry.note ?? null }],
    freqRank,
    band: entry.band ?? bandFromRank(freqRank),
    conjugation: entry.conjugation ?? null,
    source: entry.source ?? source,
  };
}
