// =====================================================================
// The Polyglot's Atlas — Korean · instrument data
// Conventions:
//   kr   — hangul
//   rr   — Revised Romanization, written to reflect pronunciation
//          (합니다 → hamnida, 먹는다 → meongneunda)
//   jp   — the corresponding Japanese form (the bridge)
//   Liaison (연음) syllables in romanizations are marked with a
//   three-part array: [before, carried consonant, after].
// =====================================================================

// role → display label + colour token (Aburaya pigments)
export const KO_ROLES = {
  topic:     { tag: 'theme · 은/는',   color: 'var(--accent)' },
  subject:   { tag: 'doer · 이/가',    color: 'var(--signal-lit)' },
  object:    { tag: 'done-to · 을/를', color: 'var(--st-active)' },
  recipient: { tag: 'goal · 에게',     color: 'var(--st-travel)' },
  place:     { tag: 'place · 에서',    color: 'var(--ink-soft)' },
}

// ---------------------------------------------------------------------
// INSTRUMENT I — the loom (Korean)
// ---------------------------------------------------------------------
export const KO_LOOM_SPECIMENS = [
  {
    id: 'letter',
    label: 'A letter in the park',
    kr: '편지',
    kind: 'free-order',
    prompt:
      'The same sentence the Japanese folio opens with — translated phrase for phrase. ' +
      'Four phrases, each wearing its particle, the verb holding the end. ' +
      'Drag them into any order — the meaning stays put.',
    tiles: [
      {
        id: 'i', kr: '저', rr: 'jeo', gloss: 'I',
        particle: '는', particleRr: 'neun', role: 'topic',
        jp: '私は',
      },
      {
        id: 'park', kr: '공원', rr: 'gongwon', gloss: 'the park',
        particle: '에서', particleRr: 'eseo', role: 'place',
        jp: '公園で',
      },
      {
        id: 'friend', kr: '친구', rr: 'chingu', gloss: 'my friend',
        particle: '에게', particleRr: 'ege', role: 'recipient',
        jp: '友達に',
      },
      {
        id: 'letter', kr: '편지', rr: 'pyeonji', gloss: 'a letter',
        particle: '를', particleRr: 'reul', role: 'object',
        jp: '手紙を',
      },
    ],
    predicate: { kr: '썼어요', rr: 'sseosseoyo', gloss: 'wrote', jp: '書いた' },
    glossEngine() {
      return {
        html: 'I wrote <span class="done">a letter</span> to my friend in the park.',
        valid: true,
      }
    },
    nuance(orderedTiles) {
      const first = orderedTiles[0]
      const map = {
        i:      'the writer — <b>저는</b> (I)',
        park:   'the setting — <b>공원에서</b> (in the park)',
        friend: 'the recipient — <b>친구에게</b> (to my friend)',
        letter: 'the thing written — <b>편지를</b> (a letter)',
      }
      return 'Same facts — but what comes first is foregrounded. Right now the sentence opens on ' + map[first.id] + '.'
    },
    eurekaReorder: {
      head: '조사 — the particles do the work, again',
      body: 'You moved the words and the meaning <b>held</b> — the exact trick Japanese plays. ' +
            'Particle for particle it is the same machine: 는 is は, 에서 is で, 에게 is に, 를 is を. ' +
            'The sentence engine you built for Japanese runs Korean without modification.',
    },
  },
  {
    id: 'eat',
    label: 'Who eats whom',
    kr: '고양이',
    kind: 'swap',
    coupledSwap: true,
    prompt:
      'Two creatures, one verb. The particles — not the order — decide who is eating. ' +
      'Click a particle and watch the meal change hands. Watch the particles’ ' +
      'shape too: each noun tailors its own.',
    tiles: [
      {
        id: 'cat', kr: '고양이', rr: 'goyangi', gloss: 'the cat',
        particle: '가', particleRr: 'ga', role: 'subject', jp: '猫が',
        swap: [
          { particle: '가', particleRr: 'ga',   role: 'subject', jp: '猫が' },
          { particle: '를', particleRr: 'reul', role: 'object',  jp: '猫を' },
        ],
      },
      {
        id: 'fish', kr: '생선', rr: 'saengseon', gloss: 'the fish',
        particle: '을', particleRr: 'eul', role: 'object', jp: '魚を',
        swap: [
          { particle: '을', particleRr: 'eul', role: 'object',  jp: '魚を' },
          { particle: '이', particleRr: 'i',   role: 'subject', jp: '魚が' },
        ],
      },
    ],
    predicate: { kr: '먹었어요', rr: 'meogeosseoyo', gloss: 'ate', jp: '食べた' },
    glossEngine(tiles) {
      const doer = tiles.find(t => t.role === 'subject')
      const done = tiles.find(t => t.role === 'object')
      if (!doer || !done) {
        return { html: '— needs exactly one doer (이/가) and one done-to (을/를).', valid: false }
      }
      return {
        html:
          'The <span class="doer">' + doer.gloss.replace('the ', '') +
          '</span> ate the <span class="done">' + done.gloss.replace('the ', '') + '</span>.',
        valid: true,
      }
    },
    nuance() {
      return 'Order is still free — <b>고양이가 생선을</b> and <b>생선을 고양이가</b> mean the same. ' +
             'And notice the tailoring: 고양이 ends open, so it takes <b>가/를</b>; 생선 ends closed (ㄴ), so it takes <b>이/을</b>.'
    },
    eurekaSwap: {
      head: 'the particle did two things at once',
      body: 'It changed <b>role</b> — doer ⇄ done-to, exactly like Japanese が⇄を. But it also changed ' +
            '<b>shape</b>: 고양이 took 가/를, 생선 took 이/을. A Korean particle is tailored to the noun ' +
            'it follows — the next instrument is about that tailoring.',
    },
  },
]

