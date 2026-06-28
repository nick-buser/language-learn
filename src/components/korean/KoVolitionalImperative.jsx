import React, { useRef, useState } from 'react'
import { VI_VERBS, VI_FORMS, VOL_LANES, IMP_LADDER, IMP_NEG, VI_LANTERN } from '../../data/koreanForms.js'

// Volitional & imperative — proposing and commanding, the acts most loaded
// with social weight. The mirror of the Japanese instrument, run the other
// way: Korean leads, Japanese is the bridge. The thesis is the extra rungs —
// Korean runs a four-step command ladder where Japanese has roughly two.
export default function KoVolitionalImperative({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState('meokda')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)

  const verb = VI_VERBS.find(v => v.id === verbId)
  const f = VI_FORMS[verbId]
  const g = verb.gloss.replace('to ', '')

  const wake = () => { if (!fired.current) { fired.current = true; setLantern(true) } }

  return (
    <div className="vi-stage forge-stage" data-screen-label="Volitional and imperative">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Two acts saturated with register: <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>proposing</b>{' '}
        (“let’s…”) and <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>commanding</b> (“do it”). Where
        Japanese offers about two levels, Korean climbs a four-rung ladder — and the wrong rung is an insult.
        Pick a verb and read both.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {VI_VERBS.map(v => (
          <button key={v.id} className={'specimen-chip' + (v.id === verbId ? ' active' : '')} onClick={() => { setVerbId(v.id); wake() }}>
            <span className="kr">{v.kr}</span>{v.gloss.replace('to ', '')}
          </button>
        ))}
      </div>

      {/* volitional — three lanes */}
      <div className="vi-section">
        <div className="vi-sec-head">volitional · 청유형 — “let’s {g} / shall we”</div>
        <div className="vol-lanes">
          {VOL_LANES.map(l => (
            <div className="vlane" key={l.id}>
              <div className="vlane-head"><span className="vl-reg">{l.reg}</span><span className="vi-pat kr">{l.pat}</span></div>
              <div className="vi-cell"><span className="vi-kr kr">{f[l.form]}</span>{showReadings && <span className="vi-rr">{f[l.rr]}</span>}</div>
              <div className="lane-note">{l.note}</div>
              {showJp && (
                <div className="vi-jp-bridge">
                  <span className="cop-bridge-tag jp-tag">日本語</span>
                  <span className="vi-jp-form jp">{l.jpEx}</span>
                  <span className="vi-jp-pat jp">{l.jp}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* imperative ladder */}
      <div className="vi-section">
        <div className="vi-sec-head">imperative · 명령형 — the ladder, blunt → polite</div>
        <div className="imp-ladder">
          {IMP_LADDER.map((s, i) => (
            <div className="imp-rung" data-level={i} key={s.id}>
              <div className="imp-top">
                <span className="imp-form kr">{f[s.form]}</span>
                {showReadings && <span className="imp-rr">{f[s.rr]}</span>}
                <span className="imp-label">{s.label} <span className="imp-pat kr">{s.pat}</span></span>
              </div>
              <div className="imp-note">{s.note}</div>
              {showJp && (
                <div className="imp-jp-bridge"><span className="cop-bridge-tag jp-tag">日本語</span><span className="jp">{s.jp}</span></div>
              )}
            </div>
          ))}
          <div className="imp-rung neg" key="neg">
            <div className="imp-top">
              <span className="imp-form kr">{f.impNeg}</span>
              {showReadings && <span className="imp-rr">{f.impNegRr}</span>}
              <span className="imp-form-alt kr">{f.impNegP}</span>
              <span className="imp-label">{IMP_NEG.label} <span className="imp-pat kr">{IMP_NEG.pat}</span></span>
            </div>
            <div className="imp-note">{IMP_NEG.note}</div>
            {showJp && (
              <div className="imp-jp-bridge"><span className="cop-bridge-tag jp-tag">日本語</span><span className="jp">{IMP_NEG.jp}</span></div>
            )}
          </div>
        </div>
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{VI_LANTERN.head}</div><div className="body" dangerouslySetInnerHTML={{ __html: VI_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
