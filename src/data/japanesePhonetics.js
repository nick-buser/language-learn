// =====================================================================
// The Polyglot's Atlas — 日本語 · 発音 (phonetics: the sound under the kana)
//
// The mirror of koreanPhonetics.js, run the other way. Korean's claim is
// that its SCRIPT draws the mouth (featural). Japanese makes the opposite,
// honest claim: kana is *arbitrary* — の carries no trace of how [no] is
// made — so this folio is about the phonetics the script HIDES, and the
// two narrow places where it doesn't.
//
//   • CONSONANTS — the kana glyph is silent on articulation, but the gojūon
//     SYSTEM isn't: the 清音→濁音→半濁音 ladder is featural. The dakuten ゛
//     means "voice this same place" (か[k]→が[ɡ]); the handakuten ゜ marks
//     the p-series (は→ぱ). Only obstruents take ゛ — sonorants are already
//     voiced. And every row hides at least one allophone the kana won't tell
//     you (し[ɕ], ち[tɕ], つ[ts], ふ[ɸ], ひ[ç]).
//   • VOWELS — five pure monophthongs, plotted on the real IPA trapezoid.
//     The trap is う [ɯ]: close-back but UNROUNDED. The bridge plots Korean's
//     ten vowels under the five, so a Japanese ear can see which gaps Korean
//     splits open (ㅡ/ㅜ, ㅗ/ㅓ).
//   • PITCH — the layer kana can't write at all: lexical pitch accent. はし
//     is spelled one way and means three things (箸 chopsticks / 橋 bridge /
//     端 edge) by pitch alone. Each word carries its H/L melody per mora.
//
// Romaji is Hepburn (project convention); IPA is the broad Tokyo-standard
// phoneme, common allophones noted. `speak` is a real kana string for the
// Web Speech seam; pitch is heard via the song folio's tone synth.
//
// SCHEMA — a preview of the future phonetics API payload; treat as a contract.
//
// @typedef {Object} Place           an articulation class
// @property {string} id             bilabial|alveolar|palatal|velar|glottal
// @property {string} ja, romaji, en
// @property {string} region         SagittalMouth hotspot key (lips|ridge|palate|velum|glottis)
// @property {string} organ          the moving/target organ, plain words
//
// @typedef {Object} Consonant       one tappable sound (series emblem OR allophone)
// @property {string} id, kana, rr
// @property {string} ipa            broad phoneme; `ipaNote` for allophony
// @property {string} place          Place.id
// @property {string} manner         stop|fricative|affricate|nasal|tap|approximant
// @property {string} voicing        voiceless|voiced
// @property {string} reg            sei(清) | daku(濁 ゛) | handaku(半濁 ゜) | son(sonorant) | allo
// @property {string} series         row key (k s t h n m r y w N)
// @property {?string} base          the 清音 kana the series grows from
// @property {string} speak          TTS kana
// @property {?string} note          allophone / special story (null = plain)
//
// @typedef {Object} Vowel
// @property {string} id, kana, rr, ipa
// @property {number} x              IPA trapezoid: 0 front … 1 back
// @property {number} y              IPA trapezoid: 0 close(high) … 1 open(low)
// @property {boolean} round
// @property {string} note
// @property {Object}  bridge        { ko: KoTwin[], note } — the 5→10 mirror
//
// @typedef {Object} PitchWord
// @property {string} id, kanji, gloss
// @property {string[]} kana         one entry per mora (ん / っ / ー count)
// @property {('H'|'L')[]} pitch     the tone of each mora
// @property {('H'|'L')} particle    the tone a following が would carry
// @property {string} type           ACCENT_TYPES key
// @property {?number} accentMora    index of the accented mora; null = heiban
// @property {?string} pair          shared id of its minimal set
// @property {string} speak          TTS kana
// =====================================================================

/** The five articulation classes used here, front → back. */
export const PLACES = [
  { id: 'bilabial', ja: '両唇音',   romaji: 'ryōshin-on',  en: 'bilabial — the lips',       region: 'lips',    organ: 'the two lips, pressed or compressed' },
  { id: 'alveolar', ja: '歯茎音',   romaji: 'shikei-on',   en: 'alveolar — the gum ridge',  region: 'ridge',   organ: 'the tongue tip at the ridge behind the teeth' },
  { id: 'palatal',  ja: '硬口蓋音', romaji: 'kōkōgai-on',  en: 'palatal — the hard palate', region: 'palate',  organ: 'the body of the tongue raised to the hard palate' },
  { id: 'velar',    ja: '軟口蓋音', romaji: 'nankōgai-on', en: 'velar — the soft palate',   region: 'velum',   organ: 'the back of the tongue against the soft palate' },
  { id: 'glottal',  ja: '声門音',   romaji: 'seimon-on',   en: 'glottal — the throat',      region: 'glottis', organ: 'the open throat — a plain breath' },
]