export const KO_LOOM_ANCHOR_EUREKA = {
  head: 'the verb keeps the end — here too',
  body: 'It won’t budge. Korean is <b>head-final</b>, like Japanese: the predicate closes the ' +
        'sentence and everything else leans toward it. Two languages, one floor plan.',
}

// ---------------------------------------------------------------------
// INSTRUMENT II — the gate (받침 · particle allomorphy)
// ---------------------------------------------------------------------
// forms: [topic, subject, object, with, toward] — each { kr, rr }
// rr is a string, or [pre, liaison-consonant, post] when the batchim
// carries over onto the particle (연음).
export const GATE_NOUNS = [
  {
    id: 'keopi', kr: '커피', rr: 'keopi', gloss: 'coffee', origin: 'loanword',
    forms: [
      { kr: '커피는', rr: 'keopineun' },
      { kr: '커피가', rr: 'keopiga' },
      { kr: '커피를', rr: 'keopireul' },
      { kr: '커피와', rr: 'keopiwa' },
      { kr: '커피로', rr: 'keopiro' },
    ],
  },
  {
    id: 'hakgyo', kr: '학교', rr: 'hakgyo', gloss: 'school', origin: '學校 · gakkō',
    forms: [
      { kr: '학교는', rr: 'hakgyoneun' },
      { kr: '학교가', rr: 'hakgyoga' },
      { kr: '학교를', rr: 'hakgyoreul' },
      { kr: '학교와', rr: 'hakgyowa' },
      { kr: '학교로', rr: 'hakgyoro' },
    ],
  },
  {
    id: 'chaek', kr: '책', rr: 'chaek', gloss: 'book', origin: '冊 · satsu',
    forms: [
      { kr: '책은', rr: ['chae', 'g', 'eun'] },
      { kr: '책이', rr: ['chae', 'g', 'i'] },
      { kr: '책을', rr: ['chae', 'g', 'eul'] },
      { kr: '책과', rr: 'chaekgwa' },
      { kr: '책으로', rr: ['chae', 'g', 'euro'] },
    ],
  },
  {
    id: 'jip', kr: '집', rr: 'jip', gloss: 'house', origin: 'native',
    forms: [
      { kr: '집은', rr: ['ji', 'b', 'eun'] },
      { kr: '집이', rr: ['ji', 'b', 'i'] },
      { kr: '집을', rr: ['ji', 'b', 'eul'] },
      { kr: '집과', rr: 'jipgwa' },
      { kr: '집으로', rr: ['ji', 'b', 'euro'] },
    ],
  },
  {
    id: 'seonsaengnim', kr: '선생님', rr: 'seonsaengnim', gloss: 'teacher', origin: '先生 + 님',
    forms: [
      { kr: '선생님은', rr: ['seonsaengni', 'm', 'eun'] },
      { kr: '선생님이', rr: ['seonsaengni', 'm', 'i'] },
      { kr: '선생님을', rr: ['seonsaengni', 'm', 'eul'] },
      { kr: '선생님과', rr: 'seonsaengnimgwa' },
      { kr: '선생님으로', rr: ['seonsaengni', 'm', 'euro'] },
    ],
  },
  {
    id: 'mul', kr: '물', rr: 'mul', gloss: 'water', origin: 'native',
    lFinal: true,
    forms: [
      { kr: '물은', rr: ['mu', 'r', 'eun'] },
      { kr: '물이', rr: ['mu', 'r', 'i'] },
      { kr: '물을', rr: ['mu', 'r', 'eul'] },
      { kr: '물과', rr: 'mulgwa' },
      { kr: '물로', rr: 'mullo' },
    ],
  },
  {
    id: 'seoul', kr: '서울', rr: 'seoul', gloss: 'Seoul', origin: 'native',
    lFinal: true,
    forms: [
      { kr: '서울은', rr: ['seou', 'r', 'eun'] },
      { kr: '서울이', rr: ['seou', 'r', 'i'] },
      { kr: '서울을', rr: ['seou', 'r', 'eul'] },
      { kr: '서울과', rr: 'seoulgwa' },
      { kr: '서울로', rr: 'seoullo' },
    ],
  },
]

export const GATE_PAIRS = [
  { id: 'topic',   closed: '은',   open: '는', role: 'theme',     jp: 'は' },
  { id: 'subject', closed: '이',   open: '가', role: 'doer',      jp: 'が' },
  { id: 'object',  closed: '을',   open: '를', role: 'done-to',   jp: 'を' },
  { id: 'with',    closed: '과',   open: '와', role: 'with · and', jp: 'と' },
  { id: 'toward',  closed: '으로', open: '로', role: 'toward · by means of', jp: 'へ・で', lException: true },
]

