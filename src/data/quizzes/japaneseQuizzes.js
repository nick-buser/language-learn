// =====================================================================
// The Polyglot's Atlas — Japanese · the proving ground (鍛錬) · decks
//
// The Korean proving ground's mirror: three Japanese folios run backwards
// into questions, each assembled from the module its live instrument
// reads. The bridge points the other way — under the 한국어 toggle the
// Korean twin shows as a cue, exactly as the Japanese folios do.
//
//   1. 動詞活用   — the verb forge inverted: a verb + a form, which shape?
//   2. こそあど    — the pointer grid inverted: a meaning, which pointer?
//   3. 形容詞      — the adjective bench inverted: an adjective + a form?
//
// See ./schema.js for the deck/card contract.
// =====================================================================

import { FORGE_VERBS, JV_FORMS, JV_CLASSES } from '../japaneseVerbs.js'
import { SERIES, CATEGORIES, GRID } from '../japaneseDeixis.js'
import { I_ADJECTIVES, NA_ADJECTIVES, ADJ_FORMS, ADJ_TYPES } from '../japaneseAdjectives.js'
import { groupsBy } from './schema.js'

// ---------------------------------------------------------------------
// 1 · 動詞活用 — verb conjugation (the forge, inverted)
//   prompt: the dictionary verb + the target form (polite/negative/…)
//   answer: the conjugated shape
//   near = verb id → distractors are the SAME verb's other four forms,
//   so the question tests the form axis. Scope chips sort by class.
// ---------------------------------------------------------------------
const verbCards = FORGE_VERBS.flatMap(v =>
  JV_FORMS.map(form => {
    const f = v.forms[form.id]
    return {
      id: `v.${v.id}.${form.id}`,
      group: v.cls,
      near: v.id,
      prompt: {
        main: v.jp, lang: 'jp', sub: v.reading, gloss: v.gloss,
        tag: `${form.label} · ${form.jp}`, jp: `${v.ko} (${v.koRr})`,
      },
      answer: { main: f.result, lang: 'jp', sub: f.reading },
    }
  }),
)

const JA_VERBS = {
  id: 'verbs', glyph: '動詞', label: 'verb conjugation',
  blurb: 'A verb and a form — drop る or shift the stem. 飲む → 飲みます · 飲んだ · 飲める.',
  promptLabel: 'which form?',
  hint: 'tap the shape that fits the form',
  groups: groupsBy(verbCards, JV_CLASSES.map(c => ({
    id: c.id, label: `${c.jp} · ${c.en}`, match: card => card.group === c.id,
  }))),
  cards: verbCards,
}

// ---------------------------------------------------------------------
// 2 · こそあど — the pointer grid (deixis, inverted)
//   prompt: the meaning + the slot (pointer × category); 한국어 twin cue
//   answer: the pointer word
//   near = category → distractors are the same column's other pointers
//   (この / その / あの / どの), the ano·kono·sono·dono confusion exactly.
// ---------------------------------------------------------------------
const SERIES_ROLE = { ko: 'near me', so: 'by you', a: 'over there', do: 'the unknown' }
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
      answer: { main: cell.word, lang: 'jp', sub: cell.reading },
    }
  }),
)

const JA_DEIXIS = {
  id: 'deixis', glyph: 'こそあど', label: 'this · that · what',
  blurb: 'Point at a meaning — pick the pointer. こ near me, そ by you, あ yonder, ど the unknown.',
  promptLabel: 'which pointer?',
  hint: 'tap the word that points there',
  groups: CATEGORIES.map(cat => ({
    id: cat.id, label: cat.label, ids: deixisCards.filter(c => c.group === cat.id).map(c => c.id),
  })),
  // the 4×6 grid as a quiz surface (see koreanQuizzes.js). Japanese words
  // are kana, so the free-entry engine is hiragana; readings roundtrip when
  // typed as spelling (kou → こう), the long-vowel macron being display-only.
  grid: {
    script: 'jp', imeScript: 'hiragana',
    rows: SERIES.map(s => ({ id: s.id, glyph: s.prefix, role: s.role })),
    cols: CATEGORIES.map(c => ({ id: c.id, label: c.label, latin: c.latin, suffix: c.suffix })),
  },
  cards: deixisCards,
}

// ---------------------------------------------------------------------
// 3 · 形容詞 — the い/な bench (adjectives, inverted)
//   prompt: the adjective + the target form
//   answer: the inflected shape (い inflects itself, な inflects だ)
//   near = adjective id → distractors are that adjective's other forms.
//   Scope chips: い-adjectives vs な-adjectives.
// ---------------------------------------------------------------------
const adjCards = [
  ...I_ADJECTIVES.map(a => ['i', a]),
  ...NA_ADJECTIVES.map(a => ['na', a]),
].flatMap(([type, a]) =>
  ADJ_FORMS.map(form => {
    const f = a.forms[form.id]
    return {
      id: `a.${a.id}.${form.id}`,
      group: type,
      near: a.id,
      prompt: {
        main: a.jp, lang: 'jp', sub: a.reading, gloss: a.gloss,
        tag: `${form.label} · ${ADJ_TYPES[type].mark}`, jp: `${a.ko} (${a.koRr})`,
      },
      answer: { main: f.result, lang: 'jp', sub: f.reading },
    }
  }),
)

const JA_ADJ = {
  id: 'adjectives', glyph: '形容詞', label: 'adjective forms',
  blurb: 'An adjective and a form — い inflects itself, な inflects the copula. 高い → 高かった.',
  promptLabel: 'which form?',
  hint: 'tap the shape that fits the form',
  groups: groupsBy(adjCards, [
    { id: 'i',  label: `${ADJ_TYPES.i.label}`,  match: c => c.group === 'i' },
    { id: 'na', label: `${ADJ_TYPES.na.label}`, match: c => c.group === 'na' },
  ]),
  cards: adjCards,
}

export const JA_DECKS = [JA_VERBS, JA_DEIXIS, JA_ADJ]