// =====================================================================
// 子音 — the consonants. The グリッド below reads each series by its あ-column
// emblem; allophone cells (し ち つ ふ ひ に) are separate tappable sounds
// flagged where the row's place quietly changes.
// =====================================================================
export const CONSONANTS = [
  // ── 清音 obstruents — the voicing ladder (these take ゛, は also ゜) ──
  { id: 'k', kana: 'か', rr: 'ka', ipa: 'k', place: 'velar', manner: 'stop', voicing: 'voiceless', reg: 'sei', series: 'k', base: 'か', speak: 'か', note: null },
  { id: 'g', kana: 'が', rr: 'ga', ipa: 'ɡ', ipaNote: '[ɡ] word-initially; between vowels many Tokyo speakers soften it to a nasal [ŋ] (が行鼻濁音).', place: 'velar', manner: 'stop', voicing: 'voiced', reg: 'daku', series: 'k', base: 'か', speak: 'が', note: 'か + ゛ — same velar place, now voiced. The dakuten is the rule made visible: voice the throat-stop and か becomes が.' },

  { id: 's', kana: 'さ', rr: 'sa', ipa: 's', place: 'alveolar', manner: 'fricative', voicing: 'voiceless', reg: 'sei', series: 's', base: 'さ', speak: 'さ', note: null },
  { id: 'z', kana: 'ざ', rr: 'za', ipa: 'z', ipaNote: 'affricated [dz] word-initially, fricative [z] between vowels.', place: 'alveolar', manner: 'fricative', voicing: 'voiced', reg: 'daku', series: 's', base: 'さ', speak: 'ざ', note: 'さ + ゛ — the voiced hiss [z].' },
  { id: 'shi', kana: 'し', rr: 'shi', ipa: 'ɕ', ipaNote: 'NOT [si]: before /i/ the tongue rides up to the palate → [ɕ] (the "sh" of sheet).', place: 'palatal', manner: 'fricative', voicing: 'voiceless', reg: 'allo', series: 's', base: 'さ', speak: 'し', note: 'The s-row breaks rank at し. The kana looks like a sibling of さ・す, but the place jumps from the ridge to the hard palate.' },

  { id: 't', kana: 'た', rr: 'ta', ipa: 't', place: 'alveolar', manner: 'stop', voicing: 'voiceless', reg: 'sei', series: 't', base: 'た', speak: 'た', note: null },
  { id: 'd', kana: 'だ', rr: 'da', ipa: 'd', place: 'alveolar', manner: 'stop', voicing: 'voiced', reg: 'daku', series: 't', base: 'た', speak: 'だ', note: 'た + ゛ — same tongue-tip place, voiced.' },
  { id: 'chi', kana: 'ち', rr: 'chi', ipa: 'tɕ', ipaNote: 't before /i/ → the affricate [tɕ] ("ch").', place: 'palatal', manner: 'affricate', voicing: 'voiceless', reg: 'allo', series: 't', base: 'た', speak: 'ち', note: 'The t-row bends twice. Before /i/ it palatalises to ち [tɕ] — a stop-then-hiss at the palate, not a clean [ti].' },
  { id: 'tsu', kana: 'つ', rr: 'tsu', ipa: 'ts', ipaNote: 't before /u/ → the affricate [ts]; the vowel is unrounded [ɯ].', place: 'alveolar', manner: 'affricate', voicing: 'voiceless', reg: 'allo', series: 't', base: 'た', speak: 'つ', note: 'And before /u/ it affricates to つ [tsɯ] — the place stays at the ridge but the release hisses.' },

  { id: 'h', kana: 'は', rr: 'ha', ipa: 'h', place: 'glottal', manner: 'fricative', voicing: 'voiceless', reg: 'sei', series: 'h', base: 'は', speak: 'は', note: 'The strangest series. は・へ・ほ are a plain glottal breath [h] — but the row was *pa* in Old Japanese, which is why its voiced and ゜ partners land on the LIPS, not the throat.' },
  { id: 'b', kana: 'ば', rr: 'ba', ipa: 'b', place: 'bilabial', manner: 'stop', voicing: 'voiced', reg: 'daku', series: 'h', base: 'は', speak: 'ば', note: 'は + ゛ = ば [b] — voiced, and at the LIPS. The dakuten preserves the old *b of the *p-row; the place moves from throat to lips.' },
  { id: 'p', kana: 'ぱ', rr: 'pa', ipa: 'p', place: 'bilabial', manner: 'stop', voicing: 'voiceless', reg: 'handaku', series: 'h', base: 'は', speak: 'ぱ', note: 'は + ゜ = ぱ [p] — the only 半濁音. The little circle restores the row’s ancient *p, a bilabial stop.' },
  { id: 'fu', kana: 'ふ', rr: 'fu', ipa: 'ɸ', ipaNote: 'not [f] (teeth-on-lip) and not [h]: BOTH lips bring air to a soft hiss → [ɸ].', place: 'bilabial', manner: 'fricative', voicing: 'voiceless', reg: 'allo', series: 'h', base: 'は', speak: 'ふ', note: 'ふ is neither "fu" nor "hu". Before /u/ the breath is shaped by both lips → the bilabial fricative [ɸ].' },
  { id: 'hi', kana: 'ひ', rr: 'hi', ipa: 'ç', ipaNote: 'h before /i/ → [ç], a hiss at the hard palate (German ich).', place: 'palatal', manner: 'fricative', voicing: 'voiceless', reg: 'allo', series: 'h', base: 'は', speak: 'ひ', note: 'And before /i/ the breath rises to the palate → ひ [çi].' },

  // ── 鼻音・流音・半母音 — sonorants. Already voiced, so no ゛ exists. ──
  { id: 'n', kana: 'な', rr: 'na', ipa: 'n', place: 'alveolar', manner: 'nasal', voicing: 'voiced', reg: 'son', series: 'n', base: 'な', speak: 'な', note: null },
  { id: 'ni', kana: 'に', rr: 'ni', ipa: 'ɲ', ipaNote: 'n before /i/ → the palatal nasal [ɲ] (roughly the "ny" of canyon).', place: 'palatal', manner: 'nasal', voicing: 'voiced', reg: 'allo', series: 'n', base: 'な', speak: 'に', note: 'Even the nasals palatalise before /i/: に is [ɲi], made at the palate.' },
  { id: 'm', kana: 'ま', rr: 'ma', ipa: 'm', place: 'bilabial', manner: 'nasal', voicing: 'voiced', reg: 'son', series: 'm', base: 'ま', speak: 'ま', note: null },
  { id: 'r', kana: 'ら', rr: 'ra', ipa: 'ɾ', ipaNote: 'a single tap [ɾ] — neither English l nor r; the tongue flicks the ridge once.', place: 'alveolar', manner: 'tap', voicing: 'voiced', reg: 'son', series: 'r', base: 'ら', speak: 'ら', note: 'The ら-row is a flap [ɾ], the sound in the middle of American "water". Not a held [l], not a bunched [r].' },
  { id: 'y', kana: 'や', rr: 'ya', ipa: 'j', place: 'palatal', manner: 'approximant', voicing: 'voiced', reg: 'son', series: 'y', base: 'や', speak: 'や', note: 'A palatal glide [j] — the tongue at the palate, the same posture as い in motion.' },
  { id: 'w', kana: 'わ', rr: 'wa', ipa: 'w', ipaNote: 'Japanese [w] compresses the lips rather than rounding them; phonetically near [ɰ].', place: 'bilabial', manner: 'approximant', voicing: 'voiced', reg: 'son', series: 'w', base: 'わ', speak: 'わ', note: 'A glide made with light lip-compression and a backed tongue — softer than English "w".' },
  { id: 'N', kana: 'ん', rr: 'n', ipa: 'ɴ', ipaNote: 'the moraic nasal: [ɴ] phrase-finally, but it ASSIMILATES — [m] before p/b/m, [n] before t/d/n, [ŋ] before k/g.', place: 'glottal', manner: 'nasal', voicing: 'voiced', reg: 'son', series: 'N', base: 'ん', speak: 'ん', note: 'The chameleon, and a full mora of its own. ん has no fixed place — it borrows the place of whatever follows it (しんぶん [ɕimbɯɴ], あんない [annai], りんご [riŋɡo]).' },
]

