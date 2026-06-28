// =====================================================================
// The Polyglot's Atlas — Japanese · 活用 constructions (the forms folio)
//
// The non-obvious verb forms, each given its own instrument: the te-form
// and its compounds, the four conditionals, and volitional + imperative.
// The plain conjugations (tense/negation/politeness/voice) live on the
// 動詞 folio; these are the constructions that don't fall out by rule.
//
// Verb data is reused from japaneseVerbs.js (the te-form, onbin pieces).
// Korean twins are authored here, since Korean has its own joints.
// =====================================================================
import { FORGE_VERBS } from './japaneseVerbs.js'

const pick = (...ids) => ids.map(id => FORGE_VERBS.find(v => v.id === id))

// ---- the te-form: one shape, a dozen meanings ----
export const TE_VERBS = pick('taberu', 'iku', 'kaku', 'nomu', 'matsu', 'suru')

// the -아/어 form (for -아 보다, -아 주다…) and the -고 form (for -고 있다, -고 나서)
export const TE_KO = {
  taberu: { a: '먹어', go: '먹고' },
  iku: { a: '가', go: '가고' },
  kaku: { a: '써', go: '쓰고' },
  nomu: { a: '마셔', go: '마시고' },
  matsu: { a: '기다려', go: '기다리고' },
  suru: { a: '해', go: '하고' },
}

// each compound attaches to the verb's te-form; Korean assembles from {a, go}
// (koBase) + koSuffix, or a fixed pattern where the joint differs.
export const TE_COMPOUNDS = [
  { id: 'bare', jp: '', reading: '', label: 'the connective', bare: true,
    gloss: 'On its own: “…and then”, “…and so.” The te-form chains clauses — the workhorse that strings a sentence together.',
    koBase: 'go', koSuffix: '', koGloss: '-고 (and) / -아·어서 (and so)' },
  { id: 'iru', jp: 'いる', reading: ' iru', label: '〜ている',
    gloss: 'is —ing, and the resulting state. Progressive and state collapse into one form (見ている = watching; 知っている = know).',
    koBase: 'go', koSuffix: ' 있어', koGloss: '-고 있다' },
  { id: 'miru', jp: 'みる', reading: ' miru', label: '〜てみる',
    gloss: 'try —ing — do it and see how it goes. From 見る “see.”',
    koBase: 'a', koSuffix: ' 봐', koGloss: '-아/어 보다 (literally “see”, same metaphor)' },
  { id: 'shimau', jp: 'しまう', reading: ' shimau', label: '〜てしまう',
    gloss: 'finish completely — or do by accident / to one’s regret. Casual: 〜ちゃう (食べちゃった).',
    koBase: 'a', koSuffix: ' 버려', koGloss: '-아/어 버리다' },
  { id: 'oku', jp: 'おく', reading: ' oku', label: '〜ておく',
    gloss: 'do in advance — leave it done, ready for later. Casual: 〜とく.',
    koBase: 'a', koSuffix: ' 둬', koGloss: '-아/어 두다 / 놓다' },
  { id: 'kudasai', jp: 'ください', reading: ' kudasai', label: '〜てください',
    gloss: 'please — . The standard polite request.',
    koBase: 'a', koSuffix: ' 주세요', koGloss: '-아/어 주세요' },
  { id: 'moii', jp: 'もいい', reading: ' mo ii', label: '〜てもいい',
    gloss: 'may — , it’s OK to — . Permission (and 〜ても “even if”).',
    koBase: 'a', koSuffix: '도 돼', koGloss: '-아/어도 되다' },
  { id: 'ikenai', jp: 'はいけない', reading: ' wa ikenai', label: '〜てはいけない',
    gloss: 'must not — . Prohibition. Casual: 〜ちゃだめ.',
    koFixed: true, koSuffix: ' (으)면 안 돼', koGloss: '-(으)면 안 되다 — note Korean uses 면, not the connective' },
  { id: 'kara', jp: 'から', reading: ' kara', label: '〜てから',
    gloss: 'after —ing, (then)… — explicit sequence, “only after.”',
    koBase: 'go', koSuffix: ' 나서', koGloss: '-고 나서' },
]

export const TE_LANTERN = {
  head: 'one form, a dozen jobs',
  body: 'Everything here hangs off a single shape — the te-form. Learn the 音便 once (書いて, 飲んで, 待って, ' +
    '行って) and you’ve unlocked the connective, the progressive, requests, permission, prohibition, ' +
    'attempts, preparation — the whole spoken scaffold. <b>Korean splits the load across two stems</b>: the ' +
    '-고 form (listing, -고 있다, -고 나서) and the -아/어 form (-아서, -아 보다, -아 주다). Where Japanese ' +
    'reaches for て, ask: is this a <i>list</i> (-고) or a <i>flow</i> (-아/어)?',
}
