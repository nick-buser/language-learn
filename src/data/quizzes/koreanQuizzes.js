// =====================================================================
// The Polyglot's Atlas — Korean · the proving ground (단련) · decks
//
// The Korean folios, run backwards into questions. Each deck is assembled
// here from the SAME hand-checked module the live instrument reads, so a
// card can never disagree with the forge, the gate, or the cabinet — the
// surface forms are never re-typed, only re-pointed.
//
//   1. 동사 활용  — the verb forge inverted: a verb + a tense, which form?
//   2. 활용표      — the conjugation table: one verb across register × tense
//   3. 이·그·저    — the pointer grid inverted: a meaning, which pointer?
//   4. 조사        — the 받침 gate inverted: a noun + a role, which particle SHAPE?
//   5. 서랍        — the cabinet inverted: a job (+ JP twin), which particle?
//   6. 빈칸        — the cabinet's specimen, the particle blanked: fill the slot.
//
// The three particle decks split the folio's axes: 조사 (the gate) drills the
// 받침 ALLOMORPHY of the skeleton few; 서랍 (the drawers) drills WHICH of the
// cabinet's 33 particles does a job, abstractly; 빈칸 (the blank) drills the
// same WHICH, but in the wild — the particle gone from its own specimen
// sentence, the Japanese twin riding the bridge as the transfer cue. All
// three scope by the folio's own five drawers.
//
// See ./schema.js for the deck/card contract.
// =====================================================================

import {
  FORGE_VERBS, FORGE_TENSES, GATE_NOUNS, GATE_PAIRS,
  CONJ_VERBS, CONJ_REGISTERS, CONJ_TENSES,
} from '../koreanData.js'
import { SERIES, CATEGORIES, GRID } from '../koreanDeixis.js'
import { PARTICLE_FAMILIES } from '../koreanParticles.js'
import { joinRr, groupsBy, clozeSegments } from './schema.js'

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
// 2 · 활용표 — the conjugation table (the forge × the register dial)
//   One verb, the whole grid: register (rows) × tense (cols). The card's
//   prompt names the verb + the slot (past · 해요체); the answer is that cell.
//   near = verb id → the three distractors are the SAME verb's OTHER cells,
//   so a right answer means you placed the register AND the tense, not just
//   recognized the verb. Scope chips (flashcards) and the grid's verb picker
//   both select one verb at a time — "a quiz within verb," the pattern drilled.
// ---------------------------------------------------------------------
const conjCards = CONJ_VERBS.flatMap(v =>
  CONJ_REGISTERS.flatMap(r =>
    CONJ_TENSES.map(t => {
      const cell = v.table[r.id][t.id]
      return {
        id: `c.${v.id}.${r.id}.${t.id}`,
        group: v.id,
        near: v.id,
        pick: v.id, row: r.id, col: t.id,
        prompt: {
          main: v.kr, lang: 'kr', sub: `${v.rr}-`, gloss: v.gloss,
          tag: `${t.label} · ${r.kr}`, jp: v.jp,
        },
        answer: { main: cell.kr, lang: 'kr', sub: cell.rr },
      }
    }),
  ),
)

const KO_CONJ = {
  id: 'conj', glyph: '활용표', label: 'the conjugation table',
  blurb: 'One verb, the whole table — register × tense. 가다 → 갑니다 · 가요 · 갈 거야.',
  promptLabel: 'which form fits the slot?',
  hint: 'tap the form for that register & tense',
  groups: CONJ_VERBS.map(v => ({
    id: v.id, label: v.kr, ids: conjCards.filter(c => c.group === v.id).map(c => c.id),
  })),
  // the per-verb table as a grid surface: register rows × tense cols, with a
  // verb PICKER on top (the third dial, handled as a selector not an axis).
  // choose (cell → form) and locate (form → cell); type is omitted — the
  // conjugated forms carry 받침/liaison spelling the romaja IME can't fairly
  // grade (갔다 needs ㅆ, not the pronounced [t]).
  grid: {
    script: 'kr', imeScript: 'hangul', modes: ['choose', 'locate'],
    pick: {
      label: 'verb',
      options: CONJ_VERBS.map(v => ({ id: v.id, glyph: v.kr, gloss: v.gloss, sub: v.rr, jp: v.jp, note: v.pattern })),
    },
    rows: CONJ_REGISTERS.map(r => ({ id: r.id, glyph: r.kr, role: r.en })),
    cols: CONJ_TENSES.map(t => ({ id: t.id, label: t.label, latin: t.latin, suffix: t.marker })),
  },
  cards: conjCards,
}

