// =====================================================================
// The Polyglot's Atlas — Korean · the song (노래)
// Conventions (same house style as koreanData.js / koreanVocab.js):
//   han    — hangul, syllable by syllable (the atom of both reading and
//            of the karaoke playhead)
//   rr     — Revised Romanization, pronunciation-aware. At the SYLLABLE
//            level rr is the syllable's own value; at the LINE level rr is
//            the connected/sung romanization, with liaison and the sung
//            sound-changes already applied (십리도 → simnido, 발병 →
//            balppyeong). The diction bench is the authority on those.
//   jp     — the Japanese bridge for a line (honored by the showJp toggle)
//
// SCHEMA NOTE — this is the song folio speaking in advance for a future
// "songs" payload, the same interface-first discipline as koreanVocab.js
// (docs/vocabulary-plan.md). The instruments (LyricBand, MelodyRoll,
// DictionBench, Harvest) depend on nothing outside the shapes below, so a
// hardcoded song here and an API-served song later are indistinguishable
// to the components. Author a song by editing data; never touch a
// component to add one.
//
// MELODY NOTE — the per-syllable pitch (deg → midi) is a STUDY
// TRANSCRIPTION, not a definitive score: a recognizable major-pentatonic
// reduction of Arirang's contour (one note per sung syllable), pitched
// for a comfortable mid voice, meant to make the melody *felt* and
// hummable rather than to settle a musicological argument. The opening
// two phrases follow a published kalimba number-notation of the standard
// tune; the closing two follow the song's well-known parallel shape. It
// is data — refine it freely. The LINGUISTIC content (hangul, RR,
// bridges) is hand-checked to the house bar; the melody is honest
// approximation, and the UI says so.
//
// /**
//  * @typedef {Object} Syl — one sung syllable: the karaoke + melody atom
//  * @property {string} han   hangul syllable
//  * @property {string} rr    romanization of the syllable on its own
//  * @property {number} beat  onset, in beats from the start of the song
//  *                          (derived — authored as a per-line duration)
//  * @property {number} dur   length in beats
//  * @property {string} deg   scale degree label (sol·la·do·re·mi)
//  * @property {number} midi  MIDI note number (the synthesis truth)
//  * @property {boolean} [spaceBefore]  this syllable opens a new word — the
//  *                          band opens a gap before it. Set by the custom
//  *                          bench's parser from the spaces in pasted text;
//  *                          hand-authored songs leave it unset.
//  *
//  * @typedef {Object} Line
//  * @property {string} id
//  * @property {Syl[]}  syls
//  * @property {number} startBeat  onset of the line (derived)
//  * @property {number} endBeat    end of the sung material (derived)
//  * @property {number} restAfter  breathing beats before the next line
//  * @property {string} rr   connected/sung romanization of the whole line
//  * @property {string} en   translation
//  * @property {?string} jp  Japanese bridge for the line
//  * @property {'sung'|'rap'|'chant'} [kind]  how the line is delivered
//                          (defaults to 'sung'; rap/chant sit in a narrow
//                          pitch band — the roll shows the difference)
//  *
//  * @typedef {Object} Section
//  * @property {string} id
//  * @property {'verse'|'refrain'|'chorus'|'bridge'} kind
//  * @property {string} label   display label (e.g. 후렴 · refrain)
//  * @property {Line[]} lines
//  *
//  * @typedef {Object} Diction — a spot where spelling ≠ how it's sung
//  * @property {string} id
//  * @property {{han: string, rr: string}} written   as on the page
//  * @property {{han: string, rr: string}} sung      as it leaves the mouth
//  * @property {string} kind     short rule name (liaison / nasalization…)
//  * @property {string} html     the why, one or two sentences
//  * @property {?{folio: string, label: string}} link  cross-folio pointer
//  *
//  * @typedef {Object} HarvestWord — a word the song hands you (lean VocabEntry)
//  * @property {string} head
//  * @property {string} rr
//  * @property {string} pos
//  * @property {string} en
//  * @property {?{kanji: string, kana: string, rr: string,
//  *              kind: 'cognate'|'equivalent'}} bridge
//  * @property {string} from   which line it sits in
//  * @property {?string} note  a usage / transfer footnote (html)
//  *
//  * @typedef {Object} GrammarNote — a structure the song carries
//  * @property {string} id
//  * @property {string} head
//  * @property {string} han   the phrase from the lyric
//  * @property {string} rr
//  * @property {string} en
//  * @property {string} html  the explanation (with JP bridge inline)
//  * @property {?{folio: string, label: string}} link
//  *
//  * @typedef {Object} Song — the future songs-API payload, piloted here
//  * @property {string} id
//  * @property {{han: string, rr: string, en: string}} title
//  * @property {string} origin   provenance line
//  * @property {string} genre
//  * @property {{bpm: number, beatsPerBar: number, key: string, mode: string}} meta
//  * @property {{difficulty: string, register: string, blurbHtml: string,
//  *             whyHtml: string, tags: string[]}} context
//  * @property {Section[]} sections
//  * @property {Diction[]} diction
//  * @property {HarvestWord[]} harvestVocab
//  * @property {GrammarNote[]} grammar
//  * @property {number} beats    total length in beats (derived)
//  */
// =====================================================================

