import React, { useState } from 'react'
import { HAGA_SPOTLIGHT } from '../data/grammarData.js'

function Half({ id, data, active, onSelect }) {
  return (
    <div
      className={'spot-half' + (active ? ' active' : '')}
      onClick={() => onSelect(id)}
      role="button"
      aria-pressed={active}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id) } }}
    >
      <div className="spot-particle">{data.particle}</div>
      <div className="spot-name">{data.name}</div>
      <div className="spot-sentence" dangerouslySetInnerHTML={{ __html: data.sentenceHtml }} />
      <div className="spot-q">{data.question}</div>
      <div className="spot-en" dangerouslySetInnerHTML={{ __html: data.enHtml }} />
    </div>
  )
}

export default function HagaSpotlight() {
  const sp = HAGA_SPOTLIGHT
  const [side, setSide] = useState('wa')

  return (
    <div data-screen-label="は/が spotlight">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The same four words, one particle apart. Tap each side — the difference is not
        meaning, it is <i>what the sentence is doing</i>.
      </div>
      <div className="spot-stage">
        <Half id="wa" data={sp.wa} active={side === 'wa'} onSelect={setSide} />
        <Half id="ga" data={sp.ga} active={side === 'ga'} onSelect={setSide} />
      </div>
      <div className="spot-rule" dangerouslySetInnerHTML={{ __html: sp.rule }} />

      <div className="double-subject">
        <div className="ds-jp" dangerouslySetInnerHTML={{ __html: sp.doubleSubject.jpHtml }} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faded)', letterSpacing: '0.06em', margin: '6px 0 2px' }}>
          {sp.doubleSubject.reading}
        </div>
        <div className="ds-note" dangerouslySetInnerHTML={{ __html: sp.doubleSubject.noteHtml }} />
      </div>
    </div>
  )
}
