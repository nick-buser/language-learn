// =====================================================================
// The Polyglot's Atlas — Korean · 이·그·저 (the deixis folio)
//
// The mirror of japaneseDeixis.js, run the other way: Korean headword,
// 日本語 bridge. Pro-forms — words that fill a noun slot by POINTING
// instead of NAMING — in three instruments:
//   1. the 이·그·저 grid  — point into space (this / that / over there)
//   2. question words      — point at the unknown (무엇 / 누구 / 언제)
//   3. personal pronouns   — point at people (저·나 / 너 / 그)
//
// The grid is the centerpiece. Korean's pointers 이 / 그 / 저 line up
// with Japanese こ / そ / あ almost perfectly — but Korean tightens the
// machine's bolts unevenly: the place row FUSES (여기·거기), and the
// question row (어느/어디/어떤/어떻게) shares no clean suffix, where
// Japanese keeps its ど-row perfectly regular. That contrast is the
// Korean-side lantern.
//
// Content hand-checked; RR reflects pronunciation (liaison marked).
// =====================================================================

/** @typedef {import('./japaneseDeixis.js').DeixisCell} DeixisCell */

export const CONFIG = {
  script: 'kr',                       // headword CSS class
  bridge: 'jp',                       // bridge CSS class
  bridgeTag: '日本語',
  bridgeFont: 'var(--font-cjk-serif)',
}

/** @type {import('./japaneseDeixis.js').DeixisSeries[]} */
export const SERIES = [
  { id: 'i',   prefix: '이', prefixRr: 'i-',   role: 'near speaker',         gloss: 'by me',      point: 'speaker'  },
  { id: 'geu', prefix: '그', prefixRr: 'geu-', role: 'near listener / known', gloss: 'by you',     point: 'listener' },
  { id: 'jeo', prefix: '저', prefixRr: 'jeo-', role: 'far from both',         gloss: 'over there', point: 'far'      },
  { id: 'eo',  prefix: '어-', prefixRr: 'eo-', role: 'the unknown',           gloss: 'which?',     point: 'question' },
]

/** @type {import('./japaneseDeixis.js').DeixisCategory[]} */
export const CATEGORIES = [
  { id: 'thing',  suffix: '것',   label: 'thing',     latin: 'pronoun (대명사)', hint: 'stands alone — 이것은…; contracts to 이거' },
  { id: 'adnom',  suffix: '—',    label: 'this N',    latin: 'adnominal (관형사)', hint: 'the bare pointer before a noun — 이 사람' },
  { id: 'place',  suffix: '기',   label: 'place',     latin: 'locative',     hint: '여기 / 거기 / 저기 — fused; 어디 for “where”' },
  { id: 'dir',    suffix: '쪽',   label: 'direction', latin: 'side · way',   hint: '이쪽 (this side); 이리/그리/저리 = toward' },
  { id: 'kind',   suffix: '런',   label: 'kind',      latin: 'such (a)',     hint: '이런 사람; the question turns to 어떤' },
  { id: 'manner', suffix: '렇게', label: 'manner',    latin: 'adverb',       hint: 'do it like this — 이렇게 해' },
]

