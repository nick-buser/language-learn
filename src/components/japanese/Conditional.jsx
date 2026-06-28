import React, { useRef, useState } from 'react'
import { COND_VERBS, condForms, CONDITIONALS, COND_LANTERN } from '../../data/japaneseForms.js'

// The conditional — four "if"s, each owning a situation English handles with
// one word. The strip shows the four forms for a verb at a glance; the detail
// spells out the niche, an example, and where Korean collapses them back to
// one (-(으)면) or keeps a separate hypothetical (-(ㄴ/는)다면).
export default function Conditional({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState('iku')
  const [selId, setSelId] = useState('tara')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)

  const verb = COND_VERBS.find(v => v.id === verbId)
  const forms = condForms(verb)
  const sel = CONDITIONALS.find(c => c.id === selId)
  const selForm = forms[selId]

  const pick = (id) => { setSelId(id); if (!fired.current) { fired.current = true; setLantern(true) } }

  return (
    <div className="cond-stage forge-stage ja" data-screen-label="Conditional">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        English says <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>“if”</b> and stops. Japanese
        spends four words on it — ば, たら, と, なら — and they don’t swap: each owns a situation the others
        can’t enter. Pick a verb, then a conditional, and read what makes it the right one.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {COND_VERBS.map(v => (
          <button key={v.id} className={'specimen-chip' + (v.id === verbId ? ' active' : '')} onClick={() => setVerbId(v.id)}>
            <span className="jp">{v.jp}</span>{v.gloss.replace('to ', '')}
          </button>
        ))}
      </div>

      <div className="cond-strip" role="tablist" aria-label="conditional">
        {CONDITIONALS.map(c => (
          <button key={c.id} role="tab" aria-selected={c.id === selId}
            className={'cond-chip' + (c.id === selId ? ' active' : '')} onClick={() => pick(c.id)}>
            <span className="cond-form jp">{forms[c.id].r}</span>
            <span className="cond-niche">{c.label} · {c.niche}</span>
          </button>
        ))}
      </div>

      <div className="cond-detail" key={selId + verbId}>
        <div className="cond-d-head">
          <span className="cond-d-form jp">{selForm.r}</span>
          {showReadings && <span className="cond-d-rr">{selForm.rr}</span>}
          <span className="cond-d-niche">{sel.niche}</span>
        </div>
        <div className="cond-use">{sel.use}</div>
        <div className="cond-ex">
          <span className="jp">{sel.ex.jp}</span>
          {showReadings && <span className="cond-ex-rr">{sel.ex.reading}</span>}
          <span className="cond-ex-en">{sel.ex.en}</span>
        </div>
        {showJp && (
          <div className="cond-bridge">
            <span className="cop-bridge-tag">한국어</span>
            <span className="cond-bridge-pat kr">{sel.ko}</span>
            <span className="cond-bridge-note">{sel.koNote}</span>
          </div>
        )}
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{COND_LANTERN.head}</div><div className="body" dangerouslySetInnerHTML={{ __html: COND_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
