// =====================================================================
// The Polyglot's Atlas — Japanese · こそあど (the deixis folio)
//
// Pro-forms: words that fill a noun slot by POINTING instead of NAMING.
// Three kinds of pointing, three instruments:
//   1. the こそあど grid   — point into space (this / that / over there)
//   2. question words      — point at the unknown (what / who / when)
//   3. personal pronouns   — point at people (I / you / he)
//
// The grid is the centerpiece machine: a word = a deictic PREFIX
// (こ/そ/あ/ど) + a category SUFFIX (れ/の/こ/ちら/んな/う). The ど-row
// IS the question-word set — demonstratives and interrogatives are one
// system. Korean runs the identical machine (이/그/저/어느 ≈ こ/そ/あ/ど),
// so every cell carries its Korean twin under the 한국어 bridge.
//
// Mirror module: koreanDeixis.js (same schema, run the other way).
// Content is hand-checked; romaji is Hepburn, RR reflects pronunciation.
// =====================================================================

/**
 * @typedef {Object} DeixisCell  — one square of the こそあど grid
 * @property {string}  word        surface form (kana)
 * @property {string}  reading     romaji (Hepburn)
 * @property {string}  gloss       English
 * @property {string}  bridge      the Korean twin (hangul)
 * @property {string}  bridgeRr    its Revised Romanization
 * @property {boolean} [irregular] true when the cell breaks prefix+suffix
 * @property {string}  [note]      footnote (usually the irregularity)
 */

/**
 * @typedef {Object} DeixisSeries  — a ROW: the deictic prefix
 * @property {string} id       'ko' | 'so' | 'a' | 'do'
 * @property {string} prefix   こ / そ / あ / ど
 * @property {string} prefixRr ko- / so- / a- / do-
 * @property {string} role     short deixis label
 * @property {string} gloss    plainer gloss
 * @property {('speaker'|'listener'|'far'|'question')} point  where it aims
 */

/**
 * @typedef {Object} DeixisCategory — a COLUMN: the category suffix
 * @property {string} id
 * @property {string} suffix  れ / の / こ / ちら / んな / う
 * @property {string} label   thing / this N / place / direction / kind / manner
 * @property {string} latin   grammatical name
 * @property {string} hint    one-line usage hint
 */

// how every instrument here labels its own script vs. the bridge
export const CONFIG = {
  script: 'jp',                       // headword CSS class
  bridge: 'kr',                       // bridge CSS class
  bridgeTag: '한국어',
  bridgeFont: 'var(--font-kr-serif)',
}

/** @type {DeixisSeries[]} */
export const SERIES = [
  { id: 'ko', prefix: 'こ', prefixRr: 'ko-', role: 'near speaker',   gloss: 'by me',         point: 'speaker'  },
  { id: 'so', prefix: 'そ', prefixRr: 'so-', role: 'near listener',  gloss: 'by you',        point: 'listener' },
  { id: 'a',  prefix: 'あ', prefixRr: 'a-',  role: 'far from both',  gloss: 'over there',    point: 'far'      },
  { id: 'do', prefix: 'ど', prefixRr: 'do-', role: 'the unknown',    gloss: 'which?',        point: 'question' },
]

/** @type {DeixisCategory[]} */
export const CATEGORIES = [
  { id: 'thing',  suffix: 'れ',   label: 'thing',     latin: 'pronoun',     hint: 'stands alone — “this one”: これは…' },
  { id: 'adnom',  suffix: 'の',   label: 'this N',    latin: 'adnominal',   hint: 'always before a noun — この本' },
  { id: 'place',  suffix: 'こ',   label: 'place',     latin: 'locative',    hint: 'here / there / where — ここで' },
  { id: 'dir',    suffix: 'ちら', label: 'direction', latin: 'way · polite “this one”', hint: 'way or side; also the polite これ. Casual: こっち' },
  { id: 'kind',   suffix: 'んな', label: 'kind',      latin: 'such (a)',    hint: 'this kind of N — こんな人' },
  { id: 'manner', suffix: 'う',   label: 'manner',    latin: 'adverb “thus”', hint: 'do it like this — こうする' },
]

