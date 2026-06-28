// =====================================================================
// The Polyglot's Atlas — scripts · ime (type without switching keyboards)
//
// Two input engines so a learner can produce Japanese or Korean from a
// plain Latin keyboard — no OS IME, no keyboard switch:
//
//   · romaji  → kana   (a greedy table converter; コーヒー from "ko-hi-")
//   · romaja  → hangul (a composition AUTOMATON: jamo fold into syllable
//                       blocks the way the OS Korean IME does — the
//                       inverse of song/romanize.js's decomposition)
//
// Both expose the SAME small interface so one input component drives
// either language, and the hangul block-builder instrument reuses the
// composition primitives (composeBlock, the jamo arrays):
//
//   engine = {
//     lang,                         // BCP-47 tag for speech.js
//     init()            -> state
//     setPending(s,raw) -> state    // raw = the Latin field's text; convert
//                                   //   complete units, keep the rest pending
//     tap(s, token)     -> state    // commit a kana / jamo straight (tap pad)
//     backspace(s)      -> state
//     flush(s)          -> state    // finalize a trailing fragment (lone n → ん)
//     value(s)          -> string   // the composed script so far
//     pending(s)        -> string   // the in-progress Latin tail
//   }
//
// `value(flush(state))` is the answer the games grade against.
// =====================================================================

// =====================================================================
// 1. KANA — romaji → ひらがな / カタカナ
// =====================================================================

// Wāpuro-style romaji → hiragana. Katakana falls out by a +0x60 codepoint
// shift, so only the hiragana table is maintained. Includes the yōon
// (きゃ…) and the loanword combos (ファ, ティ, チェ, ヴ…) the katakana game
// leans on. Long vowels are the hyphen "-" → ー, exactly as an IME types ー.
const KANA = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  sa: 'さ', shi: 'し', si: 'し', su: 'す', se: 'せ', so: 'そ',
  za: 'ざ', ji: 'じ', zi: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  ta: 'た', chi: 'ち', ti: 'ち', tsu: 'つ', tu: 'つ', te: 'て', to: 'と',
  da: 'だ', de: 'で', do: 'ど', du: 'づ',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', hu: 'ふ', he: 'へ', ho: 'ほ',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を', n: 'ん',
  // yōon
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ', gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ', sya: 'しゃ', syu: 'しゅ', syo: 'しょ',
  ja: 'じゃ', ju: 'じゅ', jo: 'じょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', cya: 'ちゃ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
  // loanword combos (katakana-bound, written via small kana)
  fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ',
  thi: 'てぃ', dhi: 'でぃ', twu: 'とぅ', dwu: 'どぅ',
  che: 'ちぇ', je: 'じぇ', she: 'しぇ',
  va: 'ゔぁ', vi: 'ゔぃ', vu: 'ゔ', ve: 'ゔぇ', vo: 'ゔぉ',
  wi: 'うぃ', we: 'うぇ',
  tsa: 'つぁ', tsi: 'つぃ', tse: 'つぇ', tso: 'つぉ',
}
const KANA_KEYS = Object.keys(KANA)
const VOWELS = new Set(['a', 'i', 'u', 'e', 'o'])
const isLatin = ch => ch >= 'a' && ch <= 'z'
const isCons = ch => isLatin(ch) && !VOWELS.has(ch)

// Is `frag` a strict prefix of a longer key? Then a match on it at the very
// end of the input might still grow (ky → kya), so we hold rather than emit.
function kanaCouldGrow(frag) {
  for (const k of KANA_KEYS) if (k.length > frag.length && k.startsWith(frag)) return true
  return false
}

// hiragana ぁ(3041)–ゖ(3096) (incl. ゔ 3094) → katakana, same offset.
function toKatakana(s) {
  let out = ''
  for (const ch of s) {
    const c = ch.codePointAt(0)
    out += (c >= 0x3041 && c <= 0x3096) ? String.fromCodePoint(c + 0x60) : ch
  }
  return out
}

