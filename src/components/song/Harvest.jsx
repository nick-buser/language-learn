import React from 'react';

// =====================================================================
// The harvest — what four lines give the bank.
//
// A song is comprehensible input you'll happily repeat a hundred times, so
// the words and structures in it are the cheapest to keep. This pulls them
// out: the vocabulary (lean dictionary entries, with the Japanese bridge),
// and the grammar the lyric carries — each cross-linked to the folio that
// teaches it. The vocabulary plan calls reading "the harvest"; a song is
// the same harvest with a melody attached. Honors showReadings / showJp.
// =====================================================================

const BRIDGE_BADGE = { cognate: '同源 twin', equivalent: '対訳 equiv' };

export default function Harvest({ song, showReadings, showJp }) {
  const lines = song.sections.flatMap((s) => s.lines);
  const lineNo = (id) => {
    const i = lines.findIndex((l) => l.id === id);
    return i >= 0 ? 'L' + (i + 1) : '';
  };

  return (
    <div className="harvest" data-screen-label="The harvest">
      {/* ── vocabulary ── */}
      <div>
        <div className="harvest-head">어휘 · words the song hands you</div>
        {song.harvestVocab.map((w) => (
          <div className="hv-word" key={w.head}>
            <div className="hv-main">
              <div className="hv-han kr">{w.head}</div>
              {showReadings && <div className="hv-rr">{w.rr}</div>}
            </div>
            <div className="hv-body">
              <div>
                <span className="hv-gloss">{w.en}</span>
                <span className="hv-pos">{w.pos}</span>
                <span className="from-tag" style={{ marginLeft: 8 }}>{lineNo(w.from)}</span>
              </div>
              {showJp && w.bridge && (
                <div className="hv-bridge">
                  {w.bridge.kanji}
                  {w.bridge.kana && `（${w.bridge.kana}）`}
                  <span className="rr">{w.bridge.rr}</span>
                  <span className="badge">{BRIDGE_BADGE[w.bridge.kind] || w.bridge.kind}</span>
                </div>
              )}
              {w.note && <div className="hv-note" dangerouslySetInnerHTML={{ __html: w.note }} />}
            </div>
          </div>
        ))}
      </div>

      {/* ── grammar ── */}
      <div>
        <div className="harvest-head">문법 · structures it carries</div>
        {song.grammar.map((g) => (
          <div className="hv-gram" key={g.id}>
            <div className="hv-g-head">{g.head}</div>
            <div className="hv-g-phrase kr">{g.han}</div>
            {showReadings && <div className="hv-g-rr">{g.rr}</div>}
            <div className="hv-g-en">{g.en}</div>
            <div className="hv-g-body" dangerouslySetInnerHTML={{ __html: g.html }} />
            {g.link && <a className="diction-link" href={g.link.folio}>{g.link.label}</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
