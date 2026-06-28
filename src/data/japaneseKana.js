// =====================================================================
// The Polyglot's Atlas — 日本語 · かな (the gojūon)
//
// The data behind the kana foundry: the 五十音 laid out as the grid it
// actually is (5 vowels × the consonant series), plus the 濁音/半濁音 and
// 拗音 extensions, the tap-pad layout for the keyboardless IME, and a
// hand-checked katakana loanword list for the transliteration bench. Data
// only — the grid, drill, and bench are language-blind components.
//
// @typedef {Object} KanaCell
// @property {string} id    stable id (the romaji; unique across a set)
// @property {string} h     hiragana glyph
// @property {string} k     katakana glyph
// @property {string} rr    romaji (the sound shown/drilled)
// @property {boolean} [rare]  ぢ/づ — shown in the grid, kept out of the drill
//
// @typedef {Object} KanaRow
// @property {string} cons  the consonant series label ('k', 's', … '' for vowels)
// @property {(KanaCell|null)[]} cells  five columns (a i u e o); null = a gap
//
// @typedef {Object} TranslitWord
// @property {string} id, en, script, romaji, rule, note   (see Transliterator)
// =====================================================================

export const VOWEL_HEADS = ['a', 'i', 'u', 'e', 'o']

const c = (id, h, k, rr, rare) => ({ id, h, k, rr, rare: !!rare })

/** The base 五十音 — 46 sounds, the grid's spine. */
export const GOJUON = [
  { cons: '', cells: [c('a', 'あ', 'ア', 'a'), c('i', 'い', 'イ', 'i'), c('u', 'う', 'ウ', 'u'), c('e', 'え', 'エ', 'e'), c('o', 'お', 'オ', 'o')] },
  { cons: 'k', cells: [c('ka', 'か', 'カ', 'ka'), c('ki', 'き', 'キ', 'ki'), c('ku', 'く', 'ク', 'ku'), c('ke', 'け', 'ケ', 'ke'), c('ko', 'こ', 'コ', 'ko')] },
  { cons: 's', cells: [c('sa', 'さ', 'サ', 'sa'), c('shi', 'し', 'シ', 'shi'), c('su', 'す', 'ス', 'su'), c('se', 'せ', 'セ', 'se'), c('so', 'そ', 'ソ', 'so')] },
  { cons: 't', cells: [c('ta', 'た', 'タ', 'ta'), c('chi', 'ち', 'チ', 'chi'), c('tsu', 'つ', 'ツ', 'tsu'), c('te', 'て', 'テ', 'te'), c('to', 'と', 'ト', 'to')] },
  { cons: 'n', cells: [c('na', 'な', 'ナ', 'na'), c('ni', 'に', 'ニ', 'ni'), c('nu', 'ぬ', 'ヌ', 'nu'), c('ne', 'ね', 'ネ', 'ne'), c('no', 'の', 'ノ', 'no')] },
  { cons: 'h', cells: [c('ha', 'は', 'ハ', 'ha'), c('hi', 'ひ', 'ヒ', 'hi'), c('fu', 'ふ', 'フ', 'fu'), c('he', 'へ', 'ヘ', 'he'), c('ho', 'ほ', 'ホ', 'ho')] },
  { cons: 'm', cells: [c('ma', 'ま', 'マ', 'ma'), c('mi', 'み', 'ミ', 'mi'), c('mu', 'む', 'ム', 'mu'), c('me', 'め', 'メ', 'me'), c('mo', 'も', 'モ', 'mo')] },
  { cons: 'y', cells: [c('ya', 'や', 'ヤ', 'ya'), null, c('yu', 'ゆ', 'ユ', 'yu'), null, c('yo', 'よ', 'ヨ', 'yo')] },
  { cons: 'r', cells: [c('ra', 'ら', 'ラ', 'ra'), c('ri', 'り', 'リ', 'ri'), c('ru', 'る', 'ル', 'ru'), c('re', 'れ', 'レ', 're'), c('ro', 'ろ', 'ロ', 'ro')] },
  { cons: 'w', cells: [c('wa', 'わ', 'ワ', 'wa'), null, null, null, c('wo', 'を', 'ヲ', 'wo')] },
  { cons: 'n͚', cells: [c('n', 'ん', 'ン', 'n'), null, null, null, null] },
]

