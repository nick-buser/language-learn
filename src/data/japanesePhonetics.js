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
