// =====================================================================
// The Polyglot's Atlas — Korean · the word bank (어휘)
// Conventions (same as koreanData.js / koreanCognates.js):
//   head — the headword in hangul; in ex.text the word under study is
//          wrapped in <m>…</m> (inflected form, where it differs)
//   rr   — Revised Romanization, written to reflect pronunciation
//          (없어요 → eopseoyo, 읽어요 → ilgeoyo, 좋다 → jota)
//   bridge — the Japanese side, shown wherever the mapping is real
//
// SCHEMA NOTE — this module is phase 2/3 of the vocabulary plan
// (docs/vocabulary-plan.md) speaking in advance: a dictionary-shaped
// word bank, generalized beyond the cognate ledger to all three strata
// of the Korean lexicon. Like koreanCognates.js, the entries below are
// a hand-written exemplar of the payload a future dictionary API will
// return; the instruments (WordLedger, ReviewDrawer) must depend on
// nothing outside these shapes, so swapping this file for a backend
// call is invisible to the components.
//
// /**
//  * @typedef {Object} VocabBridge — the Japanese side of an entry
//  * @property {string} kanji      JP written form (kanji or katakana)
//  * @property {string} kana       kana reading ('' when kanji is kana)
//  * @property {string} rr         romaji
//  * @property {'cognate'|'loan'|'equivalent'} kind
//  *           cognate — same Sino word borrowed twice (toll only)
//  *           loan    — same modern loanword on both shores
//  *           equivalent — plain translation; no etymological bridge
//  *
//  * @typedef {Object} VocabEntry — future dictionary payload, piloted here
//  * @property {string} id         stable slug; the future primary key
//  * @property {string} head       headword in the language's own script
//  * @property {?string} hanja     Sino spelling when origin is 'sino'
//  * @property {{kana?: string, rr: string}} reading
//  *           pronunciation layer — ko: rr only; ja: kana + romaji
//  * @property {'noun'|'verb'|'adj'|'adverb'|'expression'} pos
//  * @property {string} origin     lexical stratum — see VOCAB_LANG.strata
//  * @property {string} en         gloss
//  * @property {1|2|3} band        frequency band (1 core · 2 everyday · 3 extended)
//  * @property {string} domain     coarse topic tag
//  * @property {?VocabBridge} bridge
//  * @property {{text: string, rr: string, jp?: string, jpRr?: string, en: string}} ex
//  * @property {{head: string, html: string}} [note]  usage / trap footnote
//  */
// =====================================================================

export const KO_VOCAB_LANG = {
  id: 'ko',
  name: 'Korean',
  glyph: '어휘',
  scriptClass: 'kr',
  font: 'var(--font-kr-serif)',
  hasBridge: true, // entries carry a Japanese bridge → ledger/cards show it
  strata: [
    { id: 'sino',   glyph: '한자어', label: 'sino',
      hint: 'the Middle-Chinese lexicon — same words as your on’yomi, bridge toll only' },
    { id: 'native', glyph: '고유어', label: 'native',
      hint: 'native Korean — no bridge across, full price, highest frequency' },
    { id: 'loan',   glyph: '외래어', label: 'loan',
      hint: 'modern loanwords — usually shared with Japanese, clipped differently' },
  ],
}

// Bridge-kind badges — how the Japanese side relates to the Korean word.
export const BRIDGE_KINDS = {
  cognate:    { label: 'twin',       glyph: '同源', hint: 'the same Sino word, borrowed twice' },
  loan:       { label: 'shared loan', glyph: '外来', hint: 'the same modern loanword on both shores' },
  equivalent: { label: 'equivalent', glyph: '対訳', hint: 'translation only — no shared ancestry' },
}