/** 濁音 / 半濁音 — the ten-ten and maru series. */
export const DAKUTEN = [
  { cons: 'g', cells: [c('ga', 'が', 'ガ', 'ga'), c('gi', 'ぎ', 'ギ', 'gi'), c('gu', 'ぐ', 'グ', 'gu'), c('ge', 'げ', 'ゲ', 'ge'), c('go', 'ご', 'ゴ', 'go')] },
  { cons: 'z', cells: [c('za', 'ざ', 'ザ', 'za'), c('ji', 'じ', 'ジ', 'ji'), c('zu', 'ず', 'ズ', 'zu'), c('ze', 'ぜ', 'ゼ', 'ze'), c('zo', 'ぞ', 'ゾ', 'zo')] },
  { cons: 'd', cells: [c('da', 'だ', 'ダ', 'da'), c('di', 'ぢ', 'ヂ', 'ji', true), c('du', 'づ', 'ヅ', 'zu', true), c('de', 'で', 'デ', 'de'), c('do', 'ど', 'ド', 'do')] },
  { cons: 'b', cells: [c('ba', 'ば', 'バ', 'ba'), c('bi', 'び', 'ビ', 'bi'), c('bu', 'ぶ', 'ブ', 'bu'), c('be', 'べ', 'ベ', 'be'), c('bo', 'ぼ', 'ボ', 'bo')] },
  { cons: 'p', cells: [c('pa', 'ぱ', 'パ', 'pa'), c('pi', 'ぴ', 'ピ', 'pi'), c('pu', 'ぷ', 'プ', 'pu'), c('pe', 'ぺ', 'ペ', 'pe'), c('po', 'ぽ', 'ポ', 'po')] },
]

/** 拗音 — the small-や/ゆ/よ glides. Three columns. */
export const YOON_HEADS = ['ya', 'yu', 'yo']
export const YOON = [
  { cons: 'k', cells: [c('kya', 'きゃ', 'キャ', 'kya'), c('kyu', 'きゅ', 'キュ', 'kyu'), c('kyo', 'きょ', 'キョ', 'kyo')] },
  { cons: 's', cells: [c('sha', 'しゃ', 'シャ', 'sha'), c('shu', 'しゅ', 'シュ', 'shu'), c('sho', 'しょ', 'ショ', 'sho')] },
  { cons: 't', cells: [c('cha', 'ちゃ', 'チャ', 'cha'), c('chu', 'ちゅ', 'チュ', 'chu'), c('cho', 'ちょ', 'チョ', 'cho')] },
  { cons: 'n', cells: [c('nya', 'にゃ', 'ニャ', 'nya'), c('nyu', 'にゅ', 'ニュ', 'nyu'), c('nyo', 'にょ', 'ニョ', 'nyo')] },
  { cons: 'h', cells: [c('hya', 'ひゃ', 'ヒャ', 'hya'), c('hyu', 'ひゅ', 'ヒュ', 'hyu'), c('hyo', 'ひょ', 'ヒョ', 'hyo')] },
  { cons: 'm', cells: [c('mya', 'みゃ', 'ミャ', 'mya'), c('myu', 'みゅ', 'ミュ', 'myu'), c('myo', 'みょ', 'ミョ', 'myo')] },
  { cons: 'r', cells: [c('rya', 'りゃ', 'リャ', 'rya'), c('ryu', 'りゅ', 'リュ', 'ryu'), c('ryo', 'りょ', 'リョ', 'ryo')] },
  { cons: 'g', cells: [c('gya', 'ぎゃ', 'ギャ', 'gya'), c('gyu', 'ぎゅ', 'ギュ', 'gyu'), c('gyo', 'ぎょ', 'ギョ', 'gyo')] },
  { cons: 'j', cells: [c('ja', 'じゃ', 'ジャ', 'ja'), c('ju', 'じゅ', 'ジュ', 'ju'), c('jo', 'じょ', 'ジョ', 'jo')] },
  { cons: 'b', cells: [c('bya', 'びゃ', 'ビャ', 'bya'), c('byu', 'びゅ', 'ビュ', 'byu'), c('byo', 'びょ', 'ビョ', 'byo')] },
  { cons: 'p', cells: [c('pya', 'ぴゃ', 'ピャ', 'pya'), c('pyu', 'ぴゅ', 'ピュ', 'pyu'), c('pyo', 'ぴょ', 'ピョ', 'pyo')] },
]

