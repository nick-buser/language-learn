// =====================================================================
// The Polyglot's Atlas — Korean · the cognate bridge (한자어)
// Conventions (same as koreanData.js):
//   kr   — hangul; the word under study is wrapped in <m>…</m>
//   rr   — Revised Romanization, written to reflect pronunciation
//   jp   — the Japanese bridge sentence · jpRr — its romaji
//
// SCHEMA NOTE — this module is the pilot for the dictionary system
// (docs/vocabulary-plan.md, phase 1 → 2). LEDGER below is a hand-written
// exemplar of the payload a future dictionary API will return; the
// instruments must depend on nothing outside these shapes, so that
// swapping this file for a backend call is invisible to the components.
//
// /**
//  * @typedef {Object} CognateChar — one character's sound derivation
//  * @property {string} hanja          the shared character
//  * @property {{kana: string, rr: string}} ja   on'yomi as used in this word
//  * @property {{hangul: string, rr: string}} ko Sino-Korean reading
//  * @property {?string} ruleId        BRIDGE_RULES id governing the final
//  *                                   (null — no final consonant in play)
//  * @property {string} [ini]          initial correspondence worth noting,
//  *                                   e.g. 'g↔h' (see BRIDGE_INITIALS)
//  *
//  * @typedef {Object} CognateEntry — future dictionary payload, piloted here
//  * @property {string} id             stable slug; the future primary key
//  * @property {string} hanja          the shared Sino headword
//  * @property {{hangul: string, rr: string}} ko
//  * @property {{kanji: string, kana: string, rr: string}} ja
//  * @property {string} en             gloss of the Korean sense
//  * @property {'true'|'skewed'|'false-friend'} cognacy
//  * @property {string} domain         coarse topic tag (school, daily, social…)
//  * @property {CognateChar[]} chars   per-character derivation
//  * @property {{kr,rr,jp,jpRr,en}} ex specimen sentence
//  * @property {{head: string, html: string}} [note]  usage / trap footnote
//  */
// =====================================================================