/**
 * GRID[seriesId][categoryId] = DeixisCell.
 * Read a row to feel the prefix hold; read a column to feel the suffix hold.
 * @type {Record<string, Record<string, DeixisCell>>}
 */
export const GRID = {
  ko: {
    thing:  { word: 'これ',   reading: 'kore',    gloss: 'this one',        bridge: '이것', bridgeRr: 'igeot' },
    adnom:  { word: 'この',   reading: 'kono',    gloss: 'this N',          bridge: '이',   bridgeRr: 'i' },
    place:  { word: 'ここ',   reading: 'koko',    gloss: 'here',            bridge: '여기', bridgeRr: 'yeogi' },
    dir:    { word: 'こちら', reading: 'kochira', gloss: 'this way',        bridge: '이쪽', bridgeRr: 'ijjok' },
    kind:   { word: 'こんな', reading: 'konna',   gloss: 'this kind of',    bridge: '이런', bridgeRr: 'ireon' },
    manner: { word: 'こう',   reading: 'kō',      gloss: 'like this',       bridge: '이렇게', bridgeRr: 'ireoke' },
  },
  so: {
    thing:  { word: 'それ',   reading: 'sore',    gloss: 'that one (by you)', bridge: '그것', bridgeRr: 'geugeot' },
    adnom:  { word: 'その',   reading: 'sono',    gloss: 'that N (by you)',   bridge: '그',   bridgeRr: 'geu' },
    place:  { word: 'そこ',   reading: 'soko',    gloss: 'there (by you)',    bridge: '거기', bridgeRr: 'geogi' },
    dir:    { word: 'そちら', reading: 'sochira', gloss: 'that way',          bridge: '그쪽', bridgeRr: 'geujjok' },
    kind:   { word: 'そんな', reading: 'sonna',   gloss: 'that kind of',      bridge: '그런', bridgeRr: 'geureon' },
    manner: { word: 'そう',   reading: 'sō',      gloss: 'like that / so',    bridge: '그렇게', bridgeRr: 'geureoke' },
  },
  a: {
    thing:  { word: 'あれ',   reading: 'are',     gloss: 'that one (over there)', bridge: '저것', bridgeRr: 'jeogeot' },
    adnom:  { word: 'あの',   reading: 'ano',     gloss: 'that N (over there)',   bridge: '저',   bridgeRr: 'jeo' },
    place:  { word: 'あそこ', reading: 'asoko',   gloss: 'over there',  bridge: '저기', bridgeRr: 'jeogi',
              irregular: true, note: 'あそこ breaks the pattern — not ✗あこ. (Korean 저기 stays regular.)' },
    dir:    { word: 'あちら', reading: 'achira',  gloss: 'that way (yonder)',     bridge: '저쪽', bridgeRr: 'jeojjok' },
    kind:   { word: 'あんな', reading: 'anna',    gloss: 'that kind of (yonder)', bridge: '저런', bridgeRr: 'jeoreon' },
    manner: { word: 'ああ',   reading: 'ā',       gloss: 'like that (yonder)',    bridge: '저렇게', bridgeRr: 'jeoreoke',
              irregular: true, note: 'ああ, not ✗あう — the あ-row twists twice (あそこ, ああ).' },
  },
  do: {
    thing:  { word: 'どれ',   reading: 'dore',    gloss: 'which one',   bridge: '어느 것', bridgeRr: 'eoneu geot' },
    adnom:  { word: 'どの',   reading: 'dono',    gloss: 'which N',     bridge: '어느', bridgeRr: 'eoneu' },
    place:  { word: 'どこ',   reading: 'doko',    gloss: 'where',       bridge: '어디', bridgeRr: 'eodi' },
    dir:    { word: 'どちら', reading: 'dochira', gloss: 'which way / which (polite)', bridge: '어느 쪽', bridgeRr: 'eoneu jjok' },
    kind:   { word: 'どんな', reading: 'donna',   gloss: 'what kind of', bridge: '어떤', bridgeRr: 'eotteon',
              note: 'Korean switches root here: 어떤, not ✗어느-. The 어- question stem isn’t one morpheme.' },
    manner: { word: 'どう',   reading: 'dō',      gloss: 'how',         bridge: '어떻게', bridgeRr: 'eotteoke' },
  },
}

