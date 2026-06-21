// =====================================================================
// The reading room's coverage join — pure, no React, no network.
//
// Takes the analyzer's morpheme tokens and the live vocab state and works out,
// for each content word, whether the learner knows it — then the headline
// number: known-word coverage. Extensive reading wants ~98% known so the few
// unknowns can be guessed from context; this is the gauge for that.
//
// The join is by lemma → dictionary headword. Words with no dictionary entry are
// 'unknown' (not in the bank, so neither known nor markable yet — resolution
// improves as the dictionary grows). Function morphemes (particles, endings,
// punctuation) don't count toward coverage at all.
// =====================================================================

// Order matters: it's the stacked-bar order in the meter (known → unknown).
export const COVERAGE_CLASSES = ['known', 'target', 'learning', 'met', 'unseen', 'unknown']

// The comprehensible-input zones, by known-coverage fraction.
export function coverageZone(c) {
  if (c >= 0.98) return { id: 'extensive', label: 'extensive', hint: '98%+ — read for pleasure; guess the rest' }
  if (c >= 0.95) return { id: 'comprehensible', label: 'comprehensible', hint: '95–98% — the input sweet spot' }
  if (c >= 0.90) return { id: 'intensive', label: 'intensive', hint: '90–95% — workable, but effortful' }
  return { id: 'frustration', label: 'too hard', hint: 'under 90% known — too many gaps to enjoy' }
}

// Headword → entry index for the lemma join (first entry wins on collision).
export function indexByHead(entries) {
  const m = new Map()
  for (const e of entries || []) if (!m.has(e.head)) m.set(e.head, e)
  return m
}

/**
 * Enrich tokens with their coverage class + dictionary entry, and tally stats.
 * @param {Array} tokens     MorphToken[] from POST /v1/reading/analyze
 * @param {Map} headIndex    headword → dictionary entry (see indexByHead)
 * @param {(id: string) => string} statusOf   the vocab store's status lookup
 * @returns {{ tokens: Array, stats: { contentTotal: number, counts: Object, coverage: number } }}
 */
export function analyzeCoverage(tokens, headIndex, statusOf) {
  const enriched = (tokens || []).map((t) => {
    if (!t.content) return { ...t, klass: 'function', entryId: null, entry: null }
    const entry = headIndex.get(t.lemma)
    if (!entry) return { ...t, klass: 'unknown', entryId: null, entry: null }
    return { ...t, klass: statusOf(entry.id), entryId: entry.id, entry }
  })

  const counts = Object.fromEntries(COVERAGE_CLASSES.map((k) => [k, 0]))
  let contentTotal = 0
  for (const t of enriched) {
    if (t.klass === 'function') continue
    contentTotal += 1
    counts[t.klass] = (counts[t.klass] || 0) + 1
  }
  const coverage = contentTotal ? counts.known / contentTotal : 0
  return { tokens: enriched, stats: { contentTotal, counts, coverage } }
}
