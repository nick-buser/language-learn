import React, { useRef, useState } from 'react'
import { VOWELS, HARMONY, VOWEL_LANTERN } from '../../data/koreanPhonetics.js'
import { speak, primeSpeech, speechSupported, hasVoice } from '../scripts/speech.js'

// INSTRUMENT II — 모음 the vowel compass.
// Two readings of the same letters, laid one over the other:
//   • the real IPA vowel TRAPEZOID (the "open diagram") — front↔back ×
//     close↔open, each Korean monophthong plotted where the tongue makes it;
//   • the letter GEOMETRY — every vowel built from ·/ㅡ/ㅣ, the dot's side
//     reading as 음양 (vowel harmony, the verb forge's 아/어 fork), a doubled
//     dot as a y-glide, an added ㅣ as the front vowels, a stacked pair as a
//     w-glide.
// The honesty is the point: the geometry is cosmological, not a tongue-map,
// and the trapezoid shows exactly where shape and mouth agree and diverge.

const byJamo = Object.fromEntries(VOWELS.map(v => [v.jamo, v]))
const byId = Object.fromEntries(VOWELS.map(v => [v.id, v]))

// IPA quadrilateral corners (SVG units): close-front, close-back, open-back, open-front.
const TL = [52, 32], TR = [270, 32], BR = [250, 200], BL = [122, 200]
function plot(vx, vy) {
  const topX = TL[0] + (TR[0] - TL[0]) * vx, topY = TL[1] + (TR[1] - TL[1]) * vx
  const botX = BL[0] + (BR[0] - BL[0]) * vx, botY = BL[1] + (BR[1] - BL[1]) * vx
  return [topX + (botX - topX) * vy, topY + (botY - topY) * vy]
}

const RULE_RACKS = [
  { rule: 'base',      k: '세 뿌리', l: 'the three roots' },
  { rule: 'yinyang',   k: '기본',    l: 'a dot on an axis — and 음양' },
  { rule: 'ioffglide', k: '＋ㅣ',    l: 'add ㅣ — the front vowels' },
  { rule: 'yglide',    k: '＋·',     l: 'double the dot — a y-glide' },
  { rule: 'wglide',    k: 'ㅗ/ㅜ＋',  l: 'stack two — a w-glide' },
]

const RULE_BADGE = {
  base: 'a root stroke', yinyang: 'dot side = 음양 harmony',
  ioffglide: 'fossil ㅣ off-glide', yglide: 'doubled dot = +/j/', wglide: 'rounded + open = +/w/',
}

function Mono({ v, sel, onPick }) {
  const [cx, cy] = plot(v.x, v.y)
  const on = sel === v.id
  return (
    <g className={'vc-node' + (on ? ' lit' : '') + (v.round ? ' round' : '')}
       onClick={() => onPick(v.id)} role="button" aria-label={v.jamo} tabIndex={0}
       onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(v.id) } }}>
      {on && <circle className="vc-halo" cx={cx} cy={cy} r="16" />}
      {v.round && <circle className="vc-round-ring" cx={cx} cy={cy} r="12.5" />}
      <circle className="vc-dot" cx={cx} cy={cy} r={on ? 11 : 9} />
      <text className="vc-node-glyph kr" x={cx} y={cy} dominantBaseline="central" textAnchor="middle">{v.jamo}</text>
    </g>
  )
}

