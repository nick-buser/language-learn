// =====================================================================
// The word bank's export — the generator's input, built client-side.
//
// Mirrors the backend's VocabExport (GET /v1/vocab/{lang}/export): every
// dictionary entry joined to its per-learner state, so the consumer sees the
// whole known/target/unseen landscape — not just the words you've touched. The
// future extensive-reading generator reads `words`: the `known` pool is the
// ~98% coverage floor; unknowns are sampled heavily from `status === 'target'`.
//
// Built from data already in hand (the loaded entries + the store's word map),
// so Export works with or without the backend up — offline-honest, no network.
// =====================================================================

import { dayKey } from './srs.js'

const STATUS_KEYS = ['unseen', 'met', 'target', 'learning', 'known']

/**
 * Assemble the export payload (the backend VocabExport shape).
 * @param {string} langId
 * @param {Array} entries  the loaded dictionary slice
 * @param {Object} words   the store's per-word state map (store.words)
 */
export function buildExport(langId, entries, words) {
  const counts = Object.fromEntries(STATUS_KEYS.map(k => [k, 0]))
  const rows = entries.map(e => {
    const w = words[e.id]
    const status = w?.status || 'unseen'
    counts[status] = (counts[status] || 0) + 1
    return {
      id: e.id,
      head: e.head,
      reading: e.reading,
      pos: e.pos,
      origin: e.origin,
      en: e.en,
      band: e.band ?? null,
      freqRank: e.freqRank ?? null,
      hanja: e.hanja ?? null,
      status,
      since: w?.since ?? null,
      srs: w?.srs ?? null,
    }
  })
  return { lang: langId, exportedAt: new Date().toISOString(), counts, words: rows }
}

/** Build the export and trigger a browser download of it as pretty JSON. */
export function downloadExport(langId, entries, words) {
  const payload = buildExport(langId, entries, words)
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `atlas-${langId}-vocab-${dayKey()}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