// Greedy tokenize romaji → array of kana tokens + the unconverted tail.
// `force` finalizes a trailing fragment (used by flush) instead of holding it.
function tokenizeKana(input, force) {
  const s = input.toLowerCase()
  const tokens = []
  let i = 0
  while (i < s.length) {
    const ch = s[i]
    if (ch === '-') { tokens.push('ー'); i++; continue }
    if (!isLatin(ch)) { i++; continue }            // drop stray punctuation
    // sokuon: a doubled consonant (kk/tt/pp/ss…) — but never "nn"
    if (isCons(ch) && ch !== 'n' && s[i + 1] === ch) { tokens.push('っ'); i++; continue }
    // ん before another n, or before a consonant that isn't y
    if (ch === 'n') {
      const nx = s[i + 1]
      if (nx === 'n') { tokens.push('ん'); i += 2; continue }
      if (nx && !VOWELS.has(nx) && nx !== 'y' && nx !== '-') { tokens.push('ん'); i++; continue }
    }
    let m = ''
    for (let L = 3; L >= 1; L--) { const sub = s.substr(i, L); if (KANA[sub]) { m = sub; break } }
    if (m) {
      // Hold if the remaining tail is a prefix of a longer key (n → na/にゃ/にゅ,
      // ky → kya): a shorter match must not fire before the longer one can form.
      if (!force && kanaCouldGrow(s.slice(i))) break
      tokens.push(KANA[m]); i += m.length; continue
    }
    break   // unconvertible from here → the rest is pending
  }
  return { tokens, rest: s.slice(i) }
}

function makeKanaEngine(katakana) {
  const cast = toks => (katakana ? toks.map(toKatakana) : toks)
  return {
    lang: 'ja-JP',
    katakana,
    init: () => ({ tokens: [], pending: '' }),
    setPending(st, raw) {
      const clean = raw.toLowerCase().replace(/[^a-z-]/g, '')
      const { tokens, rest } = tokenizeKana(clean, false)
      return { tokens: st.tokens.concat(cast(tokens)), pending: rest }
    },
    tap(st, token) {
      const f = this.flush(st)
      return { tokens: f.tokens.concat([token]), pending: '' }
    },
    backspace(st) {
      if (st.pending) return { ...st, pending: st.pending.slice(0, -1) }
      return { ...st, tokens: st.tokens.slice(0, -1) }
    },
    flush(st) {
      if (!st.pending) return st
      const { tokens } = tokenizeKana(st.pending, true)   // force the tail (lone n → ん)
      return { tokens: st.tokens.concat(cast(tokens)), pending: '' }
    },
    value: st => st.tokens.join(''),
    pending: st => st.pending,
  }
}

// =====================================================================
// 2. HANGUL — romaja → 한글 (the composition automaton)
// =====================================================================

// Compatibility jamo in their L / V / T (초성 / 중성 / 종성) index order —
// the grid Unicode precomposed syllables sit on (가 = 0xAC00).
export const L_JAMO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
export const V_JAMO = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
export const T_JAMO = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

const L_INDEX = Object.fromEntries(L_JAMO.map((j, i) => [j, i]))
const V_INDEX = Object.fromEntries(V_JAMO.map((j, i) => [j, i]))
const T_INDEX = Object.fromEntries(T_JAMO.map((j, i) => [j, i]))

// ㄸㅃㅉ are initials only — never finals.
const NOT_FINAL = new Set(['ㄸ', 'ㅃ', 'ㅉ'])