export const GRID_LANTERN = {
  head: 'two halves, one machine',
  body:
    'Every word in this grid is a <b>prefix + suffix</b>. The prefix points — こ near me, そ near you, ' +
    'あ away from us both, ど into the unknown — and the suffix names the category: れ a thing, の a ' +
    'noun-modifier, こ a place, んな a kind, う a manner. Four prefixes × six suffixes = twenty-four words ' +
    'for the price of ten parts. <b>Korean runs the very same machine.</b> The mid term is the one to trust: ' +
    'そ↔그 (near the listener / already known) and あ↔저 (far from both) — so これ↔이것, それ↔그것, あれ↔저것 ' +
    'line up cleanly. And the whole <b>ど-row is the question-word set</b> (どれ which, どこ where, どう how): ' +
    'pointing at the unknown is just the fourth column of pointing.',
}

// ---------------------------------------------------------------------
// 2 · question words (疑問詞) — the ど-row spun out, plus the non-grid set
// ---------------------------------------------------------------------

/**
 * @typedef {Object} QuestionWord
 * @property {string} word
 * @property {string} reading
 * @property {string} gloss
 * @property {string} bridge      Korean twin
 * @property {string} bridgeRr
 * @property {string} [also]      a common variant
 * @property {{q:string, qRr:string, en:string, bridgeQ:string, bridgeQRr:string}} ex  a specimen question
 */

/** the interrogatives that are NOT just the ど-column of the grid */
export const QUESTION_WORDS = [
  { word: '何', reading: 'nani / nan', gloss: 'what', bridge: '무엇', bridgeRr: 'mueot', also: '口語: 뭐 (mwo)',
    ex: { q: 'これは何ですか。', qRr: 'kore wa nan desu ka', en: 'What is this?',
          bridgeQ: '이것은 무엇입니까?', bridgeQRr: 'igeoseun mueosimnikka' } },
  { word: '誰', reading: 'dare', gloss: 'who', bridge: '누구', bridgeRr: 'nugu', also: 'honorific: どなた / 어느 분',
    ex: { q: 'あの人は誰ですか。', qRr: 'ano hito wa dare desu ka', en: 'Who is that person?',
          bridgeQ: '저 사람은 누구예요?', bridgeQRr: 'jeo sarameun nuguyeyo' } },
  { word: 'いつ', reading: 'itsu', gloss: 'when', bridge: '언제', bridgeRr: 'eonje',
    ex: { q: '誕生日はいつですか。', qRr: 'tanjōbi wa itsu desu ka', en: 'When is your birthday?',
          bridgeQ: '생일은 언제예요?', bridgeQRr: 'saengireun eonjeyeyo' } },
  { word: 'なぜ', reading: 'naze', gloss: 'why', bridge: '왜', bridgeRr: 'wae', also: '口語: どうして / 어째서',
    ex: { q: 'なぜ来なかったの。', qRr: 'naze konakatta no', en: 'Why didn’t you come?',
          bridgeQ: '왜 안 왔어요?', bridgeQRr: 'wae an wasseoyo' } },
  { word: 'いくら', reading: 'ikura', gloss: 'how much (cost)', bridge: '얼마', bridgeRr: 'eolma',
    ex: { q: 'これはいくらですか。', qRr: 'kore wa ikura desu ka', en: 'How much is this?',
          bridgeQ: '이거 얼마예요?', bridgeQRr: 'igeo eolmayeyo' } },
  { word: 'いくつ', reading: 'ikutsu', gloss: 'how many / how old', bridge: '몇', bridgeRr: 'myeot', also: '+ counter: 몇 개, 몇 살',
    ex: { q: 'おいくつですか。', qRr: 'o-ikutsu desu ka', en: 'How old are you?',
          bridgeQ: '몇 살이에요?', bridgeQRr: 'myeot sarieyo' } },
  { word: 'どれくらい', reading: 'dore kurai', gloss: 'how much / how long', bridge: '얼마나', bridgeRr: 'eolmana',
    ex: { q: 'どれくらいかかりますか。', qRr: 'dore kurai kakarimasu ka', en: 'How long does it take?',
          bridgeQ: '얼마나 걸려요?', bridgeQRr: 'eolmana geollyeoyo' } },
]

