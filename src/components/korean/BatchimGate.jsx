import React, { useState, useRef } from 'react'
import { GATE_NOUNS, GATE_PAIRS, GATE_EUREKAS } from '../../data/koreanData.js'

// Hangul syllable → jamo decomposition (U+AC00 block arithmetic)
const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
const JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
const JONG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

function decompose(ch) {
  const code = ch.codePointAt(0) - 0xAC00
  if (code < 0 || code > 11171) return null
  return {
    cho: CHO[Math.floor(code / 588)],
    jung: JUNG[Math.floor((code % 588) / 28)],
    jong: JONG[code % 28],
  }
}

function Rr({ rr }) {
  if (Array.isArray(rr)) {
    return <>{rr[0]}<span className="liaison">{rr[1]}</span>{rr[2]}</>
  }
  return <>{rr}</>
}

export default function BatchimGate({ showReadings, showJp }) {
  const [nounId, setNounId] = useState(GATE_NOUNS[0].id)
  const [eureka, setEureka] = useState(null)
  const seenOpen = useRef(true) // the initial noun (커피) is open — it counts as seen
  const seenClosed = useRef(false)
  const mainShown = useRef(false)
  const lShown = useRef(false)

  const noun = GATE_NOUNS.find(n => n.id === nounId)
  const finalJamo = decompose(noun.kr[noun.kr.length - 1])
  const closed = !!(finalJamo && finalJamo.jong)

  const pick = (n) => {
    setNounId(n.id)
    const f = decompose(n.kr[n.kr.length - 1])
    const isClosed = !!(f && f.jong)
    if (isClosed) seenClosed.current = true
    else seenOpen.current = true
    if (n.lFinal && mainShown.current && !lShown.current) {
      lShown.current = true
      setEureka(GATE_EUREKAS.lFinal)
    } else if (seenOpen.current && seenClosed.current && !mainShown.current) {
      mainShown.current = true
      setEureka(GATE_EUREKAS.bothSeen)
    }
  }

  return (
    <div className="gate-stage" data-screen-label="Batchim gate">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Japanese particles never change — は is は after anything. Korean particles are{' '}
        <i>tailored</i>: each one has two shapes, and the noun’s last sound picks between them.
        Choose a noun and watch every particle re-cut itself to fit.
      </div>

      <div className="specimen-row">
        <span className="lbl">Noun</span>
        {GATE_NOUNS.map(n => (
          <button
            key={n.id}
            className={'specimen-chip' + (n.id === nounId ? ' active' : '')}
            onClick={() => pick(n)}
          >
            <span className="kr">{n.kr}</span>{n.gloss}
          </button>
        ))}
      </div>

      <div className="gate-body">
        {/* The noun under examination, last syllable opened up */}
        <div className="gate-noun-stage">
          <div className="gate-noun kr">{noun.kr}</div>
          {showReadings && <div className="gate-noun-rr">{noun.rr}</div>}
          <div className="gate-noun-gloss">
            {noun.gloss}
            <span className="origin"> · {noun.origin}</span>
          </div>

          {finalJamo && (
            <div className="gate-anatomy" key={nounId}>
              <div className="ga-label">last syllable, opened</div>
              <div className="ga-boxes">
                <div className="ga-box"><span className="kr">{finalJamo.cho}</span></div>
                <div className="ga-box"><span className="kr">{finalJamo.jung}</span></div>
                <div className={'ga-box jong' + (closed ? ' filled' : ' empty')}>
                  <span className="kr">{closed ? finalJamo.jong : ''}</span>
                </div>
              </div>
              <div className={'ga-verdict' + (closed ? ' closed' : '')}>
                {closed
                  ? <>받침 <b className="kr">{finalJamo.jong}</b> — the door is <b>closed</b></>
                  : <>no 받침 — the door is <b>open</b></>}
              </div>
            </div>
          )}
        </div>

        {/* The five particle pairs resolving against the noun */}
        <div className="gate-pairs" key={'pairs-' + nounId}>
          {GATE_PAIRS.map((p, i) => {
            const useOpen = p.lException && noun.lFinal ? true : !closed
            const form = noun.forms[i]
            const lExcActive = p.lException && noun.lFinal
            return (
              <div
                className={'gate-row' + (lExcActive ? ' l-exc' : '')}
                key={p.id}
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <div className="gr-role">
                  {p.role}
                  {showJp && <span className="gr-jp">{p.jp}</span>}
                </div>
                <div className="gr-pair kr" aria-label={'particle pair ' + p.closed + ' / ' + p.open}>
                  <span className={'gr-half' + (!useOpen ? ' on' : '')}>{p.closed}</span>
                  <span className="gr-slash">/</span>
                  <span className={'gr-half' + (useOpen ? ' on' : '')}>{p.open}</span>
                </div>
                <div className="gr-result">
                  <span className="gr-word kr">{form.kr}</span>
                  {showReadings && (
                    <span className="gr-rr"><Rr rr={form.rr} /></span>
                  )}
                </div>
                {lExcActive && (
                  <div className="gr-exc-note">ㄹ counts as open here → {noun.kr}로</div>
                )}
              </div>
            )
          })}
          <div className="gate-foot">
            after a 받침 → left shape · after a vowel → right shape
            <span className="invariant"> — meanwhile 하고 (=と) and 한테 (=に, spoken) never change: training wheels exist.</span>
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
