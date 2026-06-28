// =====================================================================
// The Polyglot's Atlas — Japanese · the adjective forge (形容詞)
// The two adjective classes, conjugated side by side:
//   · い-adjectives (形容詞)     — inflect THEMSELVES, like quasi-verbs
//   · な-adjectives (形容動詞)   — inflect the COPULA, like quasi-nouns
// The reverse bridge (한국어) carries the thesis: Korean draws neither
// line. Its adjectives ARE verbs — 비싸다 conjugates exactly like 가다 —
// so both Japanese classes collapse into the one verb forge.
//
// Conventions: jp / reading (romaji, plain forms) / ko / koRr (반말, to
// match the plain Japanese forms; pronunciation-reflecting RR).
// Pieces: stem (ink) · harm (gold — the inflecting morpheme) · tail.
// For な-adjectives the gold morpheme IS the copula (だ/で/に/じゃない),
// detached from an unchanging stem — the visual heart of the contrast.
// =====================================================================

export const ADJ_TYPES = {
  i:  { jp: '形容詞',   rr: 'keiyōshi',   label: 'い-adjective', mark: 'い', tag: 'inflects itself — a quasi-verb' },
  na: { jp: '形容動詞', rr: 'keiyōdōshi', label: 'な-adjective', mark: 'な', tag: 'inflects the copula — a quasi-noun' },
}

// the six forms, each with the い/な/Korean contrast it teaches
export const ADJ_FORMS = [
  {
    id: 'present', label: 'present', jp: 'plain',
    contrast: 'An い-adjective is already a whole predicate — 高い needs nothing. A な-adjective is a noun at heart, so it borrows the copula to stand up: 静か<b>だ</b> (polite 静か<b>です</b>). Korean ends every adjective the way it ends a verb: 비싸, 조용해.',
  },
  {
    id: 'negative', label: 'negative', jp: '〜ない',
    contrast: 'い swaps い→<b>く</b> and adds ない (高<b>く</b>ない). な keeps its stem intact and negates the copula: <b>じゃない</b> (静か<b>じゃない</b>). Korean negates an adjective the same way it negates a verb — 안 비싸 / 비싸지 않아.',
  },
  {
    id: 'past', label: 'past', jp: '〜た',
    contrast: 'い carries its OWN past, like a verb: い→<b>かった</b> (高<b>かった</b>). な leans on the copula’s past <b>だった</b> (静か<b>だった</b>). Korean: just the verb past, 비쌌어.',
  },
  {
    id: 'pastneg', label: 'past neg.', jp: '〜なかった',
    contrast: 'い stacks く + なかった (高<b>くなかった</b>). な stacks じゃ + なかった (静か<b>じゃなかった</b>). Korean stacks 안 onto the past, 안 비쌌어 — one system for everything.',
  },
  {
    id: 'te', label: 'te / and', jp: '〜て',
    contrast: 'The “and / so” joint: い→<b>くて</b> (高<b>くて</b>), な→<b>で</b> (静か<b>で</b>). Korean joins adjectives with the very connectives it uses for verbs: -아/어서, -고 (비싸서, 비싸고).',
  },
  {
    id: 'adverb', label: 'adverb', jp: '〜く / 〜に',
    contrast: 'To modify a verb: い→<b>く</b> (高<b>く</b>), な→<b>に</b> (静か<b>に</b>). Korean derives adverbs from ANY adjective with one suffix, <b>-게</b> (비싸게, 조용하게) — again, no split.',
  },
]

