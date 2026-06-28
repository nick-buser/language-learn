import React, { useState, useRef } from 'react'
import { FORGE_VERBS, JV_CLASSES, JV_TENSES, tenseCells, FORGE_EUREKAS } from '../../data/japaneseVerbs.js'

// The verb forge — class fork on the left, TENSE down the right, and the
// plain | polite lanes across. Politeness is its own axis (its own instrument
// below), so it comes out of the form list: here you read tense in both
// registers at once. The lanes do real work — the plain past carries 音便
// (飲んだ) while the polite past keeps the clean 連用形 (飲みました).
export default function JapaneseVerbForge({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState(FORGE_VERBS[0].id)
  const [tenseId, setTenseId] = useState('nonpast')
  const [eureka, setEureka] = useState(null)

  const seenIchidan = useRef(true)
  const seenGodan = useRef(false)
  const classShown = useRef(false)
  const onbinShown = useRef(false)
  const irregularShown = useRef(false)

  const verb = FORGE_VERBS.find(v => v.id === verbId)
  const cls = JV_CLASSES.find(c => c.id === verb.cls)
  const cells = tenseCells(verb)
  const tense = cells[tenseId]

  const maybeOnbin = (v, t) => {
    if (v.cls === 'godan' && v.onbin && t === 'past' && !onbinShown.current) {
      onbinShown.current = true
      setEureka(FORGE_EUREKAS.onbin)
      return true
    }
    return false
  }

  const pickVerb = (v) => {
    setVerbId(v.id)
    if (v.cls === 'ichidan') seenIchidan.current = true
    if (v.cls === 'godan') seenGodan.current = true
    if (v.cls === 'irregular' && !irregularShown.current) {
      irregularShown.current = true
      setEureka(FORGE_EUREKAS.irregular)
      return
    }
    if (maybeOnbin(v, tenseId)) return
    if (seenIchidan.current && seenGodan.current && !classShown.current) {
      classShown.current = true
      setEureka(FORGE_EUREKAS.cls)
    }
  }

  const pickTense = (t) => { setTenseId(t); maybeOnbin(verb, t) }

  const Lane = ({ cell, label, kr }) => (
    <div className="vlane">
      <div className="vlane-head"><span className="vl-reg">{label}</span><span className="vl-kr kr">{kr}</span></div>
      <div className="forge-eq" key={verbId + '-' + tenseId + '-' + label}>
        <div className="fq-line">
          {cell.pieces.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="fq-plus">+</span>}
              <span className={'fq-piece jp ' + p.c}>{p.t}</span>
            </React.Fragment>
          ))}
          <span className="fq-eqsign">=</span>
          <span className="fq-result jp">{cell.result}</span>
        </div>
        <div className="fq-readout">
          {showReadings && <span className="fq-rr">{cell.reading}</span>}
          <span className="fq-en">{cell.en}</span>
        </div>
        {showJp && (
          <div className="fq-ko">
            <span className="kr">{cell.ko}</span>
            {showReadings && <span className="fq-ko-rr">{cell.koRr}</span>}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="forge-stage ja" data-screen-label="Japanese verb forge">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The class decides how the stem shifts; <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>tense</b>{' '}
        decides the ending. Politeness is a third thing entirely — so it’s pulled out as the two{' '}
        <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>lanes</b>, plain and polite, read side by
        side. Pick a verb, pull a tense, and watch the past split: plain takes 音便, polite keeps the clean 連用形.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {FORGE_VERBS.map(v => (
          <button key={v.id} className={'specimen-chip' + (v.id === verbId ? ' active' : '')} onClick={() => pickVerb(v)}>
            <span className="jp">{v.jp}</span>{v.gloss.replace('to ', '')}
            {v.cls === 'irregular' && <span className="chip-irr">不規則</span>}
          </button>
        ))}
      </div>

      <div className="forge-body">
        {/* Left — the class decision */}
        <div className="forge-left">
          <div className="forge-stem-card">
            <div className="fs-head">the dictionary form</div>
            <div className="fs-main">
              <span className="fs-kr jp">{verb.jp}</span>
              <span className="fs-meta">
                {showReadings && <span className="fs-rr">{verb.reading}</span>}
                <span className="fs-gloss">{verb.gloss}</span>
                {showJp && (
                  <span className="fs-ko"><span className="kr">{verb.ko}</span>{showReadings && <span className="fs-ko-rr">{verb.koRr}</span>}</span>
                )}
              </span>
            </div>
            <div className="fs-vowel">
              class — <b className="jp">{cls.jp}</b> <span className="fs-cls-en">{cls.en}</span>
              <span className="fs-cls-rule">{cls.rule}</span>
            </div>
          </div>

          <div className="forge-fork">
            <div className="ff-q">which class? the dictionary form tells you</div>
            {JV_CLASSES.map(c => (
              <div key={c.id} className={'ff-branch' + (verb.cls === c.id ? ' active' : '')}>
                <span className="ff-cond">{c.cond}</span>
                <span className="ff-arr">→</span>
                <span className="ff-out jp">{c.jp}</span>
                <span className="ff-tag">{c.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — tense selector + the two lanes */}
        <div className="forge-right">
          <div className="forge-tenses jv-tenses" role="tablist" aria-label="tense">
            {JV_TENSES.map(t => (
              <button key={t.id} role="tab" aria-selected={t.id === tenseId}
                className={'forge-tense' + (t.id === tenseId ? ' active' : '')} onClick={() => pickTense(t.id)}>
                <span className="ft-en">{t.label}</span>
                <span className="ft-kr jp">{t.jp}</span>
              </button>
            ))}
          </div>

          <div className="lane-pair">
            <Lane cell={tense.plain} label="plain" kr="반말" />
            <Lane cell={tense.polite} label="polite" kr="해요체" />
          </div>
          <div className="lane-note">
            {tenseId === 'past'
              ? <>The split to watch: <b>plain</b> past takes 音便 (the euphonic stem-morph), <b>polite</b> past keeps the clean 連用形 stem + ました.</>
              : tenseId === 'prog'
                ? <>〜ている is the same te-form + いる/います — Korean’s -고 있다 agrees here exactly (먹고 있어 / 먹고 있어요).</>
                : <>Non-past covers now, habit, and future alike. Plain is the bare dictionary form; polite adds 連用形 + ます.</>}
          </div>
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