/** @type {Record<string, Record<string, DeixisCell>>} */
export const GRID = {
  i: {
    thing:  { word: '이것',   reading: 'igeot',   gloss: 'this one',     bridge: 'これ',   bridgeRr: 'kore' },
    adnom:  { word: '이',     reading: 'i',       gloss: 'this N',       bridge: 'この',   bridgeRr: 'kono' },
    place:  { word: '여기',   reading: 'yeogi',   gloss: 'here',         bridge: 'ここ',   bridgeRr: 'koko',
              irregular: true, note: '여기, not ✗이기 — the place row fuses. (Japanese ここ stays regular.)' },
    dir:    { word: '이쪽',   reading: 'ijjok',   gloss: 'this way / side', bridge: 'こちら', bridgeRr: 'kochira' },
    kind:   { word: '이런',   reading: 'ireon',   gloss: 'this kind of', bridge: 'こんな', bridgeRr: 'konna' },
    manner: { word: '이렇게', reading: 'ireoke',  gloss: 'like this',    bridge: 'こう',   bridgeRr: 'kō' },
  },
  geu: {
    thing:  { word: '그것',   reading: 'geugeot', gloss: 'that one (by you)', bridge: 'それ',   bridgeRr: 'sore' },
    adnom:  { word: '그',     reading: 'geu',     gloss: 'that N (by you)',   bridge: 'その',   bridgeRr: 'sono' },
    place:  { word: '거기',   reading: 'geogi',   gloss: 'there (by you)',    bridge: 'そこ',   bridgeRr: 'soko',
              irregular: true, note: '거기, not ✗그기 — fused like 여기.' },
    dir:    { word: '그쪽',   reading: 'geujjok', gloss: 'that way / side',   bridge: 'そちら', bridgeRr: 'sochira' },
    kind:   { word: '그런',   reading: 'geureon', gloss: 'that kind of',      bridge: 'そんな', bridgeRr: 'sonna' },
    manner: { word: '그렇게', reading: 'geureoke', gloss: 'like that / so',   bridge: 'そう',   bridgeRr: 'sō' },
  },
  jeo: {
    thing:  { word: '저것',   reading: 'jeogeot', gloss: 'that one (over there)', bridge: 'あれ',   bridgeRr: 'are' },
    adnom:  { word: '저',     reading: 'jeo',     gloss: 'that N (over there)',   bridge: 'あの',   bridgeRr: 'ano',
              note: 'the same 저 is also the humble “I” — pointer vs. pronoun, told apart by what follows.' },
    place:  { word: '저기',   reading: 'jeogi',   gloss: 'over there', bridge: 'あそこ', bridgeRr: 'asoko',
              note: '저기 is regular — but its Japanese twin あそこ is the irregular one.' },
    dir:    { word: '저쪽',   reading: 'jeojjok', gloss: 'that way (yonder)',     bridge: 'あちら', bridgeRr: 'achira' },
    kind:   { word: '저런',   reading: 'jeoreon', gloss: 'that kind of (yonder)', bridge: 'あんな', bridgeRr: 'anna' },
    manner: { word: '저렇게', reading: 'jeoreoke', gloss: 'like that (yonder)',   bridge: 'ああ',   bridgeRr: 'ā' },
  },
  eo: {
    thing:  { word: '어느 것', reading: 'eoneu geot', gloss: 'which one', bridge: 'どれ',   bridgeRr: 'dore',
              note: 'for “what (thing)” outright, use 무엇 / 뭐.' },
    adnom:  { word: '어느',   reading: 'eoneu',   gloss: 'which N',  bridge: 'どの',   bridgeRr: 'dono' },
    place:  { word: '어디',   reading: 'eodi',    gloss: 'where',    bridge: 'どこ',   bridgeRr: 'doko',
              irregular: true, note: '어디, not ✗어기 — the question row breaks the suffix.' },
    dir:    { word: '어느 쪽', reading: 'eoneu jjok', gloss: 'which way', bridge: 'どちら', bridgeRr: 'dochira' },
    kind:   { word: '어떤',   reading: 'eotteon', gloss: 'what kind of', bridge: 'どんな', bridgeRr: 'donna',
              irregular: true, note: '어떤, not ✗어런 — a different root from the 이런/그런 row.' },
    manner: { word: '어떻게', reading: 'eotteoke', gloss: 'how',     bridge: 'どう',   bridgeRr: 'dō' },
  },
}

export const GRID_LANTERN = {
  head: 'the same machine, looser bolts',
  body:
    '이 / 그 / 저 point exactly as こ / そ / あ do — 이 near me, 그 by you (or already known), 저 far from ' +
    'us both — so 이것↔これ, 그것↔それ, 저것↔あれ slot straight in. <b>Trust the mid term:</b> 그 is Japanese ' +
    'そ, not あ. But Korean tightens the bolts unevenly. The place row <i>fuses</i> — 여기·거기, not ' +
    '✗이기·✗그기 — and where Japanese keeps its question row perfectly regular (just swap こ→ど), Korean ' +
    '<b>breaks</b> it: 어느 / 어디 / 어떤 / 어떻게 share no clean suffix, and “what” jumps to 무엇 entirely. ' +
    'Same idea as the こそあど grid; the Korean surface just hides the seams. Learn the three pointers and ' +
    'the table still falls open.',
}

// ---------------------------------------------------------------------
// 2 · question words (의문사)
// ---------------------------------------------------------------------

/**
 * @typedef {Object} QuestionWord
 * @property {string} word
 * @property {string} reading     RR (liaison marked)
 * @property {string} gloss
 * @property {string} bridge      Japanese twin
 * @property {string} bridgeRr    romaji
 * @property {string} [also]      a common variant
 * @property {{q:string, qRr:string, en:string, bridgeQ:string, bridgeQRr:string}} ex
 */
