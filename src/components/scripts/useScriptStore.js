import { useCallback, useMemo, useState } from 'react'

// =====================================================================
// The script foundry's ink — per-glyph mastery + game scores, persisted
// per language. The third localStorage store in the atlas (after the
// roadmap and the word bank), and shaped the same way the backend would
// serve it, so swapping in an API later is a seam, not surgery.
//
// One key per language (atlas.<lang>.scripts.v1):
//
//   {
//     glyphs: {                          // mastery per kana / jamo / block
//       [glyphId]: {
//         level:    0..5,                // the lamp — climbs on right, falls on wrong
//         seen:     n, correct: n,       // lifetime tallies → accuracy
//         streak:   n,                   // current consecutive-correct
//         since:   'YYYY-MM-DD',
//       }
//     },
//     drill:    { best: { [mode]: n }, runs: n },   // best streak per drill mode
//     translit: { best: n, solved: { [wordId]: n } } // best round score, words cleared
//   }
//
// Mastery is gamified, not date-scheduled (that's the word bank's SRS job).
// A glyph climbs one lamp per correct answer to a cap of MASTERY_MAX and
// drops two on a miss — fast to light, quick to remind. "Learned" = the
// top two lamps (>= LEARNED_AT), which drives the "N / total learned"
// headline and the lantern that fires when a whole row goes gold.
// =====================================================================

export const MASTERY_MAX = 5
export const LEARNED_AT = 4 // a glyph counts as learned at lamp 4 of 5

const KEY = lang => `atlas.${lang}.scripts.v1`

// Local-date key (matches the roadmap store; toISOString drifts at UTC midnight).
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

export default function useScriptStore(langId) {
  const key = KEY(langId)
  const [store, setStore] = useState(() => load(key))

  // Every mutation writes through; the store is the single source of truth.
  const patch = useCallback((fn) => {
    setStore(prev => {
      const next = fn(prev)
      try { window.localStorage.setItem(key, JSON.stringify(next)) } catch { /* private mode: session-only */ }
      return next
    })
  }, [key])

  const glyphs = store.glyphs || {}

  const levelOf = useCallback((id) => (store.glyphs || {})[id]?.level || 0, [store])

  // Record one answer for a glyph. Returns the new level so a caller can
  // notice the moment a glyph crosses into "learned".
  const record = useCallback((id, correct) => {
    let level = 0
    patch(s => {
      const all = { ...(s.glyphs || {}) }
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
      return { ...s, glyphs: all }
    })
    return level
  }, [patch])

  // Best streak per drill mode (kana→sound, sound→kana, …) + a run tally.
  const drillBest = useCallback((mode) => (store.drill?.best || {})[mode] || 0, [store])
  const recordDrill = useCallback((mode, streak) => patch(s => {
    const drill = s.drill || {}
    const best = { ...(drill.best || {}) }
    best[mode] = Math.max(best[mode] || 0, streak)
    return { ...s, drill: { ...drill, best, runs: (drill.runs || 0) + 1 } }
  }), [patch])

  // Transliteration game: best round score + words ever cleared.
  const translit = store.translit || { best: 0, solved: {} }
  const recordTranslit = useCallback((score) => patch(s => {
    const t = s.translit || { best: 0, solved: {} }
    return { ...s, translit: { ...t, best: Math.max(t.best || 0, score) } }
  }), [patch])
  const markSolved = useCallback((wordId) => patch(s => {
    const t = s.translit || { best: 0, solved: {} }
    const solved = { ...(t.solved || {}) }
    solved[wordId] = (solved[wordId] || 0) + 1
    return { ...s, translit: { ...t, solved } }
  }), [patch])

  const resetGlyphs = useCallback(() => patch(s => ({ ...s, glyphs: {} })), [patch])

  // Roll up a set of glyph ids into a headline: how many learned, mean accuracy.
  const summarize = useCallback((ids) => {
    let learned = 0, seen = 0, correct = 0
    for (const id of ids) {
      const g = glyphs[id]
      if (!g) continue
      if (g.level >= LEARNED_AT) learned += 1
      seen += g.seen || 0
      correct += g.correct || 0
    }
    return { learned, total: ids.length, seen, correct, accuracy: seen ? correct / seen : 0 }
  }, [glyphs])

  return useMemo(() => ({
    glyphs, levelOf, record,
    drillBest, recordDrill,
    translit, recordTranslit, markSolved,
    resetGlyphs, summarize,
  }), [glyphs, levelOf, record, drillBest, recordDrill, translit, recordTranslit, markSolved, resetGlyphs, summarize])
}