// ---- derivations: flat glyph pools + drill groups, per script ----
const cellsOf = rows => rows.flatMap(r => r.cells.filter(Boolean))
const toGlyph = (script, cell) => ({ id: `${script}-${cell.id}`, glyph: cell[script === 'hiragana' ? 'h' : 'k'], rr: cell.rr, group: cell.id })

/** Every drillable kana for a script (ぢ/づ excluded — too rare, dup sounds). */
export function kanaGlyphs(script) {
  return [...cellsOf(GOJUON), ...cellsOf(DAKUTEN), ...cellsOf(YOON)]
    .filter(cell => !cell.rare)
    .map(cell => toGlyph(script, cell))
}

/** Drill scopes: 基本 / 濁音 / 拗音. */
export function kanaGroups(script) {
  const ids = rows => cellsOf(rows).filter(c => !c.rare).map(c => `${script}-${c.id}`)
  return [
    { id: 'base', label: '基本 base', ids: ids(GOJUON) },
    { id: 'dakuten', label: '濁音 dakuten', ids: ids(DAKUTEN) },
    { id: 'yoon', label: '拗音 yōon', ids: ids(YOON) },
  ]
}

/** The IME tap pad — every kana as its own key (each is one token), + ー and small. */
const SMALL = {
  hiragana: [['ー', 'ー'], ['っ', 'っ'], ['ゃ', 'ゃ'], ['ゅ', 'ゅ'], ['ょ', 'ょ'], ['ぁ', 'ぁ'], ['ぃ', 'ぃ'], ['ぅ', 'ぅ'], ['ぇ', 'ぇ'], ['ぉ', 'ぉ']],
  katakana: [['ー', 'ー'], ['ッ', 'ッ'], ['ャ', 'ャ'], ['ュ', 'ュ'], ['ョ', 'ョ'], ['ァ', 'ァ'], ['ィ', 'ィ'], ['ゥ', 'ゥ'], ['ェ', 'ェ'], ['ォ', 'ォ']],
}
export function kanaKeyboard(script) {
  const key = script === 'hiragana' ? 'h' : 'k'
  const rowKeys = rows => rows.map(r => r.cells.map(cell => (cell ? { token: cell[key], key: cell[key] } : null)))
  return {
    label: script === 'hiragana' ? 'ひらがな pad' : 'カタカナ pad',
    rows: [
      ...rowKeys(GOJUON),
      ...rowKeys(DAKUTEN),
      SMALL[script].map(([token, k]) => ({ token, key: k })),
    ],
  }
}

