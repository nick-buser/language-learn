import { MASTERY_MAX } from './useQuizStore.js'

// =====================================================================
// The proving ground's shared question-maker — used by both the flashcard
// cycle (QuizStage) and the grid cycle (GridQuiz), so the two formats draw
// targets and distractors identically. A target is weighted toward the
// cards you know least; the three distractors come FIRST from the target's
// `near` cohort (other tenses of the same verb, other pointers in the same
// category), then the rest of the scope, then the whole deck — deduped by
// the answer's surface form. The useful, near-miss kind of wrong.
// =====================================================================

export const shuffle = (a) => {
  const r = a.slice()
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[r[i], r[j]] = [r[j], r[i]] }
  return r
}

/** Weighted target from `pool` (falls back to the whole deck when the scope
 *  is too thin to fill four options). */
export function weightedTarget(deck, pool, store) {
  const list = pool.length >= 4 ? pool : deck.cards
  const weights = list.map(c => MASTERY_MAX - store.levelOf(c.id) + 1)
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = Math.random() * total
  for (let i = 0; i < list.length; i++) { roll -= weights[i]; if (roll <= 0) return list[i] }
  return list[0]
}

/** Three near-miss distractors for `target`, drawn from `pool` then the deck. */
export function distractors(deck, target, pool) {
  const out = []
  const used = new Set([target.answer.main])
  const take = (cands) => {
    for (const c of cands) {
      if (out.length >= 3) break
      if (used.has(c.answer.main)) continue
      used.add(c.answer.main); out.push(c)
    }
  }
  const others = pool.filter(c => c.id !== target.id)
  const isNear = (c) => target.near != null && c.near === target.near
  take(shuffle(others.filter(isNear)))
  take(shuffle(others.filter(c => !isNear(c))))
  take(shuffle(deck.cards.filter(c => c.id !== target.id)))
  return out
}

/** A full four-option question (target + shuffled options). */
export function makeQuestion(deck, pool, store) {
  const list = pool.length >= 4 ? pool : deck.cards
  const target = weightedTarget(deck, list, store)
  return { target, options: shuffle([target, ...distractors(deck, target, list)]) }
}
