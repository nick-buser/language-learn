// =====================================================================
// The Polyglot's Atlas — 한국어 · 한글 (the jamo + the block)
//
// The data behind the hangul forge: the 자모 (jamo — consonants + vowels)
// with Revised Romanization and a voiceable CV exemplar each, the 초성/중성/
// 받침 inventories the block builder assembles, the tap-pad layout for the
// keyboardless IME, and a hand-checked Korean loanword list. Data only.
//
// Korean always carries hangul + RR (project convention). A consonant's
// `speak` is its plain sound on the neutral ㅡ (그, 느, 드…) so the browser
// voice has something real to say; a vowel's is its ㅇ-filler block (아, 어…).
//
// @typedef {Object} Jamo
// @property {string} id, jamo, rr
// @property {string} speak   a real syllable for TTS
// @property {string} kind    plain|aspirate|tense (consonants) · basic|y|e|w (vowels)
//
// @typedef {Object} TranslitWord  { id, en, script, romaji, rule, note }
//   romaji here is the IME *input* (RR-keyed: g=ㄱ, k=ㅋ, ng=받침 ㅇ).
// =====================================================================

/** 자음 — the 19 consonants. */
export const CONSONANTS = [
  { id: 'g', jamo: 'ㄱ', rr: 'g/k', speak: '그', kind: 'plain' },
  { id: 'n', jamo: 'ㄴ', rr: 'n', speak: '느', kind: 'plain' },
  { id: 'd', jamo: 'ㄷ', rr: 'd/t', speak: '드', kind: 'plain' },
  { id: 'r', jamo: 'ㄹ', rr: 'r/l', speak: '르', kind: 'plain' },
  { id: 'm', jamo: 'ㅁ', rr: 'm', speak: '므', kind: 'plain' },
  { id: 'b', jamo: 'ㅂ', rr: 'b/p', speak: '브', kind: 'plain' },
  { id: 's', jamo: 'ㅅ', rr: 's', speak: '스', kind: 'plain' },
  { id: 'ng', jamo: 'ㅇ', rr: '–/ng', speak: '으', kind: 'plain' },
  { id: 'j', jamo: 'ㅈ', rr: 'j', speak: '즈', kind: 'plain' },
  { id: 'h', jamo: 'ㅎ', rr: 'h', speak: '흐', kind: 'plain' },
  { id: 'k', jamo: 'ㅋ', rr: 'k', speak: '크', kind: 'aspirate' },
  { id: 't', jamo: 'ㅌ', rr: 't', speak: '트', kind: 'aspirate' },
  { id: 'p', jamo: 'ㅍ', rr: 'p', speak: '프', kind: 'aspirate' },
  { id: 'ch', jamo: 'ㅊ', rr: 'ch', speak: '츠', kind: 'aspirate' },
  { id: 'kk', jamo: 'ㄲ', rr: 'kk', speak: '끄', kind: 'tense' },
  { id: 'tt', jamo: 'ㄸ', rr: 'tt', speak: '뜨', kind: 'tense' },
  { id: 'pp', jamo: 'ㅃ', rr: 'pp', speak: '쁘', kind: 'tense' },
  { id: 'ss', jamo: 'ㅆ', rr: 'ss', speak: '쓰', kind: 'tense' },
  { id: 'jj', jamo: 'ㅉ', rr: 'jj', speak: '쯔', kind: 'tense' },
]

/** 모음 — the 21 vowels. */
export const VOWELS = [
  { id: 'a', jamo: 'ㅏ', rr: 'a', speak: '아', kind: 'basic' },
  { id: 'eo', jamo: 'ㅓ', rr: 'eo', speak: '어', kind: 'basic' },
  { id: 'o', jamo: 'ㅗ', rr: 'o', speak: '오', kind: 'basic' },
  { id: 'u', jamo: 'ㅜ', rr: 'u', speak: '우', kind: 'basic' },
  { id: 'eu', jamo: 'ㅡ', rr: 'eu', speak: '으', kind: 'basic' },
  { id: 'i', jamo: 'ㅣ', rr: 'i', speak: '이', kind: 'basic' },
  { id: 'ya', jamo: 'ㅑ', rr: 'ya', speak: '야', kind: 'y' },
  { id: 'yeo', jamo: 'ㅕ', rr: 'yeo', speak: '여', kind: 'y' },
  { id: 'yo', jamo: 'ㅛ', rr: 'yo', speak: '요', kind: 'y' },
  { id: 'yu', jamo: 'ㅠ', rr: 'yu', speak: '유', kind: 'y' },
  { id: 'ae', jamo: 'ㅐ', rr: 'ae', speak: '애', kind: 'e' },
  { id: 'e', jamo: 'ㅔ', rr: 'e', speak: '에', kind: 'e' },
  { id: 'yae', jamo: 'ㅒ', rr: 'yae', speak: '얘', kind: 'e' },
  { id: 'ye', jamo: 'ㅖ', rr: 'ye', speak: '예', kind: 'e' },
  { id: 'wa', jamo: 'ㅘ', rr: 'wa', speak: '와', kind: 'w' },
  { id: 'wo', jamo: 'ㅝ', rr: 'wo', speak: '워', kind: 'w' },
  { id: 'oe', jamo: 'ㅚ', rr: 'oe', speak: '외', kind: 'w' },
  { id: 'wi', jamo: 'ㅟ', rr: 'wi', speak: '위', kind: 'w' },
  { id: 'wae', jamo: 'ㅙ', rr: 'wae', speak: '왜', kind: 'w' },
  { id: 'we', jamo: 'ㅞ', rr: 'we', speak: '웨', kind: 'w' },
  { id: 'ui', jamo: 'ㅢ', rr: 'ui', speak: '의', kind: 'w' },
]