// Live-typing combinations: two simple vowels fuse to a compound (ㅗ+ㅏ→ㅘ);
// a final consonant can grow to a compound cluster (ㄹ+ㄱ→ㄺ).
const VOWEL_MERGE = { 'ㅗㅏ': 'ㅘ', 'ㅗㅐ': 'ㅙ', 'ㅗㅣ': 'ㅚ', 'ㅜㅓ': 'ㅝ', 'ㅜㅔ': 'ㅞ', 'ㅜㅣ': 'ㅟ', 'ㅡㅣ': 'ㅢ' }
const FINAL_MERGE = { 'ㄱㅅ': 'ㄳ', 'ㄴㅈ': 'ㄵ', 'ㄴㅎ': 'ㄶ', 'ㄹㄱ': 'ㄺ', 'ㄹㅁ': 'ㄻ', 'ㄹㅂ': 'ㄼ', 'ㄹㅅ': 'ㄽ', 'ㄹㅌ': 'ㄾ', 'ㄹㅍ': 'ㄿ', 'ㄹㅎ': 'ㅀ', 'ㅂㅅ': 'ㅄ' }
// Reverse splits, for backspace (peel a cluster) and final→next-initial migration.
const VOWEL_SPLIT = Object.fromEntries(Object.entries(VOWEL_MERGE).map(([k, v]) => [v, [k[0], k[1]]]))
const FINAL_SPLIT = Object.fromEntries(Object.entries(FINAL_MERGE).map(([k, v]) => [v, [k[0], k[1]]]))

/** Compose a syllable block from compatibility jamo; lone jamo pass through. */
export function composeBlock(L, V, T) {
  if (L && V && L_INDEX[L] != null && V_INDEX[V] != null) {
    const ti = T ? (T_INDEX[T] ?? 0) : 0
    return String.fromCharCode(0xac00 + (L_INDEX[L] * 21 + V_INDEX[V]) * 28 + ti)
  }
  return (L || '') + (V || '') + (T || '')
}

const blockChar = b => (b ? composeBlock(b.L, b.V, b.T) : '')

// The automaton: fold one jamo into (committed[], block). A consonant after a
// full block tentatively becomes its 받침; a following vowel makes that 받침
// migrate to the next block's 초성 (안 + 아 → 아나) — the rule that lets
// 바나나 fall out of "banana".
function feedConsonant(committed, block, c) {
  if (!block) return { committed, block: { L: c, V: null, T: null } }
  if (block.L && !block.V) return { committed: committed.concat([blockChar(block)]), block: { L: c, V: null, T: null } }
  if (block.V && !block.T) {
    if (NOT_FINAL.has(c)) return { committed: committed.concat([blockChar(block)]), block: { L: c, V: null, T: null } }
    return { committed, block: { ...block, T: c } }
  }
  const merged = FINAL_MERGE[block.T + c]
  if (merged) return { committed, block: { ...block, T: merged } }
  return { committed: committed.concat([blockChar(block)]), block: { L: c, V: null, T: null } }
}
function feedVowel(committed, block, v) {
  if (!block) return { committed, block: { L: 'ㅇ', V: v, T: null } }   // bare vowel → ㅇ filler (아, 이…)
  if (block.L && !block.V) return { committed, block: { ...block, V: v } }
  if (!block.T) {
    const merged = VOWEL_MERGE[block.V + v]
    if (merged) return { committed, block: { ...block, V: merged } }
    return { committed: committed.concat([blockChar(block)]), block: { L: 'ㅇ', V: v, T: null } }
  }
  // full block + vowel → migrate the final (split a cluster, keep the first half)
  const split = FINAL_SPLIT[block.T]
  if (split) return { committed: committed.concat([composeBlock(block.L, block.V, split[0])]), block: { L: split[1], V: v, T: null } }
  return { committed: committed.concat([composeBlock(block.L, block.V, null)]), block: { L: block.T, V: v, T: null } }
}
function feedJamo(committed, block, jamo) {
  return V_INDEX[jamo] != null ? feedVowel(committed, block, jamo) : feedConsonant(committed, block, jamo)
}