// Major pentatonic, do = C5. The whole tune lives in a sixth: the low
// sol/la sit under the tonic, the melody reaches up to mi.
const SCALE = { s: 67, l: 69, d: 72, r: 74, m: 76 }; // G4 A4 C5 D5 E5
export const DEG_ORDER = ['m', 'r', 'd', 'l', 's']; // top → bottom for the roll
export const DEG_LABEL = { s: 'sol', l: 'la', d: 'do', r: 're', m: 'mi' };

// Author a line as: [hangul, syllable-rr, degree, beats]. The builder
// below threads absolute beats through the whole song and resolves midi,
// so the components receive a flat, ready timeline.
const RAW_LINES = [
  {
    id: 'l1', restAfter: 2,
    rr: 'arirang arirang arariyo',
    en: 'Arirang, Arirang, arariyo —',
    jp: 'アリラン、アリラン、アラリヨ —',
    syls: [
      ['아', 'a', 'd', 2], ['리', 'ri', 'r', 1], ['랑', 'rang', 'd', 1],
      ['아', 'a', 'r', 1], ['리', 'ri', 'm', 2], ['랑', 'rang', 'r', 1],
      ['아', 'a', 'm', 1], ['라', 'ra', 'd', 1], ['리', 'ri', 'l', 1], ['요', 'yo', 's', 3],
    ],
  },
  {
    id: 'l2', restAfter: 2,
    rr: 'arirang gogaereul neomeoganda',
    en: 'over the Arirang pass (you) go.',
    jp: 'アリランの峠を越えていく。',
    syls: [
      ['아', 'a', 'd', 2], ['리', 'ri', 'r', 1], ['랑', 'rang', 'd', 1],
      ['고', 'go', 'r', 1], ['개', 'gae', 'm', 2], ['를', 'reul', 'r', 1],
      ['넘', 'neom', 'd', 1], ['어', 'eo', 'l', 1], ['간', 'gan', 's', 2], ['다', 'da', 'l', 2],
    ],
  },
  {
    id: 'l3', restAfter: 2,
    rr: 'nareul beorigo gasineun nimeun',
    en: 'The dear one who leaves me behind —',
    jp: '私を捨てて行く愛しい人は、',
    syls: [
      ['나', 'na', 'm', 2], ['를', 'reul', 'm', 1], ['버', 'beo', 'm', 1],
      ['리', 'ri', 'r', 1], ['고', 'go', 'd', 2], ['가', 'ga', 'r', 1],
      ['시', 'si', 'm', 1], ['는', 'neun', 'r', 1], ['님', 'nim', 'd', 2], ['은', 'eun', 'd', 2],
    ],
  },
  {
    id: 'l4', restAfter: 4,
    rr: 'simnido mot gaseo balppyeong nanda',
    en: 'won’t get ten li before (your) feet ache.',
    jp: '十里も行かないうちに足が痛くなる。',
    syls: [
      ['십', 'sip', 'd', 1], ['리', 'ri', 'r', 1], ['도', 'do', 'd', 2],
      ['못', 'mot', 'r', 1], ['가', 'ga', 'm', 2], ['서', 'seo', 'r', 1],
      ['발', 'bal', 'd', 1], ['병', 'byeong', 'l', 1], ['난', 'nan', 's', 2], ['다', 'da', 'd', 2],
    ],
  },
];

// Thread absolute beats + resolve midi over a list of authored lines, so
// every song speaks the same flat, ready timeline to the components.
function buildSection(rawLines) {
  let beat = 0;
  const lines = rawLines.map((raw) => {
    const startBeat = beat;
    const syls = raw.syls.map(([han, rr, deg, dur]) => {
      const syl = { han, rr, deg, dur, beat, midi: SCALE[deg] };
      beat += dur;
      return syl;
    });
    const endBeat = beat;
    beat += raw.restAfter;
    return { id: raw.id, syls, startBeat, endBeat, restAfter: raw.restAfter,
      rr: raw.rr, en: raw.en, jp: raw.jp, kind: raw.kind || 'sung' };
  });
  return { lines, beats: beat };
}

const built = buildSection(RAW_LINES);

