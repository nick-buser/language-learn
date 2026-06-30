// =====================================================================
// The Polyglot's Atlas — 한국어 · 소리 (phonetics: sound ↔ shape)
//
// The data behind the phonetics folio. Korean's special claim — the one
// no other living script can make — is that hangul is *featural*: the
// SHAPE of a letter is a diagram of how the mouth makes the SOUND. The
// 訓民正音 해례본 (Hunminjeongeum Haerye, 1446) says so outright. This
// module is the hand-checked map of those correspondences, and — just as
// honestly — of the places where the shape stops tracking the sound.
//
// Two systems, two logics:
//   • CONSONANTS are iconic of the ARTICULATOR. Five base letters each
//     draw one speech organ (ㄱ tongue-root, ㄴ tongue-tip, ㅁ lips,
//     ㅅ tooth, ㅇ throat); adding a stroke (가획) adds aspiration at the
//     same place; doubling (각자병서) adds tensing. Exceptions are flagged.
//   • VOWELS are compositional from three cosmic strokes — · (heaven),
//     ㅡ (earth), ㅣ (human). The dot's position encodes 음양 (yin-yang)
//     = vowel harmony (the verb forge's 아/어 fork); a doubled dot = a
//     y-glide; an added ㅣ = an i-offglide; horizontal+vertical = a
//     w-glide. The geometry is cosmological, NOT a literal tongue-map —
//     so each vowel ALSO carries its true IPA trapezoid coordinate, and
//     the instrument shows where shape and mouth rhyme and where they part.
//
// Romanization is Revised Romanization (project convention); IPA is the
// broad Seoul-standard phoneme, with common allophones noted. `speak` is a
// real syllable for the Web Speech seam (a consonant on neutral ㅡ → 그/느;
// a vowel on silent ㅇ → 아/어).
//
// SCHEMA — a preview of the future phonetics API payload; treat as a contract.
//
// @typedef {Object} Place           a traditional articulation class (오음)
// @property {string} id             velar|alveolar|labial|sibilant|glottal
// @property {string} hanja          牙音 / 舌音 / 脣音 / 齒音 / 喉音
// @property {string} ko             어금닛소리 …  (+rr)
// @property {string} en             "velar (soft palate)" …
// @property {string} region         sagittal-diagram region key (lit by the SVG)
// @property {string} organ          the moving/target organ, plain words
//
// @typedef {Object} Consonant
// @property {string} id, jamo, rr
// @property {string} ipa            broad phoneme; `ipaNote` for allophony
// @property {string} place          Place.id
// @property {string} manner         plosive|nasal|fricative|affricate|liquid
// @property {string} phon           plain|aspirate|tense|sonorant|silent
// @property {string} base           the base jamo this shape grows from
// @property {string} build          pictograph|stroke|doubling|variant|placeholder
// @property {number} rung           0 base · 1 plosive/affricate · 2 aspirate · -1 off-ladder
// @property {string} [origin]       the pictograph story (base letters only)
// @property {string} [deriv]        how this shape is built from its base
// @property {string} speak          TTS syllable
// @property {?string} exception     null, or why the shape↔sound rule bends here
//
// @typedef {Object} Vowel
// @property {string} id, jamo, rr
// @property {string} ipa
// @property {number} x              IPA trapezoid: 0 front … 1 back
// @property {number} y              IPA trapezoid: 0 close(high) … 1 open(low)
// @property {boolean} round
// @property {string} harmony        bright(양성) | dark(음성) | neutral(중성)
// @property {string} axis           vertical(ㅣ) | horizontal(ㅡ) | stroke(base)
// @property {string} rule           base | yinyang | yglide | ioffglide | wglide
// @property {string[]} parts        the jamo it is assembled from
// @property {string} build          prose: how the shape is drawn
// @property {string} speak
// @property {boolean} [mono]        a plotted monophthong (sits on the trapezoid)
// =====================================================================

