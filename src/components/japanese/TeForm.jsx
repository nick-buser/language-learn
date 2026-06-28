import React, { useRef, useState } from 'react'
import { TE_VERBS, TE_KO, TE_COMPOUNDS, TE_LANTERN } from '../../data/japaneseForms.js'

// The て-form — its own folio section, because it's the least intuitive and
// the most load-bearing form in the language. The head shows the bare te-form
// (with its 音便 highlighted); the compound rack shows what て + an auxiliary
// does — progressive, request, attempt, prohibition — each bridged to Korean's
// split -고 / -아·어 stems.
export default function TeForm({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState('taberu')
  const [compId, setCompId] = useState('iru')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)

  const verb = TE_VERBS.find(v => v.id === verbId)
  const te = verb.forms.te
  const comp = TE_COMPOUNDS.find(c => c.id === compId)
  const ko = TE_KO[verbId]

  const formJp = comp.bare ? te.result + '、…' : te.result + comp.jp
  const reading = te.reading + comp.reading
  const koResult = comp.bare
    ? `${ko.go} · ${ko.a}서`
    : comp.koFixed ? '' : `${ko[comp.koBase]}${comp.koSuffix}`

  const pickComp = (id) => {
    setCompId(id)
    if (!fired.current) { fired.current = true; setLantern(true) }
  }

  return (
    <div className="teform-stage forge-stage ja" data-screen-label="te-form">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>て-form</b> is the joint the whole
        spoken language hangs on. Alone it means “and then”; bolt an auxiliary onto it and it becomes the
        progressive, a request, an attempt, a prohibition. Learn the 音便 once — then read the rack.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {TE_VERBS.map(v => (
          <button key={v.id} className={'specimen-chip' + (v.id === verbId ? ' active' : '')} onClick={() => setVerbId(v.id)}>
            <span className="jp">{v.jp}</span>{v.gloss.replace('to ', '')}
          </button>
        ))}
      </div>

      {/* the bare te-form, with onbin highlighted */}
      <div className="te-head">
        <div className="te-head-lbl">the て-form</div>
        <div className="forge-eq" key={verbId}>
          <div className="fq-line">
            {te.pieces.map((p, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="fq-plus">+</span>}
                <span className={'fq-piece jp ' + p.c}>{p.t}</span>
              </React.Fragment>
            ))}
            <span className="fq-eqsign">=</span>
            <span className="fq-result jp">{te.result}</span>
          </div>
          {showReadings && <span className="te-head-rr">{te.reading}</span>}
        </div>
        <div className="te-head-note">{verb.id === 'iku' ? 'note: 行く is the lone rogue — 行って, never ✗行いて.' : verb.cls === 'godan' && verb.onbin ? 'the 音便: the stem morphs so it can be said in one breath.' : 'no 音便 here — the stem joins て cleanly.'}</div>
      </div>

      {/* the compound rack */}
      <div className="te-rack" role="tablist" aria-label="te-compound">
        {TE_COMPOUNDS.map(c => (
          <button key={c.id} role="tab" aria-selected={c.id === compId}
            className={'te-chip' + (c.id === compId ? ' active' : '')} onClick={() => pickComp(c.id)}>
            <span className="jp">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="te-card" key={compId + verbId}>
        <div className="te-card-form">
          <span className="te-form-jp jp">{formJp}</span>
          {showReadings && <span className="te-form-rr">{reading}</span>}
        </div>
        <div className="te-card-gloss">{comp.gloss}</div>
        {showJp && (
          <div className="te-bridge">
            <span className="cop-bridge-tag">한국어</span>
            <span className="te-bridge-pattern">{comp.koGloss}</span>
            {!comp.koFixed && <span className="te-bridge-ex kr">{koResult}</span>}
          </div>
        )}
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{TE_LANTERN.head}</div><div className="body" dangerouslySetInnerHTML={{ __html: TE_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