export const GATE_EUREKAS = {
  bothSeen: {
    head: '받침 — the particle listens to the noun',
    body: 'Every pair is one particle wearing two shapes. A syllable that ends on a consonant — a ' +
          '<b>받침</b>, “the prop under the floor” — takes the shape that begins with a vowel, so the ' +
          'consonant has somewhere to land: 책 + 이 is read <b>chae-gi</b>, not chaek-i. The spelling ' +
          'keeps the pieces apart; the voice ties them together (연음, liaison). Japanese never does ' +
          'this — は is は after anything. That invariance is the one luxury you are giving up.',
  },
  lFinal: {
    head: 'ㄹ — the one consonant the gate waves through',
    body: 'A noun ending in <b>ㄹ</b> counts as closed everywhere — 물은, 물이, 물을 — except before ' +
          '(으)로, which treats ㄹ as if the door were open: <b>물로</b> (mullo), <b>서울로</b> (seoullo). ' +
          'One exception, worth owning early: 서울로 가요 — “I’m going to Seoul.”',
  },
}

// ---------------------------------------------------------------------
// INSTRUMENT III — 은/는 vs 이/가 — the spotlight
// ---------------------------------------------------------------------
export const NEUN_GA = {
  neun: {
    particle: '은/는',
    name: 'eun/neun · the topic',
    sentence: { kr: '저<span class="mark">는</span> 학생이에요', rr: 'jeoneun haksaengieyo' },
    jp: { kr: '私は学生です', rr: 'watashi wa gakusei desu' },
    question: 'answers: “tell me about you.”',
    enHtml: 'It sets the stage — <b>as for me</b>, (the matter is) a student. 는 lifts something up ' +
            'and says “here is what we’re talking about.” Your は instinct applies wholesale.',
  },
  ga: {
    particle: '이/가',
    name: 'i/ga · the subject',
    sentence: { kr: '제<span class="mark">가</span> 학생이에요', rr: 'jega haksaengieyo' },
    jp: { kr: '私が学生です', rr: 'watashi ga gakusei desu' },
    question: 'answers: “which one is the student?”',
    enHtml: 'It selects — <b>I’m the one</b> who is the student. 가 points and picks out exactly ' +
            'which one, often as new or contrastive information. Your が instinct, likewise.',
  },
  rule: '은/는 presents what we are talking <b>about</b>; 이/가 selects <b>which one</b> it is. ' +
        'This is は and が under new names — the intuition you built in Japanese transfers almost ' +
        'untouched. What’s new is only the tailoring (은 after a 받침, 는 after a vowel) and a ' +
        'few fused pronouns.',
  fusions: {
    head: 'three fused pronouns',
    body: 'Before 가, three pronouns contract: 나 + 가 → <b>내가</b> (naega), 저 + 가 → <b>제가</b> ' +
          '(jega), 누구 + 가 → <b>누가</b> (nuga). That is why the spotlight sentence reads 제가, ' +
          'not 저가.',
  },
  copula: {
    head: 'the copula is gated too',
    body: '“is” itself changes shape by 받침: 학생<b>이에요</b> (haksaeng-ieyo) but 의사<b>예요</b> ' +
          '(uisa-yeyo). Same gate as the particles — once you hear it, you hear it everywhere.',
  },
  doubleSubject: {
    krHtml: '<span class="topic">코끼리는</span> <span class="subj">코가</span> 길어요.',
    rr: 'kokkirineun koga gireoyo',
    jpHtml: '<span class="topic">象は</span><span class="subj">鼻が</span>長い。',
    jpRr: 'zō wa hana ga nagai',
    noteHtml: 'The canonical linguistics example — in both languages, particle for particle. ' +
              '<span class="topic">코끼리는</span> sets the topic (<i>as for elephants</i>) while ' +
              '<span class="subj">코가</span> is the subject of 길어요 (<i>the noses are long</i>). ' +
              'The double-subject construction you puzzled out for Japanese comes free.',
  },
}

