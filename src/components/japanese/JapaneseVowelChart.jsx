import React, { useRef, useState } from 'react'
import { VOWELS, VOWEL_NOTES, VOWEL_LANTERN } from '../../data/japanesePhonetics.js'
import { speak, primeSpeech, speechSupported, hasVoice } from '../scripts/speech.js'

// INSTRUMENT II — 母音 the five-vowel compass.
// Japanese has just five vowels, all short and pure. They sit on the real
// IPA trapezoid (front↔back × close↔open). Two honesties: う is [ɯ], close
// and back but UNROUNDED; and — the mirror the Korean folio promised — when
// the 한국어 bridge is on, Korean's TEN monophthongs ghost in underneath, so
// a Japanese ear can see exactly which gaps Korean splits open (ㅡ/ㅜ, ㅗ/ㅓ).

const byId = Object.fromEntries(VOWELS.map(v => [v.id, v]))

// IPA quadrilateral corners (SVG units) — shared geometry with the Korean compass.
const TL = [52, 32], TR = [270, 32], BR = [250, 200], BL = [122, 200]
function plot(vx, vy) {
  const topX = TL[0] + (TR[0] - TL[0]) * vx, topY = TL[1] + (TR[1] - TL[1]) * vx
  const botX = BL[0] + (BR[0] - BL[0]) * vx, botY = BL[1] + (BR[1] - BL[1]) * vx
  return [topX + (botX - topX) * vy, topY + (botY - topY) * vy]
}

function Mono({ v, sel, onPick }) {
  const [cx, cy] = plot(v.x, v.y)
  const on = sel === v.id
  return (
    <g className={'vc-node' + (on ? ' lit' : '') + (v.round ? ' round' : '')}
       onClick={() => onPick(v.id)} role="button" aria-label={v.kana} tabIndex={0}
       onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(v.id) } }}>
      {on && <circle className="vc-halo" cx={cx} cy={cy} r="17" />}
      {v.round && <circle className="vc-round-ring" cx={cx} cy={cy} r="13" />}
      <circle className="vc-dot" cx={cx} cy={cy} r={on ? 12 : 10} />
      <text className="vc-node-glyph jp" x={cx} y={cy} dominantBaseline="central" textAnchor="middle">{v.kana}</text>
    </g>
  )
}

// A Korean twin, ghosted in under the bridge. `split` ones (the vowels a
// Japanese ear must newly carve out) get the signal colour.
function KoGhost({ tw, from }) {
  const [kx, ky] = plot(tw.x, tw.y)
  return (
    <g className={'jvb-ghost' + (tw.split ? ' split' : '')} aria-hidden="true">
      <line className="jvb-link" x1={from[0]} y1={from[1]} x2={kx} y2={ky} />
      <circle className="jvb-dot" cx={kx} cy={ky} r="8.5" />
      <text className="jvb-glyph kr" x={kx} y={ky} dominantBaseline="central" textAnchor="middle">{tw.jamo}</text>
    </g>
  )
}

