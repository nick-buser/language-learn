import React, { useState, useRef } from 'react'
import { FORGE_VERBS, FORGE_TENSES, FORGE_EUREKAS } from '../../data/koreanData.js'

export default function VerbForge({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState(FORGE_VERBS[0].id)
  const [tenseId, setTenseId] = useState('present')
  const [eureka, setEureka] = useState(null)

  const seenBright = useRef(true) // the initial verb (가다) is bright — it counts as seen
  const seenDark = useRef(false)
  const harmonyShown = useRef(false)
  const bufferShown = useRef(false)
  const irregularShown = useRef(false)

  const verb = FORGE_VERBS.find(v => v.id === verbId)
  const tense = verb.tenses[tenseId]

  const maybeBuffer = (v, t) => {
    if (t === 'future' && v.batchim && !bufferShown.current) {
      bufferShown.current = true
      setEureka(FORGE_EUREKAS.buffer)
      return true
    }
    return false
  }

  const pickVerb = (v) => {
    setVerbId(v.id)
    if (v.harmony === 'bright') seenBright.current = true
    if (v.harmony === 'dark' && !v.irregular) seenDark.current = true
    if (v.irregular && !irregularShown.current) {
      irregularShown.current = true
      setEureka(FORGE_EUREKAS.irregular)
      return
    }
    if (maybeBuffer(v, tenseId)) return
    if (seenBright.current && seenDark.current && !harmonyShown.current) {
      harmonyShown.current = true
      setEureka(FORGE_EUREKAS.harmony)
    }
  }

  const pickTense = (t) => {
    setTenseId(t)
    maybeBuffer(verb, t)
  }

  const branch = verb.harmony // 'bright' | 'dark' | 'ha'

  return (
    <div className="forge-stage" data-screen-label="Verb forge">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Japanese conjugation made you learn <i>classes</i> — う-verbs, る-verbs, the two outlaws.
        Korean asks a different question, and asks it every single time:{' '}
        <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>what is the stem’s last vowel?</b>{' '}
        Pick a verb, pull a tense, and watch the ending get fitted.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {FORGE_VERBS.map(v => (
          <button
            key={v.id}
            className={'specimen-chip' + (v.id === verbId ? ' active' : '')}
            onClick={() => pickVerb(v)}
          >
            <span className="kr">{v.kr}</span>{v.gloss.replace('to ', '')}
            {v.irregular && <span className="chip-irr">불규칙</span>}
          </button>
        ))}
      </div>

      <div className="forge-body">
        {/* Left — the decision */}
        <div className="forge-left">
          <div className="forge-stem-card">
            <div className="fs-head">the stem</div>
            <div className="fs-main">
              <span className="fs-kr kr">{verb.stem}</span>
              <span className="fs-meta">
                {showReadings && <span className="fs-rr">{verb.stemRr}-</span>}
                <span className="fs-gloss">{verb.gloss}</span>
                {showJp && <span className="fs-jp">{verb.jp}</span>}
              </span>
            </div>
            <div className="fs-vowel">
              last vowel — <b className="kr">{verb.lastVowel}</b>
              {verb.irregular && <span className="fs-irr">⚠ {verb.irregular}</span>}
            </div>
          </div>

          <div className="forge-fork">
            <div className="ff-q">which ending vowel? the stem decides</div>
            <div className={'ff-branch' + (branch === 'bright' ? ' active' : '')}>
              <span className="ff-cond kr">ㅏ · ㅗ</span>
              <span className="ff-arr">→</span>
              <span className="ff-out kr">-아</span>
              <span className="ff-tag">bright · 양성</span>
            </div>
            <div className={'ff-branch' + (branch === 'dark' ? ' active' : '')}>
              <span className="ff-cond">anything else</span>
              <span className="ff-arr">→</span>
              <span className="ff-out kr">-어</span>
              <span className="ff-tag">dark · 음성</span>
            </div>
            <div className={'ff-branch' + (branch === 'ha' ? ' active' : '')}>
              <span className="ff-cond kr">하-</span>
              <span className="ff-arr">→</span>
              <span className="ff-out kr">해</span>
              <span className="ff-tag">the wildcard</span>
            </div>
          </div>
        </div>

        {/* Right — the assembly */}
        <div className="forge-right">
          <div className="forge-tenses" role="tablist" aria-label="tense">
            {FORGE_TENSES.map(t => (
              <button
                key={t.id}
                role="tab"
                aria-selected={t.id === tenseId}
                className={'forge-tense' + (t.id === tenseId ? ' active' : '')}
                onClick={() => pickTense(t.id)}
              >
                <span className="ft-en">{t.label}</span>
                <span className="ft-kr kr">{t.kr}</span>
              </button>
            ))}
          </div>

          <div className="forge-eq" key={verbId + '-' + tenseId}>
            <div className="fq-line">
              {tense.pieces.map((p, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="fq-plus">+</span>}
                  <span className={'fq-piece kr ' + p.c}>{p.t}</span>
                </React.Fragment>
              ))}
              <span className="fq-eqsign">=</span>
              <span className="fq-result kr">{tense.result}</span>
            </div>
            <div className="fq-readout">
              {showReadings && <span className="fq-rr">{tense.rr}</span>}
              <span className="fq-en">{tense.en}</span>
              {showJp && <span className="fq-jp">≈ {tense.jp}</span>}
            </div>
            <div className="fq-fuse" dangerouslySetInnerHTML={{ __html: tense.fuse }} />
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
