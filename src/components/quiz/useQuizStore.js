import { useCallback, useMemo, useState } from 'react'

// =====================================================================
// The proving ground's ledger — per-card mastery + per-deck best streaks,
// persisted per language. The sibling of the script foundry's useScriptStore
// (same shape, same gamified-not-scheduled philosophy), keyed apart so the
// two never collide. Shaped the way the backend would serve it, so an API
// swap is a seam, not surgery.
//
// One key per language (atlas.<lang>.quiz.v1):
//
//   {
//     cards: {                           // mastery per quiz card (the lamp)
//       [cardId]: { level: 0..5, seen, correct, streak, since }
//     },
//     decks: { best: { [deckId]: n }, runs: n }   // best streak per deck
//   }
//
// A card climbs one lamp per correct answer (cap MASTERY_MAX) and drops two
// on a miss — fast to light, quick to remind. "Learned" = the top two lamps
// (>= LEARNED_AT), which drives the "N / total learned" headline and the
// lantern that fires when a whole scope goes gold.
// =====================================================================

export const MASTERY_MAX = 5
export const LEARNED_AT = 4

const KEY = lang => `atlas.${lang}.quiz.v1`

function dayKey(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function load(key) {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(window.localStorage.getItem(key)) || {} }
  catch { return {} }
}

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))

export default function useQuizStore(langId) {
  const key = KEY(langId)
  const [store, setStore] = useState(() => load(key))

  const patch = useCallback((fn) => {
    setStore(prev => {
      const next = fn(prev)
      try { window.localStorage.setItem(key, JSON.stringify(next)) } catch { /* private mode: session-only */ }
      return next
    })
  }, [key])

  const cards = store.cards || {}

  const levelOf = useCallback((id) => (store.cards || {})[id]?.level || 0, [store])

  const record = useCallback((id, correct) => {
    let level = 0
    patch(s => {
      const all = { ...(s.cards || {}) }
      const prev = all[id] || { level: 0, seen: 0, correct: 0, streak: 0 }
      level = correct
        ? clamp(prev.level + 1, 0, MASTERY_MAX)
        : clamp(prev.level - 2, 0, MASTERY_MAX)
      all[id] = {
        level,
        seen: prev.seen + 1,
        correct: prev.correct + (correct ? 1 : 0),
        streak: correct ? (prev.streak || 0) + 1 : 0,
        since: dayKey(),
      }
      return { ...s, cards: all }
    })
    return level
  }, [patch])

  const deckBest = useCallback((deckId) => (store.decks?.best || {})[deckId] || 0, [store])
  const recordDeck = useCallback((deckId, streak) => patch(s => {
    const decks = s.decks || {}
    const best = { ...(decks.best || {}) }
    best[deckId] = Math.max(best[deckId] || 0, streak)
    return { ...s, decks: { ...decks, best, runs: (decks.runs || 0) + 1 } }
  }), [patch])

  const resetCards = useCallback(() => patch(s => ({ ...s, cards: {} })), [patch])

  // Roll up a set of card ids into a headline: how many learned, mean accuracy.
  const summarize = useCallback((ids) => {
    let learned = 0, seen = 0, correct = 0
    for (const id of ids) {
      const c = cards[id]
      if (!c) continue
      if (c.level >= LEARNED_AT) learned += 1
      seen += c.seen || 0
      correct += c.correct || 0
    }
    return { learned, total: ids.length, seen, correct, accuracy: seen ? correct / seen : 0 }
  }, [cards])

  return useMemo(() => ({
    levelOf, record, deckBest, recordDeck, resetCards, summarize,
  }), [levelOf, record, deckBest, recordDeck, resetCards, summarize])
}