// ---------------------------------------------------------------------
// VERB FORGE — vowel harmony + assembly
// ---------------------------------------------------------------------
// harmony: 'bright' (ㅏ/ㅗ → -아), 'dark' (else → -어), 'ha' (하 → 해)
// Each tense: pieces for the equation, the result, rr, en, jp.
export const FORGE_VERBS = [
  {
    id: 'gada', kr: '가다', rr: 'gada', stem: '가', stemRr: 'ga',
    lastVowel: 'ㅏ', harmony: 'bright', gloss: 'to go', jp: '行く',
    batchim: false,
    tenses: {
      present: {
        pieces: [{ t: '가', c: 'stem' }, { t: '아요', c: 'harm' }],
        result: '가요', rr: 'gayo', en: 'go / goes (polite)', jp: '行きます',
        fuse: 'ㅏ + 아 are the same vowel — one absorbs the other: 가아요 → <b>가요</b>.',
      },
      past: {
        pieces: [{ t: '가', c: 'stem' }, { t: '았', c: 'harm' }, { t: '어요', c: 'tail' }],
        result: '갔어요', rr: 'gasseoyo', en: 'went', jp: '行きました',
        fuse: '가 + 았 fuses into one block: <b>갔</b>. The past marker 았/었 is the harmony vowel + ㅆ.',
      },
      future: {
        pieces: [{ t: '가', c: 'stem' }, { t: 'ㄹ 거예요', c: 'tail' }],
        result: '갈 거예요', rr: 'gal geoyeyo', en: 'will go', jp: '行くつもりです',
        fuse: 'Open stem → bare <b>ㄹ</b> tucks under the syllable: 가 → 갈.',
      },
    },
  },
  {
    id: 'boda', kr: '보다', rr: 'boda', stem: '보', stemRr: 'bo',
    lastVowel: 'ㅗ', harmony: 'bright', gloss: 'to see', jp: '見る',
    batchim: false,
    tenses: {
      present: {
        pieces: [{ t: '보', c: 'stem' }, { t: '아요', c: 'harm' }],
        result: '봐요', rr: 'bwayo', en: 'see / sees (polite)', jp: '見ます',
        fuse: 'ㅗ + 아 glide together into <b>ㅘ</b>: 보아요 → <b>봐요</b>.',
      },
      past: {
        pieces: [{ t: '보', c: 'stem' }, { t: '았', c: 'harm' }, { t: '어요', c: 'tail' }],
        result: '봤어요', rr: 'bwasseoyo', en: 'saw', jp: '見ました',
        fuse: 'Same glide, then ㅆ: 보았 → <b>봤</b>.',
      },
      future: {
        pieces: [{ t: '보', c: 'stem' }, { t: 'ㄹ 거예요', c: 'tail' }],
        result: '볼 거예요', rr: 'bol geoyeyo', en: 'will see', jp: '見るつもりです',
        fuse: 'Open stem → bare ㄹ: 보 → 볼.',
      },
    },
  },
  {
    id: 'meokda', kr: '먹다', rr: 'meokda', stem: '먹', stemRr: 'meok',
    lastVowel: 'ㅓ', harmony: 'dark', gloss: 'to eat', jp: '食べる',
    batchim: true,
    tenses: {
      present: {
        pieces: [{ t: '먹', c: 'stem' }, { t: '어요', c: 'harm' }],
        result: '먹어요', rr: 'meogeoyo', en: 'eat / eats (polite)', jp: '食べます',
        fuse: 'A 받침 keeps the pieces apart on paper — but the voice ties them: <b>meo-geo-yo</b>, the ㄱ slides onto 어. The gate again.',
      },
      past: {
        pieces: [{ t: '먹', c: 'stem' }, { t: '었', c: 'harm' }, { t: '어요', c: 'tail' }],
        result: '먹었어요', rr: 'meogeosseoyo', en: 'ate', jp: '食べました',
        fuse: 'Dark stem → 었. No fusion to do — the 받침 holds the line.',
      },
      future: {
        pieces: [{ t: '먹', c: 'stem' }, { t: '을 거예요', c: 'tail' }],
        result: '먹을 거예요', rr: 'meogeul geoyeyo', en: 'will eat', jp: '食べるつもりです',
        fuse: 'Closed stem → buffered <b>을</b>. The same 받침 logic as the particles: 먹 + 을, read meo-geul.',
      },
    },
  },
  {
    id: 'masida', kr: '마시다', rr: 'masida', stem: '마시', stemRr: 'masi',
    lastVowel: 'ㅣ', harmony: 'dark', gloss: 'to drink', jp: '飲む',
    batchim: false,
    tenses: {
      present: {
        pieces: [{ t: '마시', c: 'stem' }, { t: '어요', c: 'harm' }],
        result: '마셔요', rr: 'masyeoyo', en: 'drink / drinks (polite)', jp: '飲みます',
        fuse: 'ㅣ + 어 glide into <b>ㅕ</b>: 마시어요 → <b>마셔요</b>.',
      },
      past: {
        pieces: [{ t: '마시', c: 'stem' }, { t: '었', c: 'harm' }, { t: '어요', c: 'tail' }],
        result: '마셨어요', rr: 'masyeosseoyo', en: 'drank', jp: '飲みました',
        fuse: 'Same glide, then ㅆ: 마시었 → <b>마셨</b>.',
      },
      future: {
        pieces: [{ t: '마시', c: 'stem' }, { t: 'ㄹ 거예요', c: 'tail' }],
        result: '마실 거예요', rr: 'masil geoyeyo', en: 'will drink', jp: '飲むつもりです',
        fuse: 'Open stem → bare ㄹ: 마시 → 마실.',
      },
    },
  },
  {
    id: 'hada', kr: '하다', rr: 'hada', stem: '하', stemRr: 'ha',
    lastVowel: 'ㅏ', harmony: 'ha', gloss: 'to do', jp: 'する',
    batchim: false,
    tenses: {
      present: {
        pieces: [{ t: '하', c: 'stem' }, { t: '여요', c: 'harm' }],
        result: '해요', rr: 'haeyo', en: 'do / does (polite)', jp: 'します',
        fuse: 'The wildcard. 하 takes 여, and 하여 contracts to <b>해</b>. One irregular — and it ' +
              'conjugates half the dictionary: every 工夫-style Sino compound is noun + 하다 ' +
              '(공부하다 = 勉強する).',
      },
      past: {
        pieces: [{ t: '하', c: 'stem' }, { t: '였', c: 'harm' }, { t: '어요', c: 'tail' }],
        result: '했어요', rr: 'haesseoyo', en: 'did', jp: 'しました',
        fuse: '하였 → <b>했</b>. Same contraction, plus ㅆ.',
      },
      future: {
        pieces: [{ t: '하', c: 'stem' }, { t: 'ㄹ 거예요', c: 'tail' }],
        result: '할 거예요', rr: 'hal geoyeyo', en: 'will do', jp: 'するつもりです',
        fuse: 'Open stem → bare ㄹ: 하 → 할.',
      },
    },
  },
  {
    id: 'deutda', kr: '듣다', rr: 'deutda', stem: '듣', stemRr: 'deut',
    lastVowel: 'ㅡ', harmony: 'dark', irregular: 'ㄷ → ㄹ before a vowel',
    gloss: 'to listen', jp: '聞く',
    batchim: true,
    tenses: {
      present: {
        pieces: [{ t: '들', c: 'stem' }, { t: '어요', c: 'harm' }],
        result: '들어요', rr: 'deureoyo', en: 'listen / listens (polite)', jp: '聞きます',
        fuse: 'The ㄷ-irregular: before a vowel the stem’s ㄷ softens to ㄹ — 듣 → <b>들</b>. ' +
              'Then the ordinary dark 어: 들어요, read deu-reo-yo.',
      },
      past: {
        pieces: [{ t: '들', c: 'stem' }, { t: '었', c: 'harm' }, { t: '어요', c: 'tail' }],
        result: '들었어요', rr: 'deureosseoyo', en: 'listened', jp: '聞きました',
        fuse: 'Same shift, then 었: <b>들었어요</b>.',
      },
      future: {
        pieces: [{ t: '들', c: 'stem' }, { t: '을 거예요', c: 'tail' }],
        result: '들을 거예요', rr: 'deureul geoyeyo', en: 'will listen', jp: '聞くつもりです',
        fuse: '으 counts as a vowel, so the shift fires here too: 듣 → 들 + 을.',
      },
    },
  },
]

