import React, { useState, useRef } from 'react'
import { REGISTER_LEVELS, REGISTER_EUREKAS } from '../../data/koreanData.js'

// 2×2 truth of the four levels: formality × politeness
const AXIS = [
  { row: '격식 · formal',   cells: ['hapsyo', 'haera'] },
  { row: '비격식 · relaxed', cells: ['haeyo', 'hae'] },
]

export default function RegisterDial({ showReadings, showJp }) {
  const [i, setI] = useState(1) // start at 해요체 — the learner's home register
  const [honor, setHonor] = useState(false)
  const [eureka, setEureka] = useState(null)

  const banmalShown = useRef(false)
  const honorShown = useRef(false)
  const kkeseoShown = useRef(false)

  const level = REGISTER_LEVELS[i]
  const mode = honor ? level.honor : level.plain

  const goLevel = (idx) => {
    setI(idx)
    const id = REGISTER_LEVELS[idx].id
    if (id === 'hae') {
      if (honor && !honorShown.current) {
        honorShown.current = true
        setEureka(REGISTER_EUREKAS.honor)
      } else if (!banmalShown.current) {
        banmalShown.current = true
        setEureka(REGISTER_EUREKAS.banmal)
      }
    }
  }

  const toggleHonor = () => {
    const next = !honor
    setHonor(next)
    if (next) {
      if (level.id === 'hae' && !honorShown.current) {
        honorShown.current = true
        setEureka(REGISTER_EUREKAS.honor)
      } else if (!kkeseoShown.current) {
        kkeseoShown.current = true
        setEureka(REGISTER_EUREKAS.kkeseo)
      }
    }
  }

  return (
    <div className="dial-stage reg" data-screen-label="Register dial">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        One sentence — <i>going home</i> — spoken four ways. Nothing about the going changes;
        what changes is <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>who is listening</b>.
        This is the load-bearing wall of spoken Korean, and the engine of every K-drama scene.
      </div>

      <div className="dial-track" role="tablist" aria-label="speech level">
        {REGISTER_LEVELS.map((s, idx) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={idx === i}
            className={'dial-stop' + (idx === i ? ' active' : '')}
            onClick={() => goLevel(idx)}
          >
            <span className="vlabel-jp kr">{s.kr}</span>
            <span className="vlabel-en">{s.en}</span>
          </button>
        ))}
      </div>

      <div className="reg-honor-row">
        <span
          className={'mini-toggle' + (honor ? ' on' : '')}
          onClick={toggleHonor}
          role="switch"
          aria-checked={honor}
          style={{ cursor: 'pointer' }}
        >
          <span className="box"></span>
          -시- · honor the subject
        </span>
        <span className="reg-honor-note">
          {honor
            ? <>now speaking <i>about</i> 할머니 (halmeoni — grandmother)</>
            : <>speaking about yourself — flip to speak about grandmother</>}
        </span>
      </div>

      <div className="reg-readout">
        {/* Left — the morphology */}
        <div className="reg-form">
          <div className="rf-ending">
            <span className="rf-name kr">{level.ending}</span>
            <span className="rf-levelname">{level.kr} · {level.rr}</span>
          </div>
          <div className="rf-endnote">{level.endingNote}</div>

          <div className="forge-eq reg-eq" key={level.id + (honor ? '-h' : '-p')}>
            <div className="fq-line">
              {mode.eq.map((p, k) => (
                <React.Fragment key={k}>
                  {k > 0 && <span className="fq-plus">+</span>}
                  <span className={'fq-piece kr ' + p.c}>{p.t}</span>
                </React.Fragment>
              ))}
            </div>
            <div className="rf-sentence kr">{mode.sent}</div>
            {showReadings && <div className="rf-rr">{mode.rr}</div>}
            <div className="rf-en">{mode.en}</div>
            {mode.note && <div className="fq-fuse" dangerouslySetInnerHTML={{ __html: mode.note }} />}
            {showJp && <div className="rf-jp">{level.jp}</div>}
          </div>
        </div>

        {/* Right — the social map */}
        <div className="reg-map">
          <div className="axis-map">
            <div className="am-head">the four levels, mapped</div>
            <div className="am-grid">
              <div className="am-corner"></div>
              <div className="am-col">존댓말 · polite</div>
              <div className="am-col">반말 · plain</div>
              {AXIS.map(row => (
                <React.Fragment key={row.row}>
                  <div className="am-row">{row.row}</div>
                  {row.cells.map(id => {
                    const idx = REGISTER_LEVELS.findIndex(l => l.id === id)
                    const l = REGISTER_LEVELS[idx]
                    return (
                      <button
                        key={id}
                        className={'am-cell' + (id === level.id ? ' active' : '')}
                        onClick={() => goLevel(idx)}
                      >
                        <span className="kr">{l.kr}</span>
                      </button>
                    )
                  })}
                </React.Fragment>
              ))}
            </div>
            <div className={'am-si' + (honor ? ' on' : '')}>
              <span className="lamp"></span>
              -시- subject honor — the third, independent axis
            </div>
          </div>

          <div className="reg-scene">
            <div className="rs-actor">
              <div className="figure kr">나</div>
              <div className="who">you</div>
            </div>
            <div className="rs-gap" style={{ '--dist': level.listener.dist }} aria-hidden="true">
              <span className="rs-line"></span>
            </div>
            <div className="rs-actor listener">
              <div className="figure kr">{level.listener.kr}</div>
              <div className="who">
                {level.listener.en}
                {showReadings && <span className="rs-rr"> · {level.listener.rr}</span>}
              </div>
            </div>
          </div>
          <div className="reg-context">{level.context}</div>
          <div className="reg-kdrama">
            <span className="rk-label">k-drama field note</span>
            {level.kdrama}
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