// ---------------------------------------------------------------------
// INSTRUMENT I — the sound bridge (on'yomi ↔ Sino-Korean finals)
// Both lexicons are Middle Chinese, borrowed twice; the finals are
// where the two borrowings diverge most regularly.
// Specimen readings split head/tail so the reflex can be inked:
// kana tail = the JP syllable/vowel carrying the old final,
// ko rr tail = the 받침 (or its absence) carrying it in Korean.
// ---------------------------------------------------------------------
export const BRIDGE_RULES = [
  {
    id: 'k',
    krFinal: 'ㄱ', krRr: '-k',
    jaShape: '-く / -き', jaRr: '-ku / -ki',
    name: 'the propped stop',
    mc: 'Middle Chinese -k',
    color: 'var(--accent)',
    bodyHtml:
      'Korean keeps the old final <b>-k</b> as a 받침 and simply stops: 학, 국, 약. Japanese ' +
      'forbids a syllable from ending on a stop, so it props the consonant up with a vowel — ' +
      '<b>く</b> or <b>き</b>. To cross the bridge, strip the prop and close the door.',
    specimens: [
      { hanja: '学', gloss: 'study',   ja: { head: 'が',  tail: 'く', rrHead: 'ga',  rrTail: 'ku' }, ko: { hangul: '학', rrHead: 'ha',  rrTail: 'k' } },
      { hanja: '国', gloss: 'country', ja: { head: 'こ',  tail: 'く', rrHead: 'ko',  rrTail: 'ku' }, ko: { hangul: '국', rrHead: 'gu',  rrTail: 'k' } },
      { hanja: '約', gloss: 'promise', ja: { head: 'や',  tail: 'く', rrHead: 'ya',  rrTail: 'ku' }, ko: { hangul: '약', rrHead: 'ya',  rrTail: 'k' } },
      { hanja: '食', gloss: 'eat',     ja: { head: 'しょ', tail: 'く', rrHead: 'sho', rrTail: 'ku' }, ko: { hangul: '식', rrHead: 'si',  rrTail: 'k' } },
    ],
  },
  {
    id: 't',
    krFinal: 'ㄹ', krRr: '-l',
    jaShape: '-つ / -ち', jaRr: '-tsu / -chi',
    name: 'the consonant that changed coats',
    mc: 'Middle Chinese -t',
    color: 'var(--signal-lit)',
    bodyHtml:
      'The one final where the two languages disagree about the sound itself. The old <b>-t</b> ' +
      'got the usual Japanese prop (<b>つ</b>/<b>ち</b>) — but Korean let it soften into the ' +
      'liquid <b>ㄹ</b>. So いち is 일, はち is 팔: where Japanese has -tsu/-chi, expect an ㄹ.',
    specimens: [
      { hanja: '一', gloss: 'one',   ja: { head: 'い',  tail: 'ち', rrHead: 'i',   rrTail: 'chi' }, ko: { hangul: '일', rrHead: 'i',   rrTail: 'l' } },
      { hanja: '八', gloss: 'eight', ja: { head: 'は',  tail: 'ち', rrHead: 'ha',  rrTail: 'chi' }, ko: { hangul: '팔', rrHead: 'pa',  rrTail: 'l' } },
      { hanja: '出', gloss: 'exit',  ja: { head: 'しゅ', tail: 'つ', rrHead: 'shu', rrTail: 'tsu' }, ko: { hangul: '출', rrHead: 'chu', rrTail: 'l' } },
      { hanja: '物', gloss: 'thing', ja: { head: 'ぶ',  tail: 'つ', rrHead: 'bu',  rrTail: 'tsu' }, ko: { hangul: '물', rrHead: 'mu',  rrTail: 'l' } },
    ],
  },
  {
    id: 'p',
    krFinal: 'ㅂ', krRr: '-p',
    jaShape: '-う (long vowel)', jaRr: '-u (was -fu)',
    name: 'the buried lip',
    mc: 'Middle Chinese -p',
    color: 'var(--st-travel)',
    bodyHtml:
      'Korean still says the old <b>-p</b>: 십, 입, 집. Japanese once did too — as <b>-ふ</b> — ' +
      'then the ふ eroded into a long vowel: じふ → じゅう. When a Japanese on’yomi ends in a ' +
      'long <b>-う</b>, suspect a buried p underneath; the hangul digs it back up.',
    specimens: [
      { hanja: '十', gloss: 'ten',    ja: { head: 'じゅ', tail: 'う', rrHead: 'ju',  rrTail: 'u' }, ko: { hangul: '십', rrHead: 'si',  rrTail: 'p' } },
      { hanja: '入', gloss: 'enter',  ja: { head: 'にゅ', tail: 'う', rrHead: 'nyu', rrTail: 'u' }, ko: { hangul: '입', rrHead: 'i',   rrTail: 'p' } },
      { hanja: '集', gloss: 'gather', ja: { head: 'しゅ', tail: 'う', rrHead: 'shu', rrTail: 'u' }, ko: { hangul: '집', rrHead: 'ji',  rrTail: 'p' } },
      { hanja: '法', gloss: 'law',    ja: { head: 'ほ',  tail: 'う', rrHead: 'ho',  rrTail: 'u' }, ko: { hangul: '법', rrHead: 'beo', rrTail: 'p' } },
    ],
  },
  {
    id: 'ng',
    krFinal: 'ㅇ', krRr: '-ng',
    jaShape: '-う / -い (long vowel)', jaRr: '-u / -i',
    name: 'the melted hum',
    mc: 'Middle Chinese -ng',
    color: 'var(--amber)',
    bodyHtml:
      'The highest-volume rule on the bridge. The old <b>-ng</b> melted into a Japanese long ' +
      'vowel — とう, きょう, せい — but Korean still hums it as <b>ㅇ</b>: 동, 경, 생. ' +
      'Long vowel in Tokyo, soft gong in Seoul; one final, two fates.',
    specimens: [
      { hanja: '東', gloss: 'east',    ja: { head: 'と',  tail: 'う', rrHead: 'to',  rrTail: 'u' }, ko: { hangul: '동', rrHead: 'do',  rrTail: 'ng' } },
      { hanja: '京', gloss: 'capital', ja: { head: 'きょ', tail: 'う', rrHead: 'kyo', rrTail: 'u' }, ko: { hangul: '경', rrHead: 'gyeo', rrTail: 'ng' } },
      { hanja: '生', gloss: 'life',    ja: { head: 'せ',  tail: 'い', rrHead: 'se',  rrTail: 'i' }, ko: { hangul: '생', rrHead: 'sae', rrTail: 'ng' } },
      { hanja: '工', gloss: 'craft',   ja: { head: 'こ',  tail: 'う', rrHead: 'ko',  rrTail: 'u' }, ko: { hangul: '공', rrHead: 'go',  rrTail: 'ng' } },
    ],
  },
  {
    id: 'n',
    krFinal: 'ㄴ', krRr: '-n',
    jaShape: '-ん', jaRr: '-n',
    name: 'the freebie',
    mc: 'Middle Chinese -n',
    color: 'var(--ink-soft)',
    bodyHtml:
      'The old <b>-n</b> survived in both languages untouched: ん crosses the strait as <b>ㄴ</b> ' +
      'and nothing changes. 山 is さん and 산, 新 is しん and 신. Pocket it and move on — ' +
      'but see the next rule before you trust every ん.',
    specimens: [
      { hanja: '山', gloss: 'mountain', ja: { head: 'さ', tail: 'ん', rrHead: 'sa',  rrTail: 'n' }, ko: { hangul: '산', rrHead: 'sa', rrTail: 'n' } },
      { hanja: '新', gloss: 'new',      ja: { head: 'し', tail: 'ん', rrHead: 'shi', rrTail: 'n' }, ko: { hangul: '신', rrHead: 'si', rrTail: 'n' } },
      { hanja: '民', gloss: 'people',   ja: { head: 'み', tail: 'ん', rrHead: 'mi',  rrTail: 'n' }, ko: { hangul: '민', rrHead: 'mi', rrTail: 'n' } },
      { hanja: '問', gloss: 'ask',      ja: { head: 'も', tail: 'ん', rrHead: 'mo',  rrTail: 'n' }, ko: { hangul: '문', rrHead: 'mu', rrTail: 'n' } },
    ],
  },
  {
    id: 'm',
    krFinal: 'ㅁ', krRr: '-m',
    jaShape: '-ん (merged)', jaRr: '-n',
    name: 'the lip Japanese lost',
    mc: 'Middle Chinese -m',
    color: 'var(--st-active)',
    bodyHtml:
      'Middle Chinese had two nasal finals, <b>-n</b> and <b>-m</b>. Japanese folded both into ' +
      'ん centuries ago; Korean still closes its lips: 삼, 심, 음. A Japanese ん only tells you ' +
      '“nasal — n or m, can’t say which”; the hangul keeps the receipt.',
    specimens: [
      { hanja: '三', gloss: 'three', ja: { head: 'さ', tail: 'ん', rrHead: 'sa',  rrTail: 'n' }, ko: { hangul: '삼', rrHead: 'sa', rrTail: 'm' } },
      { hanja: '心', gloss: 'heart', ja: { head: 'し', tail: 'ん', rrHead: 'shi', rrTail: 'n' }, ko: { hangul: '심', rrHead: 'si', rrTail: 'm' } },
      { hanja: '音', gloss: 'sound', ja: { head: 'お', tail: 'ん', rrHead: 'o',   rrTail: 'n' }, ko: { hangul: '음', rrHead: 'eu', rrTail: 'm' } },
      { hanja: '南', gloss: 'south', ja: { head: 'な', tail: 'ん', rrHead: 'na',  rrTail: 'n' }, ko: { hangul: '남', rrHead: 'na', rrTail: 'm' } },
    ],
  },
]