export const ARIRANG = {
  id: 'arirang',
  title: { han: '아리랑', rr: 'Arirang', en: 'Arirang' },
  origin: 'Korean folk song · traditional (본조/Bonjo, the standard Gyeonggi version) · no known author · public domain · UNESCO Intangible Cultural Heritage, 2012',
  genre: '민요 · folk song',
  meta: { bpm: 88, beatsPerBar: 3, key: 'C', mode: 'major pentatonic' },
  context: {
    difficulty: 'beginner',
    register: '해라체 · plain/lyrical',
    tags: ['민요 folk', '이별 parting', '3박 triple time'],
    blurbHtml:
      'There is no more Korean song than <b>아리랑</b>. Every region keeps its own ' +
      'Arirang; this is the 본조 (Bonjo) — the “standard key” Gyeonggi version popularized by ' +
      'the 1926 film, the one sung at reunions, Olympics, and in exile. The words are a ' +
      'parting: a lover crossing a mountain pass, the singer left behind wishing them sore feet ' +
      'before the first ten <i>li</i>.',
    whyHtml:
      'It is the ideal first song. The melody is a <b>five-note pentatonic</b> in a slow triple ' +
      'lilt — easy to hold a pitch against. The lyric is short, repetitive, and built almost ' +
      'entirely from words and grammar already in this atlas: a relative clause (가시는 님), the ' +
      'honorific <span class="kr">-시-</span>, the ability negation <span class="kr">못</span>, ' +
      'a Sino counter (十里). And it hides a clinic of sung pronunciation — liaison, nasalization, ' +
      'tensification — in just four lines.',
  },
  sections: [
    { id: 's1', kind: 'refrain', label: '본조 아리랑 · the standard verse', lines: built.lines },
  ],
  beats: built.beats,

  // Spelling ≠ singing: the four lines hide most of Korean's sandhi.
  diction: [
    {
      id: 'neomeo',
      written: { han: '넘어', rr: 'neom + eo' },
      sung: { han: '너머', rr: 'neo-meo' },
      kind: 'liaison · 연음',
      html: 'A 받침 with a vowel behind it slides over: the ㅁ of 넘 re-syllabifies onto 어. ' +
        'Exactly the Japanese learner’s friend — write the boundary, sing across it. ' +
        '넘어간다 leaves the mouth as <b>[너머간다]</b>.',
      link: { folio: '#/ko/grammar', label: 'the gate — 받침 & liaison' },
    },
    {
      id: 'nimeun',
      written: { han: '님은', rr: 'nim + eun' },
      sung: { han: '니믄', rr: 'ni-meun' },
      kind: 'liaison · 연음',
      html: 'The topic particle 은 pulls the ㅁ off 님: <b>[니믄]</b>. The same liaison the ' +
        'particle cabinet marks on 책이 → 채기 — a 받침 never sits still before a vowel.',
      link: { folio: '#/ko/particles', label: 'the particle cabinet' },
    },
    {
      id: 'simni',
      written: { han: '십리', rr: 'sip + ri' },
      sung: { han: '심니', rr: 'sim-ni' },
      kind: 'nasalization · 비음화',
      html: 'Two changes at once, both forced by the meeting of stop + ㄹ: the ㄹ of 리 nasalizes ' +
        'to ㄴ, and the ㅂ of 십 assimilates to ㅁ before it. 십리 → <b>[심니]</b> (simni). ' +
        'Korean keeps the 十 (십) you know from じゅう; only the seam re-sounds.',
      link: { folio: '#/ko/cognates', label: 'the cognate bridge (十 · 里)' },
    },
    {
      id: 'motga',
      written: { han: '못 가서', rr: 'mot ga-seo' },
      sung: { han: '몯까서', rr: 'mot-kka-seo' },
      kind: 'tensification · 경음화',
      html: 'The negator 못 ends in an unreleased [t] (받침 neutralization), and a stop after a ' +
        'stop tenses: ㄱ → ㄲ. 못 가서 → <b>[몯까서]</b>. The same reflex that turns 학교 into ' +
        '[학꾜].',
      link: { folio: '#/ko/verbs', label: 'the verb forge — 안 & 못' },
    },
    {
      id: 'balppyeong',
      written: { han: '발병', rr: 'bal-byeong' },
      sung: { han: '발뼝', rr: 'bal-ppyeong' },
      kind: 'tensification · 경음화',
      html: 'A compound seam tenses the second element: 발 (foot) + 병 (病, illness) → ' +
        '<b>[발뼝]</b>. The 病 is your びょう, paid the Sino toll; the doubling is purely Korean ' +
        'sandhi.',
      link: { folio: '#/ko/cognates', label: 'the cognate bridge (病)' },
    },
  ],

  // What four lines hand you for the bank (lean VocabEntry shape).
  harvestVocab: [
    {
      head: '고개', rr: 'gogae', pos: 'noun', en: 'mountain pass · ridge', from: 'l2',
      bridge: { kanji: '峠', kana: 'とうげ', rr: 'tōge', kind: 'equivalent' },
      note: 'Native Korean for the pass over a ridge — Japanese 峠 is a kokuji with no Sino ' +
        'reading, so the two words share the sense, not the sound. (고개 also = the nape/neck.)',
    },
    {
      head: '넘다', rr: 'neomda', pos: 'verb', en: 'to cross over · go beyond', from: 'l2',
      bridge: { kanji: '越える', kana: 'こえる', rr: 'koeru', kind: 'equivalent' },
      note: '넘어가다 = 넘다 + 가다, “cross over and go” — the very 越えていく of the bridge line.',
    },
    {
      head: '버리다', rr: 'beorida', pos: 'verb', en: 'to throw away · abandon', from: 'l3',
      bridge: { kanji: '捨てる', kana: 'すてる', rr: 'suteru', kind: 'equivalent' },
      note: 'Also the auxiliary <b>-아/어 버리다</b> = 〜てしまう (do completely / regrettably) — ' +
        'one of the highest-value transfers from Japanese.',
    },
    {
      head: '님', rr: 'nim', pos: 'noun', en: 'beloved · dear one (also honorific suffix)', from: 'l3',
      bridge: { kanji: '様', kana: 'さま', rr: 'sama', kind: 'equivalent' },
      note: 'Standalone 님 is the loved one of poetry and song; suffixed it is the 様 of respect ' +
        '— 선생님 = 先生 + 様.',
    },
    {
      head: '못', rr: 'mot', pos: 'adverb', en: 'cannot (ability negation)', from: 'l4',
      bridge: { kanji: '〜できない', kana: '', rr: 'dekinai', kind: 'equivalent' },
      note: '못 + verb negates <i>ability</i> (couldn’t), against 안 for <i>will</i> ' +
        '(won’t). Here: 못 가서 = “unable to go (even that far).”',
    },
    {
      head: '리', rr: 'ri', pos: 'noun', en: 'li — a unit of distance (~0.4 km)', from: 'l4',
      bridge: { kanji: '里', kana: 'り', rr: 'ri', kind: 'cognate' },
      note: 'A clean 한자어: 里 = り, the same Sino measure. 십리 (十里) ≈ 4 km — “not even a short ' +
        'walk.”',
    },
  ],

  grammar: [
    {
      id: 'sineun',
      head: 'honorific -시- inside a relative clause',
      han: '가시는 님', rr: 'ga-si-neun nim', en: 'the dear one who goes',
      html: '가다 → honorific <b>가시다</b> → present adnominal <b>가시는</b>, modifying 님. Two ' +
        'transfers stacked: the subject-honor <span class="kr">-시-</span> is Japanese 尊敬 ' +
        '(お…になる), and <span class="kr">-는</span> is the present 連体形 — 行く人 with respect ' +
        'built in.',
      link: { folio: '#/ko/verbs', label: 'the register dial (-시-)' },
    },
    {
      id: 'plain',
      head: 'the plain -ㄴ다/-는다 declarative',
      han: '넘어간다 · 난다', rr: 'neomeoganda · nanda', en: '(she) goes over · (it) happens',
      html: 'The narrative register: plain-style <b>-ㄴ다/-는다</b> (해라체), the voice of song, ' +
        'diary, and headline. It maps to Japanese plain 〜る/だ (越えていく / 痛くなる) — no です/ます, ' +
        'no 요.',
      link: { folio: '#/ko/verbs', label: 'the register dial (해라체)' },
    },
    {
      id: 'go',
      head: 'the -고 connective',
      han: '버리고', rr: 'beorigo', en: 'leaving (me) and…',
      html: '-고 chains clauses like Japanese 〜て: 버리고 가다 = 捨てて行く, “abandon and go.” ' +
        'The same -고 that strings 먹고 자다 (食べて寝る).',
      link: { folio: '#/ko/particles', label: 'connectives (planned)' },
    },
  ],
};

