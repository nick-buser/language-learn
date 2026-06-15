// =====================================================================
// The Polyglot's Atlas — song · romanize (approximate, per-syllable)
//
// Hangul is a featural alphabet: every precomposed syllable block
// (가–힣) decomposes deterministically into an initial consonant (초성),
// a vowel (중성), and an optional final (받침/종성) — Unicode lays them out
// on a grid, so the split is pure arithmetic, no dictionary needed. Each
// jamo has a fixed Revised-Romanization letter; concatenate them and you
// have a romanization.
//
// This is APPROXIMATE on purpose. It romanizes each syllable on its own,
// so it captures within-syllable rules (받침 neutralization: 옷→ot, 닭→dak)
// but NOT the cross-syllable sandhi a dictionary/parser would need:
//   · liaison        책이  → here "chaeki", really "chaegi"
//   · assimilation   십리  → here "simri", really "simni"
//   · palatalization 같이  → here "gati",  really "gachi"
// Good enough to read along to; the precise version arrives with the
// dictionary. Used by the custom bench (parseLyrics); the hand-authored
// songs keep their pronunciation-aware RR.
// =====================================================================

// Revised Romanization of each jamo, in Unicode jamo order.
const LEAD = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const VOWEL = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
// Finals by their neutralized (받침) sound — deterministic from the block alone.
const TAIL = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];

const SBASE = 0xac00;
const TCOUNT = 28;
const NCOUNT = 21 * TCOUNT; // 588
const SCOUNT = 19 * NCOUNT; // 11172

/** Romanize a single hangul syllable; '' for anything that isn't one. */
export function romanizeSyllable(ch) {
  const idx = ch.codePointAt(0) - SBASE;
  if (idx < 0 || idx >= SCOUNT) return '';
  const lead = Math.floor(idx / NCOUNT);
  const vowel = Math.floor((idx % NCOUNT) / TCOUNT);
  const tail = idx % TCOUNT;
  return LEAD[lead] + VOWEL[vowel] + TAIL[tail];
}

/**
 * Romanize a token: hangul characters become RR, everything else (Latin
 * words, punctuation) contributes nothing — so an English token reads ''.
 */
export function romanizeToken(token) {
  let out = '';
  for (const ch of token) out += romanizeSyllable(ch);
  return out;
}
