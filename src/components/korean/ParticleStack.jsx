import React, { useState, useRef } from 'react'
import { STACK_BASES, STACK_DELIMS, STACK_EUREKAS } from '../../data/koreanParticles.js'

// THE STACK — particle compounding. Pick a noun already wearing its
// particle, then add a delimiter (는/도/만). Adverbial particles hold
// and the delimiter docks after (에 + 는 → 에는, exactly には); case
// particles yield and vanish (를 + 는 → 는, exactly ✗をは → は).
export default function ParticleStack({ showReadings, showJp }) {
  const [baseId, setBaseId] = useState(STACK_BASES[0].id)
  const [delimId, setDelimId] = useState('none')
  const [eureka, setEureka] = useState(null)
  const yieldSeen = useRef(false)
  const holdSeen = useRef(false)
  const yieldShown = useRef(false)
  const castesShown = useRef(false)

  const base = STACK_BASES.find(b => b.id === baseId)
  const delim = STACK_DELIMS.find(d => d.id === delimId)
  const combo = base.combos[delimId]
  const stacked = delimId !== 'none'
  const displaced = stacked && base.base.kind === 'case'

  const register = (b, dId) => {
    if (dId === 'none') return
    if (b.base.kind === 'case') yieldSeen.current = true
    else holdSeen.current = true
    if (yieldSeen.current && !yieldShown.current) {
      yieldShown.current = true
      setEureka(STACK_EUREKAS.yield)
    } else if (yieldSeen.current && holdSeen.current && !castesShown.current) {
      castesShown.current = true
      setEureka(STACK_EUREKAS.castes)
    }
  }

  const pickBase = (b) => { setBaseId(b.id); register(b, delimId) }
  const pickDelim = (d) => { setDelimId(d.id); register(base, d.id) }

  // assemble the resulting word from its pieces
  const word = base.noun.kr + (displaced ? '' : base.base.kr) + (stacked ? delim.kr : '')
  const wordRr = base.noun.rr + (displaced ? '' : base.base.rr) + (stacked ? delim.rr : '')
  const wordJp = base.noun.jp + (displaced ? '' : base.base.jp) + (stacked ? delim.jp : '')

  const verdict = !stacked
    ? 'bare — pick 는, 도 or 만 and watch where it lands.'
    : displaced
      ? '격조사 — the case yields: ' + base.base.kr + ' steps aside for ' + delim.kr + '.'
      : 'adverbial — it holds: ' + base.base.kr + ' + ' + delim.kr + ' stack into ' +
        base.base.kr + delim.kr + '.'

  return (
    <div className="stack-stage" data-screen-label="The stack — particle compounding">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Korean particles compound — 학교<b>에는</b>, 친구<b>한테도</b>, 커피<b>만</b> — and one
        rule decides every combination. You already obey it in Japanese without knowing its name.
        Pick a base, then add a delimiter.
      </div>

      <div className="specimen-row">
        <span className="lbl">Base</span>
        {STACK_BASES.map(b => (
          <button
            key={b.id}
            className={'specimen-chip' + (b.id === baseId ? ' active' : '')}
            onClick={() => pickBase(b)}
          >
            <span className="kr">{b.noun.kr + b.base.kr}</span>{b.gloss}
          </button>
        ))}
      </div>
      <div className="specimen-row">
        <span className="lbl">Add</span>
        {STACK_DELIMS.map(d => (
          <button
            key={d.id}
            className={'specimen-chip' + (d.id === delimId ? ' active' : '')}
            onClick={() => pickDelim(d)}
          >
            <span className="kr">{d.kr}</span>{d.label}
            {showJp && d.id !== 'none' && <span className="chip-irr">{d.jp}</span>}
          </button>
        ))}
      </div>

      <div className="stx-board" key={baseId + '-' + delimId}>
        <div className="stx-eq kr">
          <span className="stx-piece noun">{base.noun.kr}</span>
          <span className="stx-plus">+</span>
          <span className={'stx-piece base' + (displaced ? ' displaced' : '')}>{base.base.kr}</span>
          {stacked && (
            <>
              <span className="stx-plus">+</span>
              <span className="stx-piece delim">{delim.kr}</span>
            </>
          )}
          <span className="stx-arrow">→</span>
          <span className="stx-word">{word}</span>
        </div>
        {showReadings && <div className="stx-rr">{wordRr}</div>}
        {showJp && (
          <div className="stx-eq-jp">
            <span className="stx-piece-jp noun">{base.noun.jp}</span>
            <span className="stx-plus">+</span>
            <span className={'stx-piece-jp base' + (displaced ? ' displaced' : '')}>{base.base.jp}</span>
            {stacked && (
              <>
                <span className="stx-plus">+</span>
                <span className="stx-piece-jp delim">{delim.jp}</span>
              </>
            )}
            <span className="stx-arrow">→</span>
            <span className="stx-word-jp">{wordJp}</span>
          </div>
        )}
        <div className={'stx-verdict' + (displaced ? ' yielded' : stacked ? ' held' : '')}>
          {base.base.tag} · {verdict}
        </div>

        <div className="stx-sent">
          <div className="stx-sent-kr kr" dangerouslySetInnerHTML={{ __html: combo.kr }} />
          {showReadings && <div className="stx-sent-rr">{combo.rr}</div>}
          {showJp && (
            <div className="stx-sent-jp">
              <span className="jp">{combo.jp}</span>
              {showReadings && <span className="jp-rr">{combo.jpRr}</span>}
            </div>
          )}
          <div className="stx-sent-en">{combo.en}</div>
        </div>
      </div>

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
