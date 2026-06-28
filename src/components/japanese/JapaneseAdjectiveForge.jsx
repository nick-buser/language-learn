import React, { useState, useRef } from 'react'
import {
  ADJ_TYPES, ADJ_FORMS, I_ADJECTIVES, NA_ADJECTIVES, ADJ_EUREKAS,
} from '../../data/japaneseAdjectives.js'

// One column of the bench: an adjective in the selected form.
function AdjColumn({ adj, type, form, showReadings, showJp }) {
  const f = adj.forms[form]
  return (
    <div className={'adj-col ' + type.id}>
      <div className="adj-col-head">
        <span className="adj-mark jp">{type.mark}</span>
        <span className="adj-hw jp">{adj.jp}</span>
        <span className="adj-hw-gloss">{adj.gloss}</span>
      </div>
      <div className="forge-eq" key={adj.id + '-' + form}>
        <div className="fq-line">
          {f.pieces.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="fq-plus">+</span>}
              <span className={'fq-piece jp ' + p.c}>{p.t}</span>
            </React.Fragment>
          ))}
          <span className="fq-eqsign">=</span>
          <span className="fq-result jp">{f.result}</span>
        </div>
        {showReadings && <div className="fq-readout"><span className="fq-rr">{f.reading}</span></div>}
        {showJp && (
          <div className="fq-ko">
            <span className="kr">{f.ko}</span>
            {showReadings && <span className="fq-ko-rr">{f.koRr}</span>}
          </div>
        )}
        {f.note && <div className="adj-col-note">{f.note}</div>}
      </div>
    </div>
  )
}

export default function JapaneseAdjectiveForge({ showReadings, showJp }) {
  const [iId, setIId] = useState(I_ADJECTIVES[0].id)
  const [naId, setNaId] = useState(NA_ADJECTIVES[0].id)
  const [formId, setFormId] = useState('present')
  const [eureka, setEureka] = useState(null)

  const contrastShown = useRef(false)
  const irregularShown = useRef(false)
  const falseFriendShown = useRef(false)

  const iAdj = I_ADJECTIVES.find(a => a.id === iId)
  const naAdj = NA_ADJECTIVES.find(a => a.id === naId)
  const form = ADJ_FORMS.find(f => f.id === formId)

  const pickI = (a) => {
    setIId(a.id)
    if (a.irregular && !irregularShown.current) {
      irregularShown.current = true
      setEureka(ADJ_EUREKAS.irregular)
    }
  }
  const pickNa = (a) => {
    setNaId(a.id)
    if (a.falseFriend && !falseFriendShown.current) {
      falseFriendShown.current = true
      setEureka(ADJ_EUREKAS.falseFriend)
    }
  }
  const pickForm = (id) => {
    setFormId(id)
    if (id !== 'present' && !contrastShown.current) {
      contrastShown.current = true
      setEureka(ADJ_EUREKAS.contrast)
    }
  }

  return (
    <div className="forge-stage ja adj" data-screen-label="Japanese adjective forge">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Japanese has two kinds of adjective, and they conjugate in two different ways. Pull a form and
        watch them move in parallel: the{' '}
        <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>い-adjective inflects itself</b>, the{' '}
        <b style={{ color: 'var(--st-travel)', fontStyle: 'normal' }}>な-adjective inflects the copula</b>.
        Then read the bridge — Korean refuses to split them at all.
      </div>

      {/* the い picker */}
      <div className="specimen-row">
        <span className="lbl">い</span>
        {I_ADJECTIVES.map(a => (
          <button
            key={a.id}
            className={'specimen-chip' + (a.id === iId ? ' active' : '')}
            onClick={() => pickI(a)}
          >
            <span className="jp">{a.jp}</span>{a.gloss.split(' /')[0]}
            {a.irregular && <span className="chip-irr">不規則</span>}
          </button>
        ))}
      </div>
      {/* the な picker */}
      <div className="specimen-row">
        <span className="lbl">な</span>
        {NA_ADJECTIVES.map(a => (
          <button
            key={a.id}
            className={'specimen-chip' + (a.id === naId ? ' active' : '')}
            onClick={() => pickNa(a)}
          >
            <span className="jp">{a.jp}</span>{a.gloss.split(' /')[0]}
            {a.falseFriend && <span className="chip-irr trap">な?</span>}
            {a.cognate && <span className="chip-cog">漢</span>}
          </button>
        ))}
      </div>

      {/* the form selector */}
      <div className="forge-tenses adj-forms" role="tablist" aria-label="form">
        {ADJ_FORMS.map(f => (
          <button
            key={f.id}
            role="tab"
            aria-selected={f.id === formId}
            className={'forge-tense' + (f.id === formId ? ' active' : '')}
            onClick={() => pickForm(f.id)}
          >
            <span className="ft-en">{f.label}</span>
            <span className="ft-kr jp">{f.jp}</span>
          </button>
        ))}
      </div>

      {/* the two columns, side by side */}
      <div className="adj-cols">
        <AdjColumn adj={iAdj} type={ADJ_TYPES.i} form={formId} showReadings={showReadings} showJp={showJp} />
        <AdjColumn adj={naAdj} type={ADJ_TYPES.na} form={formId} showReadings={showReadings} showJp={showJp} />
      </div>

      {/* the per-form contrast — the teaching line */}
      <div className="fq-fuse adj-contrast" key={formId} dangerouslySetInnerHTML={{ __html: form.contrast }} />

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
