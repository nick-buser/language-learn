import React, { useState } from 'react'
import { VERB_DIAL } from '../data/grammarData.js'

export default function VerbDial() {
  const dial = VERB_DIAL
  const [i, setI] = useState(0)
  const state = dial.states[i]
  const rightward = state.dir === 'rightward'

  return (
    <div className="dial-stage" data-screen-label="Verb dial">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The verb{' '}
        <b style={{ color: 'var(--ink)', fontFamily: 'var(--font-cjk-serif)', fontWeight: 500 }}>
          {dial.verb}
        </b>{' '}
        <span style={{ fontStyle: 'normal', color: 'var(--ink-faded)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          {dial.verbReading} · {dial.verbGloss}
        </span>
        . Turn the dial. Notice that{' '}
        <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>私</b> stays the subject the whole way — only its role keeps changing.
      </div>

      <div className="dial-track" role="tablist" aria-label="verb voice">
        {dial.states.map((s, idx) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={idx === i}
            className={'dial-stop' + (idx === i ? ' active' : '')}
            onClick={() => setI(idx)}
          >
            <span className="vlabel-jp">{s.labelJp}</span>
            <span className="vlabel-en">{s.labelEn}</span>
          </button>
        ))}
      </div>

      <div className="dial-readout">
        <div className="dial-form">
          <div className="form-jp">
            {state.formJp.map((seg, k) => (
              <span key={k} className={seg.c}>{seg.t}</span>
            ))}
          </div>
          <div className="form-reading">{state.reading}</div>
          <div className="sentence-jp">{state.sentenceJp}</div>
          <div className="sentence-en">{state.sentenceEn}</div>
        </div>

        <div className="actor-box">
          <div className="actor-head">who acts on whom</div>
          <div className="actor-stage">
            <div className={'actor' + (state.left.subject ? ' subject' : '')}>
              <div className="figure">{state.left.who}</div>
              <div className="who">{state.left.who === '私' ? '私 (I)' : state.left.who}</div>
              <span className="role">{state.left.role}</span>
            </div>

            <div className="actor-arrow">
              <div className="verb-tag">{state.verbTag}</div>
              <svg viewBox="0 0 64 30" aria-hidden="true">
                <defs>
                  <marker
                    id={'ah-' + state.id}
                    markerWidth="7"
                    markerHeight="7"
                    refX="5"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)" />
                  </marker>
                </defs>
                {rightward ? (
                  <line
                    x1="4" y1="15" x2="56" y2="15"
                    stroke="var(--accent)" strokeWidth="1.6"
                    markerEnd={'url(#ah-' + state.id + ')'}
                  />
                ) : (
                  <line
                    x1="60" y1="15" x2="8" y2="15"
                    stroke="var(--accent)" strokeWidth="1.6"
                    markerEnd={'url(#ah-' + state.id + ')'}
                  />
                )}
              </svg>
            </div>

            <div className={'actor' + (state.right.subject ? ' subject' : '')}>
              <div className="figure">{state.right.who}</div>
              <div className="who">{state.right.who === '私' ? '私 (I)' : state.right.who}</div>
              <span className="role">{state.right.role}</span>
            </div>
          </div>
          <div className="actor-note" dangerouslySetInnerHTML={{ __html: state.note }} />
        </div>
      </div>
    </div>
  )
}