/** The series rows, place-ordered: the four 清音 obstruents on the ゛/゜ ladder,
 *  then the sonorants that take no diacritic. Member ids resolve against CONSONANTS. */
export const SERIES = [
  { series: 'k', place: 'velar',    label: { ja: 'カ行', en: 'k → g' },   sei: 'k', daku: 'g', handaku: null, allos: [] },
  { series: 's', place: 'alveolar', label: { ja: 'サ行', en: 's → z' },   sei: 's', daku: 'z', handaku: null, allos: ['shi'] },
  { series: 't', place: 'alveolar', label: { ja: 'タ行', en: 't → d' },   sei: 't', daku: 'd', handaku: null, allos: ['chi', 'tsu'] },
  { series: 'h', place: 'glottal',  label: { ja: 'ハ行', en: 'h → b → p' }, sei: 'h', daku: 'b', handaku: 'p', allos: ['fu', 'hi'] },
  { series: 'n', place: 'alveolar', label: { ja: 'ナ行', en: 'n' },       sei: 'n', daku: null, handaku: null, allos: ['ni'] },
  { series: 'm', place: 'bilabial', label: { ja: 'マ行', en: 'm' },       sei: 'm', daku: null, handaku: null, allos: [] },
  { series: 'r', place: 'alveolar', label: { ja: 'ラ行', en: 'r' },       sei: 'r', daku: null, handaku: null, allos: [] },
  { series: 'y', place: 'palatal',  label: { ja: 'ヤ行', en: 'y' },       sei: 'y', daku: null, handaku: null, allos: [] },
  { series: 'w', place: 'bilabial', label: { ja: 'ワ行', en: 'w' },       sei: 'w', daku: null, handaku: null, allos: [] },
  { series: 'N', place: 'glottal',  label: { ja: '撥音', en: 'ん' },      sei: 'N', daku: null, handaku: null, allos: [] },
]

