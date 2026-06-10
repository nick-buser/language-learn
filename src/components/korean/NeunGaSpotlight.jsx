import React, { useState } from 'react'
import { NEUN_GA } from '../../data/koreanData.js'

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

export default function NeunGaSpotlight({ showReadings, showJp }) {
  const sp = NEUN_GA
  const [side, setSide] = useState('neun')

  return (
    <div data-screen-label="은/는 vs 이/가 spotlight">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The same four words, one particle apart — and if this page has a homecoming, it is here:
        you have already fought this battle, in Japanese, and <i>won</i>. Tap each side.
      </div>
      <div className="spot-stage">
        <Half id="neun" data={sp.neun} active={side === 'neun'} onSelect={setSide}
              showReadings={showReadings} showJp={showJp} />
        <Half id="ga" data={sp.ga} active={side === 'ga'} onSelect={setSide}
              showReadings={showReadings} showJp={showJp} />
      </div>
      <div className="spot-rule" dangerouslySetInnerHTML={{ __html: sp.rule }} />

      <div className="spot-footnotes">
        <div className="spot-footnote">
          <div className="fn-head">{sp.fusions.head}</div>
          <div className="fn-body" dangerouslySetInnerHTML={{ __html: sp.fusions.body }} />
        </div>
        <div className="spot-footnote">
          <div className="fn-head">{sp.copula.head}</div>
          <div className="fn-body" dangerouslySetInnerHTML={{ __html: sp.copula.body }} />
        </div>
      </div>

      <div className="double-subject">
        <div className="ds-kr kr" dangerouslySetInnerHTML={{ __html: sp.doubleSubject.krHtml }} />
        {showReadings && <div className="ds-rr">{sp.doubleSubject.rr}</div>}
        {showJp && (
          <div className="ds-bridge">
            <span className="ds-bridge-jp" dangerouslySetInnerHTML={{ __html: sp.doubleSubject.jpHtml }} />
            <span className="ds-bridge-rr">{sp.doubleSubject.jpRr}</span>
          </div>
        )}
        <div className="ds-note" dangerouslySetInnerHTML={{ __html: sp.doubleSubject.noteHtml }} />
      </div>
    </div>
  )
}