export const KO_VOCAB = [
  // ----- 한자어 · sino ---------------------------------------------------
  {
    id: 'hakgyo',
    head: '학교', hanja: '学校',
    reading: { rr: 'hakgyo' },
    pos: 'noun', origin: 'sino', en: 'school', band: 1, domain: 'school',
    bridge: { kanji: '学校', kana: 'がっこう', rr: 'gakkō', kind: 'cognate' },
    ex: {
      text: '<m>학교</m>에 가요.', rr: 'hakgyoe gayo',
      jp: '学校に行きます。', jpRr: 'gakkō ni ikimasu',
      en: 'I’m going to school.',
    },
    note: {
      head: 'the bridge’s poster word',
      html: 'がっこう → 학교 crosses on two rules at once: the initial breathes (g → h) and ' +
            'the -k closes into a 받침. The cognate folio walks the derivation.',
    },
  },
  {
    id: 'chingu',
    head: '친구', hanja: '親旧',
    reading: { rr: 'chingu' },
    pos: 'noun', origin: 'sino', en: 'friend', band: 1, domain: 'social',
    bridge: { kanji: '友達', kana: 'ともだち', rr: 'tomodachi', kind: 'equivalent' },
    ex: {
      text: '<m>친구</m>를 만나요.', rr: 'chingureul mannayo',
      jp: '友達に会います。', jpRr: 'tomodachi ni aimasu',
      en: 'I’m meeting a friend.',
    },
    note: {
      head: 'a Sino word Japan never kept',
      html: '친구 is 漢字語 (親旧 — “old intimate”), but Japanese never adopted the compound: ' +
            'the bridge carries 友達 as a plain translation. Mind the particle too — Korean ' +
            '<b>만나다</b> takes 를, where 会う takes に.',
    },
  },
  {
    id: 'jeonhwa',
    head: '전화', hanja: '電話',
    reading: { rr: 'jeonhwa' },
    pos: 'noun', origin: 'sino', en: 'telephone · a call', band: 1, domain: 'daily',
    bridge: { kanji: '電話', kana: 'でんわ', rr: 'denwa', kind: 'cognate' },
    ex: {
      text: '친구에게 <m>전화</m>했어요.', rr: 'chinguege jeonhwahaesseoyo',
      jp: '友達に電話しました。', jpRr: 'tomodachi ni denwa shimashita',
      en: 'I called my friend.',
    },
    note: {
      head: 'noun + 하다 = noun + する',
      html: '전화<b>하다</b> works exactly like 電話<b>する</b> — the Sino-noun-plus-do recipe ' +
            'transfers wholesale, here and across hundreds of verbs.',
    },
  },
  {
    id: 'yeohaeng',
    head: '여행', hanja: '旅行',
    reading: { rr: 'yeohaeng' },
    pos: 'noun', origin: 'sino', en: 'travel · a trip', band: 1, domain: 'travel',
    bridge: { kanji: '旅行', kana: 'りょこう', rr: 'ryokō', kind: 'cognate' },
    ex: {
      text: '<m>여행</m>을 가고 싶어요.', rr: 'yeohaengeul gago sipeoyo',
      jp: '旅行に行きたいです。', jpRr: 'ryokō ni ikitai desu',
      en: 'I want to go on a trip.',
    },
    note: {
      head: 'go *a* trip',
      html: 'Korean says 여행<b>을</b> 가다 with the object particle, where Japanese goes ' +
            '旅行<b>に</b>行く. The word crosses free; the particle pays.',
    },
  },
  {
    id: 'yeonghwa',
    head: '영화', hanja: '映画',
    reading: { rr: 'yeonghwa' },
    pos: 'noun', origin: 'sino', en: 'movie', band: 1, domain: 'culture',
    bridge: { kanji: '映画', kana: 'えいが', rr: 'eiga', kind: 'cognate' },
    ex: {
      text: '주말에 <m>영화</m>를 봤어요.', rr: 'jumare yeonghwareul bwasseoyo',
      jp: '週末に映画を見ました。', jpRr: 'shūmatsu ni eiga o mimashita',
      en: 'I saw a movie on the weekend.',
    },
  },
  {
    id: 'gongwon',
    head: '공원', hanja: '公園',
    reading: { rr: 'gongwon' },
    pos: 'noun', origin: 'sino', en: 'park', band: 2, domain: 'place',
    bridge: { kanji: '公園', kana: 'こうえん', rr: 'kōen', kind: 'cognate' },
    ex: {
      text: '<m>공원</m>에 사람이 많아요.', rr: 'gongwone sarami manayo',
      jp: '公園に人が多いです。', jpRr: 'kōen ni hito ga ōi desu',
      en: 'There are a lot of people in the park.',
    },
  },
  {
    id: 'eumsik',
    head: '음식', hanja: '飲食',
    reading: { rr: 'eumsik' },
    pos: 'noun', origin: 'sino', en: 'food', band: 1, domain: 'food',
    bridge: { kanji: '食べ物', kana: 'たべもの', rr: 'tabemono', kind: 'equivalent' },
    ex: {
      text: '한국 <m>음식</m>을 좋아해요.', rr: 'hanguk eumsigeul joahaeyo',
      jp: '韓国の食べ物が好きです。', jpRr: 'kankoku no tabemono ga suki desu',
      en: 'I like Korean food.',
    },
    note: {
      head: 'the characters exist in Japanese — the word doesn’t',
      html: '飲食 survives in Japanese only as stiff いんしょく (飲食店 — eating ' +
            'establishment). The everyday Korean word for food maps to plain 食べ物.',
    },
  },
  {
    id: 'sueop',
    head: '수업', hanja: '授業',
    reading: { rr: 'sueop' },
    pos: 'noun', origin: 'sino', en: 'class · lesson', band: 2, domain: 'school',
    bridge: { kanji: '授業', kana: 'じゅぎょう', rr: 'jugyō', kind: 'cognate' },
    ex: {
      text: '오늘은 <m>수업</m>이 없어요.', rr: 'oneureun sueobi eopseoyo',
      jp: '今日は授業がありません。', jpRr: 'kyō wa jugyō ga arimasen',
      en: 'There’s no class today.',
    },
  },
  {
    id: 'hoesa',
    head: '회사', hanja: '会社',
    reading: { rr: 'hoesa' },
    pos: 'noun', origin: 'sino', en: 'company · office', band: 1, domain: 'work',
    bridge: { kanji: '会社', kana: 'かいしゃ', rr: 'kaisha', kind: 'cognate' },
    ex: {
      text: '<m>회사</m>에 다녀요.', rr: 'hoesae danyeoyo',
      jp: '会社に勤めています。', jpRr: 'kaisha ni tsutomete imasu',
      en: 'I work at a company.',
    },
    note: {
      head: '다니다 — the commuting verb',
      html: '회사에 <b>다니다</b> (“attend regularly”) covers what Japanese splits between ' +
            '勤める and 通う. The same verb takes you to school: 학교에 다녀요.',
    },
  },
  {
    id: 'jumal',
    head: '주말', hanja: '週末',
    reading: { rr: 'jumal' },
    pos: 'noun', origin: 'sino', en: 'weekend', band: 1, domain: 'time',
    bridge: { kanji: '週末', kana: 'しゅうまつ', rr: 'shūmatsu', kind: 'cognate' },
    ex: {
      text: '<m>주말</m>에 뭐 해요?', rr: 'jumare mwo haeyo',
      jp: '週末に何をしますか。', jpRr: 'shūmatsu ni nani o shimasu ka',
      en: 'What are you doing this weekend?',
    },
    note: {
      head: 'both finals pay the published toll',
      html: 'しゅう → 주 (the long vowel un-melts to nothing here — no final to recover) and ' +
            'まつ → 말: the -tsu → ㄹ coat-change rule, mid-word.',
    },
  },
  {
    id: 'eumak',
    head: '음악', hanja: '音楽',
    reading: { rr: 'eumak' },
    pos: 'noun', origin: 'sino', en: 'music', band: 2, domain: 'culture',
    bridge: { kanji: '音楽', kana: 'おんがく', rr: 'ongaku', kind: 'cognate' },
    ex: {
      text: '<m>음악</m>을 들어요.', rr: 'eumageul deureoyo',
      jp: '音楽を聞きます。', jpRr: 'ongaku o kikimasu',
      en: 'I listen to music.',
    },
  },
  {
    id: 'sajeon',
    head: '사전', hanja: '辞典',
    reading: { rr: 'sajeon' },
    pos: 'noun', origin: 'sino', en: 'dictionary', band: 3, domain: 'school',
    bridge: { kanji: '辞典', kana: 'じてん', rr: 'jiten', kind: 'cognate' },
    ex: {
      text: '<m>사전</m>에서 단어를 찾아요.', rr: 'sajeoneseo daneoreul chajayo',
      jp: '辞書で単語を調べます。', jpRr: 'jisho de tango o shirabemasu',
      en: 'I look up words in the dictionary.',
    },
    note: {
      head: 'the twin nobody uses',
      html: '辞典 is a real Japanese word, but the everyday one is 辞書. The specimen smuggles ' +
            'in a bonus twin: 단어 is <b>単語</b> (たんご) — this word bank, in one word.',
    },
  },
  {
    id: 'chaek',
    head: '책', hanja: '冊',
    reading: { rr: 'chaek' },
    pos: 'noun', origin: 'sino', en: 'book', band: 1, domain: 'school',
    bridge: { kanji: '本', kana: 'ほん', rr: 'hon', kind: 'equivalent' },
    ex: {
      text: '<m>책</m>을 읽어요.', rr: 'chaegeul ilgeoyo',
      jp: '本を読みます。', jpRr: 'hon o yomimasu',
      en: 'I’m reading a book.',
    },
    note: {
      head: 'the noun that is a counter in Japan',
      html: '冊 is the everyday Korean word for book — in Japanese the same character survives ' +
            'only as the counter 一冊, 二冊. The noun and the counter swapped jobs.',
    },
  },
  {
    id: 'gongbuhada',
    head: '공부하다', hanja: '工夫',
    reading: { rr: 'gongbuhada' },
    pos: 'verb', origin: 'sino', en: 'to study', band: 1, domain: 'school',
    bridge: { kanji: '勉強する', kana: 'べんきょうする', rr: 'benkyō suru', kind: 'equivalent' },
    ex: {
      text: '매일 한국어를 <m>공부해요</m>.', rr: 'maeil hangugeoreul gongbuhaeyo',
      jp: '毎日韓国語を勉強します。', jpRr: 'mainichi kankokugo o benkyō shimasu',
      en: 'I study Korean every day.',
    },
    note: {
      head: 'the famous false friend, verbed',
      html: 'The Sino root is 工夫 — <b>ingenuity</b> in Tokyo, <b>studying</b> in Seoul (the ' +
            'cognate folio keeps the full warning). Each language verbed a different compound: ' +
            '勉強する there, 공부하다 here.',
    },
  },
  {
    id: 'gamsahamnida',
    head: '감사합니다', hanja: '感謝',
    reading: { rr: 'gamsahamnida' },
    pos: 'expression', origin: 'sino', en: 'thank you (polite)', band: 1, domain: 'social',
    bridge: { kanji: 'ありがとうございます', kana: '', rr: 'arigatō gozaimasu', kind: 'equivalent' },
    ex: {
      text: '도와주셔서 <m>감사합니다</m>.', rr: 'dowajusyeoseo gamsahamnida',
      jp: '手伝ってくださってありがとうございます。', jpRr: 'tetsudatte kudasatte arigatō gozaimasu',
      en: 'Thank you for helping me.',
    },
    note: {
      head: 'a Sino thank-you',
      html: 'Korean’s default thanks is Sino: 感謝 + 합니다, literally “(I) do gratitude.” ' +
            'Japanese 感謝します exists but is formal — the everyday register flipped.',
    },
  },
  // ----- 고유어 · native -------------------------------------------------
  {
    id: 'mul',
    head: '물', hanja: null,
    reading: { rr: 'mul' },
    pos: 'noun', origin: 'native', en: 'water', band: 1, domain: 'food',
    bridge: { kanji: '水', kana: 'みず', rr: 'mizu', kind: 'equivalent' },
    ex: {
      text: '<m>물</m> 좀 주세요.', rr: 'mul jom juseyo',
      jp: 'お水をください。', jpRr: 'omizu o kudasai',
      en: 'Some water, please.',
    },
    note: {
      head: '좀 — the polite softener',
      html: '좀 (“a little”) cushions requests the way よかったら or ちょっと does — ' +
            'practically mandatory in 주세요 sentences.',
    },
  },
  {
    id: 'bap',
    head: '밥', hanja: null,
    reading: { rr: 'bap' },
    pos: 'noun', origin: 'native', en: 'rice · a meal', band: 1, domain: 'food',
    bridge: { kanji: 'ご飯', kana: 'ごはん', rr: 'gohan', kind: 'equivalent' },
    ex: {
      text: '<m>밥</m> 먹었어요?', rr: 'bap meogeosseoyo',
      jp: 'ご飯を食べましたか。', jpRr: 'gohan o tabemashita ka',
      en: 'Have you eaten? — also a greeting.',
    },
    note: {
      head: 'the same double duty as ご飯',
      html: 'Cooked rice <i>and</i> meal-in-general, exactly like ご飯 — and 밥 먹었어요? ' +
            'works as a how-are-you, like ご飯食べた? between friends.',
    },
  },
  {
    id: 'jip',
    head: '집', hanja: null,
    reading: { rr: 'jip' },
    pos: 'noun', origin: 'native', en: 'house · home', band: 1, domain: 'place',
    bridge: { kanji: '家', kana: 'いえ', rr: 'ie', kind: 'equivalent' },
    ex: {
      text: '<m>집</m>에 가고 싶어요.', rr: 'jibe gago sipeoyo',
      jp: '家に帰りたいです。', jpRr: 'ie ni kaeritai desu',
      en: 'I want to go home.',
    },
    note: {
      head: 'no dedicated 帰る',
      html: 'Korean goes home with plain <b>가다</b> — there is no separate return-home verb. ' +
            '집에 가요 covers 家に帰ります.',
    },
  },
  {
    id: 'oneul',
    head: '오늘', hanja: null,
    reading: { rr: 'oneul' },
    pos: 'noun', origin: 'native', en: 'today', band: 1, domain: 'time',
    bridge: { kanji: '今日', kana: 'きょう', rr: 'kyō', kind: 'equivalent' },
    ex: {
      text: '<m>오늘</m>은 날씨가 좋아요.', rr: 'oneureun nalssiga joayo',
      jp: '今日は天気がいいです。', jpRr: 'kyō wa tenki ga ii desu',
      en: 'The weather is nice today.',
    },
  },
  {
    id: 'eoje',
    head: '어제', hanja: null,
    reading: { rr: 'eoje' },
    pos: 'noun', origin: 'native', en: 'yesterday', band: 1, domain: 'time',
    bridge: { kanji: '昨日', kana: 'きのう', rr: 'kinō', kind: 'equivalent' },
    ex: {
      text: '<m>어제</m> 비가 왔어요.', rr: 'eoje biga wasseoyo',
      jp: '昨日、雨が降りました。', jpRr: 'kinō, ame ga furimashita',
      en: 'It rained yesterday.',
    },
  },
  {
    id: 'saram',
    head: '사람', hanja: null,
    reading: { rr: 'saram' },
    pos: 'noun', origin: 'native', en: 'person', band: 1, domain: 'social',
    bridge: { kanji: '人', kana: 'ひと', rr: 'hito', kind: 'equivalent' },
    ex: {
      text: '좋은 <m>사람</m>이에요.', rr: 'joeun saramieyo',
      jp: 'いい人です。', jpRr: 'ii hito desu',
      en: 'They’re a good person.',
    },
    note: {
      head: 'native here, Sino in compounds',
      html: 'Standalone person is native 사람; in compounds the Sino reading 인 (人) takes ' +
            'over — 한국인, 애인 — exactly the kun/on division of labor.',
    },
  },
  {
    id: 'haneul',
    head: '하늘', hanja: null,
    reading: { rr: 'haneul' },
    pos: 'noun', origin: 'native', en: 'sky', band: 2, domain: 'nature',
    bridge: { kanji: '空', kana: 'そら', rr: 'sora', kind: 'equivalent' },
    ex: {
      text: '<m>하늘</m>이 맑아요.', rr: 'haneuri malgayo',
      jp: '空が晴れています。', jpRr: 'sora ga harete imasu',
      en: 'The sky is clear.',
    },
  },
  {
    id: 'son',
    head: '손', hanja: null,
    reading: { rr: 'son' },
    pos: 'noun', origin: 'native', en: 'hand', band: 2, domain: 'body',
    bridge: { kanji: '手', kana: 'て', rr: 'te', kind: 'equivalent' },
    ex: {
      text: '<m>손</m>을 씻으세요.', rr: 'soneul ssiseuseyo',
      jp: '手を洗ってください。', jpRr: 'te o aratte kudasai',
      en: 'Please wash your hands.',
    },
  },
  {
    id: 'bi',
    head: '비', hanja: null,
    reading: { rr: 'bi' },
    pos: 'noun', origin: 'native', en: 'rain', band: 1, domain: 'nature',
    bridge: { kanji: '雨', kana: 'あめ', rr: 'ame', kind: 'equivalent' },
    ex: {
      text: '<m>비</m>가 와요.', rr: 'biga wayo',
      jp: '雨が降っています。', jpRr: 'ame ga futte imasu',
      en: 'It’s raining.',
    },
    note: {
      head: 'rain comes, it doesn’t fall',
      html: 'Korean rain <b>comes</b> — 비가 <b>오다</b>, never a falling verb in everyday ' +
            'speech. Snow too: 눈이 와요. Where Japanese drops (降る), Korean arrives.',
    },
  },
  {
    id: 'meokda',
    head: '먹다', hanja: null,
    reading: { rr: 'meokda' },
    pos: 'verb', origin: 'native', en: 'to eat', band: 1, domain: 'food',
    bridge: { kanji: '食べる', kana: 'たべる', rr: 'taberu', kind: 'equivalent' },
    ex: {
      text: '김치를 <m>먹어</m> 봤어요.', rr: 'gimchireul meogeo bwasseoyo',
      jp: 'キムチを食べてみました。', jpRr: 'kimuchi o tabete mimashita',
      en: 'I tried eating kimchi.',
    },
    note: {
      head: '-아/어 보다 = 〜てみる',
      html: 'The try-doing recipe transfers whole: verb + <b>보다</b> (see) is exactly ' +
            'verb + <b>みる</b>. The specimen carries the pattern with the word.',
    },
  },
  {
    id: 'gada',
    head: '가다', hanja: null,
    reading: { rr: 'gada' },
    pos: 'verb', origin: 'native', en: 'to go', band: 1, domain: 'travel',
    bridge: { kanji: '行く', kana: 'いく', rr: 'iku', kind: 'equivalent' },
    ex: {
      text: '어디에 <m>가요</m>?', rr: 'eodie gayo',
      jp: 'どこに行きますか。', jpRr: 'doko ni ikimasu ka',
      en: 'Where are you going?',
    },
  },
  {
    id: 'boda',
    head: '보다', hanja: null,
    reading: { rr: 'boda' },
    pos: 'verb', origin: 'native', en: 'to see · watch', band: 1, domain: 'daily',
    bridge: { kanji: '見る', kana: 'みる', rr: 'miru', kind: 'equivalent' },
    ex: {
      text: '드라마를 <m>봐요</m>.', rr: 'deuramareul bwayo',
      jp: 'ドラマを見ます。', jpRr: 'dorama o mimasu',
      en: 'I watch dramas.',
    },
  },
  {
    id: 'masida',
    head: '마시다', hanja: null,
    reading: { rr: 'masida' },
    pos: 'verb', origin: 'native', en: 'to drink', band: 1, domain: 'food',
    bridge: { kanji: '飲む', kana: 'のむ', rr: 'nomu', kind: 'equivalent' },
    ex: {
      text: '커피를 <m>마셔요</m>.', rr: 'keopireul masyeoyo',
      jp: 'コーヒーを飲みます。', jpRr: 'kōhī o nomimasu',
      en: 'I drink coffee.',
    },
  },
  {
    id: 'jota',
    head: '좋다', hanja: null,
    reading: { rr: 'jota' },
    pos: 'adj', origin: 'native', en: 'to be good', band: 1, domain: 'daily',
    bridge: { kanji: '良い', kana: 'いい', rr: 'ii', kind: 'equivalent' },
    ex: {
      text: '이 노래 진짜 <m>좋아요</m>.', rr: 'i norae jinjja joayo',
      jp: 'この歌、本当にいいです。', jpRr: 'kono uta, hontō ni ii desu',
      en: 'This song is really good.',
    },
    note: {
      head: 'the silent ㅎ',
      html: 'Dictionary form [조타] — the ㅎ aspirates the ㄷ; conjugated 좋아요 [조아요] — ' +
            'the ㅎ vanishes between vowels. The batchim gate folio explains why.',
    },
  },
  {
    id: 'keuda',
    head: '크다', hanja: null,
    reading: { rr: 'keuda' },
    pos: 'adj', origin: 'native', en: 'to be big', band: 1, domain: 'daily',
    bridge: { kanji: '大きい', kana: 'おおきい', rr: 'ōkii', kind: 'equivalent' },
    ex: {
      text: '가방이 너무 <m>커요</m>.', rr: 'gabangi neomu keoyo',
      jp: 'かばんがとても大きいです。', jpRr: 'kaban ga totemo ōkii desu',
      en: 'The bag is too big.',
    },
    note: {
      head: 'ㅡ drops before 어',
      html: '크 + 어요 → <b>커요</b>: the ㅡ-drop class, same machinery as 쓰다 → 써요. ' +
            'The verb forge files the pattern.',
    },
  },
  {
    id: 'gwaenchanta',
    head: '괜찮다', hanja: null,
    reading: { rr: 'gwaenchanta' },
    pos: 'adj', origin: 'native', en: 'to be okay · fine', band: 1, domain: 'social',
    bridge: { kanji: '大丈夫', kana: 'だいじょうぶ', rr: 'daijōbu', kind: 'equivalent' },
    ex: {
      text: '<m>괜찮아요</m>?', rr: 'gwaenchanayo',
      jp: '大丈夫ですか。', jpRr: 'daijōbu desu ka',
      en: 'Are you okay?',
    },
    note: {
      head: 'the all-purpose okay',
      html: 'Like 大丈夫, it accepts, declines, reassures and forgives — 괜찮아요 answers ' +
            'both “sorry!” and “want some more?”. Polite refusal: 아니요, 괜찮아요.',
    },
  },
  {
    id: 'ilhada',
    head: '일하다', hanja: null,
    reading: { rr: 'ilhada' },
    pos: 'verb', origin: 'native', en: 'to work', band: 1, domain: 'work',
    bridge: { kanji: '働く', kana: 'はたらく', rr: 'hataraku', kind: 'equivalent' },
    ex: {
      text: '은행에서 <m>일해요</m>.', rr: 'eunhaengeseo ilhaeyo',
      jp: '銀行で働いています。', jpRr: 'ginkō de hataraite imasu',
      en: 'I work at a bank.',
    },
    note: {
      head: 'native noun, same recipe',
      html: '일 (work, a native noun) + 하다 — the noun-plus-do recipe isn’t only for Sino ' +
            'nouns. 일 also means <i>one</i> (Sino 一) and <i>day</i> (Sino 日): three words, ' +
            'one syllable, context referees.',
    },
  },
  // ----- 외래어 · loan ---------------------------------------------------
  {
    id: 'keopi',
    head: '커피', hanja: null,
    reading: { rr: 'keopi' },
    pos: 'noun', origin: 'loan', en: 'coffee', band: 1, domain: 'food',
    bridge: { kanji: 'コーヒー', kana: '', rr: 'kōhī', kind: 'loan' },
    ex: {
      text: '<m>커피</m> 한 잔 주세요.', rr: 'keopi han jan juseyo',
      jp: 'コーヒーを一杯ください。', jpRr: 'kōhī o ippai kudasai',
      en: 'One coffee, please.',
    },
  },
  {
    id: 'beoseu',
    head: '버스', hanja: null,
    reading: { rr: 'beoseu' },
    pos: 'noun', origin: 'loan', en: 'bus', band: 1, domain: 'travel',
    bridge: { kanji: 'バス', kana: '', rr: 'basu', kind: 'loan' },
    ex: {
      text: '<m>버스</m>를 타요.', rr: 'beoseureul tayo',
      jp: 'バスに乗ります。', jpRr: 'basu ni norimasu',
      en: 'I take the bus.',
    },
    note: {
      head: 'ride the object',
      html: '타다 takes <b>를</b> where 乗る takes <b>に</b> — the same trap as 만나다. ' +
            'The loanword is free; the particle still charges.',
    },
  },
  {
    id: 'keompyuteo',
    head: '컴퓨터', hanja: null,
    reading: { rr: 'keompyuteo' },
    pos: 'noun', origin: 'loan', en: 'computer', band: 2, domain: 'tech',
    bridge: { kanji: 'パソコン', kana: '', rr: 'pasokon', kind: 'loan' },
    ex: {
      text: '<m>컴퓨터</m>로 일해요.', rr: 'keompyuteoro ilhaeyo',
      jp: 'パソコンで仕事をします。', jpRr: 'pasokon de shigoto o shimasu',
      en: 'I work on the computer.',
    },
    note: {
      head: 'same loan, different clip',
      html: 'Both shores borrowed <i>computer</i>; Japanese clipped <i>personal computer</i> ' +
            'to パソコン while Korean kept the full word (컴 in compounds). Shared loans ' +
            'rarely stay identical — expect drift in the scissors.',
    },
  },
  {
    id: 'areubaiteu',
    head: '아르바이트', hanja: null,
    reading: { rr: 'areubaiteu' },
    pos: 'noun', origin: 'loan', en: 'part-time job', band: 2, domain: 'work',
    bridge: { kanji: 'アルバイト', kana: '', rr: 'arubaito', kind: 'loan' },
    ex: {
      text: '카페에서 <m>아르바이트</m>를 해요.', rr: 'kapeeseo areubaiteureul haeyo',
      jp: 'カフェでアルバイトをしています。', jpRr: 'kafe de arubaito o shite imasu',
      en: 'I work part-time at a café.',
    },
    note: {
      head: 'German, via Tokyo',
      html: '<i>Arbeit</i> entered Japanese first, then crossed to Korea — a loanword that ' +
            'took the bridge itself. Both clip it: 알바 in Seoul, バイト in Tokyo.',
    },
  },
  {
    id: 'haendeupon',
    head: '핸드폰', hanja: null,
    reading: { rr: 'haendeupon' },
    pos: 'noun', origin: 'loan', en: 'mobile phone', band: 1, domain: 'tech',
    bridge: { kanji: '携帯', kana: 'けいたい', rr: 'keitai', kind: 'equivalent' },
    ex: {
      text: '<m>핸드폰</m>을 잃어버렸어요.', rr: 'haendeuponeul ireobeoryeosseoyo',
      jp: '携帯をなくしました。', jpRr: 'keitai o nakushimashita',
      en: 'I lost my phone.',
    },
    note: {
      head: 'Konglish — a loan Japan never made',
      html: '“Hand phone” is English assembled in Korea; Japanese clipped 携帯電話 instead. ' +
            'A loanword bridge you’d expect to be there, and isn’t — the loan stratum has ' +
            'false friends too.',
    },
  },
  {
    id: 'tellebijeon',
    head: '텔레비전', hanja: null,
    reading: { rr: 'tellebijeon' },
    pos: 'noun', origin: 'loan', en: 'television', band: 2, domain: 'tech',
    bridge: { kanji: 'テレビ', kana: '', rr: 'terebi', kind: 'loan' },
    ex: {
      text: '<m>텔레비전</m>을 봐요.', rr: 'tellebijeoneul bwayo',
      jp: 'テレビを見ます。', jpRr: 'terebi o mimasu',
      en: 'I watch television.',
    },
    note: {
      head: 'clipped on one shore only',
      html: 'Japanese cut to テレビ; Korean kept five syllables in writing but clips to ' +
            '티비 (tibi) in speech. Same word, two pairs of scissors.',
    },
  },
]
