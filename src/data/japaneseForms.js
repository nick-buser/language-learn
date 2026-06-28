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

// ---- the conditional: four "if"s, one English word ----
export const COND_VERBS = pick('taberu', 'iku', 'nomu', 'suru', 'kuru')

// ば is the one form not cleanly derivable across classes — authored per verb.
const BA = {
  taberu: { r: '食べれば', rr: 'tabereba' },
  iku: { r: '行けば', rr: 'ikeba' },
  nomu: { r: '飲めば', rr: 'nomeba' },
  suru: { r: 'すれば', rr: 'sureba' },
  kuru: { r: '来れば', rr: 'kureba' },
}

// the four conditional forms for a verb: ば authored, the rest derived
// (たら = past + ら, と = dict + と, なら = dict + なら).
export function condForms(verb) {
  return {
    ba: BA[verb.id],
    tara: { r: verb.forms.past.result + 'ら', rr: verb.forms.past.reading + 'ra' },
    to: { r: verb.jp + 'と', rr: verb.reading + ' to' },
    nara: { r: verb.jp + 'なら', rr: verb.reading + ' nara' },
  }
}

export const CONDITIONALS = [
  {
    id: 'ba', label: 'ば', niche: 'general · hypothetical',
    use: 'A general “if A, then B” — conditions, advice, proverbs, things that follow logically. Tends to focus on the condition itself. You usually can’t put a request or command in the main clause.',
    ex: { jp: '早く行けば、間に合う。', reading: 'hayaku ikeba, ma ni au', en: 'If you go early, you’ll make it.' },
    ko: '-(으)면', koNote: 'Korean’s one all-purpose “if” — 가면, 먹으면. It quietly covers most of both ば and たら.',
  },
  {
    id: 'tara', label: 'たら', niche: 'when / once · specific',
    use: 'The most versatile and conversational — “when/once A happens, B.” Usually a specific, one-time sequence, and the only one that freely takes a request or command after it.',
    ex: { jp: '駅に着いたら、電話して。', reading: 'eki ni tsuitara, denwa shite', en: 'When you reach the station, call me.' },
    ko: '-(으)면 · -았/었더니', koNote: 'Again -(으)면 for the “if/when”; for “and then I found…” Korean reaches for -더니.',
  },
  {
    id: 'to', label: 'と', niche: 'automatic · natural result',
    use: '“Whenever A, B — always.” An automatic, inevitable consequence: no choice, no intention. Directions and machines live here. The main clause can’t be a request, command, or “let’s.”',
    ex: { jp: 'まっすぐ行くと、駅がある。', reading: 'massugu iku to, eki ga aru', en: 'Go straight and there’s the station.' },
    ko: '-(으)면 · -자마자', koNote: 'No exact twin; Korean uses 면 for the general case, or -자마자 for “the moment that.”',
  },
  {
    id: 'nara', label: 'なら', niche: 'if it’s the case that…',
    use: 'Contextual — “if (it’s true that) A, then…”, picking up something just said or assumed. Often advice keyed to the other person’s statement or plan.',
    ex: { jp: '行くなら、傘を持って。', reading: 'iku nara, kasa o motte', en: 'If you’re going, take an umbrella.' },
    ko: '-(ㄴ/는)다면 · -(이)라면', koNote: 'Korean’s explicitly-hypothetical/quotative “if” — 간다면, 학생이라면 — matches なら’s “if it’s the case.”',
  },
]

// ---- volitional & imperative: proposing and commanding ----
export const VI_VERBS = pick('taberu', 'iku', 'nomu', 'suru', 'kuru')

