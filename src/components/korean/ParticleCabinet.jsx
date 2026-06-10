import React from 'react'

// The index — five drawers, every particle a chip with its Japanese twin.
// Tapping a chip scrolls the folio to that particle's card.
export default function ParticleCabinet({ families, onPick, showJp }) {
  return (
    <div className="pcab" data-screen-label="Particle cabinet — index">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Thirty-three particles, five drawers. Every chip is a card below — tap one and the folio
        takes you to it. The grey glyph on each chip is the Japanese twin; where a chip has none,
        Korean is doing something Japanese cannot.
      </div>

      {families.map(f => (
        <div className="pcab-drawer" key={f.id} style={{ '--fam': f.color }}>
          <div className="pcab-label">
            <span className="pcab-no">{f.no}</span>
            <span className="pcab-name">{f.name}</span>
            <span className="pcab-kr kr">{f.kr}</span>
          </div>
          <div className="pcab-chips">
            {f.entries.map(e => (
              <button key={e.id} className="pcab-chip" onClick={() => onPick(e.id)}>
                <span className="kr">{e.forms}</span>
                {showJp && e.jp !== '— (呼びかけ)' && <span className="chip-jp jp">{e.jp}</span>}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="pcab-foot">
        not in the cabinet, on purpose: 커녕 · 더러 · 보고 · 마는 — the rarefied liners. They can
        wait for the books that need them.
      </div>
    </div>
  )
}