export default function JapaneseVowelChart({ showReadings = true, showJp = true }) {
  const [sel, setSel] = useState('u')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)
  const primed = useRef(false)
  const noVoice = !(speechSupported() && hasVoice('ja'))

  const v = byId[sel]

  const pick = (id) => {
    setSel(id)
    if (!primed.current) { primed.current = true; primeSpeech() }
    if (!fired.current) { fired.current = true; setLantern(true) }
    const vv = byId[id]
    if (vv && vv.speak) speak(vv.speak, { lang: 'ja-JP' })
  }

  return (
    <div className="vc-stage" data-screen-label="japanese vowel compass">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The frame is the real mouth — <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>front</b> at left,
        <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}> back</b> at right, high at top, open at the floor.
        Five clean vowels. {showJp ? 'The faint hangul are Korean’s ten, ghosted underneath — see where one Japanese vowel splits into two.' : 'Tap one to hear it.'}
      </div>

      <div className="vc-main">
        <div className="vc-chart">
          <svg viewBox="0 0 312 224" className="vc-trapezoid" role="img" aria-label="IPA vowel trapezoid with the five Japanese vowels plotted">
            <text className="vc-axis" x={(TL[0] + TR[0]) / 2} y="18" textAnchor="middle">tongue: front ← → back</text>
            <text className="vc-axis vert" x="20" y={(TL[1] + BL[1]) / 2} textAnchor="middle"
                  transform={`rotate(-90 20 ${(TL[1] + BL[1]) / 2})`}>close (high) ← → open (low)</text>
            <polygon className="vc-quad" points={`${TL} ${TR} ${BR} ${BL}`} />
            <line className="vc-grid" x1={plot(0, 0.5)[0]} y1={plot(0, 0.5)[1]} x2={plot(1, 0.5)[0]} y2={plot(1, 0.5)[1]} />

            {/* Korean ghosts, drawn under the Japanese nodes, only for the selected vowel */}
            {showJp && v.bridge?.ko.map((tw, i) => (
              <KoGhost key={i} tw={tw} from={plot(v.x, v.y)} />
            ))}

            {VOWELS.map(m => <Mono key={m.id} v={m} sel={sel} onPick={pick} />)}
          </svg>
          <div className="vc-chart-cap">
            ● the ring marks the one rounded vowel (お). The plot is schematic — broad Tokyo values.
            {showJp && <> Faint <span className="kr">하늘</span> hangul = the Korean vowel(s) this one maps to; <b className="jvb-splitword">gold</b> = a vowel Korean splits off that Japanese doesn’t have.</>}
          </div>
        </div>

        <div className="vc-readout" key={sel}>
          <div className="vc-headline">
            <span className="vc-big jp">{v.kana}</span>
            <div className="vc-headmeta">
              <span className="vc-big-ipa">[{v.ipa}]</span>
              {showReadings && <span className="vc-rr">{v.rr}</span>}
              <button className="vc-hear" onClick={() => pick(v.id)} aria-label={`hear ${v.kana}`}>
                ♪ hear <span className="jp">{v.kana}</span>
              </button>
            </div>
          </div>

          <div className="vc-tags">
            <span className="vc-tag">{v.x < 0.4 ? 'front' : v.x > 0.6 ? 'back' : 'central'}</span>
            <span className="vc-tag">{v.y < 0.3 ? 'close (high)' : v.y > 0.7 ? 'open (low)' : 'mid'}</span>
            <span className={'vc-tag ' + (v.round ? 'voi-voiced' : '')}>{v.round ? 'rounded lips' : 'unrounded'}</span>
          </div>

          <div className="vc-build">
            <p className="vc-build-prose">{v.note}</p>
          </div>

          {showJp && v.bridge && (
            <div className="jbridge">
              <span className="jbridge-mark">한국어</span>
              <span className="jvb-twins">
                {v.bridge.ko.map((tw, i) => (
                  <span key={i} className={'jvb-twin kr' + (tw.split ? ' split' : '')}>{tw.jamo}{showReadings && <em> {tw.rr}</em>}</span>
                ))}
              </span>
              {v.bridge.note}
            </div>
          )}
        </div>
      </div>

      {/* footnotes the kana don't show: length and devoicing */}
      <div className="jvc-notes">
        <div className="jvc-note"><span className="jvc-note-h jp">長音</span>{VOWEL_NOTES.length}</div>
        <div className="jvc-note"><span className="jvc-note-h jp">無声化</span>{VOWEL_NOTES.devoice}</div>
      </div>

      {noVoice && (
        <div className="cn-novoice">No Japanese system voice detected — the chart and IPA work; sound stays quiet until a 日本語 voice is installed.</div>
      )}

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{VOWEL_LANTERN.head}</div>
          <div className="body" dangerouslySetInnerHTML={{ __html: VOWEL_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
