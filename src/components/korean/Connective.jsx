import React, { useRef, useState } from 'react'
import { CONN_VERBS, connBases, CONN_COMPOUNDS, CONN_CONTRAST, CONN_LANTERN } from '../../data/koreanForms.js'

// The connective — the mirror of the Japanese て-form, run the other way.
// Japanese spends ONE て; Korean splits its whole load across two stems:
// the -고 stem (list / sequence) and the -아/어 stem (flow / cause). The head
// shows both stems built from the forge; the rack shows the constructions
// each carries; the contrast makes the split felt and flags the trap.
const HARMONY_TAG = {
  bright: 'bright stem (ㅏ/ㅗ) → -아',
  dark: 'dark stem → -어',
  ha: '하- → 해 (the wildcard)',
}

export default function Connective({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState('meokda')
  const [compId, setCompId] = useState('go-itda')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)

  const verb = CONN_VERBS.find(v => v.id === verbId)
  const { goBase, goRr, aBase, aRr } = connBases(verb)
  const comp = CONN_COMPOUNDS.find(c => c.id === compId)

  const base = comp.base === 'go' ? goBase : aBase
  const baseRr = comp.base === 'go' ? goRr : aRr
  const form = base + comp.suffix
  const reading = baseRr + comp.sfxRr

  const pickComp = (id) => {
    setCompId(id)
    if (!fired.current) { fired.current = true; setLantern(true) }
  }

  return (
    <div className="conn-stage forge-stage" data-screen-label="Connective">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The Japanese <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>て-form</b> is one joint doing
        a dozen jobs. Korean splits that joint in two — the <b className="kr">-고</b> stem and the{' '}
        <b className="kr">-아/어</b> stem — and makes you choose between them every time. Pick a verb, see both
        stems, then run the rack.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {CONN_VERBS.map(v => (
          <button key={v.id} className={'specimen-chip' + (v.id === verbId ? ' active' : '')} onClick={() => setVerbId(v.id)}>
            <span className="kr">{v.kr}</span>{v.gloss.replace('to ', '')}
          </button>
        ))}
      </div>

      {/* the two stems, built from the forge */}
      <div className="conn-stems" key={verbId}>
        <div className="conn-stem go">
          <div className="conn-stem-lbl">-고 stem</div>
          <div className="conn-stem-form kr">{goBase}</div>
          {showReadings && <div className="conn-stem-rr">{goRr}</div>}
          <div className="conn-stem-role">a <b>list</b> — stack separate events, register-neutral</div>
        </div>
        <div className="conn-stem a">
          <div className="conn-stem-lbl">-아/어 stem</div>
          <div className="conn-stem-form kr">{aBase}</div>
          {showReadings && <div className="conn-stem-rr">{aRr}</div>}
          <div className="conn-stem-role">a <b>flow</b> — the clauses link; also “because”</div>
          <div className="conn-stem-harm">{HARMONY_TAG[verb.harmony]}</div>
        </div>
      </div>

      {/* the construction rack */}
      <div className="te-rack" role="tablist" aria-label="connective constructions">
        {CONN_COMPOUNDS.map(c => (
          <button key={c.id} role="tab" aria-selected={c.id === compId}
            className={'te-chip' + (c.id === compId ? ' active' : '') + ' base-' + c.base} onClick={() => pickComp(c.id)}>
            <span className="kr">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="te-card" key={compId + verbId}>
        <div className="te-card-form">
          <span className="te-form-kr kr">{form}</span>
          {showReadings && <span className="te-form-rr">{reading}</span>}
        </div>
        <div className="te-card-gloss">{comp.gloss}</div>
        {showJp && (
          <div className="te-bridge">
            <span className="cop-bridge-tag jp-tag">日本語</span>
            <span className="te-bridge-pattern jp">{comp.jpPat}</span>
            <span className="conn-bridge-gloss">{comp.jpGloss}</span>
          </div>
        )}
      </div>

      {/* the minimal pair + the trap */}
      <div className="conn-contrast">
        <div className="conn-contrast-head">고 or 어서? the same two clauses, two readings</div>
        <div className="conn-pair">
          {[
            { ...CONN_CONTRAST.go, cls: 'go' },
            { ...CONN_CONTRAST.seo, cls: 'seo' },
            { ...CONN_CONTRAST.cause, cls: 'cause' },
          ].map(c => (
            <div className={'conn-pair-row ' + c.cls} key={c.cls}>
              <span className="kr">{c.kr}</span>
              {showReadings && <span className="conn-pair-rr">{c.rr}</span>}
              <span className="conn-pair-en">{c.en}</span>
              <span className="conn-pair-note">{c.note}</span>
            </div>
          ))}
        </div>
        <div className="conn-trap">
          <span className="conn-trap-head">{CONN_CONTRAST.trap.head}</span>
          <span className="conn-trap-body" dangerouslySetInnerHTML={{ __html: CONN_CONTRAST.trap.body }} />
        </div>
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{CONN_LANTERN.head}</div><div className="body" dangerouslySetInnerHTML={{ __html: CONN_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