export const FORGE_TENSES = [
  { id: 'present', label: 'present', kr: '-아/어요' },
  { id: 'past',    label: 'past',    kr: '-았/었어요' },
  { id: 'future',  label: 'future',  kr: '-(으)ㄹ 거예요' },
]

export const FORGE_EUREKAS = {
  harmony: {
    head: '모음조화 — vowel harmony',
    body: 'The ending listened to the stem. A last vowel of <b>ㅏ or ㅗ</b> (the “bright”, yang ' +
          'vowels) calls for <b>-아</b>; everything else calls for <b>-어</b>. That single fork — ' +
          'plus one wildcard, 하 → 해 — decides nearly every conjugation in the language. Japanese ' +
          'made you memorize conjugation classes; Korean asks you to listen to one vowel.',
  },
  buffer: {
    head: '으 — the buffer vowel, the gate again',
    body: 'A closed stem takes <b>-을 거예요</b>; an open stem takes bare <b>-ㄹ 거예요</b>. The ' +
          'same 받침 door as 은/는, 이/가, 을/를. One principle, surfacing in particles and verbs ' +
          'alike — learn the door once and half of Korean morphology opens with it.',
  },
  irregular: {
    head: '불규칙 — the irregular drawer',
    body: '듣다 is the preview: a small set of stems flex before vowels (ㄷ→ㄹ, ㅂ→우, ㅅ drops, ' +
          '르 doubles). Each family is tiny and regular-within-itself — closer to Japanese’s ' +
          'う/る-verb split than to French. Catalogue them as they come; don’t front-load.',
  },
}