// ---- the block builder's three inventories ----
export const INITIALS = CONSONANTS.map(c => ({ jamo: c.jamo, rr: c.id === 'ng' ? '–' : c.rr.split('/')[0], kind: c.kind }))
export const MEDIALS = VOWELS.map(v => ({ jamo: v.jamo, rr: v.rr, kind: v.kind }))
// 받침 — none + the single-consonant finals, each with its neutralized batchim sound.
export const FINALS = [
  { jamo: '', rr: '–', sound: 'open' },
  { jamo: 'ㄱ', rr: 'k' }, { jamo: 'ㄴ', rr: 'n' }, { jamo: 'ㄷ', rr: 't' }, { jamo: 'ㄹ', rr: 'l' },
  { jamo: 'ㅁ', rr: 'm' }, { jamo: 'ㅂ', rr: 'p' }, { jamo: 'ㅇ', rr: 'ng' }, { jamo: 'ㅅ', rr: 't' },
  { jamo: 'ㅈ', rr: 't' }, { jamo: 'ㅊ', rr: 't' }, { jamo: 'ㅋ', rr: 'k' }, { jamo: 'ㅌ', rr: 't' },
  { jamo: 'ㅍ', rr: 'p' }, { jamo: 'ㅎ', rr: 't' }, { jamo: 'ㄲ', rr: 'k' }, { jamo: 'ㅆ', rr: 't' },
]
// The seven representative 받침 sounds — every final neutralizes to one of these.
export const BATCHIM_SEVEN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ']

/** A few syllables to load into the builder, to show the parts assembling. */
export const BUILDER_PRESETS = [
  { block: '가', L: 'ㄱ', V: 'ㅏ', T: '' },
  { block: '한', L: 'ㅎ', V: 'ㅏ', T: 'ㄴ' },
  { block: '글', L: 'ㄱ', V: 'ㅡ', T: 'ㄹ' },
  { block: '밥', L: 'ㅂ', V: 'ㅏ', T: 'ㅂ' },
  { block: '책', L: 'ㅊ', V: 'ㅐ', T: 'ㄱ' },
  { block: '꽃', L: 'ㄲ', V: 'ㅗ', T: 'ㅊ' },
  { block: '집', L: 'ㅈ', V: 'ㅣ', T: 'ㅂ' },
]

// ---- derivations: drill pool + groups ----
const toGlyph = j => ({ id: `${j.kind}-${j.id}`, glyph: j.jamo, rr: j.rr, speak: j.speak, group: j.kind })

/** Every drillable jamo (consonants + vowels). */
export function hangulGlyphs() {
  return [...CONSONANTS, ...VOWELS].map(toGlyph)
}

/** Drill scopes by jamo family. */
export function hangulGroups() {
  const ids = (list, kinds) => list.filter(j => kinds.includes(j.kind)).map(j => `${j.kind}-${j.id}`)
  return [
    { id: 'cons-plain', label: '자음 기본 plain', ids: ids(CONSONANTS, ['plain']) },
    { id: 'cons-hard', label: '격음·경음 aspirate/tense', ids: ids(CONSONANTS, ['aspirate', 'tense']) },
    { id: 'vowel-basic', label: '모음 기본 basic', ids: ids(VOWELS, ['basic']) },
    { id: 'vowel-comp', label: '모음 복합 y/w', ids: ids(VOWELS, ['y', 'e', 'w']) },
  ]
}

/** The IME tap pad — every jamo as a key (the automaton composes them). */
export function hangulKeyboard() {
  const k = list => list.map(j => ({ token: j.jamo, key: j.jamo }))
  const plain = CONSONANTS.filter(c => c.kind === 'plain')
  const hard = CONSONANTS.filter(c => c.kind !== 'plain')
  const basic = VOWELS.filter(v => v.kind === 'basic' || v.kind === 'y')
  const rest = VOWELS.filter(v => v.kind === 'e' || v.kind === 'w')
  return {
    label: '자모 pad',
    rows: [k(plain), k(hard), k(basic), k(rest)],
  }
}

