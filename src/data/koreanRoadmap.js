// =====================================================================
// The Polyglot's Atlas — Korean · the long road (여정)
// The fluency roadmap: five capacity-named waymarks between zero and
// the far ranges, charted deep through B1 and sketched beyond.
//
// Grounding: CEFR bands and TOPIK levels appear as reference rails,
// but the waymarks are CAPACITIES — what you can do standing there —
// not exam scores. Content is tuned for this atlas's learner: a
// beginner in Korean with strong Japanese (see korean_approach.md in
// project/uploads — the provenance memo this roadmap is built against).
// Hour ranges already include the Japanese-transfer discount the memo
// estimates at 25–35% off a cold start.
//
// Conventions (as everywhere in the atlas):
//   Korean carries hangul + Revised Romanization, romanized to
//   reflect pronunciation (먹는 → meongneun, 책이 → chae-gi).
//   *Html fields are trusted strings rendered by the instruments;
//   <b> is the gold accent, <i> is italic, .kr spans get hangul type.
//
// SCHEMA NOTE — progress against this roadmap (checked items, habit
// days, check-ins) persists in localStorage under atlas.ko.roadmap.v1
// (see useRoadmapStore.js). That store's shape is the pilot for the
// per-learner state the future backend will hold (vocabulary plan,
// phase 3): this module is the immutable chart, the store is the ink.
//
// /**
//  * @typedef {Object} ChecklistItem — one assessable claim
//  * @property {string} id    stable slug — the persistence key; never rename
//  * @property {string} html  the claim, concrete enough to honestly tick
//  *
//  * @typedef {Object} Strand — one skill lane within a waymark
//  * @property {string} id    STRANDS key: vocab|grammar|sound|listen|read|produce
//  * @property {string} cando      the goal-post — capacity statement
//  * @property {string} bodyHtml   the deep explanation (why / what / how)
//  * @property {string} [bridgeHtml] Japanese-transfer note (honor showJp)
//  * @property {ChecklistItem[]} items
//  *
//  * @typedef {Object} Phase — one waymark on the trail
//  * @property {string} id          p1…p5; the persistence namespace
//  * @property {string} glyph       hangul name (Sino — every waymark name
//  *                                is itself a cognate that crosses the bridge)
//  * @property {string} rr          its romanization
//  * @property {string} hanja       the shared characters
//  * @property {string} jaBridge    the Japanese twin (kanji + kana + romaji)
//  * @property {string} name        English name
//  * @property {string} cefr        CEFR reference band (approximate)
//  * @property {string} topik       TOPIK reference level (approximate)
//  * @property {string} words       cumulative vocabulary benchmark
//  * @property {?[number,number]}  hours  focused-hours range for the phase
//  *                                (JP discount applied); null = unmapped
//  * @property {string} capacity    what you can do standing here
//  * @property {string} enter       "you stand here when —"
//  * @property {?string} gate       "the gate opens when —"
//  * @property {?string} signpost   milestone quoted from the approach memo
//  * @property {?string} kit        the working materials for the phase
//  * @property {Strand[]} strands   empty for the unmapped far ranges
//  * @property {?Object<string,Object<string,number>>} mixes
//  *                                profileId → strandId → % of weekly hours
//  * @property {?string} defaultProfile
//  * @property {string}  [sketchHtml]    p5 only — why the map runs out
//  * @property {Array}   [landmarks]     p5 only — {kr, rr, en, html}
//  */
// =====================================================================

// ---------------------------------------------------------------------
// The six strands — the skill lanes every dossier charts.
// Pigments are tokens only; vermilion is a signal surface (the sound
// strand is the alarm strand — it is what Japanese does not give you).
// ---------------------------------------------------------------------
export const STRAND_ORDER = ['vocab', 'grammar', 'sound', 'listen', 'read', 'produce']

export const STRANDS = {
  vocab:   { glyph: '어휘',  rr: 'eohwi',     en: 'vocabulary',         color: 'var(--accent)' },
  grammar: { glyph: '문법',  rr: 'munbeop',   en: 'grammar',            color: 'var(--st-travel)' },
  sound:   { glyph: '발음',  rr: 'bareum',    en: 'sound & accent',     color: 'var(--signal-lit)' },
  listen:  { glyph: '듣기',  rr: 'deutgi',    en: 'listening',          color: 'var(--amber)' },
  read:    { glyph: '읽기',  rr: 'ilkki',     en: 'reading',            color: 'var(--st-active)' },
  produce: { glyph: '말·글', rr: 'mal·geul',  en: 'speaking & writing', color: 'var(--ink-soft)' },
}

// ---------------------------------------------------------------------
// Effort profiles — three honest ways to split the same week.
// The mixes are starting points, not law; the rationale says who
// each one serves. The learner's aim (reception: drama, webtoons,
// eventually fiction) is why "the listener" is the house lean.
// ---------------------------------------------------------------------
export const PROFILES = [
  {
    id: 'balanced', label: 'the steady mix',
    why: 'Every strand fed every week. The default until your aim says otherwise — and early on, it should be the default: gaps compound faster than strengths.',
  },
  {
    id: 'listener', label: 'the listener',
    why: 'Reception first, for the K-drama aim: listening and sound take the surplus. The memo is blunt — listening is the long tail; hours moved here early are hours saved at the far end.',
  },
  {
    id: 'reader', label: 'the reader',
    why: 'Page first: webtoons and prose pull vocabulary along behind them. Strong for the literary aim — but keep a pilot light under 듣기 (deutgi); an ear left dark goes dark fast.',
  },
]

// Weekly paces for the time math. h = hours/week.
export const PACES = [
  { h: 3.5,  label: '30 min · day' },
  { h: 7,    label: '1 h · day' },
  { h: 10.5, label: '90 min · day' },
]