export const QUESTION_WORDS = [
  { word: '무엇', reading: 'mueot', gloss: 'what', bridge: '何', bridgeRr: 'nani / nan', also: '口語: 뭐 (mwo)',
    ex: { q: '이것은 무엇입니까?', qRr: 'igeoseun mueosimnikka', en: 'What is this?',
          bridgeQ: 'これは何ですか。', bridgeQRr: 'kore wa nan desu ka' } },
  { word: '누구', reading: 'nugu', gloss: 'who', bridge: '誰', bridgeRr: 'dare', also: 'honorific: 어느 분 / どなた',
    ex: { q: '저 사람은 누구예요?', qRr: 'jeo sarameun nuguyeyo', en: 'Who is that person?',
          bridgeQ: 'あの人は誰ですか。', bridgeQRr: 'ano hito wa dare desu ka' } },
  { word: '언제', reading: 'eonje', gloss: 'when', bridge: 'いつ', bridgeRr: 'itsu',
    ex: { q: '생일은 언제예요?', qRr: 'saengireun eonjeyeyo', en: 'When is your birthday?',
          bridgeQ: '誕生日はいつですか。', bridgeQRr: 'tanjōbi wa itsu desu ka' } },
  { word: '왜', reading: 'wae', gloss: 'why', bridge: 'なぜ', bridgeRr: 'naze', also: '口語: どうして / 어째서',
    ex: { q: '왜 안 왔어요?', qRr: 'wae an wasseoyo', en: 'Why didn’t you come?',
          bridgeQ: 'なぜ来なかったの。', bridgeQRr: 'naze konakatta no' } },
  { word: '얼마', reading: 'eolma', gloss: 'how much (cost)', bridge: 'いくら', bridgeRr: 'ikura',
    ex: { q: '이거 얼마예요?', qRr: 'igeo eolmayeyo', en: 'How much is this?',
          bridgeQ: 'これはいくらですか。', bridgeQRr: 'kore wa ikura desu ka' } },
  { word: '몇', reading: 'myeot', gloss: 'how many', bridge: 'いくつ', bridgeRr: 'ikutsu', also: '+ counter: 몇 개, 몇 살',
    ex: { q: '몇 살이에요?', qRr: 'myeot sarieyo', en: 'How old are you?',
          bridgeQ: 'おいくつですか。', bridgeQRr: 'o-ikutsu desu ka' } },
  { word: '얼마나', reading: 'eolmana', gloss: 'how much / how long', bridge: 'どれくらい', bridgeRr: 'dore kurai',
    ex: { q: '얼마나 걸려요?', qRr: 'eolmana geollyeoyo', en: 'How long does it take?',
          bridgeQ: 'どれくらいかかりますか。', bridgeQRr: 'dore kurai kakarimasu ka' } },
]

// the 어-words that already live in the grid — shown as a recall strip
export const QW_FROM_GRID = ['어느', '어디', '어느 것', '어느 쪽', '어떤', '어떻게']

export const QW_INDEFINITES = {
  cols: [
    { id: 'some', clitic: '＋ㄴ가', label: 'some-', latin: 'existential' },
    { id: 'any',  clitic: '＋든지', label: 'any-',  latin: 'free choice' },
    { id: 'none', clitic: '아무 ＋ 도', label: 'none', latin: 'with a negative' },
  ],
  rows: [
    { base: '무엇',
      some: ['뭔가', 'mwonga', 'something'], any: ['뭐든지', 'mwodeunji', 'anything'], none: ['아무것도', 'amugeotdo', 'nothing'],
      bridge: { some: '何か', any: '何でも', none: '何も' } },
    { base: '누구',
      some: ['누군가', 'nugunga', 'someone'], any: ['누구나', 'nuguna', 'anyone'], none: ['아무도', 'amudo', 'no one'],
      bridge: { some: '誰か', any: '誰でも', none: '誰も' } },
    { base: '어디',
      some: ['어딘가', 'eodinga', 'somewhere'], any: ['어디든지', 'eodideunji', 'anywhere'], none: ['아무 데도', 'amu dedo', 'nowhere'],
      bridge: { some: 'どこか', any: 'どこでも', none: 'どこも' } },
    { base: '언제',
      some: ['언젠가', 'eonjenga', 'sometime'], any: ['언제든지', 'eonjedeunji', 'anytime'], none: ['언제나', 'eonjena', 'always*'],
      bridge: { some: 'いつか', any: 'いつでも', none: 'いつも' } },
  ],
  note: '언제나 is the odd one: with a time word the “none” column means “always,” not “never” (and it’s ' +
        'affirmative). Japanese いつも lands exactly the same way.',
}

export const QW_LANTERN = {
  head: 'ask a word, then bend it',
  body:
    'A question word is a seed. Add <b>ㄴ가</b> and it means <i>some-</i> (누군가 someone, 뭔가 something); ' +
    'add <b>든지</b> (or 나) and it means <i>any-</i> (누구든지 anyone). For <i>none</i>, Korean drops the ' +
    'question word and switches to the stem <b>아무</b> + 도 under a negative (아무도 없어요 “no one’s here,” ' +
    '아무것도 “nothing”). <b>Japanese tracks the first two exactly</b> (誰か, 誰でも) but builds the <i>none</i> ' +
    'column straight off the question word + も (誰も…ない). Same family — Korean swaps one root, Japanese keeps it.',
}

