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

// Thread absolute beats + resolve midi. One section (the verse-refrain).
function buildSection() {
  let beat = 0;
  const lines = RAW_LINES.map((raw) => {
    const startBeat = beat;
    const syls = raw.syls.map(([han, rr, deg, dur]) => {
      const syl = { han, rr, deg, dur, beat, midi: SCALE[deg] };
      beat += dur;
      return syl;
    });
    const endBeat = beat;
    beat += raw.restAfter;
    return { id: raw.id, syls, startBeat, endBeat, restAfter: raw.restAfter,
      rr: raw.rr, en: raw.en, jp: raw.jp };
  });
  return { lines, beats: beat };
}

const built = buildSection();

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

export const KO_SONGS = [ARIRANG];