// =====================================================================
// The transliteration bench — Korean loanwords (외래어), hand-checked.
// romaji is the IME input (verified to round-trip through ime.js).
// =====================================================================
export const KOREAN_WORDS = [
  { id: 'coffee', en: 'coffee', script: '커피', romaji: 'keopi', rule: 'no f → ㅍ', note: 'Korean has no “f” — it lands on ㅍ(p). Both syllables stay open (no 받침).' },
  { id: 'icecream', en: 'ice cream', script: '아이스크림', romaji: 'aiseukeurim', rule: 'echo ㅡ', note: 'A consonant that can’t close a block gets the neutral vowel ㅡ — 스, 크 — and a vowel-initial syllable takes a silent ㅇ (아, 이).' },
  { id: 'mcdonalds', en: "McDonald's", script: '맥도날드', romaji: 'maegdonaldeu', rule: 'echo ㅡ on stops', note: 'A final “d” that won’t fit becomes its own block with an echo ㅡ → 드.' },
  { id: 'banana', en: 'banana', script: '바나나', romaji: 'banana', rule: 'open CV', note: 'Clean consonant-vowel syllables, no 받침 — the migration ㄴ→next-초성 is exactly how the IME builds it.' },
  { id: 'taxi', en: 'taxi', script: '택시', romaji: 'taegsi', rule: '받침 ㄱ + ㅅ', note: 'The “x” splits across a syllable boundary: ㄱ closes 택, ㅅ opens 시.' },
  { id: 'bus', en: 'bus', script: '버스', romaji: 'beoseu', rule: 'echo ㅡ', note: 'Final “s” can’t stand alone in English’s sense here, so it opens its own block with ㅡ → 스.' },
  { id: 'computer', en: 'computer', script: '컴퓨터', romaji: 'keompyuteo', rule: 'ㅁ받침 + ㅠ glide', note: '“com” closes with ㅁ받침 → 컴; “pu” rides the ㅠ glide → 퓨; “-ter” → 터.' },
  { id: 'hamburger', en: 'hamburger', script: '햄버거', romaji: 'haembeogeo', rule: 'ㅁ받침', note: '“ham” → 햄 (ㅁ받침), then 버 + 거 — the English “r” just colours the vowel, it doesn’t surface.' },
  { id: 'chocolate', en: 'chocolate', script: '초콜릿', romaji: 'chokollis', rule: '받침 ㅅ (t-sound)', note: 'The double “l” splits ㄹ받침 / ㄹ초성 (콜·리), and the final clips to a ㅅ받침 that sounds like “t”.' },
  { id: 'pizza', en: 'pizza', script: '피자', romaji: 'pija', rule: 'no z → ㅈ', note: 'No “z” in Korean — it becomes ㅈ(j); the doubled “zz” just collapses.' },
  { id: 'juice', en: 'juice', script: '주스', romaji: 'juseu', rule: 'echo ㅡ', note: '“ju” → 주, and the final “ce” /s/ opens its own block with ㅡ → 스.' },
  { id: 'orange', en: 'orange', script: '오렌지', romaji: 'orenji', rule: 'ㄴ받침 + ㅈ', note: '“o” takes a silent ㅇ → 오, “ran” → 렌 (ㄴ받침), and the soft “g(e)” → ㅈ.' },
  { id: 'pink', en: 'pink', script: '핑크', romaji: 'pingkeu', rule: 'ㅇ받침 + echo ㅡ', note: 'The “ng” sound is the ㅇ받침 → 핑, and the final “k” opens with ㅡ → 크.' },
  { id: 'wine', en: 'wine', script: '와인', romaji: 'wain', rule: 'ㅘ compound vowel', note: '“wi/wa” is one compound vowel ㅘ on a silent ㅇ → 와, then “n” closes 인.' },
  { id: 'camera', en: 'camera', script: '카메라', romaji: 'kamera', rule: 'open CV', note: 'Three open syllables 카·메·라 — “c” is the aspirated ㅋ here.' },
  { id: 'game', en: 'game', script: '게임', romaji: 'geim', rule: 'vowel split + ㅁ받침', note: 'The diphthong splits 게 + 임, and the final “m” closes the second block.' },
  { id: 'shopping', en: 'shopping', script: '쇼핑', romaji: 'syoping', rule: 'ㅛ glide + ㅇ받침', note: '“sho” → 쇼 (ㅅ + the ㅛ glide), and “-pping” closes with the ㅇ받침 → 핑.' },
  { id: 'internet', en: 'internet', script: '인터넷', romaji: 'inteones', rule: '받침 ㄴ + ㅅ', note: '“in” → 인 (ㄴ받침), “ter” → 터, and “net” clips to a ㅅ받침 that sounds like “t” → 넷.' },
]
