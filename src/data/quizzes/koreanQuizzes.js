// =====================================================================
// The Polyglot's Atlas — Korean · the proving ground (단련) · decks
//
// Three of the Korean folios, run backwards into questions. Each deck is
// assembled here from the SAME hand-checked module the live instrument
// reads, so a card can never disagree with the forge or the gate — the
// surface forms are never re-typed, only re-pointed.
//
//   1. 동사 활용  — the verb forge inverted: a verb + a tense, which form?
//   2. 이·그·저    — the pointer grid inverted: a meaning, which pointer?
//   3. 조사        — the 받침 gate inverted: a noun + a role, which particle?
//
// See ./schema.js for the deck/card contract.
// =====================================================================

import { FORGE_VERBS, FORGE_TENSES, GATE_NOUNS, GATE_PAIRS } from '../koreanData.js'
import { SERIES, CATEGORIES, GRID } from '../koreanDeixis.js'
import { joinRr, groupsBy } from './schema.js'

// ---------------------------------------------------------------------
// 1 · 동사 활용 — verb conjugation (the forge, inverted)
//   prompt: the dictionary verb + the target tense (해요체 throughout)
//   answer: the conjugated form
//   near = verb id → the three distractors are the SAME verb's other
//   tenses, so the question tests the tense axis, not which verb it is.
// ---------------------------------------------------------------------
const verbCards = FORGE_VERBS.flatMap(v =>
  FORGE_TENSES.map(t => {
    const f = v.tenses[t.id]
    return {
      id: `v.${v.id}.${t.id}`,
      group: t.id,
      near: v.id,
      prompt: {
        main: v.kr, lang: 'kr', sub: `${v.rr}-`, gloss: v.gloss,
        tag: `${t.label} · 해요체`, jp: v.jp,
      },
      answer: { main: f.result, lang: 'kr', sub: f.rr },
    }
  }),
)

const KO_VERBS = {
  id: 'verbs', glyph: '동사', label: 'verb conjugation',
  blurb: 'A verb and a tense — fit the ending. 가다 → 가요 · 갔어요 · 갈 거예요.',
  promptLabel: 'which conjugation?',
  hint: 'tap the form that fits the tense',
  groups: FORGE_TENSES.map(t => ({
    id: t.id, label: t.label, ids: verbCards.filter(c => c.group === t.id).map(c => c.id),
  })),
  cards: verbCards,
}

// ---------------------------------------------------------------------
// 2 · 이·그·저 — the pointer grid (deixis, inverted)
//   prompt: the meaning (gloss) + the slot it sits in (pointer × category)
//   answer: the pointer word; the Japanese twin rides showJp as a cue
//   near = category → distractors are the same category's other pointers
//   (여기 / 거기 / 저기 / 어디), the ano·kono·sono·dono confusion exactly.
// ---------------------------------------------------------------------
const SERIES_ROLE = { i: 'near me', geu: 'by you / known', jeo: 'over there', eo: 'the unknown' }
const deixisCards = SERIES.flatMap(s =>
  CATEGORIES.map(cat => {
    const cell = GRID[s.id][cat.id]
    return {
      id: `d.${s.id}.${cat.id}`,
      group: cat.id,
      near: cat.id,
      row: s.id, col: cat.id,
      prompt: {
        main: cell.gloss, gloss: `${SERIES_ROLE[s.id]} · ${cat.label}`,
        tag: cat.latin, jp: `${cell.bridge} (${cell.bridgeRr})`,
      },
      answer: { main: cell.word, lang: 'kr', sub: cell.reading },
    }
  }),
)

const KO_DEIXIS = {
  id: 'deixis', glyph: '이그저', label: 'this · that · what',
  blurb: 'Point at a meaning — pick the pointer. 이 near me, 그 by you, 저 yonder, 어 the unknown.',
  promptLabel: 'which pointer?',
  hint: 'tap the word that points there',
  groups: CATEGORIES.map(cat => ({
    id: cat.id, label: cat.label, ids: deixisCards.filter(c => c.group === cat.id).map(c => c.id),
  })),
  // the 4×6 grid as a quiz surface: prefix rows × category columns, run
  // forward (cell → word) or reverse (word → cell). imeScript names the
  // free-entry engine; readings are pronunciation-RR so the typed answer is
  // graded against the WORD the IME composes, never the reading.
  grid: {
    script: 'kr', imeScript: 'hangul',
    rows: SERIES.map(s => ({ id: s.id, glyph: s.prefix, role: s.role })),
    cols: CATEGORIES.map(c => ({ id: c.id, label: c.label, latin: c.latin, suffix: c.suffix })),
  },
  cards: deixisCards,
}

// ---------------------------------------------------------------------
// 3 · 조사 — the 받침 gate (particle allomorphy, inverted)
//   prompt: a noun + the role its slot wants (role named, particle hidden)
//   answer: the noun wearing the right particle (책 → 책은), shape and all
//   near = noun id → distractors are the SAME noun's other five forms, so
//   the question is "which particle marks this role" with the 받침-correct
//   shape baked in. Scope chips sort by ending (vowel / 받침 / ㄹ-final).
// ---------------------------------------------------------------------
const ROLE_LABEL = {
  topic: 'the theme', subject: 'the doer', object: 'the done-to',
  with: 'with · and', toward: 'toward · by means of',
}
// a hangul block carries a 받침 (final consonant) when (code − 0xAC00) % 28 ≠ 0
function hasBatchim(kr) {
  const last = kr.charCodeAt(kr.length - 1)
  if (last < 0xac00 || last > 0xd7a3) return false
  return (last - 0xac00) % 28 !== 0
}
const endingOf = (n) => (n.lFinal ? 'l' : hasBatchim(n.kr) ? 'closed' : 'open')

const particleCards = GATE_NOUNS.flatMap(n =>
  GATE_PAIRS.map((pair, i) => {
    const form = n.forms[i]
    return {
      id: `p.${n.id}.${pair.id}`,
      group: endingOf(n),
      near: n.id,
      prompt: {
        main: n.kr, lang: 'kr', sub: n.rr, gloss: n.gloss,
        tag: ROLE_LABEL[pair.id],
      },
      answer: { main: form.kr, lang: 'kr', sub: joinRr(form.rr) },
    }
  }),
)

const KO_PARTICLES = {
  id: 'particles', glyph: '조사', label: 'the 받침 gate',
  blurb: 'A noun and a role — fit the particle, shape and all. 책 (theme) → 책은.',
  promptLabel: 'which particle?',
  hint: 'tap the noun wearing the right particle',
  groups: groupsBy(particleCards, [
    { id: 'open',   label: '모음 (open)',  match: c => c.group === 'open' },
    { id: 'closed', label: '받침 (closed)', match: c => c.group === 'closed' },
    { id: 'l',      label: 'ㄹ-final',      match: c => c.group === 'l' },
  ]),
  cards: particleCards,
}

export const KO_DECKS = [KO_VERBS, KO_DEIXIS, KO_PARTICLES]