/** 오음 — the five articulation classes, in the traditional 牙舌脣齒喉 order. */
export const PLACES = [
  { id: 'velar',    hanja: '牙音', ko: '어금닛소리 (eogeumnit-sori)', en: 'velar — soft palate',        region: 'velum',   organ: 'the back of the tongue against the soft palate' },
  { id: 'alveolar', hanja: '舌音', ko: '혓소리 (hyeot-sori)',         en: 'alveolar — the gum ridge',    region: 'ridge',   organ: 'the tongue tip against the ridge behind the teeth' },
  { id: 'labial',   hanja: '脣音', ko: '입술소리 (ipsul-sori)',       en: 'labial — the lips',           region: 'lips',    organ: 'the two lips, pressed and released' },
  { id: 'sibilant', hanja: '齒音', ko: '잇소리 (it-sori)',            en: 'dental / sibilant — the teeth', region: 'teeth', organ: 'air hissed past the teeth, tongue near the ridge' },
  { id: 'glottal',  hanja: '喉音', ko: '목구멍소리 (mokgumeong-sori)', en: 'glottal — the throat',        region: 'glottis', organ: 'the throat / vocal folds, open and breathy' },
]

/** 자음 — the 19 consonants, grouped under their base, with the iconic story. */
export const CONSONANTS = [
  // ── 牙 velar — base ㄱ ──────────────────────────────────────────────
  { id: 'g', jamo: 'ㄱ', rr: 'g/k', ipa: 'k', ipaNote: 'plain (lenis): [k] initially, voiced [ɡ] between vowels', place: 'velar', manner: 'plosive', phon: 'plain', base: 'ㄱ', build: 'pictograph', rung: 0, speak: '그',
    origin: 'ㄱ draws the root of the tongue humped up to block the throat — 象舌根閉喉之形. Look at the bend: that is the back of the tongue meeting the soft palate.', exception: null },
  { id: 'k', jamo: 'ㅋ', rr: 'k', ipa: 'kʰ', ipaNote: 'aspirated — a puff of breath on release', place: 'velar', manner: 'plosive', phon: 'aspirate', base: 'ㄱ', build: 'stroke', rung: 2, speak: '크',
    deriv: 'ㄱ + one stroke. Same velar place, the added stroke = added breath (가획). The sound grows stronger, the shape grows a line.', exception: null },
  { id: 'kk', jamo: 'ㄲ', rr: 'kk', ipa: 'k͈', ipaNote: 'tense (fortis) — stiff, unaspirated, raised pitch', place: 'velar', manner: 'plosive', phon: 'tense', base: 'ㄱ', build: 'doubling', rung: -1, speak: '끄',
    deriv: 'ㄱ doubled (각자병서). Doubling is a *different* rule from adding a stroke: it writes tensing, not aspiration.',
    exception: 'Tense series — the shape encodes strength by DOUBLING, not by the stroke-ladder, and these letters are not among the five organ-pictographs.' },

  // ── 舌 alveolar — base ㄴ ───────────────────────────────────────────
  { id: 'n', jamo: 'ㄴ', rr: 'n', ipa: 'n', ipaNote: 'nasal — voiced, air through the nose', place: 'alveolar', manner: 'nasal', phon: 'sonorant', base: 'ㄴ', build: 'pictograph', rung: 0, speak: '느',
    origin: 'ㄴ draws the tongue tip raised to touch the gum ridge — 象舌附上腭之形. The hook is the tongue tip up at the ridge behind the upper teeth.', exception: null },
  { id: 'd', jamo: 'ㄷ', rr: 'd/t', ipa: 't', ipaNote: 'plain (lenis): [t] initially, voiced [d] between vowels', place: 'alveolar', manner: 'plosive', phon: 'plain', base: 'ㄴ', build: 'stroke', rung: 1, speak: '드',
    deriv: 'ㄴ + a stroke across the top. Same tongue-tip place as ㄴ; closing it fully and releasing makes a stop.', exception: null },
  { id: 't', jamo: 'ㅌ', rr: 't', ipa: 'tʰ', ipaNote: 'aspirated', place: 'alveolar', manner: 'plosive', phon: 'aspirate', base: 'ㄴ', build: 'stroke', rung: 2, speak: '트',
    deriv: 'ㄷ + another stroke. The ladder of breath: ㄴ → ㄷ → ㅌ, one line per step, same place throughout.', exception: null },
  { id: 'tt', jamo: 'ㄸ', rr: 'tt', ipa: 't͈', ipaNote: 'tense (fortis)', place: 'alveolar', manner: 'plosive', phon: 'tense', base: 'ㄴ', build: 'doubling', rung: -1, speak: '뜨',
    deriv: 'ㄷ doubled — tensing by doubling.',
    exception: 'Tense series — strength written as DOUBLING, off the stroke-ladder.' },
  { id: 'r', jamo: 'ㄹ', rr: 'r/l', ipa: 'l', ipaNote: 'flap [ɾ] between vowels, lateral [l] in coda / doubled', place: 'alveolar', manner: 'liquid', phon: 'sonorant', base: 'ㄹ', build: 'variant', rung: -1, speak: '르',
    origin: 'ㄹ is a 半舌音 (half-lingual) and an 이체자 (variant letter): it pictures the tongue too, but it was drawn freely, outside the stroke system.',
    exception: 'The big consonant exception. The Haerye groups ㄹ with the tongue letters yet says the three variant letters "take no stroke-adding meaning" — ㄹ does not sit on the ㄴ→ㄷ→ㅌ ladder.' },

  // ── 脣 labial — base ㅁ ─────────────────────────────────────────────
  { id: 'm', jamo: 'ㅁ', rr: 'm', ipa: 'm', ipaNote: 'nasal — voiced, lips closed, air through the nose', place: 'labial', manner: 'nasal', phon: 'sonorant', base: 'ㅁ', build: 'pictograph', rung: 0, speak: '므',
    origin: 'ㅁ draws the mouth itself — 象口形. The square is the closed lips seen head-on.', exception: null },
  { id: 'b', jamo: 'ㅂ', rr: 'b/p', ipa: 'p', ipaNote: 'plain (lenis): [p] initially, voiced [b] between vowels', place: 'labial', manner: 'plosive', phon: 'plain', base: 'ㅁ', build: 'stroke', rung: 1, speak: '브',
    deriv: 'ㅁ + two upstrokes. Same lips as ㅁ; pressing them shut and bursting them open makes a stop.', exception: null },
  { id: 'p', jamo: 'ㅍ', rr: 'p', ipa: 'pʰ', ipaNote: 'aspirated', place: 'labial', manner: 'plosive', phon: 'aspirate', base: 'ㅁ', build: 'stroke', rung: 2, speak: '프',
    deriv: 'The aspirate of the lip series — ㅁ → ㅂ → ㅍ, breath added with the strokes.', exception: null },
  { id: 'pp', jamo: 'ㅃ', rr: 'pp', ipa: 'p͈', ipaNote: 'tense (fortis)', place: 'labial', manner: 'plosive', phon: 'tense', base: 'ㅁ', build: 'doubling', rung: -1, speak: '쁘',
    deriv: 'ㅂ doubled — tensing by doubling.',
    exception: 'Tense series — DOUBLING, off the ladder.' },

  // ── 齒 sibilant — base ㅅ ───────────────────────────────────────────
  { id: 's', jamo: 'ㅅ', rr: 's', ipa: 's', ipaNote: 'fricative; palatalized [ɕ] before /i, j/ (시 = shi)', place: 'sibilant', manner: 'fricative', phon: 'plain', base: 'ㅅ', build: 'pictograph', rung: 0, speak: '스',
    origin: 'ㅅ draws a tooth — 象齒形. The point is the incisor; the sound is air hissed past it.', exception: null },
  { id: 'j', jamo: 'ㅈ', rr: 'j', ipa: 'tɕ', ipaNote: 'affricate; voiced [dʑ] between vowels', place: 'sibilant', manner: 'affricate', phon: 'plain', base: 'ㅅ', build: 'stroke', rung: 1, speak: '즈',
    deriv: 'ㅅ + a stroke on top. A stop-then-hiss at the same place — an affricate.', exception: null },
  { id: 'ch', jamo: 'ㅊ', rr: 'ch', ipa: 'tɕʰ', ipaNote: 'aspirated affricate', place: 'sibilant', manner: 'affricate', phon: 'aspirate', base: 'ㅅ', build: 'stroke', rung: 2, speak: '츠',
    deriv: 'ㅈ + a stroke — the aspirate of the tooth series, ㅅ → ㅈ → ㅊ.', exception: null },
  { id: 'ss', jamo: 'ㅆ', rr: 'ss', ipa: 's͈', ipaNote: 'tense fricative', place: 'sibilant', manner: 'fricative', phon: 'tense', base: 'ㅅ', build: 'doubling', rung: -1, speak: '쓰',
    deriv: 'ㅅ doubled — tensing by doubling.',
    exception: 'Tense series — DOUBLING, off the ladder.' },
  { id: 'jj', jamo: 'ㅉ', rr: 'jj', ipa: 't͈ɕ', ipaNote: 'tense affricate', place: 'sibilant', manner: 'affricate', phon: 'tense', base: 'ㅅ', build: 'doubling', rung: -1, speak: '쯔',
    deriv: 'ㅈ doubled — tensing by doubling.',
    exception: 'Tense series — DOUBLING, off the ladder.' },

  // ── 喉 glottal — base ㅇ ────────────────────────────────────────────
  { id: 'ng', jamo: 'ㅇ', rr: '–/ng', ipa: 'ŋ', ipaNote: 'SILENT as an initial (a zero onset); [ŋ] only as a 받침 final (강)', place: 'glottal', manner: 'nasal', phon: 'silent', base: 'ㅇ', build: 'pictograph', rung: 0, speak: '으',
    origin: 'ㅇ draws the round throat — 象喉形. The circle is the open glottis.',
    exception: 'A double life. The throat-circle truthfully pictures its [ŋ] sound (the final in 강), but as a syllable-initial ㅇ is a silent placeholder — a seat the vowel needs, with no sound for the shape to depict.' },
  { id: 'h', jamo: 'ㅎ', rr: 'h', ipa: 'h', ipaNote: 'fricative; weakens/drops between voiced sounds', place: 'glottal', manner: 'fricative', phon: 'aspirate', base: 'ㅇ', build: 'stroke', rung: 2, speak: '흐',
    deriv: 'The throat series climbed by strokes — ㅇ → ㆆ → ㅎ (the middle rung is now obsolete). The breath of [h] is the glottis itself.', exception: null },
]

