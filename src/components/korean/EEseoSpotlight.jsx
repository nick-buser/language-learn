import React, { useState } from 'react'
import { E_ESEO } from '../../data/koreanParticles.js'

function Half({ id, data, active, onSelect, showReadings, showJp }) {
  return (
    <div
      className={'spot-half' + (active ? ' active' : '')}
      onClick={() => onSelect(id)}
      role="button"
      aria-pressed={active}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id) } }}
    >
      <div className="spot-particle kr">{data.particle}</div>
      <div className="spot-name">{data.name}</div>
      <div className="spot-sentence kr" dangerouslySetInnerHTML={{ __html: data.sentence.kr }} />
      {showReadings && <div className="spot-rr">{data.sentence.rr}</div>}
      {showJp && (
        <div className="spot-jp">
          <span className="jp">{data.jp.kr}</span>
          <span className="jp-rr">{data.jp.rr}</span>
        </div>
      )}
      <div className="spot-q">{data.question}</div>
      <div className="spot-en" dangerouslySetInnerHTML={{ __html: data.enHtml }} />
    </div>
  )
}

export default function EEseoSpotlight({ showReadings, showJp }) {
  const sp = E_ESEO
  const [side, setSide] = useState('e')

  return (
    <div data-screen-label="에 vs 에서 spotlight">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        One cat, one house, two particles — the single most-confused pair in the drawer, and the
        one your Japanese already solved. Tap each side.
      </div>
      <div className="spot-stage">
        <Half id="e" data={sp.e} active={side === 'e'} onSelect={setSide}
              showReadings={showReadings} showJp={showJp} />
        <Half id="eseo" data={sp.eseo} active={side === 'eseo'} onSelect={setSide}
              showReadings={showReadings} showJp={showJp} />
      </div>
      <div className="spot-rule" dangerouslySetInnerHTML={{ __html: sp.rule }} />

      <div className="spot-footnotes">
        {sp.traps.map((t, i) => (
          <div className="spot-footnote" key={i}>
            <div className="fn-head">{t.head}</div>
            <div className="fn-body" dangerouslySetInnerHTML={{ __html: t.body }} />
          </div>
        ))}
      </div>
    </div>
  )
}
