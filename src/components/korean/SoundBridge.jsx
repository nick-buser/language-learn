import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { BRIDGE_RULES, BRIDGE_INITIALS, BRIDGE_EUREKAS } from '../../data/koreanCognates.js'

// The sound bridge — on'yomi ↔ Sino-Korean finals as a working rule table.
// The JP reading here is the subject matter, not scaffolding, so this
// instrument ignores the showJp toggle; romanizations honor showReadings.
// Exposes selectRule() so the ledger's rule chips can drive it.
const SoundBridge = forwardRef(function SoundBridge({ showReadings }, ref) {
  const [ruleId, setRuleId] = useState(BRIDGE_RULES[0].id)
  const [eureka, setEureka] = useState(null)
  const seen = useRef(new Set([BRIDGE_RULES[0].id]))
  const fired = useRef(new Set())
  const stageRef = useRef(null)

  const fire = (key) => {
    if (fired.current.has(key)) return false
    fired.current.add(key)
    setEureka(BRIDGE_EUREKAS[key])
    return true
  }

  const pick = (id) => {
    setRuleId(id)
    seen.current.add(id)
    if (id === 't') {
      if (fire('tToL')) return
    }
    if (seen.current.has('n') && seen.current.has('m')) {
      if (fire('merged')) return
    }
    if (seen.current.size === BRIDGE_RULES.length) fire('allSix')
  }

  useImperativeHandle(ref, () => ({
    selectRule(id) {
      pick(id)
      stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    },
  }))

  const rule = BRIDGE_RULES.find(r => r.id === ruleId)

  return (
    <div className="bridge-stage" ref={stageRef} data-screen-label="Sound bridge">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Your on’yomi and Sino-Korean are the <i>same words</i> — Middle Chinese, borrowed twice.
        The borrowings disagree most at the syllable’s end. Six finals, six fates: pick one and
        watch it cross.
      </div>

      <div className="specimen-row">
        <span className="lbl">Final</span>
        {BRIDGE_RULES.map(r => (
          <button
            key={r.id}
            className={'specimen-chip br-chip' + (r.id === ruleId ? ' active' : '')}
            style={{ '--rule-c': r.color }}
            onClick={() => pick(r.id)}
          >
            <span className="kr">{r.krFinal}</span>{r.krRr}
          </button>
        ))}
      </div>

      <div className="br-panel" key={ruleId} style={{ '--rule-c': rule.color }}>
        <div className="br-eq">
          <span className="br-eq-ja">{rule.jaShape}</span>
          <span className="br-eq-arrow">⇄</span>
          <span className="br-eq-ko kr">{rule.krFinal}</span>
          <span className="br-eq-name">{rule.name}</span>
          <span className="br-eq-mc">{rule.mc}</span>
        </div>
        <div className="br-body" dangerouslySetInnerHTML={{ __html: rule.bodyHtml }} />

        <div className="br-specimens">
          {rule.specimens.map((s, i) => (
            <div className="br-spec" key={s.hanja} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="br-spec-hanja">{s.hanja}</div>
              <div className="br-spec-cross">
                <div className="br-side ja">
                  <span className="br-kana">{s.ja.head}<b className="br-tail">{s.ja.tail}</b></span>
                  {showReadings && (
                    <span className="br-rr">{s.ja.rrHead}<b className="br-tail">{s.ja.rrTail}</b></span>
                  )}
                </div>
                <div className="br-arrow">→</div>
                <div className="br-side ko">
                  <span className="br-hangul kr">{s.ko.hangul}</span>
                  {showReadings && (
                    <span className="br-rr">{s.ko.rrHead}<b className="br-tail">{s.ko.rrTail}</b></span>
                  )}
                </div>
              </div>
              <div className="br-spec-gloss">{s.gloss}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="spot-footnotes br-initials">
        {BRIDGE_INITIALS.map(f => (
          <div className="spot-footnote" key={f.id}>
            <div className="fn-head">the initials drawer · {f.label} — {f.head}</div>
            <div className="fn-body" dangerouslySetInnerHTML={{ __html: f.html }} />
          </div>
        ))}
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
})

export default SoundBridge