/**
 * The stroke-ladder, as the consonant instrument lays it out: one row per
 * organ (base order), columns = base → plosive/affricate → aspirate, plus a
 * tense bin off to the side. Built from CONSONANTS so it can't drift.
 */
export const CONSONANT_LADDER = PLACES.map(p => {
  const here = CONSONANTS.filter(c => c.place === p.id)
  return {
    place: p.id,
    base:    here.find(c => c.rung === 0) || null,
    plosive: here.find(c => c.rung === 1) || null,   // ㄷ/ㅂ/ㅈ (velar/glottal have none)
    aspirate:here.find(c => c.rung === 2) || null,
    tense:   here.filter(c => c.phon === 'tense'),
    variant: here.filter(c => c.build === 'variant'),
  }
})

// =====================================================================
// 모음 — the vowels. x,y are schematic IPA-trapezoid coordinates
// (0 front … 1 back, 0 close/high … 1 open/low). The basics first, plotted
// as monophthongs; then the y-glides, the i-offglide set, and the w-glides.
// =====================================================================
export const VOWELS = [
  // ── the three cosmic strokes (two are also vowels) ─────────────────
  { id: 'i',  jamo: 'ㅣ', rr: 'i',  ipa: 'i',  x: 0.04, y: 0.05, round: false, harmony: 'neutral', axis: 'vertical',   rule: 'base', parts: ['ㅣ'], mono: true,  speak: '이',
    build: 'ㅣ — the Human stroke standing upright (人). One of the three roots; also the vowel [i].' },
  { id: 'eu', jamo: 'ㅡ', rr: 'eu', ipa: 'ɯ',  x: 0.82, y: 0.07, round: false, harmony: 'neutral', axis: 'horizontal', rule: 'base', parts: ['ㅡ'], mono: true,  speak: '으',
    build: 'ㅡ — the Earth stroke lying flat (地). A root and the vowel [ɯ]: high, back, unrounded — the "neutral" filler vowel.' },
  { id: 'arae', jamo: '·', rr: '(ɒ)', ipa: '(ɒ)', x: 0.5, y: 0.6, round: false, harmony: 'bright', axis: 'stroke', rule: 'base', parts: ['·'], mono: false, speak: '',
    build: '· — the Heaven dot (天), round like the sky. The 아래아: now retired as a letter, but it is the dot that builds every other vowel.' },

  // ── the basic monophthongs: a dot on an axis ───────────────────────
  { id: 'a',  jamo: 'ㅏ', rr: 'a',  ipa: 'a',  x: 0.30, y: 0.95, round: false, harmony: 'bright', axis: 'vertical',   rule: 'yinyang', parts: ['ㅣ', '·'], mono: true, speak: '아',
    build: 'ㅣ + a dot to the RIGHT. The dot is outside/sunward → 양성 (bright). Vertical axis → the vowel sits to the right of the initial.' },
  { id: 'eo', jamo: 'ㅓ', rr: 'eo', ipa: 'ʌ',  x: 0.78, y: 0.62, round: false, harmony: 'dark',   axis: 'vertical',   rule: 'yinyang', parts: ['ㅣ', '·'], mono: true, speak: '어',
    build: 'ㅣ + a dot to the LEFT. The dot is inside/shadeward → 음성 (dark). The yin twin of ㅏ on the same vertical axis.' },
  { id: 'o',  jamo: 'ㅗ', rr: 'o',  ipa: 'o',  x: 0.94, y: 0.36, round: true,  harmony: 'bright', axis: 'horizontal', rule: 'yinyang', parts: ['ㅡ', '·'], mono: true, speak: '오',
    build: 'ㅡ + a dot ABOVE. Dot above the earth → 양성 (bright). Horizontal axis → the vowel sits *under* the initial.' },
  { id: 'u',  jamo: 'ㅜ', rr: 'u',  ipa: 'u',  x: 0.96, y: 0.06, round: true,  harmony: 'dark',   axis: 'horizontal', rule: 'yinyang', parts: ['ㅡ', '·'], mono: true, speak: '우',
    build: 'ㅡ + a dot BELOW. Dot below the earth → 음성 (dark). The yin twin of ㅗ.' },

  // ── the front pair (historically i-offglides, now monophthongs) ────
  { id: 'ae', jamo: 'ㅐ', rr: 'ae', ipa: 'ɛ',  x: 0.12, y: 0.62, round: false, harmony: 'bright', axis: 'vertical', rule: 'ioffglide', parts: ['ㅏ', 'ㅣ'], mono: true, speak: '애',
    build: 'ㅏ + ㅣ. Once the diphthong [aj]; it fronted and flattened into the monophthong [ɛ]. The ㅣ on the right is the fossil of that lost off-glide.' },
  { id: 'e',  jamo: 'ㅔ', rr: 'e',  ipa: 'e',  x: 0.07, y: 0.36, round: false, harmony: 'dark',   axis: 'vertical', rule: 'ioffglide', parts: ['ㅓ', 'ㅣ'], mono: true, speak: '에',
    build: 'ㅓ + ㅣ. Once [əj], now [e]. ㅐ vs ㅔ are merging to one mid-front vowel for most younger Seoul speakers.' },

  // ── the y-glides: double the dot ───────────────────────────────────
  { id: 'ya',  jamo: 'ㅑ', rr: 'ya',  ipa: 'ja',  x: 0.30, y: 0.95, round: false, harmony: 'bright', axis: 'vertical',   rule: 'yglide', parts: ['ㅏ', '·'], mono: false, speak: '야',
    build: 'ㅏ with a SECOND dot. A doubled dot = a y- on-glide: ㅏ [a] → ㅑ [ja]. Same vowel, a /j/ bolted on the front.' },
  { id: 'yeo', jamo: 'ㅕ', rr: 'yeo', ipa: 'jʌ',  x: 0.78, y: 0.62, round: false, harmony: 'dark',   axis: 'vertical',   rule: 'yglide', parts: ['ㅓ', '·'], mono: false, speak: '여',
    build: 'ㅓ + a second dot → ㅕ [jʌ]. The dark-side y-glide.' },
  { id: 'yo',  jamo: 'ㅛ', rr: 'yo',  ipa: 'jo',  x: 0.94, y: 0.36, round: true,  harmony: 'bright', axis: 'horizontal', rule: 'yglide', parts: ['ㅗ', '·'], mono: false, speak: '요',
    build: 'ㅗ + a second dot → ㅛ [jo]. On the horizontal axis the extra dot stacks above.' },
  { id: 'yu',  jamo: 'ㅠ', rr: 'yu',  ipa: 'ju',  x: 0.96, y: 0.06, round: true,  harmony: 'dark',   axis: 'horizontal', rule: 'yglide', parts: ['ㅜ', '·'], mono: false, speak: '유',
    build: 'ㅜ + a second dot → ㅠ [ju]. The cleanest rule in the script: one extra dot, one /j/.' },
  { id: 'yae', jamo: 'ㅒ', rr: 'yae', ipa: 'jɛ',  x: 0.12, y: 0.62, round: false, harmony: 'bright', axis: 'vertical', rule: 'yglide', parts: ['ㅑ', 'ㅣ'], mono: false, speak: '얘',
    build: 'ㅐ + the y-glide (ㅑ + ㅣ) → ㅒ [jɛ]. Rare.' },
  { id: 'ye',  jamo: 'ㅖ', rr: 'ye',  ipa: 'je',  x: 0.07, y: 0.36, round: false, harmony: 'dark',  axis: 'vertical', rule: 'yglide', parts: ['ㅕ', 'ㅣ'], mono: false, speak: '예',
    build: 'ㅔ + the y-glide → ㅖ [je].' },

  // ── the w-glides: a rounded horizontal vowel onto a vertical one ───
  { id: 'wa',  jamo: 'ㅘ', rr: 'wa',  ipa: 'wa',  x: 0.30, y: 0.95, round: true, harmony: 'bright', axis: 'horizontal', rule: 'wglide', parts: ['ㅗ', 'ㅏ'], mono: false, speak: '와',
    build: 'ㅗ + ㅏ. A rounded vowel (ㅗ) glides into an open one: [o]→[a] becomes the on-glide [wa]. Bright + bright — harmony lets them combine.' },
  { id: 'wo',  jamo: 'ㅝ', rr: 'wo',  ipa: 'wʌ',  x: 0.78, y: 0.62, round: true, harmony: 'dark',  axis: 'horizontal', rule: 'wglide', parts: ['ㅜ', 'ㅓ'], mono: false, speak: '워',
    build: 'ㅜ + ㅓ → [wʌ]. Dark + dark. The harmony classes pair like with like: ㅗ goes with ㅏ, ㅜ goes with ㅓ.' },
  { id: 'oe',  jamo: 'ㅚ', rr: 'oe',  ipa: 'ø',   x: 0.55, y: 0.36, round: true, harmony: 'bright', axis: 'horizontal', rule: 'wglide', parts: ['ㅗ', 'ㅣ'], mono: true, speak: '외',
    build: 'ㅗ + ㅣ. Conservatively the front rounded monophthong [ø]; now usually said [we].' },
  { id: 'wi',  jamo: 'ㅟ', rr: 'wi',  ipa: 'y',   x: 0.30, y: 0.06, round: true, harmony: 'dark',  axis: 'horizontal', rule: 'wglide', parts: ['ㅜ', 'ㅣ'], mono: true, speak: '위',
    build: 'ㅜ + ㅣ. Conservatively the front rounded [y]; now usually [wi].' },
  { id: 'wae', jamo: 'ㅙ', rr: 'wae', ipa: 'wɛ',  x: 0.12, y: 0.62, round: true, harmony: 'bright', axis: 'horizontal', rule: 'wglide', parts: ['ㅗ', 'ㅐ'], mono: false, speak: '왜',
    build: 'ㅗ + ㅐ → [wɛ]. ㅙ/ㅚ/ㅞ have nearly merged to one [we] for most speakers.' },
  { id: 'we',  jamo: 'ㅞ', rr: 'we',  ipa: 'we',  x: 0.07, y: 0.36, round: true, harmony: 'dark',  axis: 'horizontal', rule: 'wglide', parts: ['ㅜ', 'ㅔ'], mono: false, speak: '웨',
    build: 'ㅜ + ㅔ → [we].' },
  { id: 'ui',  jamo: 'ㅢ', rr: 'ui',  ipa: 'ɰi',  x: 0.82, y: 0.07, round: false, harmony: 'neutral', axis: 'horizontal', rule: 'ioffglide', parts: ['ㅡ', 'ㅣ'], mono: false, speak: '의',
    build: 'ㅡ + ㅣ → [ɯj]. The one true on-the-page diphthong left; said [i] in many positions, [e] in the possessive 의.' },
]

