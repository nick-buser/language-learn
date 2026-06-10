import React, { useState } from 'react'
import { AN_MOT } from '../../data/koreanData.js'

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

export default function AnMotSpotlight({ showReadings, showJp }) {
  const sp = AN_MOT
  const [side, setSide] = useState('an')

  return (
    <div data-screen-label="안/못 spotlight">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Two small words, both “not” — one of will, one of ability. Both sit directly in front
        of the verb. Tap each side.
      </div>
      <div className="spot-stage">
        <Half id="an" data={sp.an} active={side === 'an'} onSelect={setSide}
              showReadings={showReadings} showJp={showJp} />
        <Half id="mot" data={sp.mot} active={side === 'mot'} onSelect={setSide}
              showReadings={showReadings} showJp={showJp} />
      </div>
      <div className="spot-rule" dangerouslySetInnerHTML={{ __html: sp.rule }} />

      <div className="double-subject">
        <div className="fn-head" style={{ marginBottom: 6 }}>{sp.sound.head}</div>
        <div className="ds-note" dangerouslySetInnerHTML={{ __html: sp.sound.body }} />
      </div>
    </div>
  )
}