export const I_ADJECTIVES = [
  {
    id: 'takai', jp: '高い', reading: 'takai', stem: '高', gloss: 'expensive / high',
    ko: '비싸다', koRr: 'bissada',
    forms: {
      present:  { pieces: [{ t: '高', c: 'stem' }, { t: 'い', c: 'tail' }], result: '高い', reading: 'takai', ko: '비싸', koRr: 'bissa' },
      negative: { pieces: [{ t: '高', c: 'stem' }, { t: 'く', c: 'harm' }, { t: 'ない', c: 'tail' }], result: '高くない', reading: 'takakunai', ko: '안 비싸', koRr: 'an bissa' },
      past:     { pieces: [{ t: '高', c: 'stem' }, { t: 'かった', c: 'harm' }], result: '高かった', reading: 'takakatta', ko: '비쌌어', koRr: 'bissasseo' },
      pastneg:  { pieces: [{ t: '高', c: 'stem' }, { t: 'く', c: 'harm' }, { t: 'なかった', c: 'tail' }], result: '高くなかった', reading: 'takakunakatta', ko: '안 비쌌어', koRr: 'an bissasseo' },
      te:       { pieces: [{ t: '高', c: 'stem' }, { t: 'く', c: 'harm' }, { t: 'て', c: 'tail' }], result: '高くて', reading: 'takakute', ko: '비싸서 · 비싸고', koRr: 'bissaseo · bissago' },
      adverb:   { pieces: [{ t: '高', c: 'stem' }, { t: 'く', c: 'harm' }], result: '高く', reading: 'takaku', ko: '비싸게', koRr: 'bissage' },
    },
  },
  {
    id: 'ookii', jp: '大きい', reading: 'ōkii', stem: '大き', gloss: 'big',
    ko: '크다', koRr: 'keuda',
    forms: {
      present:  { pieces: [{ t: '大き', c: 'stem' }, { t: 'い', c: 'tail' }], result: '大きい', reading: 'ōkii', ko: '커', koRr: 'keo' },
      negative: { pieces: [{ t: '大き', c: 'stem' }, { t: 'く', c: 'harm' }, { t: 'ない', c: 'tail' }], result: '大きくない', reading: 'ōkikunai', ko: '안 커', koRr: 'an keo' },
      past:     { pieces: [{ t: '大き', c: 'stem' }, { t: 'かった', c: 'harm' }], result: '大きかった', reading: 'ōkikatta', ko: '컸어', koRr: 'keosseo' },
      pastneg:  { pieces: [{ t: '大き', c: 'stem' }, { t: 'く', c: 'harm' }, { t: 'なかった', c: 'tail' }], result: '大きくなかった', reading: 'ōkikunakatta', ko: '안 컸어', koRr: 'an keosseo' },
      te:       { pieces: [{ t: '大き', c: 'stem' }, { t: 'く', c: 'harm' }, { t: 'て', c: 'tail' }], result: '大きくて', reading: 'ōkikute', ko: '커서 · 크고', koRr: 'keoseo · keugo' },
      adverb:   { pieces: [{ t: '大き', c: 'stem' }, { t: 'く', c: 'harm' }], result: '大きく', reading: 'ōkiku', ko: '크게', koRr: 'keuge' },
    },
  },
  {
    id: 'ii', jp: 'いい', reading: 'ii', stem: '良', gloss: 'good', irregular: true,
    ko: '좋다', koRr: 'jota',
    forms: {
      present:  { pieces: [{ t: 'いい', c: 'stem' }], result: 'いい', reading: 'ii', ko: '좋아', koRr: 'joa', note: 'present only — the rest revert to 良 (よ)' },
      negative: { pieces: [{ t: 'よ', c: 'stem' }, { t: 'く', c: 'harm' }, { t: 'ない', c: 'tail' }], result: 'よくない', reading: 'yokunai', ko: '안 좋아', koRr: 'an joa', note: 'not ✗いくない' },
      past:     { pieces: [{ t: 'よ', c: 'stem' }, { t: 'かった', c: 'harm' }], result: 'よかった', reading: 'yokatta', ko: '좋았어', koRr: 'joasseo', note: 'not ✗いかった' },
      pastneg:  { pieces: [{ t: 'よ', c: 'stem' }, { t: 'く', c: 'harm' }, { t: 'なかった', c: 'tail' }], result: 'よくなかった', reading: 'yokunakatta', ko: '안 좋았어', koRr: 'an joasseo' },
      te:       { pieces: [{ t: 'よ', c: 'stem' }, { t: 'く', c: 'harm' }, { t: 'て', c: 'tail' }], result: 'よくて', reading: 'yokute', ko: '좋아서 · 좋고', koRr: 'joaseo · joko' },
      adverb:   { pieces: [{ t: 'よ', c: 'stem' }, { t: 'く', c: 'harm' }], result: 'よく', reading: 'yoku', ko: '좋게', koRr: 'joke' },
    },
  },
]