const byId = Object.fromEntries(CONSONANTS.map(c => [c.id, c]))

/** The voicing-ladder grid, resolved — one row per series, built from the data
 *  so it can't drift. `obstruent` rows carry the ゛/゜ ladder; the rest are sonorants. */
export const VOICE_LADDER = SERIES.map(s => ({
  series: s.series,
  place: s.place,
  label: s.label,
  sei: byId[s.sei] || null,
  daku: s.daku ? byId[s.daku] : null,
  handaku: s.handaku ? byId[s.handaku] : null,
  allos: s.allos.map(id => byId[id]).filter(Boolean),
  obstruent: !!(s.daku || s.handaku),
}))

// =====================================================================
// 母音 — the five vowels. x,y are schematic IPA-trapezoid coordinates
// (0 front … 1 back, 0 close/high … 1 open/low). Each carries the Korean
// twin(s) it maps to, with `split:true` on the vowel a Japanese ear must
// newly carve out — the 5→10 mirror the Korean folio promised.
// =====================================================================
export const VOWELS = [
  { id: 'a', kana: 'あ', rr: 'a', ipa: 'a', x: 0.34, y: 0.95, round: false, speak: 'あ',
    note: 'A clean, central open [a] — short, no glide. The most stable of the five and the easiest to land.',
    bridge: { ko: [{ jamo: 'ㅏ', rr: 'a', ipa: 'a', x: 0.30, y: 0.95 }], note: 'Sits right on Korean ㅏ. Arrives for free.' } },
  { id: 'i', kana: 'い', rr: 'i', ipa: 'i', x: 0.05, y: 0.06, round: false, speak: 'い',
    note: 'Close front [i], like ㅣ. Whispers (devoices) between voiceless consonants — the い in 〜しました is barely voiced.',
    bridge: { ko: [{ jamo: 'ㅣ', rr: 'i', ipa: 'i', x: 0.04, y: 0.05 }], note: 'Equals Korean ㅣ. Free.' } },
  { id: 'u', kana: 'う', rr: 'u', ipa: 'ɯ', x: 0.88, y: 0.10, round: false, speak: 'う',
    note: 'THE trap. Close-back, but UNROUNDED — the lips compress flat, they do not purse. English and Korean [u] round hard; Japanese う does not. Devoices like い (です → roughly [des]).',
    bridge: { ko: [
      { jamo: 'ㅡ', rr: 'eu', ipa: 'ɯ', x: 0.82, y: 0.07 },
      { jamo: 'ㅜ', rr: 'u', ipa: 'u', x: 0.96, y: 0.06, split: true },
    ], note: 'Korean splits this back corner in TWO: unrounded ㅡ and rounded ㅜ. う lands near ㅡ — so ㅜ is a genuinely new, lip-rounded vowel to add.' } },
  { id: 'e', kana: 'え', rr: 'e', ipa: 'e', x: 0.10, y: 0.40, round: false, speak: 'え',
    note: 'Close-mid front [e], steady — no off-glide to [i] the way English "ay" slides.',
    bridge: { ko: [
      { jamo: 'ㅔ', rr: 'e', ipa: 'e', x: 0.07, y: 0.36 },
      { jamo: 'ㅐ', rr: 'ae', ipa: 'ɛ', x: 0.12, y: 0.62, split: true },
    ], note: 'Korean writes ㅔ [e] and ㅐ [ɛ] here — but the two are merging for younger Seoul speakers, so え nearly covers both.' } },
  { id: 'o', kana: 'お', rr: 'o', ipa: 'o', x: 0.90, y: 0.42, round: true, speak: 'お',
    note: 'Close-mid back [o], lightly rounded — the one rounded Japanese vowel. Steady, no glide.',
    bridge: { ko: [
      { jamo: 'ㅗ', rr: 'o', ipa: 'o', x: 0.94, y: 0.36 },
      { jamo: 'ㅓ', rr: 'eo', ipa: 'ʌ', x: 0.78, y: 0.62, split: true },
    ], note: 'Korean splits the back-mid into rounded ㅗ [o] and unrounded ㅓ [ʌ]. お ≈ ㅗ; ㅓ is the new one to carve out.' } },
]

/** What the vowel chart's length/voicing footnotes say (also used in the coda). */
export const VOWEL_NOTES = {
  length: 'Length is meaning. Each vowel has a SHORT and a LONG version (one mora vs two): おばさん (aunt) / おばあさん (grandmother), とる (take) / とおる (pass through). The long one is the same vowel held for a second beat — never a different sound.',
  devoice: 'い and う go voiceless between voiceless consonants or at the end of a word — 好き ≈ [s̥kʲi], です ≈ [des]. The vowel is still "there" rhythmically (it keeps its mora) but the voice switches off.',
}