// ---------------------------------------------------------------------
// Reference rails under the trail — the exam mileposts beside the road.
// One cell per waymark, aligned to the trail's five columns.
// ---------------------------------------------------------------------
export const RAILS = {
  cefr:  ['→ A1', 'A1', 'A2', 'B1', 'B2 — C2'],
  topik: ['below I', 'I · level 1', 'I · level 2', 'II · level 3', 'II · 4–6'],
  note:  'The CEFR ↔ TOPIK alignment is conventional, not official — and either way, ' +
         'the exam is a milepost beside the road, not the road. The waymarks are capacities.',
}

// =====================================================================
// THE WAYMARKS
// =====================================================================
export const PHASES = [

  // -------------------------------------------------------------------
  // I — 관문 · the sound gate
  // -------------------------------------------------------------------
  {
    id: 'p1',
    glyph: '관문', rr: 'gwanmun', hanja: '關門', jaBridge: '関門 (かんもん kanmon)',
    name: 'The sound gate',
    cefr: 'pre-A1 → A1', topik: 'below level 1', words: '~300', hours: [30, 45],
    capacity:
      'The script runs itself and the mouth knows the house rules. You can read any hangul ' +
      'aloud — slowly — and greet, thank, apologize, and introduce yourself without rehearsing.',
    enter: 'you can sound out hangul, even haltingly, and Japanese grammar is in your bones.',
    gate:
      'reading aloud no longer costs attention — batchim and first liaisons happen by ' +
      'reflex, and the courtesy formulas come out whole.',
    signpost: null,
    kit: 'TTMIK levels 1–2 · hangul & typing drills (두벌식 dubeolsik) · 1–2 minute K-drama clips with Korean subs, looped.',
    defaultProfile: 'balanced',
    mixes: {
      balanced: { vocab: 20, grammar: 15, sound: 35, listen: 15, read: 10, produce: 5 },
      listener: { vocab: 20, grammar: 10, sound: 30, listen: 25, read: 10, produce: 5 },
      reader:   { vocab: 25, grammar: 10, sound: 30, listen: 10, read: 20, produce: 5 },
    },
    strands: [
      {
        id: 'vocab',
        cando: 'Recognize ~300 words: the courtesy formulas, the survival nouns, and your first deliberately-crossed cognates.',
        bodyHtml:
          'Vocabulary at this stage is <b>chunks, not lists</b> — greetings learned as whole shapes ' +
          'with their melody attached. Start the cognate habit on day one: numbers, school words, ' +
          'and time words are Sino and arrive at a discount through the bridge folio.',
        bridgeHtml:
          '감사합니다 (gamsahamnida) carries 感謝 — <i>kansha</i> — in its first two syllables. ' +
          'The discount starts immediately; spend it.',
        items: [
          { id: 'p1-vocab-formula', html: 'The courtesy formulas as single shapes: 안녕하세요 (annyeonghaseyo), 감사합니다 (gamsahamnida), 죄송합니다 (joesonghamnida), 잠시만요 (jamsimanyo).' },
          { id: 'p1-vocab-nouns',   html: 'First 150 nouns of the day — food, places, family, body, weather.' },
          { id: 'p1-vocab-verbs',   html: '30 core verbs known in dictionary form <i>and</i> 해요체 (haeyoche): 가다 gada, 먹다 meokda, 보다 boda, 하다 hada…' },
          { id: 'p1-vocab-sino',    html: 'Sino numbers 일/이/삼 (il/i/sam) to 100 — heard, not just read — and the first ten cognates crossed <b>by rule</b>, not memory.' },
          { id: 'p1-vocab-native',  html: 'Native numbers 하나/둘/셋 (hana/dul/set) to 20; the two-line split shelved until the counters arrive in phase two.' },
        ],
      },
      {
        id: 'grammar',
        cando: 'Park a topic, mark a subject and an object, and close a polite present-tense sentence — the Japanese skeleton, re-keyed.',
        bodyHtml:
          'Nearly everything here transfers whole: SOV, topic-prominence, particle-marked case. ' +
          'What is genuinely new is the <b>morphophonemics</b> — particles re-tailoring themselves to ' +
          'batchim — and the copula. Five core particles, 이에요/예요, 해요체 present: that is the ' +
          'entire phase-one engine. The grammar and verb folios drill all of it.',
        bridgeHtml:
          '은/는 ↔ は · 이/가 ↔ が · 을/를 ↔ を · 에 ↔ に · 에서 ↔ で. The mapping is real; ' +
          'the spotlights in the grammar folio mark where it frays.',
        items: [
          { id: 'p1-gram-case',    html: 'The five-particle skeleton placed correctly in fresh sentences: 은/는 · 이/가 · 을/를 · 에 · 에서.' },
          { id: 'p1-gram-batchim', html: 'Particle allomorphy by reflex — 은 after batchim, 는 after a vowel — without stopping to check (the gate instrument drills this).' },
          { id: 'p1-gram-copula',  html: '이에요/예요 (ieyo/yeyo) to name things: 학생이에요 (haksaeng-ieyo).' },
          { id: 'p1-gram-haeyo',   html: '해요체 present of regular verbs — the bright/dark vowel fork at the forge: 가요 (gayo), 먹어요 (meogeoyo), 해요 (haeyo).' },
          { id: 'p1-gram-an',      html: 'Plain negation with 안 (an): 안 가요 (an gayo).' },
        ],
      },
      {
        id: 'sound',
        cando: 'Hear and produce what Japanese never asked of you: the three-way stops, the two missing vowels, and the dead-stop batchim.',
        bodyHtml:
          'Japanese phonology covers roughly <b>70%</b> of Korean. This strand is the other 30%, and it ' +
          'is the heaviest lane of the whole phase on purpose: the plain/aspirated/tense triad, ' +
          'ㅓ vs ㅗ and ㅡ vs ㅜ, and finals that stop dead instead of taking a vowel prop. ' +
          'Front-load it — every later hour of listening stands on this floor.',
        bridgeHtml:
          'Japanese props finals up with vowels (がく); Korean slams the door (학 <i>hak</i>). ' +
          'Unlearning the prop is half of phase-one pronunciation — the sound bridge folio shows why.',
        items: [
          { id: 'p1-sound-jamo',    html: 'Hangul automatic: any new word read aloud without spelling it out jamo-by-jamo.' },
          { id: 'p1-sound-triad',   html: 'The triads heard at ~90%: 달/탈/딸 (dal/tal/ttal — moon/mask/daughter) — and produced well enough that a listener picks the right one.' },
          { id: 'p1-sound-vowels',  html: '거기 (geogi, there) vs 고기 (gogi, meat); 글 (geul, writing) vs 굴 (gul, oyster) — the ㅓ/ㅗ and ㅡ/ㅜ fences hold in both directions.' },
          { id: 'p1-sound-batchim', html: 'Unreleased finals: 밥 (bap), 곧 (got), 책 (chaek) end with the mouth closed — no vowel escapes.' },
          { id: 'p1-sound-liaison', html: 'First liaison (연음 yeoneum): 책이 → chae-gi, 음악 → eu-mak — heard and produced as one flow.' },
        ],
      },
      {
        id: 'listen',
        cando: 'Catch single utterances cold: greetings, numbers read slowly, classroom phrases, your own name called.',
        bodyHtml:
          'Listening here is <b>ear-tuning, not comprehension</b>: short clips on repeat with attention on ' +
          'the sounds rather than the meaning. One minute of K-drama looped ten times beats twenty ' +
          'minutes played once — you are teaching the ear where syllables begin.',
        items: [
          { id: 'p1-listen-formula', html: 'The courtesy formulas recognized at native speed inside real clips.' },
          { id: 'p1-listen-numbers', html: 'Sino numbers to 100 caught by ear on a single reading.' },
          { id: 'p1-listen-clip',    html: 'A 1–2 minute drama clip looped until the syllable boundaries are audible — done ten times across the phase.' },
        ],
      },
      {
        id: 'read',
        cando: 'Decode anything; read signs, menus, and names at a walking pace.',
        bodyHtml:
          'Reading is decoding fluency this phase, and decoding fluency is secretly a pronunciation ' +
          'skill — so <b>read aloud, not silently</b>: batchim and liaison get rehearsed with every line.',
        items: [
          { id: 'p1-read-menu',  html: 'A Korean menu or shop sign read aloud, no spelling out.' },
          { id: 'p1-read-names', html: 'Transliterated names recovered on sight: 맥도날드 (maekdonaldeu), 아이스크림 (aiseukeurim).' },
          { id: 'p1-read-pace',  html: 'A fresh textbook sentence read aloud at conversational pace on the first pass.' },
        ],
      },
      {
        id: 'produce',
        cando: 'Introduce yourself in three sentences; type hangul without hunting.',
        bodyHtml:
          'Production stays deliberately light — the aim is reception — but the mouth and the fingers ' +
          'need their hooks early: shadow the formulas for <b>melody</b>, and learn the keyboard now, ' +
          'not later. Everything downstream (the diary, the dictionary, the messages) types.',
        items: [
          { id: 'p1-prod-intro',  html: 'Self-introduction, three sentences, from memory — name, affiliation via 이에요, one liked thing.' },
          { id: 'p1-prod-type',   html: '두벌식 (dubeolsik) typing without hunting; message-speed can come later.' },
          { id: 'p1-prod-shadow', html: 'Five formulas shadowed until the pitch contour matches the clip, not the page.' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // II — 생존 · the survival kit
  // -------------------------------------------------------------------
  {
    id: 'p2',
    glyph: '생존', rr: 'saengjon', hanja: '生存', jaBridge: '生存 (せいぞん seizon)',
    name: 'The survival kit',
    cefr: 'A1', topik: 'TOPIK I · level 1', words: '~800', hours: [70, 100],
    capacity:
      'You can run a simple day in Korean: order, buy, ask where and when, say what you did ' +
      'and will do, and survive a slow, kind conversation about yourself.',
    enter: 'the script runs itself and the five-particle skeleton holds.',
    gate:
      'past and future come out without rehearsal, and an unscripted transaction — café, ' +
      'taxi, shop — completes in Korean.',
    signpost: 'memo signpost · month 3 — read a children’s book unaided.',
    kit: 'Korean Grammar in Use · Beginning — first half · TTMIK levels 3–4 · a TOPIK I deck pruned by the cognate bridge.',
    defaultProfile: 'balanced',
    mixes: {
      balanced: { vocab: 25, grammar: 20, sound: 15, listen: 20, read: 10, produce: 10 },
      listener: { vocab: 20, grammar: 15, sound: 15, listen: 30, read: 10, produce: 10 },
      reader:   { vocab: 25, grammar: 15, sound: 10, listen: 15, read: 25, produce: 10 },
    },
    strands: [
      {
        id: 'vocab',
        cando: '~800 words — the TOPIK I first band: time, money, food, transport, family — with the Sino share crossed by rule.',
        bodyHtml:
          'This band is where the cognate discount runs <b>hottest</b>: time words, dates, months, and ' +
          'school/work vocabulary are nearly all 한자어. Prune the deck accordingly — a cognate ' +
          'crossed by rule needs a glance, not a flashcard. Spend the saved cards on the native ' +
          'words, which must be bought at full price.',
        bridgeHtml:
          '약속 (yaksok) = 約束 (yakusoku) · 준비 (junbi) = 準備 (junbi) · 시간 (sigan) = 時間 (jikan). ' +
          'Half this band is toll-paid before you open the deck.',
        items: [
          { id: 'p2-vocab-counters', html: 'The counter split mastered: Sino for money, dates, minutes (삼천 원 samcheon won); native for hours, people, things (세 시 se si, 두 명 du myeong) — the on/kun split, re-keyed.' },
          { id: 'p2-vocab-time',     html: 'Clock and calendar cold: days, months, 오전/오후 (ojeon/ohu = 午前/午後), the mixed-line time: 세 시 삼십 분 (se si samsip bun).' },
          { id: 'p2-vocab-trans',    html: 'Food, transport, and shop vocabulary — enough to order, pay, and ask for the bathroom without circumlocution.' },
          { id: 'p2-vocab-cognate',  html: 'First 100 cognates logged as <b>crossings, not memorizations</b> — -く→ㄱ and the long -う→ㅂ/ㅇ now fire on sight.' },
          { id: 'p2-vocab-family',   html: 'Family and people words in both registers: 어머니/엄마 (eomeoni/eomma), 아버지/아빠 (abeoji/appa).' },
        ],
      },
      {
        id: 'grammar',
        cando: 'Tense and desire: past, future, want-to, can/can’t, have-to — the verb forge at full heat.',
        bodyHtml:
          'Phase two is <b>verb morphology</b>. The conjugation engine from the forge picks up the past, ' +
          'the plain future, and the modal scaffolding of daily life. Every piece here has a clean ' +
          'Japanese twin — trust the transfer for the <i>meaning</i> and spend your hours on the ' +
          '<i>fusion</i>: vowel harmony decides every form.',
        bridgeHtml:
          '-고 싶다 ↔ 〜たい · -(으)ㄹ 수 있다 ↔ 〜ことができる · -아/어야 하다 ↔ 〜なければならない ' +
          '(lighter in tone) · 있다/없다 ↔ ある/いる <i>and</i> 持っている at once.',
        items: [
          { id: 'p2-gram-past',   html: '-았/었- (-at/eot-) past by vowel harmony, fused where it fuses: 갔어요 (gasseoyo), 먹었어요 (meogeosseoyo), 했어요 (haesseoyo).' },
          { id: 'p2-gram-future', html: '-(으)ㄹ 거예요 (-(eu)l geoyeyo) for plans and predictions.' },
          { id: 'p2-gram-want',   html: '-고 싶다 (-go sipda) wants — with 보고 싶어요 (bogo sipeoyo) noted as “I miss you.”' },
          { id: 'p2-gram-able',   html: '-(으)ㄹ 수 있다/없다 ability, and the 못 (mot) shortcut — 안 vs 못 felt, not recited (the spotlight in the verb folio).' },
          { id: 'p2-gram-oblig',  html: '-아/어야 해요 obligation; requests with 주세요 (juseyo): 물 좀 주세요 (mul jom juseyo).' },
          { id: 'p2-gram-exist',  html: '있다/없다 (itda/eopda) for existence <i>and</i> possession — one verb doing the work of ある/いる and 持っている.' },
        ],
      },
      {
        id: 'sound',
        cando: 'The sound-change rules begin: say 합니다 as hamnida because you know why — and start hearing through the changes.',
        bodyHtml:
          'Korean writes morphophonemically and speaks phonetically; the gap is <b>rule-governed</b>, and ' +
          'the rules pay in the ear more than the mouth. The word you cannot catch is very often a ' +
          'word you know, wearing a rule you have not met. Nasalization, palatalization, ' +
          'ㅎ-weakening: learn them as rules now and listening gets cheaper for years.',
        items: [
          { id: 'p2-sound-nasal',  html: 'Nasalization productive on sight: 합니다 (hamnida), 먹는 (meongneun), 십만 (simman).' },
          { id: 'p2-sound-palat',  html: 'Palatalization recognized: 같이 (gachi), 굳이 (guji).' },
          { id: 'p2-sound-hweak',  html: 'ㅎ-weakening and the aspiration merge: 좋아요 (joayo), 못 해요 (motaeyo).' },
          { id: 'p2-sound-shadow', html: 'The shadowing habit running: ten minutes daily against learner-speed audio, matching contour, not just consonants.' },
        ],
      },
      {
        id: 'listen',
        cando: 'Short, slow dialogues land whole: question and answer about time, place, price, plans.',
        bodyHtml:
          'Move from ear-tuning to <b>meaning</b>. Learner-speed dialogues are the staple; the weekly drama ' +
          'scene (three passes: subs → no subs → shadow) is the stretch. Numbers remain the honest ' +
          'test — a price caught at native speed is worth a page of exercises.',
        items: [
          { id: 'p2-listen-dialog', html: 'A new learner-speed dialogue understood on the second listen, no transcript.' },
          { id: 'p2-listen-num',    html: 'Prices and phone numbers caught at native speed, single reading.' },
          { id: 'p2-listen-scene',  html: 'The weekly scene habit running — one K-drama scene, three passes; twelve scenes done across the phase.' },
        ],
      },
      {
        id: 'read',
        cando: 'Textbook dialogues read for meaning at first pass; a children’s book survived unaided.',
        bodyHtml:
          'Reading graduates from decoding to meaning. The memo’s first signpost lands here: a ' +
          'children’s picture book, cover to cover, <b>unaided</b> — slow is fine; unaided is the point.',
        items: [
          { id: 'p2-read-dialog',  html: 'Textbook dialogues read for meaning on the first pass.' },
          { id: 'p2-read-child',   html: 'A children’s picture book read unaided, cover to cover — the month-3 signpost.' },
          { id: 'p2-read-webtoon', html: 'First webtoon panels attempted with a dictionary — tasting, not yet reading.' },
        ],
      },
      {
        id: 'produce',
        cando: 'One unscripted transaction completed; a three-sentence diary entry, twice a week.',
        bodyHtml:
          'Production earns a real lane now, but stays transactional: the test of this phase is an ' +
          'exchange that <b>was not scripted</b> and completed anyway. The diary starts here too — ' +
          'three sentences recycling the week’s grammar beats an essay copied from a model.',
        items: [
          { id: 'p2-prod-transact', html: 'An unscripted café/shop/taxi exchange completed in Korean (full role-play counts if Korea is far away).' },
          { id: 'p2-prod-diary',    html: 'The diary habit: three sentences, twice a week, recycling that week’s grammar.' },
          { id: 'p2-prod-intro',    html: 'Self-introduction grown to a paragraph: work, family, and why Korean — 왜 한국어를 배워요? (wae hangugeoreul baewoyo?).' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // III — 연결 · the connected sentence
  // -------------------------------------------------------------------
  {
    id: 'p3',
    glyph: '연결', rr: 'yeongyeol', hanja: '連結', jaBridge: '連結 (れんけつ renketsu)',
    name: 'The connected sentence',
    cefr: 'A2', topik: 'TOPIK I · level 2', words: '~2,000', hours: [130, 190],
    capacity:
      'Sentences stop being islands. You narrate — yesterday, because, although, if — follow ' +
      'slow native conversation on familiar ground, and read easy webtoons for the story, ' +
      'not the exercise.',
    enter: 'tense and the modal kit are reflex; transactions no longer scare you.',
    gate:
      'you can tell yesterday as a story with three different connectives, and a known-topic ' +
      'conversation at courteous native speed mostly lands.',
    signpost: 'memo signpost · month 6 — follow a K-drama scene without subs on the second viewing.',
    kit: 'KGIU Beginning — finished · KGIU Intermediate — begun · Iyagi-style learner podcasts · easy 네이버 웹툰 (Naver webtoon) strips.',
    defaultProfile: 'balanced',
    mixes: {
      balanced: { vocab: 20, grammar: 25, sound: 10, listen: 20, read: 15, produce: 10 },
      listener: { vocab: 15, grammar: 20, sound: 10, listen: 30, read: 15, produce: 10 },
      reader:   { vocab: 20, grammar: 20, sound: 5,  listen: 15, read: 30, produce: 10 },
    },
    strands: [
      {
        id: 'vocab',
        cando: '~2,000 words — TOPIK I complete: feelings, opinions, degrees, and the adverbs that hold clauses together.',
        bodyHtml:
          'Past the first thousand, vocabulary shifts from things to <b>texture</b>: the adverb layer, ' +
          'degree words, and the feeling-verbs K-drama runs on. The cognate reflex should be ' +
          'automatic by now — so the deliberate effort moves to <b>native Korean</b> vocabulary, which ' +
          'has no bridge and must be bought at full price. Budget for it; it is the slow half.',
        bridgeHtml:
          'An honest note: 아직 ↔ まだ and 벌써 ↔ もう align in <i>meaning</i> only — the function-word ' +
          'layer is native on both sides. No toll discount here; this is the full-price aisle.',
        items: [
          { id: 'p3-vocab-adverbs', html: 'The adverb layer placed: time (아직 ajik, 벌써 beolsseo, 갑자기 gapjagi), degree (너무 neomu, 아주 aju, 별로 byeollo + negative), frequency.' },
          { id: 'p3-vocab-feel',    html: 'Feeling and opinion words: 기쁘다 (gippeuda), 슬프다 (seulpeuda), 무섭다 (museopda), 부럽다 (bureopda, envious).' },
          { id: 'p3-vocab-topik1',  html: 'The TOPIK I band complete (~2,000), the deck long since pruned of toll-paid cognates.' },
          { id: 'p3-vocab-native',  html: 'A native-word notebook running — the no-bridge words (마음 maeum, 느낌 neukkim…) given double drill.' },
        ],
      },
      {
        id: 'grammar',
        cando: 'The clause-linking arsenal — -는데, -니까, -아서, -지만, -면 — plus the modifier system that lets clauses dress nouns.',
        bodyHtml:
          'This is the phase where Korean stops being “Japanese re-keyed” and shows its own ' +
          'machinery. Japanese joins clauses with て-forms and bare conjunctions; Korean ' +
          '<b>inflects every joint</b>, and the joints carry nuance — two different “becauses,” a ' +
          'connective (-는데) whose real meaning is social. Deepest of all: the 관형형 ' +
          '(gwanhyeonghyeong) modifier system, which conjugates a clause <i>for tense</i> before ' +
          'parking it on a noun.',
        bridgeHtml:
          '먹는 사람 ↔ 食べる人 — same architecture, but Korean inflects the joint: 먹는/먹은/먹을 사람 ' +
          '(meongneun/meogeun/meogeul saram) where Japanese reuses one plain form. ' +
          '-(으)면 ↔ 〜たら/〜ば · -지만 ↔ 〜けれども · -는데 ↔ 〜が/〜けど, and then some.',
        items: [
          { id: 'p3-gram-neunde',   html: '-는데 (-neunde) in all three jobs — background, contrast, trailing-off — the highest-frequency connective in real speech.' },
          { id: 'p3-gram-cause',    html: 'The cause split: -아/어서 vs -(으)니까 — commands and proposals demand -니까; fixed warmth like 만나서 반갑습니다 (mannaseo bangapseumnida) keeps -아서.' },
          { id: 'p3-gram-cond',     html: '-(으)면 conditions, -(으)려고 intentions, -기 전에 / -(으)ㄴ 후에 before and after.' },
          { id: 'p3-gram-modifier', html: '관형형 modifiers across tense — 먹는/먹은/먹을 사람 — <b>produced</b>, not just parsed.' },
          { id: 'p3-gram-prog',     html: '-고 있다 progressive and -아/어 보다 try-and-see (↔ 〜ている, 〜てみる).' },
          { id: 'p3-gram-geot',     html: 'The 것 (geot) nominalizer: -는 것을 좋아해요 (-neun geoseul joahaeyo) — the こと/の machine.' },
        ],
      },
      {
        id: 'sound',
        cando: 'The full assimilation table internalized; rhythm work begins — phrase grouping and the 요-rise.',
        bodyHtml:
          'Finish the segmental rules — lateralization, post-stop tensification — then move up a ' +
          'level to <b>prosody</b>: Korean rhythm groups syllables into phrases with a characteristic ' +
          'final contour, and the polite question lives or dies on the 요-rise. Shadowing ' +
          'graduates from learner audio to real drama lines.',
        items: [
          { id: 'p3-sound-lateral', html: 'Lateralization on sight: 신라 (silla), 연락 (yeollak).' },
          { id: 'p3-sound-tense',   html: 'Post-stop tensification heard and produced: 학교 (hakkyo), 식당 (sik-ttang).' },
          { id: 'p3-sound-prosody', html: 'The 요-rise vs the statement-fall produced on demand: 가요. / 가요? (gayo)' },
          { id: 'p3-sound-shadow',  html: 'Shadowing upgraded to drama lines — one line until the melody matches, daily.' },
        ],
      },
      {
        id: 'listen',
        cando: 'Slow native conversation on familiar ground mostly lands; a studied scene plays clean without subs on the second pass.',
        bodyHtml:
          'Learner podcasts at near-natural speed become the workhorse; the drama scene habit ' +
          'starts paying its dividend — the memo’s month-6 signpost lives in this strand. ' +
          'When a scene plays clean on the second pass, log it; that is the phase speaking.',
        items: [
          { id: 'p3-listen-iyagi', html: 'A five-minute learner podcast followed without transcript — gist and most detail.' },
          { id: 'p3-listen-scene', html: 'The month-6 signpost: a fresh K-drama scene — subs on the first pass, ≥80% on the second pass without.' },
          { id: 'p3-listen-qna',   html: 'Questions aimed at you in slow native speech answered without asking for repetition more than once.' },
        ],
      },
      {
        id: 'read',
        cando: 'Easy webtoons read for the story; a graded reader finished at length.',
        bodyHtml:
          'The original aim comes into reach: webtoons stop being exercises. Pick a ' +
          'slice-of-life strip and <b>follow it weekly like a reader</b>, not a student; volume at high ' +
          'coverage beats difficulty at low coverage every single week.',
        items: [
          { id: 'p3-read-webtoon', html: 'An easy slice-of-life webtoon followed weekly — ten episodes read for plot.' },
          { id: 'p3-read-graded',  html: 'A graded reader (A2 band) finished: thousands of running words at >95% coverage.' },
          { id: 'p3-read-aloud',   html: 'A paragraph of fresh text read aloud with the assimilation rules applied on sight.' },
        ],
      },
      {
        id: 'produce',
        cando: 'Ten unscripted minutes with a patient partner; yesterday told as a story.',
        bodyHtml:
          'Narration is the production skill of this phase: not correctness but <b>flow</b> — events in ' +
          'order, joined by real connectives, with the listener still awake. Record yourself; the ' +
          'tape is kinder than memory and harsher than hope.',
        items: [
          { id: 'p3-prod-convo', html: 'A ten-minute conversation with a patient partner — held weekly for a month.' },
          { id: 'p3-prod-story', html: 'Yesterday narrated in eight or more sentences using three different connectives — recorded and reviewed.' },
          { id: 'p3-prod-diary', html: 'The diary upgraded: five sentences, near-daily, recycling the week’s connectives.' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // IV — 자립 · independence
  // -------------------------------------------------------------------
  {
    id: 'p4',
    glyph: '자립', rr: 'jarip', hanja: '自立', jaBridge: '自立 (じりつ jiritsu)',
    name: 'Independence',
    cefr: 'B1', topik: 'TOPIK II · level 3', words: '~4,000', hours: [220, 320],
    capacity:
      'The language starts working for you. Dialogue-driven K-drama with Korean subs is ' +
      'watchable as television; webtoons read with the dictionary within reach, not in hand; ' +
      'a conversation can go somewhere neither of you scripted.',
    enter: 'connectives and modifiers are reflex; easy webtoons are entertainment.',
    gate:
      'an episode of a dialogue-driven drama plays in near-real-time with Korean subs; ' +
      'reported speech comes out unforced; you catch a 반말 (banmal) drop and know what it meant.',
    signpost: 'memo signposts · months 10 & 14 — get the webtoon joke before the translation; notice a speech-level shift and catch what it means.',
    kit: 'KGIU Intermediate · My Mister / Reply 1988 with Korean subs · a full webtoon arc (Pigpen reads cleanest) · the TOPIK II first-band deck.',
    defaultProfile: 'listener',
    mixes: {
      balanced: { vocab: 20, grammar: 20, sound: 10, listen: 25, read: 15, produce: 10 },
      listener: { vocab: 15, grammar: 15, sound: 10, listen: 35, read: 15, produce: 10 },
      reader:   { vocab: 20, grammar: 15, sound: 5,  listen: 20, read: 30, produce: 10 },
    },
    strands: [
      {
        id: 'vocab',
        cando: '~4,000 words — the emotional-relational lexicon K-drama actually runs on, the address-term system, and the first sound-symbolic layer.',
        bodyHtml:
          'Three deliberate fronts. The <b>catharsis lexicon</b> — 서운하다, 답답하다, 억울하다 — words ' +
          'with no clean twin in Japanese or English, which subtitles flatten and whole scenes ' +
          'are built on. The <b>address terms</b> — treated as grammar, not vocabulary: who may say ' +
          '오빠, when 선배 cools to 씨, what dropping the title announces. And the first fifty ' +
          '의성어/의태어 — the sound-symbolic layer your Japanese already believes in.',
        bridgeHtml:
          '의성어/의태어 (uiseongeo/uitaeeo) are 擬声語/擬態語 — the <i>category</i> transfers even when ' +
          'the words don’t: 두근두근 (dugeundugeun) beats exactly where どきどき beats. ' +
          'And 선배 (seonbae) <i>is</i> 先輩 — toll paid centuries ago.',
        items: [
          { id: 'p4-vocab-emotion', html: 'The catharsis lexicon held at felt-depth, not gloss-depth: 서운하다 (seounhada), 답답하다 (dapttapada), 억울하다 (eogurada), 아쉽다 (aswipda).' },
          { id: 'p4-vocab-address', html: 'Address terms as relational grammar: 오빠/형/누나/언니, 선배/후배, 아저씨/아주머니, -님/-씨 — and what switching between them announces.' },
          { id: 'p4-vocab-mimetic', html: 'First 50 의성어/의태어: 반짝반짝 (banjjakbanjjak, sparkling), 두근두근 (dugeundugeun, heart-pounding).' },
          { id: 'p4-vocab-topik2',  html: 'The TOPIK II first band underway (~4,000 total) — news-register Sino compounds now nearly free across the bridge.' },
        ],
      },
      {
        id: 'grammar',
        cando: 'Reported speech, the passive/causative pairs, honorific fluency, and the interactional endings — the machinery of talk about talk.',
        bodyHtml:
          'Reported speech is the gateway grammar of this phase: drama is people <b>relaying, ' +
          'distorting, and disclaiming</b> what other people said, and the four quotative rails carry ' +
          'all of it. The passive/causative pairs are vocabulary as much as grammar; the honorific ' +
          'system graduates from a single -시- to the full apparatus; and the interactional ' +
          'endings -거든요/-잖아요 are where textbook grammar ends and actual talk begins.',
        bridgeHtml:
          '-다고 해요 ↔ 〜と言っています/〜そうだ · -(으)ㄴ 것 같아요 ↔ 〜みたい/〜ようだ · ' +
          '드리다 ↔ 差し上げる. Keigo’s <i>architecture</i> transfers whole — the morphology must be bought new.',
        items: [
          { id: 'p4-gram-quote',    html: 'The four quotative rails: -다고/-냐고/-자고/-라고 하다 — statements, questions, proposals, commands relayed without seams.' },
          { id: 'p4-gram-passive',  html: 'Passive/causative pairs in live use: 보이다 (boida), 들리다 (deullida), 먹이다 (meogida), 입히다 (ipida) — learned as paired vocabulary.' },
          { id: 'p4-gram-honor',    html: 'The honorific circuit complete: -(으)시-, 께서, 드리다/말씀/계시다 — applied to the right person without prompting.' },
          { id: 'p4-gram-interact', html: '-거든요 (-geodeunyo, “here’s the thing—”) and -잖아요 (-janayo, “as you know—”) deployed correctly, and heard for what they do socially.' },
          { id: 'p4-gram-seem',     html: 'Hedges and guesses: -(으)ㄴ/는 것 같다, -나 보다, -(으)ㄹ 것 같다 — opinion with deniability.' },
          { id: 'p4-gram-levels',   html: 'Speech-level switching tracked live: who uses 반말 to whom — and the exact beat where it changes.' },
        ],
      },
      {
        id: 'sound',
        cando: 'Listening at speed: the sound-change rules so internalized that 못 해요 (motaeyo) costs nothing; production cleans up under pressure.',
        bodyHtml:
          'The accent work flips from learning rules to <b>burning them in at native speed</b> — reduced ' +
          'and fused forms, and above them the intonation contours of Seoul speech: the long fall ' +
          'of finality, the high plateau of protest. From here on, pronunciation is mostly a ' +
          'listening skill wearing a speaking costume.',
        items: [
          { id: 'p4-sound-speed',   html: 'Reduced and fused forms caught at native speed: 뭐 해? (mwo hae), 그렇구나 (geureokuna), 어떡해 (eotteokae).' },
          { id: 'p4-sound-contour', html: 'Three Seoul contours produced on demand: the neutral statement fall, the 요-question rise, the protest plateau (왜요— waeyo).' },
          { id: 'p4-sound-clean',   html: 'A recorded minute of free speech in which a native listener flags fewer than three segmental errors.' },
          { id: 'p4-sound-silent',  html: 'Silent reading now triggers the sound-changes internally — verified by reading aloud cold.' },
        ],
      },
      {
        id: 'listen',
        cando: 'A dialogue-driven episode with Korean subs watched as television, not exercise; familiar-topic podcasts without training wheels.',
        bodyHtml:
          'The aim of the whole roadmap surfaces here: the memo prices “K-drama with Korean subs, ' +
          'comfortably” at 10–14 months of consistent work, and it lands in this strand. <b>My Mister</b> ' +
          'for density, <b>Reply 1988</b> for family register; avoid action shows — you would be ' +
          'leaning on the pictures, and the pictures don’t teach.',
        items: [
          { id: 'p4-listen-episode', html: 'A full episode (My Mister / Reply 1988 band) with Korean subs, near-real-time — paused only a handful of times.' },
          { id: 'p4-listen-podcast', html: 'A native podcast on a familiar topic: gist reliably, detail often.' },
          { id: 'p4-listen-nosub',   html: 'Strong-context scenes starting to land first-pass <i>without</i> subs — logged when it begins happening.' },
          { id: 'p4-listen-levels',  html: 'The month-14 signpost: a speech-level shift noticed in the wild, its social meaning read correctly.' },
        ],
      },
      {
        id: 'read',
        cando: 'A full webtoon arc unaided; Korean Wikipedia on your interests; headlines parsed by hanja-sense.',
        bodyHtml:
          'Reading goes native-with-support. The headline register — densely Sino, nearly ' +
          'kanji-compound Japanese in hangul dress — is where the cognate bridge pays its ' +
          '<b>final dividend</b>: you read it the way you read a newspaper in Japanese, by the bones.',
        items: [
          { id: 'p4-read-arc',   html: 'A complete webtoon arc (Pigpen band) read unaided — dictionary nearby, not in hand.' },
          { id: 'p4-read-wiki',  html: 'Korean Wikipedia articles in your own fields, read for the information.' },
          { id: 'p4-read-news',  html: 'News headlines parsed by hanja-sense — the all-Sino register, the bridge’s victory lap.' },
          { id: 'p4-read-prose', html: 'First literary prose tasted: one short-story page with dictionary support — the month-18 signpost is in sight.' },
        ],
      },
      {
        id: 'produce',
        cando: 'Opinions with hedges, stories with punchlines, messages in the right register.',
        bodyHtml:
          'Production aims at <b>register control</b>: not just saying things, but saying them at the ' +
          'right distance. Choosing 해요체 vs 반말 deliberately — and being able to explain the ' +
          'choice — is the production-side mirror of catching the drop in a drama.',
        items: [
          { id: 'p4-prod-opinion', html: 'A three-minute opinion (why this drama is good) delivered with hedges and connectives — recorded monthly.' },
          { id: 'p4-prod-story',   html: 'A story told for effect — setup, turn, landing — and it lands.' },
          { id: 'p4-prod-message', html: 'Messaging in Korean with the register matched to the recipient: 해요체 vs 반말 chosen, not defaulted.' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // V — 원경 · the far ranges (deliberately unmapped)
  // -------------------------------------------------------------------
  {
    id: 'p5',
    glyph: '원경', rr: 'wongyeong', hanja: '遠景', jaBridge: '遠景 (えんけい enkei)',
    name: 'The far ranges',
    cefr: 'B2 → C2', topik: 'TOPIK II · levels 4–6', words: '6,000+', hours: null,
    capacity: 'Television without subtitles. Literary fiction. Jokes that land in real time.',
    enter: 'the far edge of 자립 — episodes with Korean subs are just television now.',
    gate: null,
    signpost: 'memo signpost · month 18 — a Han Kang short story with dictionary support.',
    kit: null,
    defaultProfile: null,
    mixes: null,
    strands: [],
    sketchHtml:
      'Past 자립 the chart goes quiet <b>on purpose</b>. From here the territory teaches better than ' +
      'any map: the dramas you can now watch and the webtoons you can now read set the ' +
      'curriculum, and a roadmap drawn this far ahead would be invention. Three landmarks are ' +
      'visible from this side of the ridge:',
    landmarks: [
      {
        kr: '무자막', rr: 'mujamak', en: 'no subtitles',
        html:
          'Understanding K-drama cold — listening’s long tail, which the memo prices honestly at ' +
          '2.5–4 years from the trailhead. 자막 (jamak) is 字幕 (jimaku); losing it is the point.',
      },
      {
        kr: '한강', rr: 'han gang', en: 'the literary gate',
        html:
          '한강 (Han Kang) — <i>채식주의자</i> (The Vegetarian), <i>소년이 온다</i> (Human Acts) — with a ' +
          'dictionary at hand; then 박민규 (Park Min-gyu) and 배수아 (Bae Suah) without one.',
      },
      {
        kr: '말맛', rr: 'malmat', en: 'the taste of words',
        html:
          'Idiom, wordplay, 사투리 (saturi — dialect), humor: the last things to come, ' +
          'and the reason to go.',
      },
    ],
  },
]

// =====================================================================
// THE PRACTICE LEDGER — habits & the weekly reckoning
// Cadence is advisory; the dots record what actually happened.
// `from` names the waymark where the habit enters the rotation.
// =====================================================================
export const HABITS = [
  {
    id: 'flame', kr: '등불', rr: 'deungbul', en: 'the lamp — vocabulary review',
    cadence: 'daily', mins: '10 min', from: 'p1',
    why: 'Ten unmissable minutes beat a heroic hour skipped. The deck is the wick; keep it trimmed.',
  },
  {
    id: 'shadow', kr: '그림자', rr: 'geurimja', en: 'the shadow — read aloud / shadow audio',
    cadence: 'daily', mins: '10 min', from: 'p1',
    why: 'The mouth learns by borrowing. Match the contour first; the consonants follow.',
  },
  {
    id: 'ear', kr: '귀', rr: 'gwi', en: 'the ear — listening immersion',
    cadence: 'daily', mins: '20 min', from: 'p2',
    why: 'Listening is the long tail: it goes dark first and recovers slowest. Feed it daily.',
  },
  {
    id: 'scene', kr: '장면', rr: 'jangmyeon', en: 'the scene — one drama scene, three passes',
    cadence: 'weekly', mins: '30 min', from: 'p2',
    why: 'Subs → no subs → shadow. One scene studied beats three episodes watched.',
  },
  {
    id: 'diary', kr: '일기', rr: 'ilgi', en: 'the diary — sentences written',
    cadence: 'weekly', mins: '15 min', from: 'p2',
    why: 'Production fixes what recognition lets slide. Recycle the week’s grammar, nothing fancier.',
  },
  {
    id: 'talk', kr: '대화', rr: 'daehwa', en: 'the conversation — a real exchange',
    cadence: 'weekly', mins: '10 min+', from: 'p3',
    why: 'Unscripted is the only test that counts. A patient partner outranks a perfect textbook.',
  },
  {
    id: 'reckon', kr: '점검', rr: 'jeomgeom', en: 'the reckoning — the weekly check-in below',
    cadence: 'weekly', mins: '5 min', from: 'p1',
    why: 'Stand at the trail, say where you are, write one line. The road remembers what you tell it.',
  },
]

// =====================================================================
// Lantern notes — the roadmap's eurekas
// =====================================================================
export const ROADMAP_EUREKAS = {
  firstLamp: {
    head: 'The lamp takes the flame',
    body:
      'Every box you tick feeds the lantern of its waymark up on the trail. The lamps are ' +
      'honest — they fill only from your own hand, and they are remembered <b>in this browser</b> ' +
      'until the atlas grows its backend (vocabulary plan, phase 3).',
  },
  mixShift: {
    head: 'There is no single road',
    body:
      'The mixes are starting points, not law — re-cut them as your week allows. One rule ' +
      'survives every cut: <b>듣기 (deutgi) is the long tail</b>. Whatever else you trade away, ' +
      'never let the ear go dark.',
  },
  farView: {
    head: 'The map runs out on purpose',
    body:
      'Beyond 자립 (jarip), the territory teaches better than any chart: the media you can by ' +
      'then enjoy <b>is</b> the curriculum. The far ranges get drawn when you can see them.',
  },
  sevenNights: {
    head: 'Seven nights alight',
    body:
      'A lamp lit seven nights running is no longer effort — it is architecture. Habits ' +
      'compound exactly like the cognate discount: <b>quietly, then everywhere</b>.',
  },
  namesCross: {
    head: 'Even the waymarks cross the bridge',
    body:
      'Every stage name on this trail is 한자어: 관문 is 関門, 생존 is 生存, 연결 is 連結, ' +
      '자립 is 自立, 원경 is 遠景. <b>The roadmap is written in the vocabulary it teaches.</b>',
  },
}