export default function VowelCompass({ showReadings = true }) {
  const [sel, setSel] = useState('a')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)
  const primed = useRef(false)
  const noVoice = !(speechSupported() && hasVoice('ko'))

  const v = byId[sel]
  const harm = HARMONY[v.harmony]
  const monos = VOWELS.filter(x => x.mono)

  const pick = (id) => {
    setSel(id)
    if (!primed.current) { primed.current = true; primeSpeech() }
    if (!fired.current) { fired.current = true; setLantern(true) }
    const vv = byId[id]
    if (vv && vv.speak) speak(vv.speak, { lang: 'ko-KR' })
  }

  // a glide's component arrow on the trapezoid (part vowels that have a plot)
  const arrow = (() => {
    if (v.mono || v.parts.length < 2) return null
    const a = byJamo[v.parts[0]], b = byJamo[v.parts[1]]
    if (!a || !b || a.jamo === '·' || b.jamo === '·') return null
    const [ax, ay] = plot(a.x, a.y), [bx, by] = plot(b.x, b.y)
    return { ax, ay, bx, by }
  })()

  return (
    <div className="vc-stage" data-screen-label="vowel compass">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The frame is the real mouth — <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>front</b> at left,
        <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}> back</b> at right, high at top, open at the floor.
        Tap a vowel and read its letter the other way: built from a dot and two lines.
      </div>

      <div className="vc-main">
        {/* the IPA trapezoid — the open diagram */}
        <div className="vc-chart">
          <svg viewBox="0 0 312 224" className="vc-trapezoid" role="img" aria-label="IPA vowel trapezoid with Korean vowels plotted">
            <text className="vc-axis" x={(TL[0] + TR[0]) / 2} y="18" textAnchor="middle">tongue: front ← → back</text>
            <text className="vc-axis vert" x="20" y={(TL[1] + BL[1]) / 2} textAnchor="middle"
                  transform={`rotate(-90 20 ${(TL[1] + BL[1]) / 2})`}>close (high) ← → open (low)</text>
            <polygon className="vc-quad" points={`${TL} ${TR} ${BR} ${BL}`} />
            {/* a mid gridline for height */}
            <line className="vc-grid" x1={plot(0, 0.5)[0]} y1={plot(0, 0.5)[1]} x2={plot(1, 0.5)[0]} y2={plot(1, 0.5)[1]} />

            {arrow && (
              <g className="vc-arrow">
                <defs>
                  <marker id="vc-head" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" />
                  </marker>
                </defs>
                <line x1={arrow.ax} y1={arrow.ay} x2={arrow.bx} y2={arrow.by} markerEnd="url(#vc-head)" />
              </g>
            )}

            {monos.map(m => <Mono key={m.id} v={m} sel={sel} onPick={pick} />)}
          </svg>
          <div className="vc-chart-cap">
            ● rounded vowels carry a ring (ㅗ ㅜ ㅚ ㅟ). The plot is schematic — conservative Seoul values;
            ㅐ/ㅔ and ㅚ/ㅟ are drifting together for younger speakers.
          </div>
        </div>

        {/* the readout */}
        <div className="vc-readout" key={sel}>
          <div className="vc-headline">
            <span className="vc-big kr">{v.jamo}</span>
            <div className="vc-headmeta">
              <span className="vc-big-ipa">[{v.ipa}]</span>
              {showReadings && <span className="vc-rr">{v.rr}</span>}
              {v.speak && (
                <button className="vc-hear" onClick={() => pick(v.id)} aria-label={`hear ${v.jamo}`}>
                  ♪ hear <span className="kr">{v.speak}</span>
                </button>
              )}
            </div>
          </div>

          <div className="vc-tags">
            <span className={'vc-tag harm-' + v.harmony}>{harm.ko} · {harm.en}</span>
            <span className="vc-tag">{RULE_BADGE[v.rule]}</span>
            {v.round && <span className="vc-tag">rounded lips</span>}
          </div>

          {/* the geometry build */}
          <div className="vc-build">
            <div className="vc-build-parts">
              {v.parts.map((p, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="vc-plus">+</span>}
                  <span className="vc-part kr">{p}</span>
                </React.Fragment>
              ))}
              <span className="vc-eq">=</span>
              <span className="vc-part result kr">{v.jamo}</span>
            </div>
            <p className="vc-build-prose">{v.build}</p>
          </div>

          {/* harmony cross-link to the verb forge — scoped to the four basic
              vowels, where the dot-side maps *exactly* onto -아/-어. (ㅐ/ㅚ are
              historically yang but conjugate dark, so we don't overclaim them.) */}
          {v.rule === 'yinyang' && (
            <div className="vc-harmony-link">
              <span className="vc-harm-mark">아/어</span>
              {harm.note} <a href="#/ko/verbs">→ the verb forge runs on exactly this split.</a>
            </div>
          )}
        </div>
      </div>

      {/* the racks — every vowel, grouped by the rule that builds it */}
      <div className="vc-racks">
        {RULE_RACKS.map(r => {
          const items = VOWELS.filter(x => x.rule === r.rule && x.jamo !== '·')
          const arae = r.rule === 'base'
          return (
            <div className="vc-rack" key={r.rule}>
              <div className="vc-rack-head"><span className="kr">{r.k}</span><span className="vc-rack-l">{r.l}</span></div>
              <div className="vc-rack-row">
                {arae && (
                  <span className="vc-chip arae kr" title="아래아 — the Heaven dot, now retired as a letter">·</span>
                )}
                {items.map(x => (
                  <button key={x.id}
                          className={'vc-chip' + (sel === x.id ? ' active' : '') + (x.mono ? ' mono' : '') + ' harm-' + x.harmony}
                          onClick={() => pick(x.id)} aria-pressed={sel === x.id}>
                    <span className="kr">{x.jamo}</span>
                    {showReadings && <span className="vc-chip-rr">{x.rr}</span>}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {noVoice && (
        <div className="cn-novoice">No Korean system voice detected — the chart and IPA work; sound stays quiet until a 한국어 voice is installed.</div>
      )}

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{VOWEL_LANTERN.head}</div>
          <div className="body" dangerouslySetInnerHTML={{ __html: VOWEL_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