// =====================================================================
// 母音の組み合わせ — what happens when two vowels meet. The compass's second
// view. Kana writes every vowel as its own glyph, but a vowel pair resolves
// one of two ways the script never marks:
//   • long (長音) — ONE vowel quality, held for two morae. The doubled
//     spellings (ああ いい うう ええ おお) are the open case; the traps are
//     えい and おう, written as a sequence but heard as a held [eː]/[oː]
//     (先生 = [seːseː], not se-n-se-i).
//   • seq (連母音) — TWO different vowels, each its OWN mora. Japanese has no
//     true diphthongs: あい is a·i (two beats), never the single glide of
//     English "eye" [aɪ].
// The kana is honest about the morae count and silent about hold-vs-step.
//
// `from`/`to` are base-vowel ids (the two written letters); `held` is the
// quality a long vowel sustains (null for sequences). `lie:true` flags the
// spellings that look like a sequence but sound long (えい/おう). morae = 2.
//
// @typedef {Object} VowelCombo
// @property {string} id, kana, rr, ipa
// @property {('long'|'seq')} kind
// @property {string} from, to        base-vowel ids of the two written letters
// @property {?string} held           long: the sustained vowel id; seq: null
// @property {boolean} lie            written as a sequence, heard as long
// @property {number} morae
// @property {string} note
// @property {{kanji:string,kana:string,rr:string,en:string}[]} examples
// =====================================================================
export const VOWEL_COMBOS = [
  // ── 長音 · the spellings that lie (sequence on paper, long vowel in the mouth) ──
  { id: 'ei', kana: 'えい', rr: 'ei → ē', ipa: 'eː', kind: 'long', from: 'e', to: 'i', held: 'e', lie: true, morae: 2,
    note: 'Written え→い, but ordinary speech just holds the え: [eː]. 先生 is [seːseː], not se-n-se-i. (Song or very deliberate speech can pull the い back out.) This is the default long-e spelling.',
    examples: [
      { kanji: '先生', kana: 'せんせい', rr: 'sensei', en: 'teacher' },
      { kanji: '映画', kana: 'えいが',   rr: 'eiga',   en: 'movie' },
      { kanji: '時計', kana: 'とけい',   rr: 'tokei',  en: 'clock' },
    ] },
  { id: 'ou', kana: 'おう', rr: 'ou → ō', ipa: 'oː', kind: 'long', from: 'o', to: 'u', held: 'o', lie: true, morae: 2,
    note: 'Written お→う, heard as a held [oː]. The workhorse long-o spelling — Sino-Japanese readings, verb endings, counters. 学校 is gak-kō, とうきょう is tō-kyō.',
    examples: [
      { kanji: '学校', kana: 'がっこう',   rr: 'gakkō',   en: 'school' },
      { kanji: '東京', kana: 'とうきょう', rr: 'Tōkyō',   en: 'Tokyo' },
      { kanji: '',     kana: 'ありがとう', rr: 'arigatō', en: 'thank you' },
    ] },
  // ── 長音 · the doubled letters (one vowel, written twice, held) ──
  { id: 'aa', kana: 'ああ', rr: 'ā', ipa: 'aː', kind: 'long', from: 'a', to: 'a', held: 'a', lie: false, morae: 2,
    note: 'Doubled あ, held two beats — and the length is the meaning: おばさん (aunt) and おばあさん (grandmother) differ by this one extra mora and nothing else.',
    examples: [
      { kanji: '', kana: 'おばあさん', rr: 'obāsan', en: 'grandmother' },
      { kanji: '', kana: 'おかあさん', rr: 'okāsan', en: 'mother' },
    ] },
  { id: 'ii', kana: 'いい', rr: 'ī', ipa: 'iː', kind: 'long', from: 'i', to: 'i', held: 'i', lie: false, morae: 2,
    note: 'Held い. いい (good) is two morae; お兄さん stretches the same い.',
    examples: [
      { kanji: '',       kana: 'いい',       rr: 'ii',     en: 'good' },
      { kanji: 'お兄さん', kana: 'おにいさん', rr: 'onīsan', en: 'older brother' },
    ] },
  { id: 'uu', kana: 'うう', rr: 'ū', ipa: 'ɯː', kind: 'long', from: 'u', to: 'u', held: 'u', lie: false, morae: 2,
    note: 'Held う — still unrounded [ɯ], just longer. 空気 kūki, 数学 sūgaku.',
    examples: [
      { kanji: '空気', kana: 'くうき',   rr: 'kūki',   en: 'air' },
      { kanji: '数学', kana: 'すうがく', rr: 'sūgaku', en: 'mathematics' },
    ] },
  { id: 'ee', kana: 'ええ', rr: 'ē', ipa: 'eː', kind: 'long', from: 'e', to: 'e', held: 'e', lie: false, morae: 2,
    note: 'Native long e, spelled with a doubled え — rare, only a handful of words: お姉さん, ええ (yeah). Most long e is the えい spelling instead.',
    examples: [
      { kanji: 'お姉さん', kana: 'おねえさん', rr: 'onēsan', en: 'older sister' },
      { kanji: '',       kana: 'ええ',       rr: 'ē',      en: 'yeah / yes' },
    ] },
  { id: 'oo', kana: 'おお', rr: 'ō', ipa: 'oː', kind: 'long', from: 'o', to: 'o', held: 'o', lie: false, morae: 2,
    note: 'The OTHER long o — a small, closed list of native words spelled おお, not おう. You memorize which: 大きい, 遠い, 氷, 通り.',
    examples: [
      { kanji: '大きい', kana: 'おおきい', rr: 'ōkii', en: 'big' },
      { kanji: '遠い',   kana: 'とおい',   rr: 'tōi',  en: 'far' },
      { kanji: '氷',     kana: 'こおり',   rr: 'kōri', en: 'ice' },
    ] },
  // ── 連母音 · true sequences — two vowels, two morae, no glide ──
  { id: 'ai', kana: 'あい', rr: 'a·i', ipa: 'a.i', kind: 'seq', from: 'a', to: 'i', held: null, lie: false, morae: 2,
    note: 'Two beats: a·i. English collapses this to the glide of "eye" [aɪ]; Japanese keeps each vowel a full mora and never slides. 愛 is a·i; 高い is ta·ka·i.',
    examples: [
      { kanji: '愛',   kana: 'あい',   rr: 'ai',    en: 'love' },
      { kanji: '',     kana: 'はい',   rr: 'hai',   en: 'yes' },
      { kanji: '高い', kana: 'たかい', rr: 'takai', en: 'high / expensive' },
    ] },
  { id: 'ao', kana: 'あお', rr: 'a·o', ipa: 'a.o', kind: 'seq', from: 'a', to: 'o', held: null, lie: false, morae: 2,
    note: 'a·o, two clean beats. 青 a·o (blue); 顔 ka·o (face).',
    examples: [
      { kanji: '青',   kana: 'あお',   rr: 'ao',  en: 'blue' },
      { kanji: '青い', kana: 'あおい', rr: 'aoi', en: 'blue (adj.)' },
      { kanji: '顔',   kana: 'かお',   rr: 'kao', en: 'face' },
    ] },
  { id: 'oi', kana: 'おい', rr: 'o·i', ipa: 'o.i', kind: 'seq', from: 'o', to: 'i', held: null, lie: false, morae: 2,
    note: 'o·i, two morae — not the English "oy". 恋 ko·i; 美味しい is o·i·shi·i, four beats.',
    examples: [
      { kanji: '恋',       kana: 'こい',     rr: 'koi',    en: 'love (romantic)' },
      { kanji: '美味しい', kana: 'おいしい', rr: 'oishii', en: 'delicious' },
    ] },
  { id: 'ue', kana: 'うえ', rr: 'u·e', ipa: 'ɯ.e', kind: 'seq', from: 'u', to: 'e', held: null, lie: false, morae: 2,
    note: 'u·e, two beats. 上 u·e (above); 植える u·e·ru (to plant).',
    examples: [
      { kanji: '上',     kana: 'うえ',   rr: 'ue',   en: 'above / up' },
      { kanji: '植える', kana: 'うえる', rr: 'ueru', en: 'to plant' },
    ] },
  { id: 'ie', kana: 'いえ', rr: 'i·e', ipa: 'i.e', kind: 'seq', from: 'i', to: 'e', held: null, lie: false, morae: 2,
    note: 'i·e, two morae. 家 i·e (house). いいえ (no) stacks a long い in front: ī·e, three beats.',
    examples: [
      { kanji: '家', kana: 'いえ',   rr: 'ie',  en: 'house / home' },
      { kanji: '',  kana: 'いいえ', rr: 'iie', en: 'no' },
    ] },
]