export const NA_ADJECTIVES = [
  {
    id: 'shizuka', jp: '静か', reading: 'shizuka', stem: '静か', gloss: 'quiet',
    ko: '조용하다', koRr: 'joyonghada',
    forms: {
      present:  { pieces: [{ t: '静か', c: 'stem' }, { t: 'だ', c: 'harm' }], result: '静かだ', reading: 'shizuka da', ko: '조용해', koRr: 'joyonghae', note: 'polite 静かです' },
      negative: { pieces: [{ t: '静か', c: 'stem' }, { t: 'じゃない', c: 'harm' }], result: '静かじゃない', reading: 'shizuka ja nai', ko: '안 조용해', koRr: 'an joyonghae', note: 'formal 静かではない' },
      past:     { pieces: [{ t: '静か', c: 'stem' }, { t: 'だった', c: 'harm' }], result: '静かだった', reading: 'shizuka datta', ko: '조용했어', koRr: 'joyonghaesseo' },
      pastneg:  { pieces: [{ t: '静か', c: 'stem' }, { t: 'じゃなかった', c: 'harm' }], result: '静かじゃなかった', reading: 'shizuka ja nakatta', ko: '안 조용했어', koRr: 'an joyonghaesseo' },
      te:       { pieces: [{ t: '静か', c: 'stem' }, { t: 'で', c: 'harm' }], result: '静かで', reading: 'shizuka de', ko: '조용해서 · 조용하고', koRr: 'joyonghaeseo · joyonghago' },
      adverb:   { pieces: [{ t: '静か', c: 'stem' }, { t: 'に', c: 'harm' }], result: '静かに', reading: 'shizuka ni', ko: '조용하게 · 조용히', koRr: 'joyonghage · joyonghi' },
    },
  },
  {
    id: 'yuumei', jp: '有名', reading: 'yūmei', stem: '有名', gloss: 'famous',
    ko: '유명하다', koRr: 'yumyeonghada', cognate: true,
    forms: {
      present:  { pieces: [{ t: '有名', c: 'stem' }, { t: 'だ', c: 'harm' }], result: '有名だ', reading: 'yūmei da', ko: '유명해', koRr: 'yumyeonghae', note: '有名 = 유명 — the same 漢字' },
      negative: { pieces: [{ t: '有名', c: 'stem' }, { t: 'じゃない', c: 'harm' }], result: '有名じゃない', reading: 'yūmei ja nai', ko: '안 유명해', koRr: 'an yumyeonghae' },
      past:     { pieces: [{ t: '有名', c: 'stem' }, { t: 'だった', c: 'harm' }], result: '有名だった', reading: 'yūmei datta', ko: '유명했어', koRr: 'yumyeonghaesseo' },
      pastneg:  { pieces: [{ t: '有名', c: 'stem' }, { t: 'じゃなかった', c: 'harm' }], result: '有名じゃなかった', reading: 'yūmei ja nakatta', ko: '안 유명했어', koRr: 'an yumyeonghaesseo' },
      te:       { pieces: [{ t: '有名', c: 'stem' }, { t: 'で', c: 'harm' }], result: '有名で', reading: 'yūmei de', ko: '유명해서 · 유명하고', koRr: 'yumyeonghaeseo · yumyeonghago' },
      adverb:   { pieces: [{ t: '有名', c: 'stem' }, { t: 'に', c: 'harm' }], result: '有名に', reading: 'yūmei ni', ko: '유명하게', koRr: 'yumyeonghage', note: '有名になる — become famous' },
    },
  },
  {
    id: 'kirei', jp: 'きれい', reading: 'kirei', stem: 'きれい', gloss: 'pretty / clean', falseFriend: true,
    ko: '예쁘다', koRr: 'yeppeuda',
    forms: {
      present:  { pieces: [{ t: 'きれい', c: 'stem' }, { t: 'だ', c: 'harm' }], result: 'きれいだ', reading: 'kirei da', ko: '예뻐', koRr: 'yeppeo', note: '綺麗 — the い is inside the kanji, not okurigana' },
      negative: { pieces: [{ t: 'きれい', c: 'stem' }, { t: 'じゃない', c: 'harm' }], result: 'きれいじゃない', reading: 'kirei ja nai', ko: '안 예뻐', koRr: 'an yeppeo', note: 'the tell: NOT ✗きれくない' },
      past:     { pieces: [{ t: 'きれい', c: 'stem' }, { t: 'だった', c: 'harm' }], result: 'きれいだった', reading: 'kirei datta', ko: '예뻤어', koRr: 'yeppeosseo' },
      pastneg:  { pieces: [{ t: 'きれい', c: 'stem' }, { t: 'じゃなかった', c: 'harm' }], result: 'きれいじゃなかった', reading: 'kirei ja nakatta', ko: '안 예뻤어', koRr: 'an yeppeosseo' },
      te:       { pieces: [{ t: 'きれい', c: 'stem' }, { t: 'で', c: 'harm' }], result: 'きれいで', reading: 'kirei de', ko: '예뻐서 · 예쁘고', koRr: 'yeppeoseo · yeppeugo' },
      adverb:   { pieces: [{ t: 'きれい', c: 'stem' }, { t: 'に', c: 'harm' }], result: 'きれいに', reading: 'kirei ni', ko: '예쁘게', koRr: 'yeppeuge' },
    },
  },
]

