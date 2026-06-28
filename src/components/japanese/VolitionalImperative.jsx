import React, { useRef, useState } from 'react'
import { VI_VERBS, viForms, IMP_SPECTRUM, VI_LANTERN } from '../../data/japaneseForms.js'

// Volitional & imperative — the grammar of proposing and commanding, and the
// place register matters most. Volitional in two lanes (食べよう / 食べましょう);
// the imperative as a ladder from a bare order up to a polite request, each
// rung bridged to its Korean rung.
export default function VolitionalImperative({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState('taberu')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)

  const verb = VI_VERBS.find(v => v.id === verbId)
  const f = viForms(verb)
  const ko = f.ko
  const g = verb.gloss.replace('to ', '')

  const wake = () => { if (!fired.current) { fired.current = true; setLantern(true) } }

  return (
    <div className="vi-stage forge-stage ja" data-screen-label="Volitional and imperative">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Two acts the textbook tends to bury: <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>proposing</b>{' '}
        (“let’s…”) and <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>commanding</b> (“do it”). Both
        are saturated with register — say them at the wrong level and you’ve been rude. Pick a verb and read
        the two ladders.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {VI_VERBS.map(v => (
          <button key={v.id} className={'specimen-chip' + (v.id === verbId ? ' active' : '')} onClick={() => { setVerbId(v.id); wake() }}>
            <span className="jp">{v.jp}</span>{v.gloss.replace('to ', '')}
          </button>
        ))}
      </div>

      {/* volitional */}
      <div className="vi-section">
        <div className="vi-sec-head">volitional · 意向形 — “let’s {g} / shall we / I’ll {g}”</div>
        <div className="lane-pair">
          <div className="vlane">
            <div className="vlane-head"><span className="vl-reg">casual</span><span className="vl-kr kr">반말</span></div>
            <div className="vi-cell"><span className="vi-jp jp">{f.volCasual.r}</span>{showReadings && <span className="vi-rr">{f.volCasual.rr}</span>}</div>
            {showJp && <div className="vi-ko"><span className="kr">{ko.volC}</span>{showReadings && <span className="vi-ko-rr">{ko.volCRr}</span>}<span className="vi-ko-pat">-자</span></div>}
          </div>
          <div className="vlane">
            <div className="vlane-head"><span className="vl-reg">polite</span><span className="vl-kr kr">해요체</span></div>
            <div className="vi-cell"><span className="vi-jp jp">{f.volPolite.r}</span>{showReadings && <span className="vi-rr">{f.volPolite.rr}</span>}</div>
            {showJp && <div className="vi-ko"><span className="kr">{ko.volP}</span>{showReadings && <span className="vi-ko-rr">{ko.volPRr}</span>}<span className="vi-ko-pat">-(으)ㅂ시다</span></div>}
          </div>
        </div>
      </div>

      {/* imperative ladder */}
      <div className="vi-section">
        <div className="vi-sec-head">imperative · 命令形 — the ladder, blunt → polite</div>
        <div className="imp-ladder">
          {IMP_SPECTRUM.map((s, i) => (
            <div className="imp-rung" data-level={i} key={s.id}>
              <div className="imp-top">
                <span className="imp-form jp">{f[s.form].r}</span>
                {showReadings && <span className="imp-rr">{f[s.form].rr}</span>}
                <span className="imp-label">{s.label} <span className="imp-jp jp">{s.jp}</span></span>
              </div>
              <div className="imp-note">{s.note}</div>
              {showJp && (
                <div className="imp-ko">
                  <span className="kr">{ko[s.koKey]}</span>
                  {showReadings && <span className="vi-ko-rr">{ko[s.koKey + 'Rr']}</span>}
                  <span className="vi-ko-pat">{s.ko}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{VI_LANTERN.head}</div><div className="body" dangerouslySetInnerHTML={{ __html: VI_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