/** The combination chip racks, grouped by what the pair DOES. Member ids
 *  resolve against VOWEL_COMBOS; the grouping itself is the lesson. */
export const COMBO_GROUPS = [
  { id: 'lie',     ja: '長音', l: 'the spellings that lie — held, not stepped', ids: ['ei', 'ou'] },
  { id: 'doubled', ja: '長音', l: 'doubled letters — one vowel, two beats',      ids: ['aa', 'ii', 'uu', 'ee', 'oo'] },
  { id: 'seq',     ja: '連母音', l: 'true sequences — two vowels, two morae',     ids: ['ai', 'ao', 'oi', 'ue', 'ie'] },
]

export const VOWEL_COMBO_LANTERN = {
  head: 'two vowels — held, or two beats?',
  body: 'When two vowels meet, Japanese does one of exactly two things, and the kana marks neither. It can <b>hold one vowel longer</b> — <b>えい</b> is [eː] and <b>おう</b> is [oː], the second letter a silent stretch (先生 = [seːseː], not se-n-se-i); the doubled spellings ああ・いい・うう・ええ・おお do the same in the open. And length is meaning: <b>おばさん</b> (aunt) vs <b>おばあさん</b> (grandmother) differ by one held beat. Or it keeps the two vowels <b>separate</b> — <b>あい</b> is a·i, <b>two morae</b>, never the single gliding [aɪ] of English "eye." That is the whole rule: Japanese has <b>no true diphthongs</b>. Every vowel you see is its own beat — <i>unless</i> the spelling is a long-vowel pattern, where the extra letter just buys time on the vowel before it.',
}