// =====================================================================
// BTS · MIC Drop — HOOK EXCERPT ONLY.
//
// Unlike Arirang, this is a copyrighted commercial song. Encoded here is
// just the hook — a short teaching excerpt for personal language study,
// the most-repeated and most learnable chunk — not the full lyric, and the
// rap verses are described, not reproduced. Attribution lives in `origin`.
// A song built almost entirely from RAP, so it stresses the instruments
// differently than Arirang: rhythm and connected speech carry it, the
// melody is a near-monotone chant (a narrow band on the roll, by design).
// =====================================================================
const RAW_LINES_MICDROP = [
  {
    id: 'm1', restAfter: 0.5, kind: 'chant',
    rr: 'a neomu bappa neomu busy',
    en: 'ah, too busy, too busy',
    jp: 'ああ、忙しすぎる、忙しすぎる',
    syls: [
      ['아', 'a', 'd', 0.5], ['너', 'neo', 'r', 0.5], ['무', 'mu', 'd', 0.5],
      ['바', 'ba', 'r', 0.5], ['빠', 'ppa', 'm', 0.5], ['너', 'neo', 'r', 0.5],
      ['무', 'mu', 'd', 0.5], ['busy', 'busy', 'd', 1],
    ],
  },
  {
    id: 'm2', restAfter: 0.5, kind: 'chant',
    rr: 'nae onmomi mojalla',
    en: '(even) my whole body can’t keep up',
    jp: '体ひとつじゃ足りない',
    syls: [
      ['내', 'nae', 'r', 0.5], ['온', 'on', 'd', 0.5], ['몸', 'mom', 'd', 0.5],
      ['이', 'i', 'r', 0.5], ['모', 'mo', 'd', 0.5], ['잘', 'jal', 'r', 0.5], ['라', 'ra', 'd', 1],
    ],
  },
  {
    id: 'm3', restAfter: 0.5, kind: 'chant',
    rr: 'Mic drop Mic drop',
    en: '(the signature — drop the mic)',
    jp: '（マイク・ドロップ）',
    syls: [
      ['Mic', 'mic', 'm', 1], ['drop', 'drop', 'd', 1],
      ['Mic', 'mic', 'm', 1], ['drop', 'drop', 'd', 1],
    ],
  },
  {
    id: 'm4', restAfter: 2, kind: 'chant',
    rr: 'bal bal josim neone mal mal josim',
    en: 'watch your step — watch your mouth',
    jp: '足元に注意、お前ら言葉に気をつけろ',
    syls: [
      ['발', 'bal', 'd', 0.5], ['발', 'bal', 'd', 0.5], ['조', 'jo', 'r', 0.5], ['심', 'sim', 'd', 0.5],
      ['너', 'neo', 'r', 0.5], ['네', 'ne', 'd', 0.5], ['말', 'mal', 'r', 0.5], ['말', 'mal', 'r', 0.5],
      ['조', 'jo', 'r', 0.5], ['심', 'sim', 'd', 1],
    ],
  },
];