// The initials drift too, but less regularly — footnote material, not rules.
export const BRIDGE_INITIALS = [
  {
    id: 'g-h', label: 'g/k ↔ h',
    head: 'where Japanese hardened, Korean breathed',
    html: 'One family of old initials became <b>k/g</b> in Japanese but <b>ㅎ</b> in Korean: ' +
          '学 がく → <b>학</b> (hak), 海 かい → <b>해</b> (hae), 火 か → <b>화</b> (hwa). ' +
          'So がっこう → <b>학교</b> (hakgyo) shifts at both ends.',
  },
  {
    id: 'b-m', label: 'b ↔ m',
    head: 'the un-nasaled m',
    html: 'Old <b>m-</b> initials stayed m in Korean but often hardened to <b>b</b> in Japanese: ' +
          '聞 ぶん → <b>문</b> (mun), 美 び → <b>미</b> (mi), 無 む → 무 held, but 物 ぶつ → ' +
          '<b>물</b> (mul). When Japanese says b, try m before giving up.',
  },
  {
    id: 'j-zero', label: 'j ↔ ∅',
    head: 'the vanishing 人',
    html: 'The old soft initial of 人 kept a consonant in Japanese (じん/にん) but vanished in ' +
          'Korean: <b>인</b> (in). Hence 愛人 あいじん → 애인 <b>aein</b> — the consonant simply ' +
          'isn’t there to say.',
  },
]