// Revised-Romanization-keyed romaja → jamo. g/k, b/p, d/t, j/ch split the
// plain vs aspirated pairs (so "g"=ㄱ but "k"=ㅋ); "ng" is the 받침 ㅇ; a bare
// vowel gets its ㅇ filler from feedVowel above.
const ROMAJA = {
  yae: 'ㅒ', wae: 'ㅙ', yeo: 'ㅕ', weo: 'ㅝ',
  ae: 'ㅐ', ya: 'ㅑ', yo: 'ㅛ', yu: 'ㅠ', ye: 'ㅖ', eo: 'ㅓ', eu: 'ㅡ', ui: 'ㅢ',
  wa: 'ㅘ', wo: 'ㅝ', oe: 'ㅚ', wi: 'ㅟ', we: 'ㅞ',
  a: 'ㅏ', e: 'ㅔ', i: 'ㅣ', o: 'ㅗ', u: 'ㅜ',
  kk: 'ㄲ', tt: 'ㄸ', pp: 'ㅃ', ss: 'ㅆ', jj: 'ㅉ', ch: 'ㅊ', ng: 'ㅇ',
  g: 'ㄱ', n: 'ㄴ', d: 'ㄷ', r: 'ㄹ', l: 'ㄹ', m: 'ㅁ', b: 'ㅂ', s: 'ㅅ',
  j: 'ㅈ', k: 'ㅋ', t: 'ㅌ', p: 'ㅍ', h: 'ㅎ',
}
const ROMAJA_KEYS = Object.keys(ROMAJA)
function romajaCouldGrow(frag) {
  for (const k of ROMAJA_KEYS) if (k.length > frag.length && k.startsWith(frag)) return true
  return false
}
function tokenizeRomaja(input, force) {
  const s = input.toLowerCase().replace(/[^a-z]/g, '')
  const jamos = []
  let i = 0
  while (i < s.length) {
    let m = ''
    for (let L = 3; L >= 1; L--) { const sub = s.substr(i, L); if (ROMAJA[sub]) { m = sub; break } }
    if (!m) break
    // Hold if the tail could still grow (n → ng, a → ae, e → eo/eu, wa → wae).
    if (!force && romajaCouldGrow(s.slice(i))) break
    jamos.push(ROMAJA[m]); i += m.length
  }
  return { jamos, rest: s.slice(i) }
}

function makeHangulEngine() {
  const fold = (committed, block, jamos) => {
    for (const j of jamos) ({ committed, block } = feedJamo(committed, block, j))
    return { committed, block }
  }
  return {
    lang: 'ko-KR',
    init: () => ({ committed: [], block: null, pending: '' }),
    setPending(st, raw) {
      const { jamos, rest } = tokenizeRomaja(raw, false)
      const { committed, block } = fold(st.committed, st.block, jamos)
      return { committed, block, pending: rest }
    },
    tap(st, jamo) {
      const f = this.flush(st)
      const { committed, block } = feedJamo(f.committed, f.block, jamo)
      return { committed, block, pending: '' }
    },
    backspace(st) {
      if (st.pending) return { ...st, pending: st.pending.slice(0, -1) }
      const b = st.block
      if (b) {
        if (b.T) return { ...st, block: { ...b, T: FINAL_SPLIT[b.T] ? FINAL_SPLIT[b.T][0] : null } }
        if (b.V) return { ...st, block: { ...b, V: VOWEL_SPLIT[b.V] ? VOWEL_SPLIT[b.V][0] : null } }
        return { ...st, block: null }
      }
      return { ...st, committed: st.committed.slice(0, -1) }
    },
    flush(st) {
      if (!st.pending) return st
      const { jamos } = tokenizeRomaja(st.pending, true)
      const { committed, block } = fold(st.committed, st.block, jamos)
      return { committed, block, pending: '' }
    },
    value: st => st.committed.join('') + blockChar(st.block),
    pending: st => st.pending,
  }
}

// =====================================================================
// 3. The engines — one instance each (state is passed in, so they're shared)
// =====================================================================
export const KANA_ENGINE = makeKanaEngine(false)
export const KATAKANA_ENGINE = makeKanaEngine(true)
export const HANGUL_ENGINE = makeHangulEngine()

/** Pick the engine for a script id ('hiragana' | 'katakana' | 'hangul'). */
export function engineFor(script) {
  if (script === 'hangul') return HANGUL_ENGINE
  if (script === 'hiragana') return KANA_ENGINE
  return KATAKANA_ENGINE
}