/** The eight basic vowels, in the order the compass introduces them. */
export const VOWEL_BASICS = ['i', 'eu', 'a', 'eo', 'o', 'u', 'ae', 'e']

/** Harmony classes — the bridge to the verb forge's 아/어 fork. */
export const HARMONY = {
  bright: { ko: '양성모음', rr: 'yangseong', en: 'bright / yang', takes: '-아', note: 'Stems whose last vowel is ㅏ or ㅗ take the bright ending -아(요).' },
  dark:   { ko: '음성모음', rr: 'eumseong',  en: 'dark / yin',    takes: '-어', note: 'Every other vowel is dark and takes -어(요).' },
  neutral:{ ko: '중성모음', rr: 'jungseong', en: 'neutral',       takes: '—',   note: 'ㅣ and ㅡ sit outside the pairing.' },
}

// =====================================================================
// 발성 — the live-voice view: the learner's own vowel, measured off the mic
// and dropped onto the SAME trapezoid the ideal ten sit on. Formants are
// speaker-relative, so the dot is anchored to your voice first: say the three
// corner vowels (the calibration walk) and an affine fit pins your vowel space
// onto the frame. The mic + fit live in the formants seam; the state machine in
// useVoiceCompass; this is just the copy + the three anchors. UI strings mirror
// the Japanese 発声 view so the shared <VoiceReadout> reads them unchanged.
// =====================================================================
export const VOICE_CALIBRATION = {
  // The three EXTREME corners — non-collinear on the trapezoid, so three
  // measured points fix the affine map exactly: ㅣ (front, close), ㅏ (open,
  // low), ㅜ (back, close, rounded). Targets (x,y) are read from VOWELS by id.
  // Anchoring the back corner on rounded ㅜ is deliberate: then unrounded ㅡ
  // reads a touch more FRONT (higher F2) — exactly the 5→10 split this folio
  // teaches — instead of the two collapsing.
  anchors: [
    { vowel: 'i', say: 'a long, bright “이—” — tongue high and forward, lips spread' },
    { vowel: 'a', say: 'an open “아—” — jaw dropped, tongue low and slack' },
    { vowel: 'u', say: 'a rounded “우—” — tongue high and back, lips pushed forward and pursed' },
  ],
  intro: 'The dot means nothing until the compass learns YOUR voice — the same vowel sits at very different frequencies for a low voice and a high one. Say the three corner vowels once and it pins your vowel space onto the trapezoid.',
  calibrate: 'calibrate to my voice',
  hold: 'hold it steady for about a second, then pause',
  done: 'Calibrated to your voice. Say any vowel now and watch where it lands among the ten.',
  recalibrate: 'recalibrate',
  needCal: 'Calibrate first so the dot lands in the right place.',
  noMic: 'No microphone available here — the chart and the geometry work; the live dot needs mic access over a secure (https / localhost) connection.',
  listen: 'listen',
  stop: 'stop',
  listening: 'listening — say a vowel',
  // Set expectations up front: round one rides a lightweight in-browser formant
  // detector, which is rough. Honest about the limits, never down on the learner.
  disclaimer: 'Rough edges. This first pass rides a lightweight in-browser formant detector, so the dot drifts, the close vowels (ㅣ/ㅡ/ㅜ) can blur, and ㅐ/ㅔ are hard to catch. Read it as a playful compass, not a verdict on your mouth — proper, reliable vowel coaching wants its own voice lab, which is a someday project.',
  qualityLabel: 'calibration',
  quality: {
    strong: 'Your three corners came out well separated — the compass can place a vowel confidently.',
    fair: 'Two of your vowels landed fairly close, so telling those two apart is a little sensitive — readings near that edge may wander.',
    weak: 'Two vowels came out nearly on top of each other, so the compass can barely separate them. This is usually the microphone or the formant detection, not your pronunciation — recalibrating, exaggerating the vowels, or a better mic tends to help.',
  },
  closest: 'closest pair',
}