// =====================================================================
// Español — the compass's second overlay (the "for fun" comparison). Spanish
// is the other clean five-vowel system: a e i o u, all pure, no glides, no
// reduction — the same skeleton as Japanese. Four land almost on top; the one
// real gap is u, which Spanish ROUNDS [u] where Japanese keeps う unrounded
// [ɯ] — the very rounded back corner Korean splits off as ㅜ. Coordinates
// share the trapezoid geometry; `jp` is the Japanese vowel id it shadows,
// `gap:true` marks the one that does NOT line up.
// =====================================================================
export const SPANISH_VOWELS = [
  { id: 'a', letter: 'a', ipa: 'a', x: 0.36, y: 0.96, round: false, jp: 'a', gap: false, note: 'Spanish a [a] sits right on あ — a clean central open vowel in both.' },
  { id: 'e', letter: 'e', ipa: 'e', x: 0.13, y: 0.44, round: false, jp: 'e', gap: false, note: 'Spanish e [e] ≈ え, pure with no off-glide (opened a touch to [e̞] beside a stop, as in papel).' },
  { id: 'i', letter: 'i', ipa: 'i', x: 0.05, y: 0.07, round: false, jp: 'i', gap: false, note: 'Spanish i [i] = い. Identical close front vowel.' },
  { id: 'o', letter: 'o', ipa: 'o', x: 0.87, y: 0.45, round: true,  jp: 'o', gap: false, note: 'Spanish o [o] ≈ お — both lightly rounded, close-mid back.' },
  { id: 'u', letter: 'u', ipa: 'u', x: 0.97, y: 0.07, round: true,  jp: 'u', gap: true,  note: 'THE gap. Spanish u is firmly ROUNDED [u], lips pursed; Japanese う is [ɯ], lips flat. Spanish u lands exactly where Korean splits off rounded ㅜ.' },
]

export const SPANISH_COMPARE = {
  mark: 'Español',
  overview: 'Spanish is the other five clean vowels — a e i o u, all pure, no glides, no reduction to schwa — so four of them drop almost on top of Japanese.',
  gap: 'The one gap is u: Spanish rounds it [u], Japanese keeps う unrounded [ɯ]. And when vowels meet, Spanish freely builds true diphthongs (baile, peine, ciudad — two vowels gliding into one syllable) where Japanese gives each its own mora. Same five vowels, opposite habit.',
}

// =====================================================================
// 高低アクセント — pitch accent. Each mora carries a High or Low tone; the
// accent is the place where a High DROPS to Low. はし is the famous trio:
// same kana, three words, told apart by pitch (and, for two of them, only
// by the pitch of the particle that follows). Values are standard Tokyo.
// =====================================================================
export const ACCENT_TYPES = {
  heiban:    { ja: '平板', romaji: 'heiban',    en: 'flat',        note: 'No drop anywhere. Low on mora 1, up on mora 2, then high to the end — and the following particle stays high too. The unmarked default; most words are 平板.' },
  atamadaka: { ja: '頭高', romaji: 'atamadaka', en: 'head-high',   note: 'High on the FIRST mora, then it drops and stays down. The accent (the fall) is inside the word, right after mora 1.' },
  nakadaka:  { ja: '中高', romaji: 'nakadaka',  en: 'middle-high', note: 'Rises, then drops on a MIDDLE mora — the fall sits inside the word, neither on the first mora nor on the particle.' },
  odaka:     { ja: '尾高', romaji: 'odaka',     en: 'tail-high',   note: 'High all the way through the last mora — then the drop lands on the PARTICLE. Said alone it looks identical to 平板; only a following particle reveals the fall.' },
}

export const PITCH_WORDS = [
  { id: 'hashi-chop',  kanji: '箸', gloss: 'chopsticks', kana: ['は', 'し'],       pitch: ['H', 'L'],      particle: 'L', type: 'atamadaka', accentMora: 0,    pair: 'hashi', speak: 'はし' },
  { id: 'hashi-bridge',kanji: '橋', gloss: 'bridge',     kana: ['は', 'し'],       pitch: ['L', 'H'],      particle: 'L', type: 'odaka',     accentMora: 1,    pair: 'hashi', speak: 'はし' },
  { id: 'hashi-edge',  kanji: '端', gloss: 'edge',       kana: ['は', 'し'],       pitch: ['L', 'H'],      particle: 'H', type: 'heiban',    accentMora: null, pair: 'hashi', speak: 'はし' },
  { id: 'ame-rain',    kanji: '雨', gloss: 'rain',       kana: ['あ', 'め'],       pitch: ['H', 'L'],      particle: 'L', type: 'atamadaka', accentMora: 0,    pair: 'ame',   speak: 'あめ' },
  { id: 'ame-candy',   kanji: '飴', gloss: 'candy',      kana: ['あ', 'め'],       pitch: ['L', 'H'],      particle: 'H', type: 'heiban',    accentMora: null, pair: 'ame',   speak: 'あめ' },
  { id: 'okashi',      kanji: 'お菓子', gloss: 'sweets', kana: ['お', 'か', 'し'], pitch: ['L', 'H', 'L'], particle: 'L', type: 'nakadaka',  accentMora: 1,    pair: null,    speak: 'おかし' },
  { id: 'tamago',      kanji: '卵', gloss: 'egg',        kana: ['た', 'ま', 'ご'], pitch: ['L', 'H', 'H'], particle: 'H', type: 'heiban',    accentMora: null, pair: null,    speak: 'たまご' },
]