export const ADJ_EUREKAS = {
  contrast: {
    head: '形容詞 vs 形容動詞 — and the line Korean refuses to draw',
    body: 'You are watching two different machines. The <b>い-adjective inflects itself</b> — 高い → 高かった, ' +
          'carrying tense on its own ending like a verb. The <b>な-adjective never moves</b>; it sends an ' +
          'unchanging stem (静か) to the front and makes the <b>copula</b> do all the work (だ → だった → じゃない). ' +
          'One is a quasi-verb, the other a quasi-noun. <b>Korean draws neither line.</b> Its adjectives ARE ' +
          'verbs — 비싸다 conjugates exactly like 가다 (비싸요, 비쌌어요, 비싸지 않아요) — no copula, no second ' +
          'class, no い/な fork. The 동사 verb forge already conjugates these; in Korean there is nothing new to learn.',
  },
  irregular: {
    head: 'いい — the one irregular adjective',
    body: 'The present is いい, but every inflected form reverts to the older stem <b>良 (よ)</b>: よくない, ' +
          'よかった, よく — never ✗いくない, ✗いかった. It is the only irregular い-adjective you must flag (and ' +
          'かっこいい, ださいい-types inherit it). Korean’s match <b>좋다 is perfectly regular</b> — 좋아, 좋았어, ' +
          '좋게. Japanese’s lone adjective exception lands on a Korean word that has none.',
  },
  falseFriend: {
    head: 'きれい — dressed as い, conjugates as な',
    body: '綺麗 ends in い, so the eye files it beside 高い — and it is a <b>な-adjective</b>. The negative is the ' +
          'test: <b>きれいじゃない</b>, never ✗きれくない. The reliable tell is the kanji: a true い-adjective’s い ' +
          'is okurigana <i>outside</i> the kanji (高<b>い</b>), while きれい’s い lives <i>inside</i> the reading ' +
          '(綺麗). 嫌い (hate), 幸い, ていねい play the same trick. Korean sidesteps it whole — 예쁘다 just ' +
          'conjugates like any verb.',
  },
}