const builtMic = buildSection(RAW_LINES_MICDROP);

export const MIC_DROP = {
  id: 'micdrop',
  title: { han: 'MIC Drop', rr: 'Mic Drop', en: 'Mic Drop' },
  origin: 'BTS (방탄소년단) · “MIC Drop” (2017, Love Yourself: Her) · written by Pdogg, “hitman” bang, Supreme Boi, RM, j-hope, SUGA · © Big Hit / HYBE — HOOK EXCERPT, reproduced for personal language study only',
  genre: '힙합 · hip-hop',
  meta: { bpm: 150, beatsPerBar: 4, key: 'C', mode: 'chant (study transcription)' },
  context: {
    difficulty: 'beginner (hook) · the verses are advanced rap',
    register: '반말 · casual/boast',
    tags: ['힙합 hip-hop', '디스 clap-back', '4/4 trap'],
    blurbHtml:
      'A clap-back anthem: success as the last word to the doubters. The hook trades on a tidy ' +
      'piece of wordplay — <b>발 조심</b> (watch your step) against <b>말 조심</b> (watch your ' +
      'mouth), 발 / 말 a single vowel apart. Only the hook is encoded here, as a short study ' +
      'excerpt; the verses are dense rap and are left to the record.',
    whyHtml:
      'A deliberate contrast to Arirang. This song is almost all <b>rap</b>, so it leans on the ' +
      'instruments differently — rhythm and connected speech do the work, and the melody is a ' +
      'near-monotone chant (watch it sit in a narrow band on the roll, where Arirang roamed the ' +
      'full pentatonic). The hook is still a clean little lesson: the everyday intensifier ' +
      '<span class="kr">너무</span>, a model <span class="kr">ㅡ</span>-irregular ' +
      '(<span class="kr">바쁘다 → 바빠</span>), and a Sino word whose hanja Japan didn’t keep ' +
      '(<span class="kr">조심</span>, 操心).',
  },
  sections: [
    { id: 'hook', kind: 'chorus', label: 'the hook (excerpt)', lines: builtMic.lines },
  ],
  beats: builtMic.beats,

  diction: [
    {
      id: 'onmomi',
      written: { han: '온몸이', rr: 'on-mom + i' },
      sung: { han: '온모미', rr: 'on-mo-mi' },
      kind: 'liaison · 연음',
      html: 'The subject particle 이 pulls the ㅁ off 몸: 온몸이 → <b>[온모미]</b>. The same ' +
        'liaison Arirang shows on 님은 — a 받침 never sits still before a vowel, sung fast least ' +
        'of all.',
      link: { folio: '#/ko/grammar', label: 'the gate — 받침 & liaison' },
    },
    {
      id: 'mojalla',
      written: { han: '모자라', rr: 'mo-ja-ra' },
      sung: { han: '모잘라', rr: 'mo-jal-la' },
      kind: 'colloquial · 구어',
      html: 'The standard verb is 모자라(다) “to fall short”; sung, it colors to <b>모잘라</b> — a ' +
        'casual coloring you’ll hear all over K-pop. Not a sound law, a register: know the ' +
        'dictionary form lives under it.',
      link: null,
    },
  ],

  harvestVocab: [
    {
      head: '너무', rr: 'neomu', pos: 'adverb', en: 'too · so (much)', from: 'm1',
      bridge: { kanji: 'あまりに · とても', kana: '', rr: 'amari ni · totemo', kind: 'equivalent' },
      note: 'The everyday intensifier. Strictly “excessively,” but colloquially just “so” — ' +
        '너무 좋아 = 超いい.',
    },
    {
      head: '바쁘다', rr: 'bappeuda', pos: 'adj', en: 'to be busy', from: 'm1',
      bridge: { kanji: '忙しい', kana: 'いそがしい', rr: 'isogashii', kind: 'equivalent' },
      note: 'A model <b>ㅡ-irregular</b>: 바쁘 + 아 → <span class="kr">바빠</span>, the ㅡ dropping ' +
        'exactly as in 크다 → 커요. The verb forge files the class.',
    },
    {
      head: '몸', rr: 'mom', pos: 'noun', en: 'body', from: 'm2',
      bridge: { kanji: '体', kana: 'からだ', rr: 'karada', kind: 'equivalent' },
      note: '온몸 = 온 (whole, native) + 몸 — “the whole body,” the 온 of 온종일 (all day long).',
    },
    {
      head: '조심', rr: 'josim', pos: 'noun', en: 'caution · care', from: 'm4',
      bridge: { kanji: '用心', kana: 'ようじん', rr: 'yōjin', kind: 'equivalent' },
      note: 'Sino-Korean <b>操心</b> — but Japanese never kept those characters for the sense; the ' +
        'everyday word is 用心 / 気をつける. A 한자어 whose hanja didn’t cross, like 공부 vs 勉強. ' +
        '조심하다 = to be careful.',
    },
    {
      head: '말', rr: 'mal', pos: 'noun', en: 'words · speech', from: 'm4',
      bridge: { kanji: '言葉', kana: 'ことば', rr: 'kotoba', kind: 'equivalent' },
      note: '말 조심 = “watch your words.” One vowel from 발 (foot) — the hook’s whole joke: ' +
        '발 조심 / 말 조심.',
    },
    {
      head: '발', rr: 'bal', pos: 'noun', en: 'foot', from: 'm4',
      bridge: { kanji: '足', kana: 'あし', rr: 'ashi', kind: 'equivalent' },
      note: '발 조심 = “watch your step.” Native, like 손 (hand) and 몸 (body) — the body lexicon ' +
        'is overwhelmingly 고유어.',
    },
  ],

  grammar: [
    {
      id: 'eu-irreg',
      head: 'the ㅡ-irregular stem',
      han: '바쁘다 → 바빠', rr: 'bappeuda → bappa', en: 'busy → (is) busy',
      html: 'When a stem ends in ㅡ, the ㅡ <b>drops</b> before 아/어: 바쁘 + 아 → 바빠. No ' +
        'Japanese analog — it’s pure Korean phonology — but it’s utterly regular once seen. Same ' +
        'class: 크다 → 커, 쓰다 → 써, 아프다 → 아파.',
      link: { folio: '#/ko/verbs', label: 'the verb forge (ㅡ-drop)' },
    },
    {
      id: 'noun-josim',
      head: 'noun + 조심 — “watch your X”',
      han: '발 조심 · 말 조심', rr: 'bal josim · mal josim', en: 'watch your step · watch your mouth',
      html: 'A bare noun + 조심 is an idiomatic warning (full verb: 조심하다). Maps neatly to ' +
        'Japanese 〜に気をつけて / 足元に注意. The hook stacks two for the 발/말 pun.',
      link: { folio: '#/ko/particles', label: 'the particle cabinet' },
    },
  ],
};