// ---------------------------------------------------------------------
// REGISTER DIAL — speech levels × subject honor
// ---------------------------------------------------------------------
export const REGISTER_LEVELS = [
  {
    id: 'hapsyo',
    kr: '합쇼체', rr: 'hapsyo-che', en: 'formal · polite',
    ending: '-ㅂ니다 / -습니다',
    endingNote: 'vowel stem + ㅂ니다 (갑니다) · closed stem + 습니다 (먹습니다, meokseumnida)',
    plain: {
      eq: [{ t: '가', c: 'stem' }, { t: 'ㅂ니다', c: 'tail' }],
      sent: '저는 집에 갑니다.', rr: 'jeoneun jibe gamnida',
      en: 'I am going home.',
    },
    honor: {
      eq: [{ t: '가', c: 'stem' }, { t: '시', c: 'honor' }, { t: 'ㅂ니다', c: 'tail' }],
      sent: '할머니께서 집에 가십니다.', rr: 'halmeonikkeseo jibe gasimnida',
      en: 'Grandmother is going home.',
    },
    listener: { kr: '면접관', rr: 'myeonjeopgwan', en: 'the interviewer', dist: 3 },
    context: 'podiums, news desks, job interviews, the army, announcements — distance worn as a uniform',
    jp: '≈ 行きます — but the かしこまった register: a podium’s です/ます',
    kdrama: 'the boardroom and the press conference run on 합쇼체; switching out of it mid-scene is a power move.',
  },
  {
    id: 'haeyo',
    kr: '해요체', rr: 'haeyo-che', en: 'everyday · polite',
    ending: '-아/어요',
    endingNote: 'the forge’s harmony vowel + 요 — politeness is one syllable',
    plain: {
      eq: [{ t: '가', c: 'stem' }, { t: '아', c: 'harm' }, { t: '요', c: 'tail' }],
      sent: '저는 집에 가요.', rr: 'jeoneun jibe gayo',
      en: 'I’m going home.',
    },
    honor: {
      eq: [{ t: '가', c: 'stem' }, { t: '시', c: 'honor' }, { t: '어요', c: 'tail' }],
      sent: '할머니께서 집에 가세요.', rr: 'halmeonikkeseo jibe gaseyo',
      en: 'Grandmother is going home.',
      note: '가 + 시 + 어요 → 가셔요 → <b>가세요</b> — the standard contraction.',
    },
    listener: { kr: '이웃', rr: 'iut', en: 'a neighbor', dist: 2 },
    context: 'most adults, coworkers, shopkeepers, new acquaintances — the default register; when unsure, live here',
    jp: '≈ 行きます — Japanese has one everyday-polite; Korean splits it in two. This is the gap です/ます can’t see.',
    kdrama: 'the safe register strangers meet in — which is exactly why every drama engineers a reason to leave it.',
  },
  {
    id: 'hae',
    kr: '해체', rr: 'hae-che · 반말', en: 'intimate (banmal)',
    ending: '-아/어',
    endingNote: '해요체 minus the 요 — intimacy is subtraction',
    plain: {
      eq: [{ t: '가', c: 'stem' }, { t: '아', c: 'harm' }],
      sent: '나는 집에 가.', rr: 'naneun jibe ga',
      en: 'I’m going home.',
      note: 'the pronoun bows too: humble 저 is for polite registers — banmal takes <b>나</b>.',
    },
    honor: {
      eq: [{ t: '가', c: 'stem' }, { t: '시', c: 'honor' }, { t: '어', c: 'tail' }],
      sent: '할머니가 집에 가셔.', rr: 'halmeoniga jibe gasyeo',
      en: 'Grandma’s going home.',
      note: 'casual <i>to your friend</i>, respectful <i>about grandma</i> — the two axes, proven independent.',
    },
    listener: { kr: '친구', rr: 'chingu', en: 'a close friend', dist: 1 },
    context: 'close friends, younger siblings, children — and only once granted',
    jp: '≈ 行く(よ) — plain-form speech between intimates',
    kdrama: '말 놓을까요? (mal noeulkkayo — “shall we drop the formalities?”) — the banmal drop is a named relationship event, and half of episode eight.',
  },
  {
    id: 'haera',
    kr: '해라체', rr: 'haera-che', en: 'plain · written',
    ending: '-ㄴ다 / -는다',
    endingNote: 'vowel stem + ㄴ다 (간다) · closed stem + 는다 (먹는다, meongneunda)',
    plain: {
      eq: [{ t: '가', c: 'stem' }, { t: 'ㄴ다', c: 'tail' }],
      sent: '나는 집에 간다.', rr: 'naneun jibe ganda',
      en: 'I go home.',
    },
    honor: {
      eq: [{ t: '가', c: 'stem' }, { t: '시', c: 'honor' }, { t: 'ㄴ다', c: 'tail' }],
      sent: '할머니가 집에 가신다.', rr: 'halmeoniga jibe gasinda',
      en: 'Grandmother goes home.',
    },
    listener: { kr: '일기장', rr: 'ilgijang', en: 'the diary', dist: 0 },
    context: 'books, newspapers, diaries, inner monologue, quoted speech — addressed to no one in the room',
    jp: '≈ 行く — the dictionary form as 書き言葉; narration’s register',
    kdrama: 'the voice-over register — when the protagonist narrates over the city at night, it’s 해라체.',
  },
]

export const REGISTER_EUREKAS = {
  banmal: {
    head: '반말 — “half-speech”',
    body: 'You dropped the 요. In Korean that single syllable is the relationship: using 반말 ' +
          'uninvited is an insult, being offered it is intimacy. Listen for the drop — it is the ' +
          'engine of every K-drama power scene, and it is one syllable long.',
  },
  honor: {
    head: 'two dials, not one',
    body: 'The <b>level</b> (요 / ㅂ니다 / nothing) honors the person you’re <i>talking to</i>. ' +
          'The infix <b>-시-</b> honors the person you’re <i>talking about</i>. They turn ' +
          'independently — 할머니가 집에 가셔 is casual to your friend and respectful about grandma ' +
          'at once. Japanese keigo splits the same way: 丁寧語 is the listener dial, 尊敬語 the ' +
          'subject dial.',
  },
  kkeseo: {
    head: '께서 — even the particle bows',
    body: 'With an honored subject, 이/가 itself has a deferential form: 할머니<b>께서</b>. ' +
          'Likewise 에게 → 께 (to someone honored). Honorifics in Korean are not vocabulary — ' +
          'they are inflection, reaching all the way down into the particles.',
  },
}

