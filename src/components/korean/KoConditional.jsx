import React, { useRef, useState } from 'react'
import { COND_VERBS, COND_MYEON, COND_FORMS, COND_LANTERN } from '../../data/koreanForms.js'

// The conditional — the mirror of the Japanese four "if"s, collapsed.
// Japanese spends four (ば/たら/と/なら); Korean hands almost all of it to
// -(으)면. The head builds -(으)면 with the 으-buffer fork (the 받침 door
// again); the strip lays out the small family and which Japanese form(s)
// each one absorbs.
export default function KoConditional({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState('meokda')
  const [selId, setSelId] = useState('myeon')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)

  const myeon = COND_MYEON[verbId]
  const verb = COND_VERBS.find(v => v.id === verbId)
  const sel = COND_FORMS.find(c => c.id === selId)

  const pick = (id) => { setSelId(id); if (!fired.current) { fired.current = true; setLantern(true) } }

  return (
    <div className="cond-stage forge-stage" data-screen-label="Conditional">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        In Japanese you weighed four “if”s — ば, たら, と, なら. Korean mostly spends{' '}
        <b className="kr" style={{ color: 'var(--accent)' }}>one</b>: -(으)면. Pick a verb to watch it built
        (the buffer 으 is back), then read the small family and what each one quietly absorbs.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {COND_VERBS.map(v => (
          <button key={v.id} className={'specimen-chip' + (v.id === verbId ? ' active' : '')} onClick={() => setVerbId(v.id)}>
            <span className="kr">{v.kr}</span>{v.gloss.replace('to ', '')}
          </button>
        ))}
      </div>

      {/* the -(으)면 build — the buffer fork */}
      <div className="cond-head" key={verbId}>
        <div className="cond-head-lbl">the workhorse · -(으)면</div>
        <div className="cond-head-eq">
          <span className="fq-piece kr stem">{verb.stem}</span>
          <span className="fq-plus">+</span>
          <span className="fq-piece kr tail">{myeon.open ? '면' : '으면'}</span>
          <span className="fq-eqsign">=</span>
          <span className="fq-result kr">{myeon.r}</span>
          {showReadings && <span className="cond-head-rr">{myeon.rr}</span>}
        </div>
        <div className="cond-head-note">
          {myeon.open
            ? 'open stem → bare 면. No buffer needed.'
            : 'closed stem → buffered 으면 — the same 받침 door as the forge’s -을 거예요.'}
          {myeon.irr && <span className="cond-head-irr"> ⚠ {myeon.irr}</span>}
        </div>
      </div>

      <div className="cond-strip" role="tablist" aria-label="conditional family">
        {COND_FORMS.map(c => (
          <button key={c.id} role="tab" aria-selected={c.id === selId}
            className={'cond-chip' + (c.id === selId ? ' active' : '')} onClick={() => pick(c.id)}>
            <span className="cond-form kr">{c.label}</span>
            <span className="cond-niche">{c.niche}</span>
          </button>
        ))}
      </div>

      <div className="cond-detail" key={selId}>
        <div className="cond-d-head">
          <span className="cond-d-form kr">{sel.label}</span>
          <span className="cond-d-niche">{sel.niche}</span>
        </div>
        <div className="cond-use">{sel.use}</div>
        <div className="cond-ex">
          <span className="kr">{sel.ex.kr}</span>
          {showReadings && <span className="cond-ex-rr">{sel.ex.rr}</span>}
          <span className="cond-ex-en">{sel.ex.en}</span>
        </div>
        {showJp && (
          <div className="cond-bridge">
            <span className="cop-bridge-tag jp-tag">日本語</span>
            <span className="cond-bridge-pat jp">{sel.jp}</span>
            <span className="cond-bridge-note">{sel.jpNote}</span>
          </div>
        )}
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{COND_LANTERN.head}</div><div className="body" dangerouslySetInnerHTML={{ __html: COND_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