// =====================================================================
// GD&TOP · Knock Out (뻑이가요) — HOOK / PRE-CHORUS EXCERPT ONLY.
//
// Another copyrighted track, so again only a short attributed excerpt for
// study — here the pre-chorus + the hook, the most learnable chunk; the
// rap verses are left to the record. What earns it a place beside the
// others: the whole hook is a PUN on liaison. 뻑이 가요 (I'm blown away)
// and 손이 가요 (my hand reaches) rhyme only because each 받침 slides onto
// the 이 behind it — 뻑이→[뻐기], 손이→[소니]. The song that teaches the
// single most important Korean reading reflex by making a joke of it. It
// also mixes delivery: a moving SUNG pre-chorus over a flat CHANT hook, so
// one song shows both `kind`s on the roll.
// =====================================================================
const RAW_LINES_KNOCKOUT = [
  {
    id: 'k1', restAfter: 0.5, kind: 'sung',
    rr: 'dulman bomyeon nado mollae',
    en: 'the moment I just see the two of us, despite myself —',
    jp: '二人を見ると、つい自分でも知らないうちに',
    syls: [
      ['둘', 'dul', 'd', 0.5], ['만', 'man', 'd', 0.5], ['보', 'bo', 'r', 0.5], ['면', 'myeon', 'm', 1],
      ['나', 'na', 'r', 0.5], ['도', 'do', 'd', 0.5], ['몰', 'mol', 'l', 0.5], ['래', 'rae', 'd', 1],
    ],
  },
  {
    id: 'k2', restAfter: 0.5, kind: 'sung',
    rr: 'ppeogigayo ani sonigayo',
    en: 'I’m knocked out — no, my hand’s already reaching.',
    jp: 'イカれちゃう、いや、つい手が伸びる',
    syls: [
      ['뻑', 'ppeok', 'm', 0.5], ['이', 'i', 'r', 0.5], ['가', 'ga', 'r', 0.5], ['요', 'yo', 'd', 1],
      ['아', 'a', 'r', 0.5], ['니', 'ni', 'm', 0.5], ['손', 'son', 'm', 0.5], ['이', 'i', 'r', 0.5],
      ['가', 'ga', 'd', 0.5], ['요', 'yo', 'd', 1.5],
    ],
  },
  {
    id: 'k3', restAfter: 2, kind: 'chant',
    rr: 'ppeogigayo aju ppeogigayo',
    en: 'knock out — it’s a real knock out',
    jp: 'ノックアウト、すっかりやられる',
    syls: [
      ['뻑', 'ppeok', 'd', 0.5], ['이', 'i', 'd', 0.5], ['가', 'ga', 'd', 0.5], ['요', 'yo', 'd', 1],
      ['아', 'a', 'r', 0.5], ['주', 'ju', 'r', 0.5], ['뻑', 'ppeok', 'd', 0.5], ['이', 'i', 'd', 0.5],
      ['가', 'ga', 'd', 0.5], ['요', 'yo', 'd', 1.5],
    ],
  },
];

