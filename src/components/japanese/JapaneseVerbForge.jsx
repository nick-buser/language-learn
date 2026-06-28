import React, { useState, useRef } from 'react'
import { FORGE_VERBS, JV_CLASSES, JV_FORMS, FORGE_EUREKAS } from '../../data/japaneseVerbs.js'

// The Japanese mirror of the Korean verb forge. The fork is the verb
// CLASS (一段 / 五段 / 不規則), and the gold syllable in the equation is
// the class-driven stem shift. `showJp` here means "show the Korean
// twin" — the reverse bridge, for the Korean learner.
export default function JapaneseVerbForge({ showReadings, showJp }) {
  const [verbId, setVerbId] = useState(FORGE_VERBS[0].id)
  const [formId, setFormId] = useState('polite')
  const [eureka, setEureka] = useState(null)

  const seenIchidan = useRef(true) // 食べる ships selected — counts as seen
  const seenGodan = useRef(false)
  const classShown = useRef(false)
  const onbinShown = useRef(false)
  const irregularShown = useRef(false)

  const verb = FORGE_VERBS.find(v => v.id === verbId)
  const form = verb.forms[formId]
  const cls = JV_CLASSES.find(c => c.id === verb.cls)

  const maybeOnbin = (v, f) => {
    if (v.cls === 'godan' && v.onbin && (f === 'past' || f === 'te') && !onbinShown.current) {
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
    if (maybeOnbin(v, formId)) return
    if (seenIchidan.current && seenGodan.current && !classShown.current) {
      classShown.current = true
      setEureka(FORGE_EUREKAS.cls)
    }
  }

  const pickForm = (f) => {
    setFormId(f)
    maybeOnbin(verb, f)
  }

  return (
    <div className="forge-stage ja" data-screen-label="Japanese verb forge">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        You sorted these verbs years ago — into る-verbs, う-verbs, the two outlaws. Here that sort
        is the whole machine:{' '}
        <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>what class is the verb?</b>{' '}
        decides how the stem shifts. Pick a verb, pull a form — and watch the bridge: Korean answers a
        different question (the stem’s last <i>vowel</i>) and needs no classes at all.
      </div>

      <div className="specimen-row">
        <span className="lbl">Verb</span>
        {FORGE_VERBS.map(v => (
          <button
            key={v.id}
            className={'specimen-chip' + (v.id === verbId ? ' active' : '')}
            onClick={() => pickVerb(v)}
          >
            <span className="jp">{v.jp}</span>{v.gloss.replace('to ', '')}
            {v.cls === 'irregular' && <span className="chip-irr">不規則</span>}
          </button>
        ))}
      </div>

      <div className="forge-body">
        {/* Left — the decision */}
        <div className="forge-left">
          <div className="forge-stem-card">
            <div className="fs-head">the dictionary form</div>
            <div className="fs-main">
              <span className="fs-kr jp">{verb.jp}</span>
              <span className="fs-meta">
                {showReadings && <span className="fs-rr">{verb.reading}</span>}
                <span className="fs-gloss">{verb.gloss}</span>
                {showJp && (
                  <span className="fs-ko">
                    <span className="kr">{verb.ko}</span>
                    {showReadings && <span className="fs-ko-rr">{verb.koRr}</span>}
                  </span>
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

        {/* Right — the assembly */}
        <div className="forge-right">
          <div className="forge-tenses jv-forms" role="tablist" aria-label="form">
            {JV_FORMS.map(f => (
              <button
                key={f.id}
                role="tab"
                aria-selected={f.id === formId}
                className={'forge-tense' + (f.id === formId ? ' active' : '')}
                onClick={() => pickForm(f.id)}
              >
                <span className="ft-en">{f.label}</span>
                <span className="ft-kr jp">{f.jp}</span>
              </button>
            ))}
          </div>

          <div className="forge-eq" key={verbId + '-' + formId}>
            <div className="fq-line">
              {form.pieces.map((p, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="fq-plus">+</span>}
                  <span className={'fq-piece jp ' + p.c}>{p.t}</span>
                </React.Fragment>
              ))}
              <span className="fq-eqsign">=</span>
              <span className="fq-result jp">{form.result}</span>
            </div>
            <div className="fq-readout">
              {showReadings && <span className="fq-rr">{form.reading}</span>}
              <span className="fq-en">{form.en}</span>
            </div>
            {showJp && (
              <div className="fq-ko">
                <span className="kr">{form.ko}</span>
                {showReadings && <span className="fq-ko-rr">{form.koRr}</span>}
              </div>
            )}
            <div className="fq-fuse" dangerouslySetInnerHTML={{ __html: form.fuse }} />
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