// ---------------------------------------------------------------------
// 3 · 이·그·저 — the pointer grid (deixis, inverted)
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
// 4 · 조사 — the 받침 gate (particle allomorphy, inverted)
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

// ---------------------------------------------------------------------
// 5 · 서랍 — the particle drawers (the cabinet, inverted)
//   The 조사 folio sorts 33 particles into five semantic drawers; this deck
//   runs that sort backwards. The prompt names the JOB (the role, in
//   English) with the particle's Japanese twin riding the showJp bridge as
//   the transfer cue — hide it and you are testing recall on the meaning
//   alone; show it and it is a straight より→보다 transfer drill. The answer
//   is the Korean particle, shape-pair and all (은 / 는).
//   near = the drawer → the three distractors are the target's DRAWER-MATES,
//   the genuinely confusable cohort: the three registers of "and" (와·하고·
//   랑), the focus set's even/only family (도·만·밖에·조차·마저). The scope
//   chips ARE the folio's drawers — its own groupings, reused as the quiz's.
//   Pairs with the 조사 gate: that deck drills which SHAPE, this which WORD.
// ---------------------------------------------------------------------
const DRAWER_LABEL = {
  skeleton: '뼈대 (skeleton)',
  place: '자리 (place)',
  pairing: '짝 (pairing)',
  focus: '초점 (focus)',
  social: '사람 (social)',
}
const cabinetCards = PARTICLE_FAMILIES.flatMap(fam =>
  fam.entries.map(p => ({
    id: `pf.${fam.id}.${p.id}`,
    group: fam.id,
    near: fam.id,
    prompt: {
      main: p.role, tag: DRAWER_LABEL[fam.id], jp: p.jp,
    },
    answer: { main: p.forms, lang: 'kr', sub: p.rr },
  })),
)

const KO_CABINET = {
  id: 'cabinet', glyph: '서랍', label: 'the particle drawers',
  blurb: 'A job and its Japanese twin — name the Korean particle. “than” (より) → 보다.',
  promptLabel: 'which particle?',
  hint: 'tap the particle that does this job',
  groups: PARTICLE_FAMILIES.map(fam => ({
    id: fam.id, label: DRAWER_LABEL[fam.id],
    ids: cabinetCards.filter(c => c.group === fam.id).map(c => c.id),
  })),
  cards: cabinetCards,
}

// ---------------------------------------------------------------------
// 6 · 빈칸 — fill the blank (the cabinet's specimen, the particle gone)
//   The 서랍 deck names the job in the abstract; this one shows the job in
//   the wild. Each card is a particle's OWN specimen sentence with the
//   particle lifted out — 커피▢ 마시지만 차▢ 안 마셔요 — under the English
//   translation, with the Japanese specimen riding the showJp bridge (it
//   carries the twin は/が/より, so the bridge IS the disambiguator when a
//   slot could take more than one). The answer is the particle, shape-pair
//   and all; near = the drawer, so the distractors are drawer-mates, the
//   same confusable cohort as 서랍. No sentence reading is shown — the gap is
//   the point — so the prompt withholds RR; the options carry it on reveal.
//   Built from the SAME specimens the cabinet cards display (clozeSegments
//   strips the <m>…</m> the folio uses to highlight the particle), so the
//   sentence and its blank can never disagree with the live card.
// ---------------------------------------------------------------------
const clozeCards = PARTICLE_FAMILIES.flatMap(fam =>
  fam.entries.map(p => ({
    id: `pc.${fam.id}.${p.id}`,
    group: fam.id,
    near: fam.id,
    prompt: {
      cloze: clozeSegments(p.ex.kr), lang: 'kr',
      gloss: p.ex.en, tag: DRAWER_LABEL[fam.id], jp: p.ex.jp,
    },
    answer: { main: p.forms, lang: 'kr', sub: p.rr },
  })),
)

const KO_CLOZE = {
  id: 'cloze', glyph: '빈칸', label: 'fill the blank',
  blurb: 'A real sentence, the particle gone — drop it back in. 커피▢ 마시지만 차▢ … → 은 / 는.',
  promptLabel: 'which particle fills the blank?',
  hint: 'tap the particle the sentence is missing',
  groups: PARTICLE_FAMILIES.map(fam => ({
    id: fam.id, label: DRAWER_LABEL[fam.id],
    ids: clozeCards.filter(c => c.group === fam.id).map(c => c.id),
  })),
  cards: clozeCards,
}

export const KO_DECKS = [KO_VERBS, KO_CONJ, KO_DEIXIS, KO_PARTICLES, KO_CABINET, KO_CLOZE]