// =====================================================================
// Lantern notes — the eureka panels (markup goes through dangerouslySetInnerHTML,
// so <b>…</b> is allowed and matches the .lantern-note .body styling).
// =====================================================================
export const CONSONANT_LANTERN = {
  head: 'the script is an anatomy chart',
  body: 'Five letters, five organs: <b>ㄱ</b> the tongue-root at the throat, <b>ㄴ</b> the tongue-tip at the ridge, <b>ㅁ</b> the lips, <b>ㅅ</b> the tooth, <b>ㅇ</b> the throat. Then the rule that makes hangul <b>featural</b>: a louder, breathier sound gets <b>one more stroke</b> at the same place (ㄱ→ㅋ, ㄷ→ㅌ, ㅂ→ㅍ, ㅈ→ㅊ). No other living script draws the mouth like this — kana and the alphabet are arbitrary by comparison. The exceptions prove the design was deliberate: <b>ㄹ</b> is a hand-drawn variant off the ladder, the <b>tense</b> letters double instead of adding a stroke, and initial <b>ㅇ</b> is a silent seat.',
}
export const VOWEL_LANTERN = {
  head: 'the dot is not a tongue — it is the sky',
  body: 'Tempting to read ㅏ/ㅓ/ㅗ/ㅜ as a tongue-position map (front/back/up/down). It is not. The dot\'s side encodes <b>음양 (yin-yang)</b>, not height: dot out/up = <b>bright</b> (ㅏ ㅗ), dot in/down = <b>dark</b> (ㅓ ㅜ). That split <i>is</i> Korean <b>vowel harmony</b> — the very 아/어 fork the verb forge runs on. What the geometry <i>does</i> encode cleanly is composition: a <b>doubled dot</b> = a y-glide (ㅏ→ㅑ), an added <b>ㅣ</b> = the front vowels ㅐ/ㅔ, and a rounded horizontal vowel on a vertical one = a <b>w-glide</b> (ㅗ+ㅏ=ㅘ). Lay the real IPA trapezoid underneath and you can see exactly where shape and mouth rhyme — and where they politely part ways.',
}
export const VOICE_LANTERN = {
  head: 'the trapezoid was never a diagram — it’s a map of your own mouth',
  body: 'The frame you’ve been reading is a plot of two resonances of your vocal tract. <b>F1</b> rises as your jaw drops, so it falls down the page from close to open; <b>F2</b> rises as your tongue comes forward, so it runs front-to-back across it. When your dot lands on a vowel, that’s your mouth and the ideal sharing the same two numbers. Now make the script’s hardest claim audible — the back vowels Korean splits where a Japanese ear hears one. Say <b>ㅡ</b> then <b>ㅜ</b>: same height, but <i>rounding</i> your lips drops F2 and the dot slides back. Say <b>ㅓ</b> then <b>ㅗ</b> for the other unrounded/rounded back pair. Four back vowels, four different landing spots — the very gaps (ㅡ/ㅜ, ㅓ/ㅗ) the <a href="#/ja/phonetics">仮名 reader</a> must learn to <i>hear</i>. The dot doesn’t lie about your lips: round, and watch it move.',
}
