// =====================================================================
// The Polyglot's Atlas — Japanese · the word bank (語彙)
// Same VocabEntry schema as koreanVocab.js (the pilot — see the typedef
// there); differences for Japanese:
//   head          — kanji (or katakana for gairaigo)
//   reading.kana  — the kana reading (the layer the readings toggle hides)
//   reading.rr    — romaji
//   bridge        — absent (the learner is fluent; nothing to bridge to)
//   origin        — the three Japanese strata: kango / wago / gairaigo,
//                   the exact mirror of Korean 한자어 / 고유어 / 외래어
// =====================================================================

export const JA_VOCAB_LANG = {
  id: 'ja',
  name: 'Japanese',
  glyph: '語彙',
  scriptClass: 'jp',
  font: 'var(--font-cjk-serif)',
  hasBridge: false,
  strata: [
    { id: 'kango',    glyph: '漢語',   label: 'kango',
      hint: 'Sino-Japanese — the on’yomi lexicon' },
    { id: 'wago',     glyph: '和語',   label: 'wago',
      hint: 'native Japanese — the kun’yomi lexicon' },
    { id: 'gairaigo', glyph: '外来語', label: 'gairaigo',
      hint: 'modern loanwords, mostly via English' },
  ],
}

export const JA_VOCAB = [
  // ----- 漢語 · kango ----------------------------------------------------
  {
    id: 'gakkou',
    head: '学校', hanja: null,
    reading: { kana: 'がっこう', rr: 'gakkō' },
    pos: 'noun', origin: 'kango', en: 'school', band: 1, domain: 'school',
    bridge: null,
    ex: {
      text: '<m>学校</m>に行きます。', rr: 'gakkō ni ikimasu',
      en: 'I’m going to school.',
    },
  },
  {
    id: 'jikan',
    head: '時間', hanja: null,
    reading: { kana: 'じかん', rr: 'jikan' },
    pos: 'noun', origin: 'kango', en: 'time', band: 1, domain: 'time',
    bridge: null,
    ex: {
      text: '<m>時間</m>がありません。', rr: 'jikan ga arimasen',
      en: 'There’s no time.',
    },
  },
  {
    id: 'denwa',
    head: '電話', hanja: null,
    reading: { kana: 'でんわ', rr: 'denwa' },
    pos: 'noun', origin: 'kango', en: 'telephone · a call', band: 1, domain: 'daily',
    bridge: null,
    ex: {
      text: '後で<m>電話</m>します。', rr: 'ato de denwa shimasu',
      en: 'I’ll call you later.',
    },
  },
  {
    id: 'tenki',
    head: '天気', hanja: null,
    reading: { kana: 'てんき', rr: 'tenki' },
    pos: 'noun', origin: 'kango', en: 'weather', band: 1, domain: 'nature',
    bridge: null,
    ex: {
      text: '今日は<m>天気</m>がいいです。', rr: 'kyō wa tenki ga ii desu',
      en: 'The weather is nice today.',
    },
  },
  {
    id: 'eki',
    head: '駅', hanja: null,
    reading: { kana: 'えき', rr: 'eki' },
    pos: 'noun', origin: 'kango', en: 'station', band: 1, domain: 'travel',
    bridge: null,
    ex: {
      text: '<m>駅</m>で友達を待っています。', rr: 'eki de tomodachi o matte imasu',
      en: 'I’m waiting for a friend at the station.',
    },
  },
  {
    id: 'benkyousuru',
    head: '勉強する', hanja: null,
    reading: { kana: 'べんきょうする', rr: 'benkyō suru' },
    pos: 'verb', origin: 'kango', en: 'to study', band: 1, domain: 'school',
    bridge: null,
    ex: {
      text: '毎晩、日本語を<m>勉強します</m>。', rr: 'maiban, nihongo o benkyō shimasu',
      en: 'I study Japanese every evening.',
    },
  },
  {
    id: 'genki',
    head: '元気', hanja: null,
    reading: { kana: 'げんき', rr: 'genki' },
    pos: 'adj', origin: 'kango', en: 'well · lively', band: 1, domain: 'social',
    bridge: null,
    ex: {
      text: 'お<m>元気</m>ですか。', rr: 'ogenki desu ka',
      en: 'How are you?',
    },
  },
  // ----- 和語 · wago -----------------------------------------------------
  {
    id: 'mizu',
    head: '水', hanja: null,
    reading: { kana: 'みず', rr: 'mizu' },
    pos: 'noun', origin: 'wago', en: 'water', band: 1, domain: 'food',
    bridge: null,
    ex: {
      text: '<m>水</m>を飲みます。', rr: 'mizu o nomimasu',
      en: 'I drink water.',
    },
  },
  {
    id: 'tomodachi',
    head: '友達', hanja: null,
    reading: { kana: 'ともだち', rr: 'tomodachi' },
    pos: 'noun', origin: 'wago', en: 'friend', band: 1, domain: 'social',
    bridge: null,
    ex: {
      text: '<m>友達</m>と映画を見ました。', rr: 'tomodachi to eiga o mimashita',
      en: 'I saw a movie with a friend.',
    },
  },
  {
    id: 'kyou',
    head: '今日', hanja: null,
    reading: { kana: 'きょう', rr: 'kyō' },
    pos: 'noun', origin: 'wago', en: 'today', band: 1, domain: 'time',
    bridge: null,
    ex: {
      text: '<m>今日</m>は寒いです。', rr: 'kyō wa samui desu',
      en: 'It’s cold today.',
    },
  },
  {
    id: 'shigoto',
    head: '仕事', hanja: null,
    reading: { kana: 'しごと', rr: 'shigoto' },
    pos: 'noun', origin: 'wago', en: 'work · job', band: 1, domain: 'work',
    bridge: null,
    ex: {
      text: '<m>仕事</m>が忙しいです。', rr: 'shigoto ga isogashii desu',
      en: 'Work is busy.',
    },
  },
  {
    id: 'taberu',
    head: '食べる', hanja: null,
    reading: { kana: 'たべる', rr: 'taberu' },
    pos: 'verb', origin: 'wago', en: 'to eat', band: 1, domain: 'food',
    bridge: null,
    ex: {
      text: '朝ご飯を<m>食べました</m>か。', rr: 'asagohan o tabemashita ka',
      en: 'Did you eat breakfast?',
    },
  },
  {
    id: 'iku',
    head: '行く', hanja: null,
    reading: { kana: 'いく', rr: 'iku' },
    pos: 'verb', origin: 'wago', en: 'to go', band: 1, domain: 'travel',
    bridge: null,
    ex: {
      text: '駅まで歩いて<m>行きます</m>。', rr: 'eki made aruite ikimasu',
      en: 'I walk to the station.',
    },
  },
  {
    id: 'miru',
    head: '見る', hanja: null,
    reading: { kana: 'みる', rr: 'miru' },
    pos: 'verb', origin: 'wago', en: 'to see · watch', band: 1, domain: 'daily',
    bridge: null,
    ex: {
      text: '夜はテレビを<m>見ます</m>。', rr: 'yoru wa terebi o mimasu',
      en: 'I watch TV in the evening.',
    },
  },
  {
    id: 'atarashii',
    head: '新しい', hanja: null,
    reading: { kana: 'あたらしい', rr: 'atarashii' },
    pos: 'adj', origin: 'wago', en: 'new', band: 1, domain: 'daily',
    bridge: null,
    ex: {
      text: '<m>新しい</m>靴を買いました。', rr: 'atarashii kutsu o kaimashita',
      en: 'I bought new shoes.',
    },
  },
  // ----- 外来語 · gairaigo -----------------------------------------------
  {
    id: 'koohii',
    head: 'コーヒー', hanja: null,
    reading: { kana: '', rr: 'kōhī' },
    pos: 'noun', origin: 'gairaigo', en: 'coffee', band: 1, domain: 'food',
    bridge: null,
    ex: {
      text: '毎朝<m>コーヒー</m>を飲みます。', rr: 'maiasa kōhī o nomimasu',
      en: 'I drink coffee every morning.',
    },
  },
  {
    id: 'pasokon',
    head: 'パソコン', hanja: null,
    reading: { kana: '', rr: 'pasokon' },
    pos: 'noun', origin: 'gairaigo', en: 'computer (PC)', band: 1, domain: 'tech',
    bridge: null,
    ex: {
      text: '<m>パソコン</m>で仕事をします。', rr: 'pasokon de shigoto o shimasu',
      en: 'I work on the computer.',
    },
    note: {
      head: 'a clip, not a borrowing',
      html: 'パソコン is <i>personal computer</i> run through the four-mora clipper — ' +
            'the same scissors that made エアコン and スマホ.',
    },
  },
  {
    id: 'arubaito',
    head: 'アルバイト', hanja: null,
    reading: { kana: '', rr: 'arubaito' },
    pos: 'noun', origin: 'gairaigo', en: 'part-time job', band: 2, domain: 'work',
    bridge: null,
    ex: {
      text: '週末に<m>アルバイト</m>をします。', rr: 'shūmatsu ni arubaito o shimasu',
      en: 'I work part-time on weekends.',
    },
    note: {
      head: 'German in the lexicon',
      html: 'From <i>Arbeit</i> — Meiji-era German, not English. It later crossed to Korea ' +
            'as 아르바이트: a loanword that emigrated twice.',
    },
  },
]