// ---------------------------------------------------------------------
// 3 · personal pronouns (인칭대명사)
// ---------------------------------------------------------------------

/** @typedef {import('./japaneseDeixis.js').Pronoun} Pronoun */
export const PRONOUNS = {
  rail: { left: 'formal · humble', right: 'blunt · intimate' },
  persons: [
    { id: '1', label: '1st — “I”', latin: '저·나',
      items: [
        { word: '저', reading: 'jeo', gloss: 'I (humble)', rank: 1,
          who: 'the default to anyone you address with 요 / -ㅂ니다', bridge: 'わたし', bridgeRr: 'watashi / watakushi' },
        { word: '나', reading: 'na', gloss: 'I (plain)', rank: 3,
          who: 'only in 반말 — close friends, juniors, children', bridge: '僕 / 俺', bridgeRr: 'boku / ore' },
      ],
      plural: '저희 (humble “we”) · 우리 (“we” — also “my/our”: 우리 집, 우리 나라). Possessive: 저→제, 나→내.' },
    { id: '2', label: '2nd — “you”', latin: '너·당신',
      items: [
        { word: '당신', reading: 'dangsin', gloss: 'you (distant / spousal)', rank: 1, warn: true,
          who: 'NOT a safe “you” — distant, a spouse’s word, or a fight. Use 이름 + 씨 or a title.', bridge: 'あなた', bridgeRr: 'anata' },
        { word: '그대', reading: 'geudae', gloss: 'you (poetic “thou”)', rank: 1,
          who: 'songs, poems, letters', bridge: '君', bridgeRr: 'kimi (lyrical)' },
        { word: '자네', reading: 'jane', gloss: 'you (older → grown junior)', rank: 2,
          who: 'an elder to an adult below them', bridge: '君', bridgeRr: 'kimi (downward)' },
        { word: '너', reading: 'neo', gloss: 'you (intimate / down)', rank: 4,
          who: 'close friends, children — in 반말', bridge: '君 / お前', bridgeRr: 'kimi / omae' },
      ],
      plural: '너희 (“you,” pl.). Possessive: 너→네 (often said 니 to avoid sounding like 내).' },
    { id: '3', label: '3rd — “he / she”', latin: '그·그녀',
      items: [
        { word: '그분', reading: 'geubun', gloss: 'that person (honorific)', rank: 0,
          who: 'polite reference to someone present / respected', bridge: 'あの方', bridgeRr: 'ano kata' },
        { word: '그 사람', reading: 'geu saram', gloss: 'that person (neutral)', rank: 2,
          who: 'the everyday spoken “he / she” — straight from the grid', bridge: 'あの人', bridgeRr: 'ano hito' },
        { word: '그', reading: 'geu', gloss: 'he (literary)', rank: 3,
          who: 'written narration; rare in speech', bridge: '彼', bridgeRr: 'kare' },
        { word: '그녀', reading: 'geunyeo', gloss: 'she (literary)', rank: 3,
          who: 'a 20th-c. translation coinage — read far more than heard', bridge: '彼女', bridgeRr: 'kanojo' },
      ],
      plural: '그들 (“they,” written). In speech, 그 사람들 is more natural.' },
  ],
  proDrop: {
    full: '저는 학생이에요',
    drop: '학생이에요',
    dropWord: '저는',
    rr: '(jeoneun) haksaeng-ieyo',
    en: '“(I’m) a student.” — the 저는 is normally left off; the listener already knows.',
    bridge: '(私は)学生です',
    bridgeRr: '(watashi wa) gakusei desu',
  },
}

export const PRO_LANTERN = {
  head: 'the pronoun you don’t say',
  body:
    'Korean, like Japanese, would rather not say the pronoun at all — context carries the subject, so 저 and ' +
    '너 mostly fall away. When you must name yourself, the choice is <b>humility</b>: 저 to anyone you speak ' +
    'politely to, 나 only in 반말. Second person is a minefield — <b>당신 is not a safe “you”</b> (it’s ' +
    'distant, spousal, or picking a fight); you use the person’s 이름 + 씨 or their title instead. And 그 / ' +
    '그녀 (he / she) are bookish, translation-era coinages you’ll read more than hear. <b>Japanese drew the ' +
    'same map first:</b> drop the pronoun, pick 私 vs. 俺 by your listener, never aim あなた upward — the ' +
    '저↔私, 나↔僕 instinct ports straight over. (And the pun cuts back: 저 is your humble “I” <i>and</i> the ' +
    '저 of the grid, “that over there.”)',
}