// the ど-words that already live in the grid — shown as a recall strip
export const QW_FROM_GRID = ['どれ', 'どの', 'どこ', 'どちら', 'どんな', 'どう']

/**
 * The indefinite machine: a question word + a clitic re-aims it.
 * + か = some-, + でも = any-, + も(…ない) = none.
 * Korean tracks か/でも with 〜ㄴ가 / 〜든지, but swaps the stem to 아무 for "none".
 * @typedef {Object} IndefRow
 * @property {string} base
 * @property {{some:string[], any:string[], none:string[]}} jp   [word, reading, gloss]
 * @property {{some:string, any:string, none:string}} ko
 */
export const QW_INDEFINITES = {
  cols: [
    { id: 'some', clitic: '＋か',  label: 'some-', latin: 'existential' },
    { id: 'any',  clitic: '＋でも', label: 'any-',  latin: 'free choice' },
    { id: 'none', clitic: '＋も',  label: 'none',  latin: 'with a negative' },
  ],
  rows: [
    { base: '何',
      some: ['何か', 'nanika', 'something'], any: ['何でも', 'nandemo', 'anything'], none: ['何も', 'nanimo', 'nothing'],
      bridge: { some: '뭔가', any: '뭐든지', none: '아무것도' } },
    { base: '誰',
      some: ['誰か', 'dareka', 'someone'], any: ['誰でも', 'daredemo', 'anyone'], none: ['誰も', 'daremo', 'no one'],
      bridge: { some: '누군가', any: '누구나', none: '아무도' } },
    { base: 'どこ',
      some: ['どこか', 'dokoka', 'somewhere'], any: ['どこでも', 'dokodemo', 'anywhere'], none: ['どこも', 'dokomo', 'nowhere'],
      bridge: { some: '어딘가', any: '어디든지', none: '아무 데도' } },
    { base: 'いつ',
      some: ['いつか', 'itsuka', 'sometime'], any: ['いつでも', 'itsudemo', 'anytime'], none: ['いつも', 'itsumo', 'always*'],
      bridge: { some: '언젠가', any: '언제든지', none: '언제나' } },
  ],
  note: 'いつも is the odd one: 〜も on a time word gives “always,” not “never” (and いつも is affirmative). ' +
        'Korean’s 언제나 lands the same way.',
}

export const QW_LANTERN = {
  head: 'ask a word, then bend it',
  body:
    'A question word is a seed. Add <b>か</b> and it means <i>some-</i> (誰か someone, 何か something); add ' +
    '<b>でも</b> and it means <i>any-</i> (誰でも anyone); add <b>も</b> with a negative verb and it means ' +
    '<i>none</i> (誰も…ない no one). One root, the whole indefinite family. <b>Korean plays along</b> for ' +
    'some-/any- (누군가, 누구나/든지) — but for the <i>none</i> column it abandons the question word and ' +
    'reaches for a different stem, <b>아무</b> (아무도, 아무것도, 아무 데도). Same idea, one swapped part.',
}

// ---------------------------------------------------------------------
// 3 · personal pronouns (人称代名詞) — the register ladder
// ---------------------------------------------------------------------

/**
 * @typedef {Object} Pronoun
 * @property {string} word
 * @property {string} reading
 * @property {string} gloss
 * @property {number} rank      0 = most formal/humble … 4 = bluntest/most intimate (rail position)
 * @property {string} who       who says it / when
 * @property {string} bridge    Korean twin
 * @property {string} bridgeRr
 * @property {boolean} [warn]    a usage trap worth a red flag
 */

/**
 * @typedef {Object} PronounPerson
 * @property {string} id
 * @property {string} label
 * @property {string} latin
 * @property {Pronoun[]} items
 * @property {string} plural   a short note on the plural(s)
 */
