import React, { useRef, useState } from 'react'
import { VOICE_VERBS, VOICE_LANTERN } from '../../data/koreanForms.js'

// Voice — the instrument the Korean verb folio doesn't host yet, and the
// richest contrast. Japanese voice is one productive rule (〜られる / 〜させる,
// any verb). Korean splits it: a LEXICAL layer (이/히/리/기 passive, plus
// 우/구/추 causative — gappy, per-verb) and a PRODUCTIVE layer (-아/어지다,
// -게 하다). The matrix shows the split; the specimen trio grounds it; the
// Japanese bridge shows the one rule it replaces.
export default function VoiceDial({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState('meokda')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)
  const v = VOICE_VERBS.find(x => x.id === verbId)

  const pickVerb = (id) => {
    setVerbId(id)
    if (id !== verbId && !fired.current) { fired.current = true; setLantern(true) }
  }

  // a matrix cell — a real form, a faded productive hint, or a flat gap
  const cell = (data, { hint, hintNote } = {}) => {
    if (data) {
      return (
        <div className="voice-cell">
          <div className="voice-cell-top">
            <span className="voice-cell-kr kr">{data.kr}</span>
            {data.sfx && <span className="voice-sfx kr">{data.sfx}</span>}
          </div>
          {showReadings && <span className="voice-cell-rr">{data.rr}</span>}
          <span className="voice-cell-gloss">{data.gloss}</span>
        </div>
      )
    }
    if (hint) {
      return (
        <div className="voice-cell faded">
          <span className="voice-cell-kr kr">{hint}</span>
          <span className="voice-cell-gloss">{hintNote}</span>
        </div>
      )
    }
    return <div className="voice-cell empty"><span className="voice-dash">—</span><span className="voice-cell-gloss">no lexical form</span></div>
  }

  const sents = [
    { id: 'active', label: 'active', s: v.sentences.active },
    { id: 'passive', label: 'passive', s: v.sentences.passive },
    { id: 'causative', label: 'causative', s: v.sentences.causative },
  ].filter(r => r.s)

  return (
    <div className="voice-stage forge-stage" data-screen-label="Voice">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Japanese voice is one machine: any verb takes <b className="jp" style={{ color: 'var(--accent)' }}>〜られる</b>{' '}
        and <b className="jp" style={{ color: 'var(--accent)' }}>〜させる</b>, by rule. Korean splits the job in
        two — a <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>lexical</b> layer you memorise per
        verb, and a <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>productive</b> layer that always
        works. Pick a verb and see which cells it fills.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {VOICE_VERBS.map(x => (
          <button key={x.id} className={'specimen-chip' + (x.id === verbId ? ' active' : '')} onClick={() => pickVerb(x.id)}>
            <span className="kr">{x.kr}</span>{x.gloss.replace('to ', '')}
          </button>
        ))}
      </div>

      {/* active base + the Japanese one-rule bridge */}
      <div className="voice-active" key={verbId}>
        <div className="voice-active-form">
          <span className="voice-active-lbl">active</span>
          <span className="voice-cell-kr kr">{v.kr}</span>
          {showReadings && <span className="voice-cell-rr">{v.rr}</span>}
          <span className="voice-cell-gloss">{v.gloss.replace('to ', '')}</span>
        </div>
        {showJp && (
          <div className="voice-jp-rule">
            <span className="cop-bridge-tag jp-tag">日本語</span>
            <span className="jp voice-jp-base">{v.jp}</span>
            <span className="voice-jp-arm"><span className="jp">{v.jpPassive}</span><span className="voice-jp-tag">passive</span></span>
            <span className="voice-jp-arm"><span className="jp">{v.jpCausative}</span><span className="voice-jp-tag">causative</span></span>
            <span className="voice-jp-rule-note">one rule, every verb</span>
          </div>
        )}
      </div>

      {/* the voice matrix: rows passive/causative × cols lexical/productive */}
      <div className="voice-matrix">
        <div className="voice-col-h" />
        <div className="voice-col-h">lexical <span className="voice-col-sub kr">이/히/리/기</span></div>
        <div className="voice-col-h">productive <span className="voice-col-sub">by rule</span></div>

        <div className="voice-row-h pass">passive</div>
        {cell(v.lexPassive)}
        {cell(v.periPassive, { hint: '-아/어지다', hintNote: v.lexPassive ? 'regular, but the lexical form carries it here' : 'the productive passive' })}

        <div className="voice-row-h caus">causative</div>
        {cell(v.lexCausative)}
        {cell(v.periCausative)}
      </div>

      {/* the specimen trio — voice made concrete */}
      <div className="voice-sentences">
        {sents.map(r => (
          <div className={'voice-sent ' + r.id} key={r.id}>
            <span className="voice-sent-lbl">{r.label}</span>
            <span className="kr voice-sent-kr">{r.s.kr}</span>
            {showReadings && <span className="voice-sent-rr">{r.s.rr}</span>}
            <span className="voice-sent-en">{r.s.en}</span>
          </div>
        ))}
      </div>

      <div className="voice-note">{v.note}</div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{VOICE_LANTERN.head}</div><div className="body" dangerouslySetInnerHTML={{ __html: VOICE_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