export const BRIDGE_EUREKAS = {
  tToL: {
    head: '-t became -ㄹ — the coat change',
    body: 'Five of the six finals keep their consonant; this one swapped it. Once you hear ' +
          'つ/ち as a disguised <b>ㄹ</b>, words start unlocking mid-stride: しつもん → ' +
          '<b>질문</b> (jilmun), いち → <b>일</b>, はち → <b>팔</b>. This is the rule that ' +
          'feels like a magic trick — enjoy it.',
  },
  merged: {
    head: 'さん is 산 and also 삼',
    body: 'You’ve now seen both nasals. Japanese merged old -n and -m into one ん; Korean kept ' +
          'them apart — 山 <b>산</b> but 三 <b>삼</b>, 新 <b>신</b> but 心 <b>심</b>. Crossing ' +
          'from Japanese you must recover a distinction your source language threw away: the ' +
          'hangul is the older archive here, not the newer one.',
  },
  allSix: {
    head: 'six rules, half the dictionary',
    body: 'That’s the whole bridge: six finals plus a few initial habits. Roughly <b>60% of ' +
          'Korean vocabulary is 한자어</b> — the same Middle Chinese lexicon your on’yomi came ' +
          'from, borrowed twice. You don’t learn these words; you <b>re-key</b> them, at a rate ' +
          'no flashcard deck will ever match.',
  },
}

// ---------------------------------------------------------------------
// INSTRUMENT II — the cognate ledger (the dictionary pilot)
// ---------------------------------------------------------------------
export const COGNACY = {
  'true':         { label: 'true twin',    color: 'var(--st-active)',  blurb: 'same characters, same meaning — pay the sound toll and it’s yours' },
  'skewed':       { label: 'skewed sense', color: 'var(--amber)',      blurb: 'same characters, meaning drifted — close enough to mislead politely' },
  'false-friend': { label: 'false friend', color: 'var(--signal-lit)', blurb: 'same characters, different meaning — the bridge’s trolls' },
}

export const LEDGER_EUREKAS = {
  trolls: {
    head: 'the bridge has trolls',
    body: 'Most twins are true — that is the whole bargain. But a few drifted: <b>工夫</b> means ' +
          'studying in Seoul and ingenuity in Tokyo; <b>愛人</b> is a sweetheart in Seoul and a ' +
          'scandal in Tokyo. False friends are rare enough to learn as a short list — and ' +
          'precisely because everything else transfers, your guard will be down. Keep the list.',
  },
}