// ---------------------------------------------------------------------
// 안 / 못 — the two negations
// ---------------------------------------------------------------------
export const AN_MOT = {
  an: {
    particle: '안',
    name: 'an · won’t / doesn’t',
    sentence: { kr: '<span class="mark">안</span> 가요', rr: 'an gayo' },
    jp: { kr: '行きません・行かない', rr: 'ikimasen · ikanai' },
    question: 'the will says no.',
    enHtml: 'Plain negation — the subject <b>chooses not to</b>, or it simply isn’t so. ' +
            'Drop 안 in front of the verb and you’re done. Long form: 가<b>지 않아요</b> ' +
            '(gaji anayo) — same meaning, one notch more formal or written.',
  },
  mot: {
    particle: '못',
    name: 'mot · can’t',
    sentence: { kr: '<span class="mark">못</span> 가요', rr: 'mot gayo' },
    jp: { kr: '行けません・行けない', rr: 'ikemasen · ikenai' },
    question: 'the world says no.',
    enHtml: 'Inability or prevention — the subject <b>cannot</b>, however much they’d like to. ' +
            'Japanese buries this in the potential form (行け<b>ない</b>); Korean hands it a word of ' +
            'its own. Long form: 가<b>지 못해요</b> (gaji motaeyo).',
  },
  rule: '<b>안</b> negates the will; <b>못</b> negates the ability. 안 가요 — I’m not going. ' +
        '못 가요 — I can’t go. The apology, the excuse, and the tragedy all live in the gap ' +
        'between those two words.',
  sound: {
    head: 'what your ear will meet',
    body: '못 가요 is written <i>mot gayo</i> but said <b>[몯까요]</b> — the ㅅ hardens and the ㄱ ' +
          'tenses: <i>mot-kka-yo</i>. Korean assimilates consonants at every word seam (Japanese ' +
          'barely does); when listening practice begins, expect the seams, not the spelling.',
  },
}

// ---------------------------------------------------------------------
// THE CONJUGATION TABLE — register × tense, per verb
// ---------------------------------------------------------------------
// The forge folio shows the everyday-polite (해요체) tenses; the register
// dial shows one verb across the four speech levels. This table is the
// CROSS of the two — the canonical conjugation grid a textbook prints —
// so the proving ground can drill one verb's whole pattern at once
// (verb + register + tense, the "assemble" game the quiz coda names).
//
// A few REPRESENTATIVE verbs, one per pattern, not the whole dictionary:
//   가다  bright/open      — vowel fusion (가+아 → 가)
//   보다  ㅗ-glide         — 보+아 → 봐
//   먹다  dark/받침        — the buffer (먹+어, 먹+을), no fusion
//   하다  the 하 wildcard  — 하+여 → 해 (conjugates half the dictionary)
//   듣다  ㄷ-irregular     — ㄷ→ㄹ BEFORE A VOWEL only (들어요, but 듣습니다)
//
// table[registerId][tenseId] = { kr, rr }. rr is pronunciation-reflecting
// per the file header: nasalization shown (갑니다 → gamnida, 먹는다 →
// meongneunda), liaison shown (먹어요 → meogeoyo), but tensification after an
// obstruent is NOT (갔다 → gatda, 먹다 → meokda) — the same RR convention the
// forge uses. Future uses the 거(=것이) contraction across all four levels
// (갈 거예요 · 갈 겁니다 = 갈 것입니다 · 갈 거야 · 갈 거다). Hand-checked.
export const CONJ_REGISTERS = [
  { id: 'hapsyo', kr: '합쇼체', rr: 'hapsyo-che', en: 'formal',   ending: '-(스)ㅂ니다', jp: 'です/ます' },
  { id: 'haeyo',  kr: '해요체', rr: 'haeyo-che',  en: 'polite',   ending: '-아/어요',    jp: 'です/ます' },
  { id: 'hae',    kr: '해체',   rr: 'hae-che',    en: 'intimate', ending: '-아/어',      jp: 'plain' },
  { id: 'haera',  kr: '해라체', rr: 'haera-che',  en: 'plain',    ending: '-ㄴ/는다',    jp: 'plain' },
]

// marker — the tense morpheme shared DOWN the column, register-independent:
// present has none (∅), past is 았/었, future is the ㄹ 거(예요/…) periphrasis.
export const CONJ_TENSES = [
  { id: 'present', label: 'present', latin: 'now',  marker: '—' },
  { id: 'past',    label: 'past',    latin: 'did',  marker: '았/었' },
  { id: 'future',  label: 'future',  latin: 'will', marker: 'ㄹ 거' },
]

