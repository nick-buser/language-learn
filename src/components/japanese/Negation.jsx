import React, { useState } from 'react'
import { FORGE_VERBS, negCells } from '../../data/japaneseVerbs.js'

// Negation — ない / ません across tense in two lanes, plus the "can't" row
// (potential-negative). The bridge is the payoff: Japanese has ONE negator
// where Korean splits 안 (won't / general) from 못 (can't) — and 못 is exactly
// what the Japanese potential-negative 食べられない maps onto.
export default function Negation({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState('taberu')
  const verb = FORGE_VERBS.find(v => v.id === verbId)
  const c = negCells(verb)

  const Cell = ({ cell }) => (
    <div className="neg-cell">
      <span className="neg-jp jp">{cell.result}</span>
      {showReadings && <span className="neg-rr">{cell.reading}</span>}
      <span className="neg-en">{cell.en}</span>
    </div>
  )

  const rows = [
    { id: 'nonpast', label: 'non-past', cells: c.nonpast },
    { id: 'past', label: 'past', cells: c.past },
    { id: 'cant', label: 'can’t', cant: true, cells: c.cant },
  ]

  return (
    <div className="neg-stage forge-stage ja" data-screen-label="Negation">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Japanese negates with one word — <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>ない</b>{' '}
        (plain) / <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>ません</b> (polite) — across every
        tense. Korean splits that one “no” into two: <span className="kr">안</span> (won’t) and{' '}
        <span className="kr">못</span> (can’t) — and Japanese’s own “can’t” is a separate form, the
        potential-negative. Watch the bottom row cross to 못.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {FORGE_VERBS.map(v => (
          <button key={v.id} className={'specimen-chip' + (v.id === verbId ? ' active' : '')} onClick={() => setVerbId(v.id)}>
            <span className="jp">{v.jp}</span>{v.gloss.replace('to ', '')}
          </button>
        ))}
      </div>

      <div className="neg-grid">
        <div className="neg-corner" />
        <div className="neg-lane-h">plain <span className="kr">반말</span></div>
        <div className="neg-lane-h">polite <span className="kr">해요체</span></div>
        {rows.map(r => (
          <React.Fragment key={r.id}>
            <div className={'neg-row-h' + (r.cant ? ' cant' : '')}>
              {r.label}{r.cant && <span className="neg-mot-tag">→ 못</span>}
            </div>
            <Cell cell={r.cells.plain} />
            <Cell cell={r.cells.polite} />
          </React.Fragment>
        ))}
      </div>

      {showJp && (
        <div className="neg-bridge">
          <div className="neg-bridge-head"><span className="cop-bridge-tag">한국어</span> one ない, two Korean no’s</div>
          <div className="neg-bridge-row">
            <span className="nb-jp jp">{verb.forms.negative.result}</span>
            <span className="nb-arrow">≈</span>
            <span className="nb-ko kr">{c.ko.an}</span>
            {showReadings && <span className="nb-rr">{c.ko.anRr}</span>}
            <span className="nb-note">general “won’t / doesn’t” — the everyday negation (also long: <span className="kr">{c.ko.ji}</span>)</span>
          </div>
          <div className="neg-bridge-row cant">
            <span className="nb-jp jp">{c.cant.plain.result}</span>
            <span className="nb-arrow">≈</span>
            <span className="nb-ko kr">{c.ko.mot}</span>
            {showReadings && <span className="nb-rr">{c.ko.motRr}</span>}
            <span className="nb-note">“can’t” — the potential-negative, which is where 못 lives (see 안 / 못 on this folio)</span>
          </div>
        </div>
      )}
    </div>
  )
}