export const LEDGER = [
  // ----- true twins ---------------------------------------------------
  {
    id: 'yaksok',
    hanja: '約束',
    ko: { hangul: '약속', rr: 'yaksok' },
    ja: { kanji: '約束', kana: 'やくそく', rr: 'yakusoku' },
    en: 'promise · plans',
    cognacy: 'true',
    domain: 'social',
    chars: [
      { hanja: '約', ja: { kana: 'やく', rr: 'yaku' }, ko: { hangul: '약', rr: 'yak' }, ruleId: 'k' },
      { hanja: '束', ja: { kana: 'そく', rr: 'soku' }, ko: { hangul: '속', rr: 'sok' }, ruleId: 'k' },
    ],
    ex: {
      kr: '내일 <m>약속</m>이 있어요.',
      rr: 'naeil yaksogi isseoyo',
      jp: '明日、約束があります。',
      jpRr: 'ashita, yakusoku ga arimasu',
      en: 'I have plans tomorrow.',
    },
    note: {
      head: 'double -k, double toll',
      html: 'Both characters pay the same toll: やく → 약, そく → 속. Korean uses 약속 a shade ' +
            'more casually than Japanese 約束 — any appointment or plans, not only a vow.',
    },
  },
  {
    id: 'haksaeng',
    hanja: '学生',
    ko: { hangul: '학생', rr: 'haksaeng' },
    ja: { kanji: '学生', kana: 'がくせい', rr: 'gakusei' },
    en: 'student',
    cognacy: 'true',
    domain: 'school',
    chars: [
      { hanja: '学', ja: { kana: 'がく', rr: 'gaku' }, ko: { hangul: '학', rr: 'hak' }, ruleId: 'k', ini: 'g↔h' },
      { hanja: '生', ja: { kana: 'せい', rr: 'sei' },  ko: { hangul: '생', rr: 'saeng' }, ruleId: 'ng' },
    ],
    ex: {
      kr: '저는 <m>학생</m>이에요.',
      rr: 'jeoneun haksaengieyo',
      jp: '私は学生です。',
      jpRr: 'watashi wa gakusei desu',
      en: 'I am a student.',
    },
    note: {
      head: 'you already met this word',
      html: 'The grammar folio’s spotlight sentence — now you know where 학생 comes from: ' +
            'がくせい with the -k closed and the -i hummed into -ng.',
    },
  },
  {
    id: 'sigan',
    hanja: '時間',
    ko: { hangul: '시간', rr: 'sigan' },
    ja: { kanji: '時間', kana: 'じかん', rr: 'jikan' },
    en: 'time',
    cognacy: 'true',
    domain: 'daily',
    chars: [
      { hanja: '時', ja: { kana: 'じ', rr: 'ji' },   ko: { hangul: '시', rr: 'si' }, ruleId: null },
      { hanja: '間', ja: { kana: 'かん', rr: 'kan' }, ko: { hangul: '간', rr: 'gan' }, ruleId: 'n' },
    ],
    ex: {
      kr: '<m>시간</m>이 없어요.',
      rr: 'sigani eopseoyo',
      jp: '時間がありません。',
      jpRr: 'jikan ga arimasen',
      en: 'There’s no time.',
    },
  },
  {
    id: 'gajok',
    hanja: '家族',
    ko: { hangul: '가족', rr: 'gajok' },
    ja: { kanji: '家族', kana: 'かぞく', rr: 'kazoku' },
    en: 'family',
    cognacy: 'true',
    domain: 'social',
    chars: [
      { hanja: '家', ja: { kana: 'か', rr: 'ka' },   ko: { hangul: '가', rr: 'ga' }, ruleId: null },
      { hanja: '族', ja: { kana: 'ぞく', rr: 'zoku' }, ko: { hangul: '족', rr: 'jok' }, ruleId: 'k' },
    ],
    ex: {
      kr: '<m>가족</m>과 같이 살아요.',
      rr: 'gajokgwa gachi sarayo',
      jp: '家族と一緒に住んでいます。',
      jpRr: 'kazoku to issho ni sunde imasu',
      en: 'I live with my family.',
    },
  },
  {
    id: 'undong',
    hanja: '運動',
    ko: { hangul: '운동', rr: 'undong' },
    ja: { kanji: '運動', kana: 'うんどう', rr: 'undō' },
    en: 'exercise · movement',
    cognacy: 'true',
    domain: 'daily',
    chars: [
      { hanja: '運', ja: { kana: 'うん', rr: 'un' },  ko: { hangul: '운', rr: 'un' }, ruleId: 'n' },
      { hanja: '動', ja: { kana: 'どう', rr: 'dō' },  ko: { hangul: '동', rr: 'dong' }, ruleId: 'ng' },
    ],
    ex: {
      kr: '매일 <m>운동</m>해요.',
      rr: 'maeil undonghaeyo',
      jp: '毎日、運動します。',
      jpRr: 'mainichi, undō shimasu',
      en: 'I exercise every day.',
    },
    note: {
      head: 'both nasal fates in one word',
      html: 'うん keeps its -n (운) while どう un-melts back to -ng (동) — the bridge’s two ' +
            'nasal rules running side by side. And 운동<b>하다</b> = 運動<b>する</b>: the ' +
            'noun-plus-do recipe transfers wholesale.',
    },
  },
  {
    id: 'sinmun',
    hanja: '新聞',
    ko: { hangul: '신문', rr: 'sinmun' },
    ja: { kanji: '新聞', kana: 'しんぶん', rr: 'shinbun' },
    en: 'newspaper',
    cognacy: 'true',
    domain: 'daily',
    chars: [
      { hanja: '新', ja: { kana: 'しん', rr: 'shin' }, ko: { hangul: '신', rr: 'sin' }, ruleId: 'n' },
      { hanja: '聞', ja: { kana: 'ぶん', rr: 'bun' },  ko: { hangul: '문', rr: 'mun' }, ruleId: 'n', ini: 'b↔m' },
    ],
    ex: {
      kr: '아침에 <m>신문</m>을 읽어요.',
      rr: 'achime sinmuneul ilgeoyo',
      jp: '朝、新聞を読みます。',
      jpRr: 'asa, shinbun o yomimasu',
      en: 'I read the paper in the morning.',
    },
  },
  {
    id: 'doseogwan',
    hanja: '図書館',
    ko: { hangul: '도서관', rr: 'doseogwan' },
    ja: { kanji: '図書館', kana: 'としょかん', rr: 'toshokan' },
    en: 'library',
    cognacy: 'true',
    domain: 'school',
    chars: [
      { hanja: '図', ja: { kana: 'と', rr: 'to' },    ko: { hangul: '도', rr: 'do' }, ruleId: null },
      { hanja: '書', ja: { kana: 'しょ', rr: 'sho' },  ko: { hangul: '서', rr: 'seo' }, ruleId: null },
      { hanja: '館', ja: { kana: 'かん', rr: 'kan' },  ko: { hangul: '관', rr: 'gwan' }, ruleId: 'n' },
    ],
    ex: {
      kr: '<m>도서관</m>에서 공부해요.',
      rr: 'doseogwaneseo gongbuhaeyo',
      jp: '図書館で勉強します。',
      jpRr: 'toshokan de benkyō shimasu',
      en: 'I study at the library.',
    },
  },
  {
    id: 'sajin',
    hanja: '写真',
    ko: { hangul: '사진', rr: 'sajin' },
    ja: { kanji: '写真', kana: 'しゃしん', rr: 'shashin' },
    en: 'photograph',
    cognacy: 'true',
    domain: 'daily',
    chars: [
      { hanja: '写', ja: { kana: 'しゃ', rr: 'sha' },  ko: { hangul: '사', rr: 'sa' }, ruleId: null },
      { hanja: '真', ja: { kana: 'しん', rr: 'shin' }, ko: { hangul: '진', rr: 'jin' }, ruleId: 'n' },
    ],
    ex: {
      kr: '<m>사진</m>을 찍었어요.',
      rr: 'sajineul jjigeosseoyo',
      jp: '写真を撮りました。',
      jpRr: 'shashin o torimashita',
      en: 'I took a photo.',
    },
    note: {
      head: 'the noun crosses, the verb doesn’t',
      html: 'Cognates hand you the <b>nouns</b>; the verbs stay native on each shore — ' +
            '사진을 <b>찍다</b> vs 写真を<b>撮る</b>. Budget your study time accordingly.',
    },
  },
  {
    id: 'jumun',
    hanja: '注文',
    ko: { hangul: '주문', rr: 'jumun' },
    ja: { kanji: '注文', kana: 'ちゅうもん', rr: 'chūmon' },
    en: 'an order (food, goods)',
    cognacy: 'true',
    domain: 'daily',
    chars: [
      { hanja: '注', ja: { kana: 'ちゅう', rr: 'chū' }, ko: { hangul: '주', rr: 'ju' }, ruleId: null },
      { hanja: '文', ja: { kana: 'もん', rr: 'mon' },   ko: { hangul: '문', rr: 'mun' }, ruleId: 'n' },
    ],
    ex: {
      kr: '커피를 <m>주문</m>했어요.',
      rr: 'keopireul jumunhaesseoyo',
      jp: 'コーヒーを注文しました。',
      jpRr: 'kōhī o chūmon shimashita',
      en: 'I ordered a coffee.',
    },
  },
  {
    id: 'jilmun',
    hanja: '質問',
    ko: { hangul: '질문', rr: 'jilmun' },
    ja: { kanji: '質問', kana: 'しつもん', rr: 'shitsumon' },
    en: 'question',
    cognacy: 'true',
    domain: 'school',
    chars: [
      { hanja: '質', ja: { kana: 'しつ', rr: 'shitsu' }, ko: { hangul: '질', rr: 'jil' }, ruleId: 't' },
      { hanja: '問', ja: { kana: 'もん', rr: 'mon' },    ko: { hangul: '문', rr: 'mun' }, ruleId: 'n' },
    ],
    ex: {
      kr: '<m>질문</m>이 있어요.',
      rr: 'jilmuni isseoyo',
      jp: '質問があります。',
      jpRr: 'shitsumon ga arimasu',
      en: 'I have a question.',
    },
    note: {
      head: 'the coat change, mid-word',
      html: 'しつ → <b>질</b> is the -t → ㄹ rule earning its keep inside an everyday word. ' +
            'Say しつもん, swap the coat, and 질문 was already yours.',
    },
  },
  {
    id: 'muryo',
    hanja: '無料',
    ko: { hangul: '무료', rr: 'muryo' },
    ja: { kanji: '無料', kana: 'むりょう', rr: 'muryō' },
    en: 'free of charge',
    cognacy: 'true',
    domain: 'daily',
    chars: [
      { hanja: '無', ja: { kana: 'む', rr: 'mu' },     ko: { hangul: '무', rr: 'mu' }, ruleId: null },
      { hanja: '料', ja: { kana: 'りょう', rr: 'ryō' }, ko: { hangul: '료', rr: 'ryo' }, ruleId: null },
    ],
    ex: {
      kr: '입장은 <m>무료</m>예요.',
      rr: 'ipjangeun muryoyeyo',
      jp: '入場は無料です。',
      jpRr: 'nyūjō wa muryō desu',
      en: 'Admission is free.',
    },
    note: {
      head: 'cognates nest',
      html: 'The specimen smuggles in a second one: 입장 is <b>入場</b> (にゅうじょう) — the ' +
            'buried-p and melted-ng rules in a single bonus word.',
    },
  },
  {
    id: 'ansim',
    hanja: '安心',
    ko: { hangul: '안심', rr: 'ansim' },
    ja: { kanji: '安心', kana: 'あんしん', rr: 'anshin' },
    en: 'relief · peace of mind',
    cognacy: 'true',
    domain: 'social',
    chars: [
      { hanja: '安', ja: { kana: 'あん', rr: 'an' },   ko: { hangul: '안', rr: 'an' }, ruleId: 'n' },
      { hanja: '心', ja: { kana: 'しん', rr: 'shin' }, ko: { hangul: '심', rr: 'sim' }, ruleId: 'm' },
    ],
    ex: {
      kr: '이제 <m>안심</m>했어요.',
      rr: 'ije ansimhaesseoyo',
      jp: 'もう安心しました。',
      jpRr: 'mō anshin shimashita',
      en: 'Now I can relax.',
    },
    note: {
      head: 'two ん, two fates',
      html: 'あんしん has two identical ん — and Korean resolves them differently: 안 (ㄴ) but ' +
            '심 (ㅁ). The merged-nasal rule, witnessed inside one word.',
    },
  },
  // ----- skewed sense -------------------------------------------------
  {
    id: 'sikdang',
    hanja: '食堂',
    ko: { hangul: '식당', rr: 'sikdang' },
    ja: { kanji: '食堂', kana: 'しょくどう', rr: 'shokudō' },
    en: 'restaurant (any)',
    cognacy: 'skewed',
    domain: 'daily',
    chars: [
      { hanja: '食', ja: { kana: 'しょく', rr: 'shoku' }, ko: { hangul: '식', rr: 'sik' }, ruleId: 'k' },
      { hanja: '堂', ja: { kana: 'どう', rr: 'dō' },      ko: { hangul: '당', rr: 'dang' }, ruleId: 'ng' },
    ],
    ex: {
      kr: '<m>식당</m>에서 점심을 먹었어요.',
      rr: 'sikdangeseo jeomsimeul meogeosseoyo',
      jp: '食堂で昼ご飯を食べました。',
      jpRr: 'shokudō de hirugohan o tabemashita',
      en: 'I had lunch at a restaurant.',
    },
    note: {
      head: 'same sign, different doorway',
      html: 'In Korean 식당 is the plain word for <b>any restaurant</b>; in Japanese 食堂 has ' +
            'narrowed to canteens and old-style diners. The characters match; the establishments ' +
            'don’t quite.',
    },
  },
  // ----- false friends ------------------------------------------------
  {
    id: 'gongbu',
    hanja: '工夫',
    ko: { hangul: '공부', rr: 'gongbu' },
    ja: { kanji: '工夫', kana: 'くふう', rr: 'kufū' },
    en: 'KO: studying — JP: ingenuity',
    cognacy: 'false-friend',
    domain: 'school',
    chars: [
      { hanja: '工', ja: { kana: 'こう', rr: 'kō' }, ko: { hangul: '공', rr: 'gong' }, ruleId: 'ng' },
      { hanja: '夫', ja: { kana: 'ふ', rr: 'fu' },   ko: { hangul: '부', rr: 'bu' }, ruleId: null },
    ],
    ex: {
      kr: '한국어를 <m>공부</m>해요.',
      rr: 'hangugeoreul gongbuhaeyo',
      jp: '韓国語を勉強します。',
      jpRr: 'kankokugo o benkyō shimasu',
      en: 'I’m studying Korean.',
    },
    note: {
      head: 'the most famous troll',
      html: 'The same two characters mean <b>studying</b> in Seoul and <b>clever devising</b> in ' +
            'Tokyo (くふうする — to contrive). Each language picked a different Sino compound ' +
            'for “study”: Japanese took 勉強, Korean took 工夫 — and neither reads the other’s ' +
            'choice the same way.',
    },
  },
  {
    id: 'aein',
    hanja: '愛人',
    ko: { hangul: '애인', rr: 'aein' },
    ja: { kanji: '愛人', kana: 'あいじん', rr: 'aijin' },
    en: 'KO: sweetheart — JP: mistress',
    cognacy: 'false-friend',
    domain: 'social',
    chars: [
      { hanja: '愛', ja: { kana: 'あい', rr: 'ai' },   ko: { hangul: '애', rr: 'ae' }, ruleId: null },
      { hanja: '人', ja: { kana: 'じん', rr: 'jin' },  ko: { hangul: '인', rr: 'in' }, ruleId: 'n', ini: 'j↔∅' },
    ],
    ex: {
      kr: '<m>애인</m>이 있어요?',
      rr: 'aeini isseoyo',
      jp: '恋人がいますか。',
      jpRr: 'koibito ga imasu ka',
      en: 'Do you have a boyfriend/girlfriend?',
    },
    note: {
      head: 'mind the gap',
      html: 'In Korean 애인 is an innocent <b>sweetheart</b>; in Japanese 愛人 means a ' +
            '<b>mistress / illicit lover</b>. Translate it with 恋人, never with its own ' +
            'characters — the one bridge plank you must not step on.',
    },
  },
  {
    id: 'palbangmiin',
    hanja: '八方美人',
    ko: { hangul: '팔방미인', rr: 'palbangmiin' },
    ja: { kanji: '八方美人', kana: 'はっぽうびじん', rr: 'happō bijin' },
    en: 'KO: good at everything — JP: people-pleaser',
    cognacy: 'false-friend',
    domain: 'social',
    chars: [
      { hanja: '八', ja: { kana: 'はち', rr: 'hachi' }, ko: { hangul: '팔', rr: 'pal' }, ruleId: 't' },
      { hanja: '方', ja: { kana: 'ほう', rr: 'hō' },    ko: { hangul: '방', rr: 'bang' }, ruleId: 'ng' },
      { hanja: '美', ja: { kana: 'び', rr: 'bi' },      ko: { hangul: '미', rr: 'mi' }, ruleId: null, ini: 'b↔m' },
      { hanja: '人', ja: { kana: 'じん', rr: 'jin' },   ko: { hangul: '인', rr: 'in' }, ruleId: 'n', ini: 'j↔∅' },
    ],
    ex: {
      kr: '그 사람은 <m>팔방미인</m>이에요.',
      rr: 'geu sarameun palbangmiinieyo',
      jp: 'あの人は何でもできます。',
      jpRr: 'ano hito wa nan demo dekimasu',
      en: 'That person is good at everything — a compliment.',
    },
    note: {
      head: 'a compliment that doesn’t travel',
      html: '“Beauty in all eight directions”: in Korean, sincere praise for an all-rounder. In ' +
            'Japanese the same idiom curdled into <b>someone nice to everyone and true to ' +
            'no one</b>. Four characters, one ocean, opposite toasts.',
    },
  },
]