const builtKnock = buildSection(RAW_LINES_KNOCKOUT);

export const KNOCK_OUT = {
  id: 'knockout',
  title: { han: '뻑이가요', rr: 'Knock Out', en: 'Knock Out' },
  origin: 'GD&TOP (지드래곤&탑) · “Knock Out” (뻑이가요) (2010) · written by G-Dragon, Teddy, et al. · © YG Entertainment — PRE-CHORUS / HOOK EXCERPT, reproduced for personal language study only',
  genre: '힙합 · hip-hop',
  meta: { bpm: 130, beatsPerBar: 4, key: 'C', mode: 'sung + chant (study transcription)' },
  context: {
    difficulty: 'beginner (hook) · the verses are advanced rap/slang',
    register: '반말 · slang/boast',
    tags: ['힙합 hip-hop', '말장난 wordplay', '4/4'],
    blurbHtml:
      'A 2010 GD&TOP banger whose Korean title, <b>뻑이가요</b>, is slang for “you knock me out / ' +
      'I’m blown away.” The pre-chorus runs the joke: <b>뻑이 가요</b> (I’m blown away) against ' +
      '<b>손이 가요</b> (my hand reaches) — the same tune, a single consonant apart, made to rhyme ' +
      'by liaison. Only that excerpt is encoded; the rap verses are left to the record.',
    whyHtml:
      'A wordplay song that drills the one reflex Korean reading most depends on: <b>liaison</b>. ' +
      'Its whole hook only rhymes because the 받침 slides onto the 이 behind it — 뻑이→[뻐기], ' +
      '손이→[소니]. The pre-chorus throws in a compact grammar kit too: the conditional ' +
      '<span class="kr">-(으)면</span> (보면 = 見れば), and the focus particles ' +
      '<span class="kr">만</span> (だけ) and <span class="kr">도</span> (も). It also mixes ' +
      'delivery — a moving sung line over a flat chant — so one song shows both on the roll.',
  },
  sections: [
    { id: 'hook', kind: 'chorus', label: 'pre-chorus + hook (excerpt)', lines: builtKnock.lines },
  ],
  beats: builtKnock.beats,

  diction: [
    {
      id: 'ppeogi',
      written: { han: '뻑이', rr: 'ppeok + i' },
      sung: { han: '뻐기', rr: 'ppeo-gi' },
      kind: 'liaison · 연음',
      html: 'The ㄱ of 뻑 slides onto the 이: 뻑이 → <b>[뻐기]</b>. Half of the song’s pun — and the ' +
        'reason 뻑이가요 and 손이가요 rhyme at all.',
      link: { folio: '#/ko/grammar', label: 'the gate — 받침 & liaison' },
    },
    {
      id: 'soni',
      written: { han: '손이', rr: 'son + i' },
      sung: { han: '소니', rr: 'so-ni' },
      kind: 'liaison · 연음',
      html: 'The other half: the ㄴ of 손 carries onto 이, 손이 → <b>[소니]</b>. Two 받침, two ' +
        'liaisons, one rhyme — the pun is pure phonology. (손 = hand; 손이 가다 = the hand reaches, ' +
        '“to be tempted.”)',
      link: { folio: '#/ko/grammar', label: 'the gate — 받침 & liaison' },
    },
  ],

  harvestVocab: [
    {
      head: '아주', rr: 'aju', pos: 'adverb', en: 'very · really', from: 'k3',
      bridge: { kanji: '非常に · とても', kana: '', rr: 'hijō ni · totemo', kind: 'equivalent' },
      note: 'A degree adverb a notch stronger than 너무 — 아주 좋아 = すごくいい. Stacks before ' +
        'adjectives and verbs alike.',
    },
    {
      head: '둘', rr: 'dul', pos: 'noun', en: 'two (of them) · the two', from: 'k1',
      bridge: { kanji: '二人 · 二つ', kana: 'ふたり · ふたつ', rr: 'futari · futatsu', kind: 'equivalent' },
      note: 'The <b>native</b> two; the Sino 이 (二) takes over for dates and counting — exactly ' +
        'the kun/on split (ふたつ vs に).',
    },
    {
      head: '몰래', rr: 'mollae', pos: 'adverb', en: 'secretly · without (one) knowing', from: 'k1',
      bridge: { kanji: 'こっそり', kana: '', rr: 'kossori', kind: 'equivalent' },
      note: 'From 모르다 (to not know). 나도 몰래 = “even without my realizing” — before you know it.',
    },
    {
      head: '손', rr: 'son', pos: 'noun', en: 'hand', from: 'k2',
      bridge: { kanji: '手', kana: 'て', rr: 'te', kind: 'equivalent' },
      note: '손이 가다 = “the hand reaches” → 手が伸びる, the idiom of being drawn to something. The ' +
        'punchline of the pun.',
    },
    {
      head: '뻑가다', rr: 'ppeokgada', pos: 'expression', en: 'to be blown away · smitten (slang)', from: 'k2',
      bridge: { kanji: 'イカれる · メロメロ', kana: '', rr: 'ikareru · meromero', kind: 'equivalent' },
      note: 'Slang (뻑이 가다): to flip for someone/something. The title itself — no clean bridge, ' +
        'just attitude.',
    },
  ],

  grammar: [
    {
      id: 'eu-myeon',
      head: 'the -(으)면 conditional',
      han: '보면', rr: 'bomyeon', en: 'when / if (one) sees',
      html: '보다 + <b>-면</b> = “when/if (you) see.” Maps to Japanese 〜ば / 〜たら / 〜と — 見れば, ' +
        '見たら. Add 으 after a 받침 (먹으면 = 食べれば). One of the first connectives to own.',
      link: { folio: '#/ko/verbs', label: 'the verb forge' },
    },
    {
      id: 'man-do',
      head: '만 & 도 — the focus particles',
      han: '둘만 · 나도', rr: 'dulman · nado', en: 'just the two · me too',
      html: '<b>만</b> = だけ (only/just): 둘만 = “just the two.” <b>도</b> = も (also/even): 나도 = ' +
        '“I too.” Both attach straight to the noun, and both <i>stack</i> after other particles — ' +
        'the stack instrument files how.',
      link: { folio: '#/ko/particles', label: 'the particle stack (는/도/만)' },
    },
  ],
};

export const KO_SONGS = [ARIRANG, MIC_DROP, KNOCK_OUT];
