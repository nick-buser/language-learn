import { useCallback, useEffect, useState } from 'react'
import { dayKey, newSrs, schedule, KNOWN_INTERVAL } from './srs.js'
import { api, API_ENABLED } from '../../api/client.js'

// =====================================================================
// The word bank's ink — per-learner word state, persisted per language.
//
// Phase 3 of docs/vocabulary-plan.md. When the backend is configured
// (VITE_API_URL), the homelab API is the canonical store — the bank follows
// you across devices — and localStorage is the offline cache shown instantly
// before a hydrate resolves; every change writes through (best-effort). Unset,
// it's localStorage-only, exactly as before. One key per language
// (atlas.<lang>.vocab.v1), holding:
//
//   {
//     words: {
//       [entryId]: {
//         status:  'met' | 'target' | 'learning' | 'known',  // unseen = absent
//         since:   'YYYY-MM-DD',                   // when status last changed
//         source:  'ledger' | 'review',            // which instrument set it
//         srs:     { reps, lapses, ease, interval, due },  // once learning
//         log:     [{ date, grade }, …]            // last 50 reviews
//       }
//     }
//   }
//
// Status taxonomy (the plan's contract): unseen — never touched; met —
// encountered, parked; target — a deliberate known-gap ("I know I don't know
// it"), the set the reading generator samples; learning — in the review queue;
// known — held. The learner's three buckets project onto these: known = known,
// not-known = target + learning, unvisited = unseen + met.
// =====================================================================

export const STATUSES = [
  { id: 'unseen',   label: 'unseen',   color: 'var(--ink-faded)', hint: 'not yet met' },
  { id: 'met',      label: 'met',      color: 'var(--st-travel)', hint: 'encountered, not yet studied' },
  { id: 'target',   label: 'target',   color: 'var(--signal)',    hint: 'a known gap — flagged to learn, sampled by reading' },
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

  // Write-through to the homelab backend when configured. Best-effort: the
  // localStorage cache above is the durable copy, so a failed call just means
  // the next successful hydrate reconciles. PUT one word, or DELETE it when it
  // goes back to unseen.
  const syncWord = useCallback((change) => {
    if (!API_ENABLED) return
    const { id, word, del } = change
    const req = del
      ? api.DELETE('/v1/vocab/{lang}/{slug}', { params: { path: { lang: langId, slug: id } } })
      : api.PUT('/v1/vocab/{lang}/{slug}', { params: { path: { lang: langId, slug: id } }, body: word })
    req
      .then(r => { if (r?.error) console.warn('[vocab] sync failed', id, r.error) })
      .catch(() => { /* offline — localStorage holds it; next hydrate reconciles */ })
  }, [langId])

  // Hydrate from the backend on mount / language switch. The server is the
  // canonical store; localStorage is the cache rendered instantly before this
  // resolves. On a fresh backend with a non-empty local cache, the pilot's
  // state migrates up (one PUT per touched word) instead of being adopted.
  useEffect(() => {
    if (!API_ENABLED) return
    let live = true
    api.GET('/v1/vocab/{lang}', { params: { path: { lang: langId } } })
      .then(({ data, error }) => {
        if (!live || error || !data) return
        const remote = data.words || {}
        if (Object.keys(remote).length > 0) {
          setStore(prev => {
            const next = { ...prev, words: remote }
            try { window.localStorage.setItem(key, JSON.stringify(next)) } catch { /* private mode */ }
            return next
          })
          return
        }
        const local = load(key).words || {}
        for (const [slug, word] of Object.entries(local)) syncWord({ id: slug, word })
      })
      .catch(() => { /* offline — keep the localStorage cache */ })
    return () => { live = false }
  }, [langId, key, syncWord])

  const words = store.words || {}
  const statusOf = useCallback((id) => (store.words || {})[id]?.status || 'unseen', [store])

  // Move a word between states. 'unseen' erases the record entirely;
  // entering 'learning' winds the SRS clock (kept across later moves, so
  // demoting a known word back to learning resumes its history).
  const setStatus = useCallback((id, status, source = 'ledger') => {
    let synced = null
    patch(s => {
      const all = { ...(s.words || {}) }
      if (status === 'unseen') {
        delete all[id]
        synced = { id, del: true }
        return { ...s, words: all }
      }
      const prev = all[id] || {}
      const word = { ...prev, status, since: dayKey(), source }
      if (status === 'learning' && !word.srs) word.srs = newSrs()
      all[id] = word
      synced = { id, word }
      return { ...s, words: all }
    })
    if (synced) syncWord(synced)
  }, [patch, syncWord])

  // Grade a due card. Returns what happened so the drawer can narrate:
  // { graduated } — the interval crossed KNOWN_INTERVAL and the word is
  // now known; { lapsed } — an 'again' on a word that had traction.
  const rate = useCallback((id, grade) => {
    let outcome = { graduated: false, lapsed: false }
    let synced = null
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
      synced = { id, word: all[id] }
      return { ...s, words: all }
    })
    if (synced) syncWord(synced)
    return outcome
  }, [patch, syncWord])

  return { words, statusOf, setStatus, rate }
}
