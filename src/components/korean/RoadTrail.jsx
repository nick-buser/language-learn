import React, { useRef, useState } from 'react'
import { PHASES, RAILS, ROADMAP_EUREKAS } from '../../data/koreanRoadmap.js'

// The trail — Instrument I of the roadmap folio.
// Five waymarks on a night path, each a lantern that fills with gold
// as its dossier checklist completes. Beneath the path run the two
// reference rails (CEFR, TOPIK): the exam mileposts beside the road.
export default function RoadTrail({ selected, onSelect, progress, showReadings }) {
  const [eureka, setEureka] = useState(null)
  const farSeen = useRef(false)
  const namesSeen = useRef(false)

  const pick = (id) => {
    onSelect(id)
    if (id === 'p5' && !farSeen.current) {
      farSeen.current = true
      setEureka(ROADMAP_EUREKAS.farView)
    }
  }

  const revealNames = () => {
    if (namesSeen.current) return
    namesSeen.current = true
    setEureka(ROADMAP_EUREKAS.namesCross)
  }

  const sel = PHASES.find(p => p.id === selected) || PHASES[0]
  const selProg = progress[sel.id] || { done: 0, total: 0 }

  return (
    <div className="trail-stage" data-screen-label="The trail">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Five waymarks between zero and the far ranges. Each lantern fills as you tick boxes in
        the dossier below — the lamps are honest; they hold only what your own hand put there.
        The rails underneath show where the exams stand <i>beside</i> the road.
      </div>

      <div className="trail-cols trail-grid">
        <div className="rail-tag" aria-hidden="true"></div>
        {PHASES.map((p, i) => {
          const prog = progress[p.id] || { done: 0, total: 0 }
          const pct = prog.total ? Math.round((prog.done / prog.total) * 100) : 0
          const unmapped = prog.total === 0
          return (
            <button
              key={p.id}
              className={'trail-station' + (p.id === selected ? ' active' : '')}
              aria-current={p.id === selected ? 'true' : undefined}
              onClick={() => pick(p.id)}
            >
              <span className="st-no">{['I', 'II', 'III', 'IV', 'V'][i]}</span>
              <span className={'lantern' + (unmapped ? ' unmapped' : '') + (pct > 0 ? ' lit' : '')}>
                <span className="flame" style={{ height: pct + '%' }}></span>
              </span>
              <span className="st-count">{unmapped ? '—' : `${prog.done}/${prog.total}`}</span>
              <span className="st-glyph kr">{p.glyph}</span>
              {showReadings && <span className="st-rr">{p.rr}</span>}
              <span className="st-name">{p.name}</span>
            </button>
          )
        })}
      </div>

      <div className="trail-cols trail-rail">
        <div className="rail-tag">CEFR</div>
        {RAILS.cefr.map((c, i) => <div key={i} className="rail-cell">{c}</div>)}
      </div>
      <div className="trail-cols trail-rail">
        <div className="rail-tag">TOPIK</div>
        {RAILS.topik.map((c, i) => <div key={i} className="rail-cell">{c}</div>)}
      </div>
      <div className="trail-foot">{RAILS.note}</div>

      <div className="trail-caption">
        <div className="cap-head">
          <span className="kr">{sel.glyph}</span>
          {showReadings && <span className="cap-rr">{sel.rr}</span>}
          <span className="cap-name">{sel.name}</span>
          <button className="cap-hanja" onClick={revealNames} title="the waymark’s own name">
            {sel.hanja}
          </button>
        </div>
        <p className="cap-capacity">{sel.capacity}</p>
        <div className="cap-meta">
          <span className="cap-chip">CEFR · {sel.cefr}</span>
          <span className="cap-chip">{sel.topik}</span>
          <span className="cap-chip">{sel.words} words</span>
          <span className="cap-chip">
            {sel.hours ? `~${sel.hours[0]}–${sel.hours[1]} focused hours` : 'hours unmapped'}
          </span>
          {selProg.total > 0 && (
            <span className="cap-chip gold">{selProg.done} of {selProg.total} marks made</span>
          )}
        </div>
      </div>

      <div className={'lantern-note' + (eureka ? ' lit' : '')} aria-live="polite">
        {eureka && (
          <>
            <div className="head">{eureka.head}</div>
            <div className="body" dangerouslySetInnerHTML={{ __html: eureka.body }} />
          </>
        )}
      </div>
    </div>
  )
}
