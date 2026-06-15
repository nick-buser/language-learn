// =====================================================================
// The Polyglot's Atlas — song · parseLyrics
//
// Turn a pasted block of text into a Song the lyric band can play. Each
// non-blank line becomes a Line; each line is tokenized into "syllables":
//   · a hangul block character (가, 사, 랑…) is one syllable
//   · a run of Latin letters/digits is one whole word-syllable (busy, Mic)
//   · punctuation rides along with the syllable before it
//   · whitespace just separates
//
// There's no melody here, so every syllable gets a flat pitch and an equal
// duration — enough for the playhead to sweep and light each one in time.
// The output shape matches koreanSongs.js exactly, so the band and the
// transport can't tell a typed song from a hand-authored one.
// =====================================================================

const isHangul = (c) => c >= '가' && c <= '힣';
const isWord = (c) => /[A-Za-z0-9'’]/.test(c);

/** Split one line of text into display tokens (the band's syllables). */
export function tokenizeLine(line) {
  const toks = [];
  let i = 0;
  while (i < line.length) {
    const c = line[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (isHangul(c)) {
      toks.push(c);
      i++;
    } else if (isWord(c)) {
      let j = i;
      while (j < line.length && isWord(line[j])) j++;
      toks.push(line.slice(i, j));
      i = j;
    } else {
      // punctuation — attach to the previous token so the line still reads
      if (toks.length) toks[toks.length - 1] += c;
      i++;
    }
  }
  return toks;
}

/**
 * Build a flat, ready Song from a text block.
 * @param {string} text
 * @param {{bpm?: number, beatsPerBar?: number, beatsPerSyllable?: number, restAfter?: number}} [opts]
 */
export function parseLyrics(text, opts = {}) {
  const {
    bpm = 90,
    beatsPerBar = 4,
    beatsPerSyllable = 1,
    restAfter = 1,
  } = opts;

  const rawLines = String(text || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  let beat = 0;
  const lines = rawLines.map((lineText, idx) => {
    const startBeat = beat;
    const syls = tokenizeLine(lineText).map((han) => {
      const syl = { han, rr: '', deg: 'd', midi: 72, dur: beatsPerSyllable, beat };
      beat += beatsPerSyllable;
      return syl;
    });
    const endBeat = beat;
    beat += restAfter;
    return {
      id: 'c' + idx,
      syls,
      startBeat,
      endBeat,
      restAfter,
      rr: lineText,
      en: '',
      jp: '',
      kind: 'sung',
    };
  });

  return {
    id: 'custom',
    title: { han: 'Custom', rr: '', en: '' },
    meta: { bpm, beatsPerBar },
    sections: [{ id: 's1', kind: 'verse', label: 'custom', lines }],
    beats: beat,
  };
}