export const PRONOUNS = {
  rail: { left: 'formal · humble', right: 'blunt · intimate' },
  persons: [
    { id: '1', label: '1st — “I”', latin: '自称',
      items: [
        { word: 'わたくし', reading: 'watakushi', gloss: 'I (most formal)', rank: 0,
          who: 'ceremony, business keigo', bridge: '저', bridgeRr: 'jeo' },
        { word: '私', reading: 'watashi', gloss: 'I (neutral-polite)', rank: 1,
          who: 'the safe default — any gender, any setting', bridge: '저 / 나', bridgeRr: 'jeo / na' },
        { word: '僕', reading: 'boku', gloss: 'I (soft-masculine)', rank: 2,
          who: 'men & boys, casual-polite', bridge: '나', bridgeRr: 'na' },
        { word: 'あたし', reading: 'atashi', gloss: 'I (feminine-casual)', rank: 3,
          who: 'women, casual speech', bridge: '나', bridgeRr: 'na' },
        { word: '俺', reading: 'ore', gloss: 'I (blunt-masculine)', rank: 4,
          who: 'men, intimate / rough', bridge: '나', bridgeRr: 'na' },
      ],
      plural: '私たち / 我々 (formal) / 僕ら・俺ら (casual) — “we”' },
    { id: '2', label: '2nd — “you”', latin: '対称',
      items: [
        { word: 'あなた', reading: 'anata', gloss: 'you (distant-polite / “dear”)', rank: 1, warn: true,
          who: 'NOT safe upward — use 名前 + さん. Also a wife’s word for her husband.', bridge: '당신', bridgeRr: 'dangsin' },
        { word: '君', reading: 'kimi', gloss: 'you (soft, downward / intimate)', rank: 2,
          who: 'senior → junior, or lovers (often a male speaker)', bridge: '너 / 그대', bridgeRr: 'neo / geudae' },
        { word: 'あんた', reading: 'anta', gloss: 'you (casual, can sting)', rank: 3, warn: true,
          who: 'familiar or irritated', bridge: '너', bridgeRr: 'neo' },
        { word: 'お前', reading: 'omae', gloss: 'you (blunt / intimate or aggressive)', rank: 4, warn: true,
          who: 'close friends — or a fight', bridge: '너', bridgeRr: 'neo' },
      ],
      plural: 'あなたたち / 君たち / お前ら — “you (pl.)”' },
    { id: '3', label: '3rd — “he / she”', latin: '他称',
      items: [
        { word: 'あの方', reading: 'ano kata', gloss: 'that person (honorific)', rank: 0,
          who: 'polite reference to someone present/known', bridge: '그분', bridgeRr: 'geubun' },
        { word: 'あの人', reading: 'ano hito', gloss: 'that person (neutral)', rank: 2,
          who: 'the everyday spoken “he/she” — straight from the grid', bridge: '그 사람', bridgeRr: 'geu saram' },
        { word: '彼', reading: 'kare', gloss: 'he (also “boyfriend”)', rank: 3,
          who: 'bookish as “he”; common as “boyfriend”', bridge: '그', bridgeRr: 'geu' },
        { word: '彼女', reading: 'kanojo', gloss: 'she (also “girlfriend”)', rank: 3,
          who: 'bookish as “she”; common as “girlfriend”', bridge: '그녀', bridgeRr: 'geunyeo' },
      ],
      plural: '彼ら / 彼女ら — “they.” In speech, あの人たち is more natural.' },
  ],
  proDrop: {
    full: 'わたしは がくせい です',
    drop: 'は がくせい です',
    dropWord: 'わたし',
    rr: '(watashi wa) gakusei desu',
    en: '“(I’m) a student.” — the 私は is normally left off; the listener already knows.',
    bridge: '(저는) 학생이에요',
    bridgeRr: '(jeoneun) haksaeng-ieyo',
  },
}

export const PRO_LANTERN = {
  head: 'the pronoun you don’t say',
  body:
    'English leans on pronouns; Japanese leans away from them. Context carries the subject, so 私 and ' +
    'あなた are usually <b>dropped</b> — and saying あなた to your boss is a mistake, not politeness ' +
    '(use their 名前 + さん). The word you <i>do</i> reach for marks who you are: 僕 / 俺 flag a male ' +
    'speaker, わたくし flags ceremony. <b>Korean works the same way</b> — drop the pronoun by default, and ' +
    'choose humble 저 vs. plain 나 by who is listening, the very 私 / 俺 instinct rebuilt as humility. ' +
    '(Mind the pun: Korean 저 is both “I, humbly” and “that, over there” — the あ of the grid.)',
}
