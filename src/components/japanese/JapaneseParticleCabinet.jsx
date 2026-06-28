import React from 'react'

// The grey twin on each chip is the Korean correspondence, shortened to
// its first form (the card carries the full set). For the 終助詞 drawer
// that "twin" is a verb ENDING, not a particle — which is the point.
const chipTwin = (ko) => {
  const first = ko.split(/\s*[/·]\s*/)[0]
  return first.replace(/\s*\([^)]*\)\s*$/, '').trim() || first
}

export default function JapaneseParticleCabinet({ families, onPick, showJp, foot }) {
  return (
    <div className="pcab ja" data-screen-label="Particle cabinet — index">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Twenty-eight particles, five drawers. Every chip is a card below — tap one and the folio takes
        you to it. The grey glyph is the Korean twin; in the last drawer it’s a verb <i>ending</i>, not a
        particle — because that is how Korean does the work Japanese gives to a sentence-final 助詞.
      </div>

      {families.map(f => (
        <div className="pcab-drawer" key={f.id} style={{ '--fam': f.color }}>
          <div className="pcab-label">
            <span className="pcab-no">{f.no}</span>
            <span className="pcab-name">{f.name}</span>
            <span className="pcab-kr jp">{f.jp}</span>
          </div>
          <div className="pcab-chips">
            {f.entries.map(e => (
              <button key={e.id} className="pcab-chip" onClick={() => onPick(e.id)}>
                <span className="jp">{e.forms}</span>
                {showJp && <span className="chip-ko kr">{chipTwin(e.ko)}</span>}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="pcab-foot">{foot}</div>
    </div>
  )
}