// =====================================================================
// The transliteration bench — katakana loanwords (gairaigo), hand-checked.
// Each romaji is typeable with ime.js (long vowel = "-", ティ = "thi").
// =====================================================================
export const KATAKANA_WORDS = [
  { id: 'coffee', en: 'coffee', script: 'コーヒー', romaji: 'ko-hi-', rule: 'long vowel ー', note: 'A stressed/long English vowel becomes a chōonpu ー, and the doubled “ff” simply vanishes — Japanese never doubles a consonant that way.' },
  { id: 'black', en: 'black', script: 'ブラック', romaji: 'burakku', rule: 'padding + small っ', note: 'No consonant stands alone: “b” takes a ウ → ブ, “l” → ラ, and the final “ck” clips to a small っ before ク.' },
  { id: 'milk', en: 'milk', script: 'ミルク', romaji: 'miruku', rule: 'echo vowel', note: '“l” → ル and the final “k” gets an echo ウ → ク. Every consonant must carry a vowel out.' },
  { id: 'party', en: 'party', script: 'パーティー', romaji: 'pa-thi-', rule: 'ティ for “ti”', note: 'Foreign “ti” uses the small-イ combo ティ, not チ; the “ar” stretches to ー and so does the final “y”.' },
  { id: 'tv', en: 'television', script: 'テレビ', romaji: 'terebi', rule: 'clipped + no “v”', note: 'Long borrowings get clipped — テレビ(ジョン) loses its tail — and “v” has no native kana, so it lands on ビ.' },
  { id: 'computer', en: 'computer', script: 'コンピューター', romaji: 'konpyu-ta-', rule: 'ン + long vowels', note: '“m” before a consonant → ン, “pu” + small ュ = ピュ, and the “-er” ending stretches to ー.' },
  { id: 'sandwich', en: 'sandwich', script: 'サンドイッチ', romaji: 'sandoicchi', rule: 'broken cluster + っチ', note: 'Every cluster splits (サ-ン-ド), and the “tch” doubles into っチ.' },
  { id: 'icecream', en: 'ice cream', script: 'アイスクリーム', romaji: 'aisukuri-mu', rule: 'broken cluster', note: '“cr” can’t cluster, so it becomes ク + リ, each consonant given its own vowel; the long “ea” → ー.' },
  { id: 'news', en: 'news', script: 'ニュース', romaji: 'nyu-su', rule: 'ニュ glide', note: '“new” rides the にゅ glide → ニュ, then the long vowel ー.' },
  { id: 'orange', en: 'orange', script: 'オレンジ', romaji: 'orenji', rule: 'ン + ジ', note: '“n” → ン and the soft “g(e)” lands on ジ.' },
  { id: 'taxi', en: 'taxi', script: 'タクシー', romaji: 'takushi-', rule: 'split “x” + long ー', note: 'The “x” splits into ク + シ, and the final “i” stretches long → シー.' },
  { id: 'fork', en: 'fork', script: 'フォーク', romaji: 'fo-ku', rule: 'フォ for “fo”', note: 'No native “f”: “fo” uses the small-ォ combo フォ, then the “r” colours the vowel long → ー.' },
  { id: 'beer', en: 'beer', script: 'ビール', romaji: 'bi-ru', rule: 'long vowel', note: 'The double “ee” → a long ー, and the final “r” surfaces as ル.' },
  { id: 'cake', en: 'cake', script: 'ケーキ', romaji: 'ke-ki', rule: 'long vowel', note: 'The “a” (as /eɪ/) stretches to ー and the silent “e” disappears.' },
  { id: 'game', en: 'game', script: 'ゲーム', romaji: 'ge-mu', rule: 'long vowel + echo', note: 'Long ー for the vowel, and the final “m” takes an echo ウ → ム.' },
  { id: 'mcdonalds', en: "McDonald's", script: 'マクドナルド', romaji: 'makudonarudo', rule: 'every consonant voweled', note: 'The famous one — マ-ク-ド-ナ-ル-ド — six syllables because every consonant must carry a vowel.' },
  { id: 'internet', en: 'internet', script: 'インターネット', romaji: 'inta-netto', rule: 'long ー + small っ', note: '“in-ter” → イン + ター (ー), and “net” doubles into ネット.' },
  { id: 'juice', en: 'juice', script: 'ジュース', romaji: 'ju-su', rule: 'ジュ + long vowel', note: '“ju” → ジュ and the long “ui” collapses to ー.' },
]