/** Minimal sets keyed by `pair` — the spelling-identical words pitch tells apart. */
export const PITCH_PAIRS = {
  hashi: { kana: 'はし', en: 'Spelled はし three ways over — pitch is the only thing that says which.' },
  ame:   { kana: 'あめ', en: 'あめ is 雨 (rain) falling or 飴 (candy) rising — same two kana.' },
}

/** The 한국어 bridge for the consonants — the reverse of the Korean folio's
 *  "Japanese gives you one k". Chosen by category in the mouth-map readout. */
export const CONSONANT_BRIDGE = {
  voicing: 'Japanese pairs consonants by VOICE — か [k] and が [ɡ] are different words. Korean does the opposite: voicing is automatic there (ㄱ is [k] to start a word, [ɡ] between vowels — one letter), and its real three-way split is by BREATH: plain ㄱ · aspirated ㅋ · tense ㄲ. The contrast Japanese carries, Korean ignores; the one Korean carries, Japanese lacks.',
  tap: 'ら is a single tap [ɾ] — and so is Korean ㄹ between vowels (아래 a-rae). The one consonant that crosses the bridge almost free.',
  moraic: 'Japanese folds every syllable-final nasal into one ん that takes the colour of the next sound. Korean keeps them apart as three distinct finals — ㄴ [n] · ㅁ [m] · ㅇ [ŋ] — that you must write and hear separately.',
  sonorant: 'Voiced by nature — like Korean’s nasals and ㄹ, it needs no special mark in either script.',
}

// =====================================================================
// Lantern notes — the eureka panels (markup goes through dangerouslySetInnerHTML,
// so <b>…</b> is allowed and matches the .lantern-note .body styling).
// =====================================================================
export const MOUTH_LANTERN = {
  head: 'the glyph is mute, but the system speaks',
  body: 'Unlike hangul, a kana’s <b>shape</b> tells you nothing about the mouth — か is not a picture of a velar stop. But the gojūon’s <b>order</b> is a phonetic chart (place × vowel), and the diacritics are genuinely <b>featural</b>: the dakuten <b>゛</b> means "voice this same place" (か[k]→が[ɡ], さ[s]→ざ[z]), and the handakuten <b>゜</b> marks the lone p-series (は→ぱ). The deep cut: only <b>obstruents</b> take ゛ — there is no ゛ on な/ま/ら/や/わ because a nasal or glide is <i>already voiced</i>; you can’t voice what’s voiced. And every row hides an allophone the kana won’t admit: <b>し</b>[ɕ], <b>ち</b>[tɕ], <b>つ</b>[ts], <b>ふ</b>[ɸ], <b>ひ</b>[ç] all change place or manner before い/う.',
}
export const VOWEL_LANTERN = {
  head: 'five clean vowels — and one is a trap',
  body: 'Japanese has just five, all short and pure (no English-style glides), which is the easy half. The trap is <b>う</b>: it is close and back like English "oo", but <b>unrounded</b> — the lips stay flat. Now run it the other way for Korean: lay the real trapezoid down and Korean splits this same vowel-space into <b>ten</b>. Where Japanese hears one back-high vowel, Korean separates unrounded <b>ㅡ</b> from rounded <b>ㅜ</b>; where Japanese hears one back-mid, Korean splits rounded <b>ㅗ</b> from unrounded <b>ㅓ</b>. Those two gaps — ㅡ/ㅜ and ㅗ/ㅓ — are exactly the vowels a Japanese ear must learn to <i>hear</i> before it can say them.',
}
export const PITCH_LANTERN = {
  head: 'the word the kana cannot write',
  body: '<b>はし</b> is two kana, one spelling — and three words: <b>箸</b> (chopsticks, falling は́し), <b>橋</b> (bridge, rising はし́), <b>端</b> (edge, rising and staying up). Kana records the morae perfectly and the <b>pitch</b> not at all; the melody is an invisible layer riding on top. Note the cruelty of 橋 vs 端 — identical until a particle follows, when 橋 drops (はし<span style="opacity:.6">が↓</span>) and 端 stays high. For the Korean bridge this is the clean inverse of the consonant story: Seoul Korean has <b>no</b> lexical pitch accent, so this whole dimension is one Japanese carries and Korean doesn’t — just as Korean’s three-way ㄱ/ㅋ/ㄲ is one Japanese lacks.',
}