export const CONJ_VERBS = [
  {
    id: 'gada', kr: '가다', rr: 'gada', gloss: 'to go', jp: '行く', pattern: 'bright · open',
    table: {
      hapsyo: { present: { kr: '갑니다', rr: 'gamnida' }, past: { kr: '갔습니다', rr: 'gatseumnida' }, future: { kr: '갈 겁니다', rr: 'gal geomnida' } },
      haeyo:  { present: { kr: '가요',   rr: 'gayo' },    past: { kr: '갔어요',   rr: 'gasseoyo' },    future: { kr: '갈 거예요', rr: 'gal geoyeyo' } },
      hae:    { present: { kr: '가',     rr: 'ga' },      past: { kr: '갔어',     rr: 'gasseo' },      future: { kr: '갈 거야',   rr: 'gal geoya' } },
      haera:  { present: { kr: '간다',   rr: 'ganda' },   past: { kr: '갔다',     rr: 'gatda' },       future: { kr: '갈 거다',   rr: 'gal geoda' } },
    },
  },
  {
    id: 'boda', kr: '보다', rr: 'boda', gloss: 'to see', jp: '見る', pattern: 'ㅗ glide',
    table: {
      hapsyo: { present: { kr: '봅니다', rr: 'bomnida' }, past: { kr: '봤습니다', rr: 'bwatseumnida' }, future: { kr: '볼 겁니다', rr: 'bol geomnida' } },
      haeyo:  { present: { kr: '봐요',   rr: 'bwayo' },   past: { kr: '봤어요',   rr: 'bwasseoyo' },    future: { kr: '볼 거예요', rr: 'bol geoyeyo' } },
      hae:    { present: { kr: '봐',     rr: 'bwa' },     past: { kr: '봤어',     rr: 'bwasseo' },      future: { kr: '볼 거야',   rr: 'bol geoya' } },
      haera:  { present: { kr: '본다',   rr: 'bonda' },   past: { kr: '봤다',     rr: 'bwatda' },       future: { kr: '볼 거다',   rr: 'bol geoda' } },
    },
  },
  {
    id: 'meokda', kr: '먹다', rr: 'meokda', gloss: 'to eat', jp: '食べる', pattern: 'dark · 받침',
    table: {
      hapsyo: { present: { kr: '먹습니다', rr: 'meokseumnida' }, past: { kr: '먹었습니다', rr: 'meogeotseumnida' }, future: { kr: '먹을 겁니다', rr: 'meogeul geomnida' } },
      haeyo:  { present: { kr: '먹어요',   rr: 'meogeoyo' },     past: { kr: '먹었어요',   rr: 'meogeosseoyo' },     future: { kr: '먹을 거예요', rr: 'meogeul geoyeyo' } },
      hae:    { present: { kr: '먹어',     rr: 'meogeo' },       past: { kr: '먹었어',     rr: 'meogeosseo' },       future: { kr: '먹을 거야',   rr: 'meogeul geoya' } },
      haera:  { present: { kr: '먹는다',   rr: 'meongneunda' },  past: { kr: '먹었다',     rr: 'meogeotda' },        future: { kr: '먹을 거다',   rr: 'meogeul geoda' } },
    },
  },
  {
    id: 'hada', kr: '하다', rr: 'hada', gloss: 'to do', jp: 'する', pattern: '하 → 해',
    table: {
      hapsyo: { present: { kr: '합니다', rr: 'hamnida' }, past: { kr: '했습니다', rr: 'haetseumnida' }, future: { kr: '할 겁니다', rr: 'hal geomnida' } },
      haeyo:  { present: { kr: '해요',   rr: 'haeyo' },   past: { kr: '했어요',   rr: 'haesseoyo' },    future: { kr: '할 거예요', rr: 'hal geoyeyo' } },
      hae:    { present: { kr: '해',     rr: 'hae' },     past: { kr: '했어',     rr: 'haesseo' },      future: { kr: '할 거야',   rr: 'hal geoya' } },
      haera:  { present: { kr: '한다',   rr: 'handa' },   past: { kr: '했다',     rr: 'haetda' },       future: { kr: '할 거다',   rr: 'hal geoda' } },
    },
  },
  {
    id: 'deutda', kr: '듣다', rr: 'deutda', gloss: 'to listen', jp: '聞く', pattern: 'ㄷ irregular',
    table: {
      // The ㄷ-irregular fires only before a VOWEL: 들어요 / 들었- / 들을-, but the
      // consonant-initial endings keep the hard stem — 듣습니다, 듣는다 (→ deunneunda).
      hapsyo: { present: { kr: '듣습니다', rr: 'deutseumnida' }, past: { kr: '들었습니다', rr: 'deureotseumnida' }, future: { kr: '들을 겁니다', rr: 'deureul geomnida' } },
      haeyo:  { present: { kr: '들어요',   rr: 'deureoyo' },     past: { kr: '들었어요',   rr: 'deureosseoyo' },     future: { kr: '들을 거예요', rr: 'deureul geoyeyo' } },
      hae:    { present: { kr: '들어',     rr: 'deureo' },       past: { kr: '들었어',     rr: 'deureosseo' },       future: { kr: '들을 거야',   rr: 'deureul geoya' } },
      haera:  { present: { kr: '듣는다',   rr: 'deunneunda' },   past: { kr: '들었다',     rr: 'deureotda' },        future: { kr: '들을 거다',   rr: 'deureul geoda' } },
    },
  },
]

export const CONJ_EUREKAS = {
  cross: {
    head: '활용표 — the two dials, crossed',
    body: 'One verb, the whole grid: every cell is a <b>register × tense</b> choice. Read down a ' +
          'column and the tense holds while the politeness ending changes (갑니다 · 가요 · 가 · 간다); ' +
          'read across a row and the register holds while the tense marker (∅ · 았/었 · ㄹ 거) slides ' +
          'in. The forge taught the harmony vowel; the register dial taught the four levels — this is ' +
          'them multiplied.',
  },
  irregular: {
    head: '듣다 — the irregular shows its seam',
    body: '들어요 / 들었어요 but <b>듣습니다 · 듣는다</b>: the ㄷ→ㄹ shift only fires before a vowel. The ' +
          'consonant-initial endings (-습니다, -는다) never trigger it, so the hard stem 듣 surfaces ' +
          'there. Spotting which ending starts with a vowel <i>is</i> the irregular.',
  },
}