// volitional-casual (〜おう/よう) and blunt imperative (〜ろ/え) — irregular
// across classes, so authored; the rest derive from polite (ます→ましょう/なさい),
// te (+ください), and dict (+な).
const VOL_CASUAL = {
  taberu: { r: '食べよう', rr: 'tabeyō' }, iku: { r: '行こう', rr: 'ikō' }, nomu: { r: '飲もう', rr: 'nomō' },
  suru: { r: 'しよう', rr: 'shiyō' }, kuru: { r: '来よう', rr: 'koyō' },
}
const IMP_BLUNT = {
  taberu: { r: '食べろ', rr: 'tabero' }, iku: { r: '行け', rr: 'ike' }, nomu: { r: '飲め', rr: 'nome' },
  suru: { r: 'しろ', rr: 'shiro' }, kuru: { r: '来い', rr: 'koi' },
}
const VI_KO = {
  taberu: { volC: '먹자', volCRr: 'meokja', volP: '먹읍시다', volPRr: 'meogeupsida', impB: '먹어라', impBRr: 'meogeora', impP: '드세요', impPRr: 'deuseyo', impN: '먹지 마', impNRr: 'meokji ma' },
  iku: { volC: '가자', volCRr: 'gaja', volP: '갑시다', volPRr: 'gapsida', impB: '가라', impBRr: 'gara', impP: '가세요', impPRr: 'gaseyo', impN: '가지 마', impNRr: 'gaji ma' },
  nomu: { volC: '마시자', volCRr: 'masija', volP: '마십시다', volPRr: 'masipsida', impB: '마셔라', impBRr: 'masyeora', impP: '마세요', impPRr: 'maseyo', impN: '마시지 마', impNRr: 'masiji ma' },
  suru: { volC: '하자', volCRr: 'haja', volP: '합시다', volPRr: 'hapsida', impB: '해라', impBRr: 'haera', impP: '하세요', impPRr: 'haseyo', impN: '하지 마', impNRr: 'haji ma' },
  kuru: { volC: '오자', volCRr: 'oja', volP: '옵시다', volPRr: 'opsida', impB: '와라', impBRr: 'wara', impP: '오세요', impPRr: 'oseyo', impN: '오지 마', impNRr: 'oji ma' },
}

export function viForms(verb) {
  const pol = verb.forms.polite
  return {
    volCasual: VOL_CASUAL[verb.id],
    volPolite: { r: pol.result.replace(/ます$/, 'ましょう'), rr: pol.reading.replace(/masu$/, 'mashō') },
    impBlunt: IMP_BLUNT[verb.id],
    impNasai: { r: pol.result.replace(/ます$/, 'なさい'), rr: pol.reading.replace(/masu$/, 'nasai') },
    impRequest: { r: verb.forms.te.result + 'ください', rr: verb.forms.te.reading + ' kudasai' },
    impNeg: { r: verb.jp + 'な', rr: verb.reading + ' na' },
    ko: VI_KO[verb.id],
  }
}

// the imperative spectrum, blunt → polite, with the Korean twin keys
export const IMP_SPECTRUM = [
  { id: 'blunt', form: 'impBlunt', jp: '〜ろ / 〜え', label: 'blunt', note: 'A bare order — drill sergeants, anger, signs, men’s rough speech. Rare in daily life.', koKey: 'impB', ko: '-아라/어라' },
  { id: 'nasai', form: 'impNasai', jp: '〜なさい', label: 'instructing', note: 'The parent-to-child / teacher-to-student command. Firm but not rude.', koKey: 'impB', ko: '-아라/어라' },
  { id: 'request', form: 'impRequest', jp: '〜てください', label: 'requesting', note: 'The everyday polite “please —”. What you’ll actually use to ask someone to do something.', koKey: 'impP', ko: '-(으)세요' },
  { id: 'neg', form: 'impNeg', jp: '〜な', label: 'negative', note: 'The blunt “don’t —!” (食べるな). The polite version is 〜ないでください.', koKey: 'impN', ko: '-지 마(세요)' },
]

export const VI_LANTERN = {
  head: 'urging is where register bites',
  body: 'Proposing and commanding are the acts most loaded with social weight, so this is exactly where the ' +
    'plain/polite split you met on the 動詞 folio turns sharp. 食べよう (let’s — to a friend) vs 食べましょう ' +
    '(let’s — polite); 食べろ (a bare order) vs 食べてください (a request). <b>Korean runs the same spectrum</b>: ' +
    '-자 / -(으)ㅂ시다 for “let’s,” and an imperative ladder from blunt -아라 up to -(으)세요 — with the famous ' +
    '-지 마 for “don’t.” Get the rung wrong and you’ve insulted someone; this is the grammar of being polite.',
}

export const COND_LANTERN = {
  head: 'four “if”s, and the situation each owns',
  body: 'English makes one word do all of this. Japanese spends four, and they aren’t interchangeable: ば is ' +
    'the <i>general</i> condition, たら the <i>specific when</i> (and the only one that takes a command), と ' +
    'the <i>automatic</i> result (no will allowed), なら the <i>contextual</i> “if it’s the case.” <b>Korean ' +
    'collapses most of them back to one</b> — -(으)면 — keeping a separate -(ㄴ/는)다면 only for the explicitly ' +
    'hypothetical case. So the work here is unlearning the reflex to translate “if” as a single thing.',
}
