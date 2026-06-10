import { useCallback, useState } from 'react'
import { dayKey, newSrs, schedule, KNOWN_INTERVAL } from './srs.js'

// =====================================================================
// The word bank's ink — per-learner word state, persisted per language.
//
// Phase 3 of docs/vocabulary-plan.md: localStorage now, the backend
// later, same shapes throughout. One key per language
// (atlas.<lang>.vocab.v1), holding:
//
//   {
//     words: {
//       [entryId]: {
//         status:  'met' | 'learning' | 'known',   // unseen = absent
//         since:   'YYYY-MM-DD',                   // when status last changed
//         source:  'ledger' | 'review',            // which instrument set it
//         srs:     { reps, lapses, ease, interval, due },  // once learning
//         log:     [{ date, grade }, …]            // last 50 reviews
//       }
//     }
//   }
//
// Status taxonomy (the plan's contract): unseen — never touched; met —
// encountered, parked; learning — in the review queue; known — held.
// =====================================================================

export const STATUSES = [
  { id: 'unseen',   label: 'unseen',   color: 'var(--ink-faded)', hint: 'not yet met' },
  { id: 'met',      label: 'met',      color: 'var(--st-travel)', hint: 'encountered, not yet studied' },
  { id: 'learning', label: 'learning', color: 'var(--amber)',     hint: 'in the review queue' },
  { id: 'known',    label: 'known',    color: 'var(--st-active)', hint: 'held — 21 days without a lapse' },
]

export const STATUS_META = Object.fromEntries(STATUSES.map(s => [s.id, s]))

function load(key) {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(key)) || {}
  } catch {
    return {}
  }
}

export default function useVocabStore(langId) {
  const key = `atlas.${langId}.vocab.v1`
  const [store, setStore] = useState(() => load(key))

  const patch = useCallback((fn) => {
    setStore(prev => {
      const next = fn(prev)
      try { window.localStorage.setItem(key, JSON.stringify(next)) } catch { /* private mode: session-only */ }
      return next
    })
  }, [key])

  const words = store.words || {}
  const statusOf = useCallback((id) => (store.words || {})[id]?.status || 'unseen', [store])

  // Move a word between states. 'unseen' erases the record entirely;
  // entering 'learning' winds the SRS clock (kept across later moves, so
  // demoting a known word back to learning resumes its history).
  const setStatus = useCallback((id, status, source = 'ledger') => patch(s => {
    const all = { ...(s.words || {}) }
    if (status === 'unseen') {
      delete all[id]
      return { ...s, words: all }
    }
    const prev = all[id] || {}
    const word = { ...prev, status, since: dayKey(), source }
    if (status === 'learning' && !word.srs) word.srs = newSrs()
    all[id] = word
    return { ...s, words: all }
  }), [patch])

  // Grade a due card. Returns what happened so the drawer can narrate:
  // { graduated } — the interval crossed KNOWN_INTERVAL and the word is
  // now known; { lapsed } — an 'again' on a word that had traction.
  const rate = useCallback((id, grade) => {
    let outcome = { graduated: false, lapsed: false }
    patch(s => {
      const all = { ...(s.words || {}) }
      const prev = all[id]
      if (!prev?.srs) return s
      const srs = schedule(prev.srs, grade)
      outcome = {
        graduated: srs.interval >= KNOWN_INTERVAL && prev.status === 'learning',
        lapsed: grade === 'again' && prev.srs.reps > 0,
      }
      all[id] = {
        ...prev,
        status: outcome.graduated ? 'known' : prev.status,
        since: outcome.graduated ? dayKey() : prev.since,
        source: outcome.graduated ? 'review' : prev.source,
        srs,
        log: [...(prev.log || []), { date: dayKey(), grade }].slice(-50),
      }
      return { ...s, words: all }
    })
    return outcome
  }, [patch])

  return { words, statusOf, setStatus, rate }
}
