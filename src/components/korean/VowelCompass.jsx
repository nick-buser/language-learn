import React, { useRef, useState } from 'react'
import { VOWELS, HARMONY, VOWEL_LANTERN, VOICE_CALIBRATION, VOICE_LANTERN } from '../../data/koreanPhonetics.js'
import { speak, primeSpeech, speechSupported, hasVoice } from '../scripts/speech.js'
import { useVoiceCompass } from '../scripts/useVoiceCompass.js'
import VoiceReadout from '../phonetics/VoiceReadout.jsx'

// INSTRUMENT II — 모음 the vowel compass. One trapezoid, two views:
//   • 모음 (the vowels) — the real IPA vowel TRAPEZOID (front↔back × close↔open)
//     laid UNDER the letter GEOMETRY: every monophthong built from ·/ㅡ/ㅣ, the
//     dot's side reading as 음양 (vowel harmony, the verb forge's 아/어 fork), a
//     doubled dot a y-glide, an added ㅣ the front vowels, a stacked pair a
//     w-glide. The honesty is the point: the geometry is cosmological, not a
//     tongue-map, and the trapezoid shows where shape and mouth agree and part.
//   • 발성 (your voice) — the learner's own vowels, measured off the mic and
//     dropped onto the SAME trapezoid beside the ideal ten. Formants are
//     speaker-relative, so the dot is anchored to your voice first (say the
//     three corner vowels). The mic + affine fit live in the formants seam, the
//     audio state machine in the shared useVoiceCompass hook, the readout in the
//     shared <VoiceReadout> — this folio just supplies its vowels + jamo + copy.

const byJamo = Object.fromEntries(VOWELS.map(v => [v.jamo, v]))
const byId = Object.fromEntries(VOWELS.map(v => [v.id, v]))
// The plotted monophthongs — the dots the compass can place a reading among.
const MONOS = VOWELS.filter(v => v.mono)

// Korean calibration is its OWN voice space — separate localStorage keys from
// the Japanese 発声 compass on purpose (see the note in koreanPhonetics.js):
// anchoring on rounded ㅜ here would misplace Japanese's unrounded う there.
const CAL_KEY = 'atlas.ko.formant.cal.v1'
const CALQ_KEY = 'atlas.ko.formant.calq.v1'

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

// A faint anchor — the plotted monophthongs as a backdrop in the voice view.
function Anchor({ v }) {
  const [cx, cy] = plot(v.x, v.y)
  return (
    <g className="vc-anchor" aria-hidden="true">
      <circle className="vc-anchor-dot" cx={cx} cy={cy} r="7" />
      <text className="vc-anchor-glyph kr" x={cx} y={cy} dominantBaseline="central" textAnchor="middle">{v.jamo}</text>
    </g>
  )
}

// The learner's voice on the trapezoid — a fading trail of recent readings and
// a lit, haloed dot for the latest. (Mapped (x,y) already in trapezoid space.)
function VoiceTrail({ dots, listening }) {
  if (!dots.length) return null
  const last = dots[dots.length - 1]
  const [lx, ly] = plot(last.x, last.y)
  return (
    <g className="vc-voice-layer" aria-hidden="true">
      {dots.map((d, i) => {
        if (i === dots.length - 1) return null
        const [cx, cy] = plot(d.x, d.y)
        const t = dots.length > 1 ? i / (dots.length - 1) : 1
        return <circle key={i} className="vc-voicedot trail" cx={cx} cy={cy} r="5" style={{ opacity: 0.1 + 0.4 * t }} />
      })}
      <g className={'vc-voicedot-live' + (listening ? ' listening' : '')}>
        <circle className="vc-voicehalo" cx={lx} cy={ly} r="16" />
        <circle className="vc-voicedot live" cx={lx} cy={ly} r="9" />
      </g>
    </g>
  )
}

export default function VowelCompass({ showReadings = true }) {
  const [mode, setMode] = useState('mono')   // 'mono' | 'voice'
  const [sel, setSel] = useState('a')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)
  const primed = useRef(false)
  const noVoice = !(speechSupported() && hasVoice('ko'))

  // ── 발성 — the live-mic vowel mode, behind the shared seam ──
  const voice = useVoiceCompass({
    vowels: MONOS,
    anchors: VOICE_CALIBRATION.anchors,
    glyphOf: vw => vw.jamo,
    noMic: VOICE_CALIBRATION.noMic,
    calKey: CAL_KEY, calqKey: CALQ_KEY,
    active: mode === 'voice',
  })

  const v = byId[sel]
  const harm = HARMONY[v.harmony]

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

  const lit = mode === 'voice' ? voice.lit : lantern
  const activeLantern = mode === 'voice' ? VOICE_LANTERN : VOWEL_LANTERN

  return (
    <div className="vc-stage" data-screen-label="vowel compass">
      {/* the view switch — the geometry, or your own voice on the trapezoid */}
      <div className="vc-modebar">
        <div className="vc-seg" role="tablist" aria-label="vowel view">
          <button className={'vc-seg-btn' + (mode === 'mono' ? ' on' : '')} role="tab" aria-selected={mode === 'mono'}
                  onClick={() => setMode('mono')}>
            <span className="kr">모음</span>the vowels
          </button>
          <button className={'vc-seg-btn' + (mode === 'voice' ? ' on' : '')} role="tab" aria-selected={mode === 'voice'}
                  onClick={() => setMode('voice')}>
            <span className="kr">발성</span>your voice
          </button>
        </div>
      </div>

      <div className="loom-prompt" style={{ marginTop: 0 }}>
        {mode === 'mono' ? (
          <>
            The frame is the real mouth — <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>front</b> at left,
            <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}> back</b> at right, high at top, open at the floor.
            Tap a vowel and read its letter the other way: built from a dot and two lines.
          </>
        ) : (
          <>
            Now the trapezoid goes live: speak, and your own vowel drops as a{' '}
            <b style={{ color: 'var(--st-travel)', fontStyle: 'normal' }}>dot</b> among the ideal ten. Because a low voice and
            a high one place the same vowel differently, anchor it to your voice first — then say{' '}
            <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>ㅡ</b> and{' '}
            <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>ㅜ</b> and watch the rounding slide the dot back.
          </>
        )}
      </div>

      {mode === 'voice' && (
        <div className="vc-voice-wip" role="note">
          <span className="vc-voice-wip-tag kr">실험</span>
          <span className="vc-voice-wip-tag">experimental</span>
          {VOICE_CALIBRATION.disclaimer}
        </div>
      )}

      <div className="vc-main">
        {/* the IPA trapezoid — the geometry view plots tappable vowels; the
            voice view ghosts them as targets and floats the live mic dot */}
        <div className="vc-chart">
          <svg viewBox="0 0 312 224" className="vc-trapezoid" role="img" aria-label="IPA vowel trapezoid with Korean vowels plotted">
            <text className="vc-axis" x={(TL[0] + TR[0]) / 2} y="18" textAnchor="middle">tongue: front ← → back</text>
            <text className="vc-axis vert" x="20" y={(TL[1] + BL[1]) / 2} textAnchor="middle"
                  transform={`rotate(-90 20 ${(TL[1] + BL[1]) / 2})`}>close (high) ← → open (low)</text>
            <polygon className="vc-quad" points={`${TL} ${TR} ${BR} ${BL}`} />
            {/* a mid gridline for height */}
            <line className="vc-grid" x1={plot(0, 0.5)[0]} y1={plot(0, 0.5)[1]} x2={plot(1, 0.5)[0]} y2={plot(1, 0.5)[1]} />

            {mode === 'mono' ? (
              <>
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
                {MONOS.map(m => <Mono key={m.id} v={m} sel={sel} onPick={pick} />)}
              </>
            ) : (
              <>
                {MONOS.map(m => <Anchor key={m.id} v={m} />)}
                <VoiceTrail dots={voice.dots} listening={voice.listening} />
              </>
            )}
          </svg>
          <div className="vc-chart-cap">
            {mode === 'voice' ? (
              <>The ten sit faint as targets; your <b style={{ color: 'var(--st-travel)' }}>dot</b> is the latest reading, with a
                short trail behind it. It’s segment-based — say a vowel, pause, and it lands (a beat later). The plot is your own
                vowel space, fitted to the frame.</>
            ) : (
              <>● rounded vowels carry a ring (ㅗ ㅜ ㅚ ㅟ). The plot is schematic — conservative Seoul values;
                ㅐ/ㅔ and ㅚ/ㅟ are drifting together for younger speakers.</>
            )}
          </div>
        </div>

        {/* the readout — geometry, or the shared voice panel */}
        {mode === 'voice' ? (
          <VoiceReadout
            {...voice}
            copy={VOICE_CALIBRATION}
            vowels={MONOS}
            glyphOf={vw => vw.jamo}
            glyphClass="kr"
          />
        ) : (
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
        )}
      </div>

      {/* the racks — every vowel, grouped by the rule that builds it (geometry view) */}
      {mode === 'mono' && (
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
      )}

      {noVoice && mode === 'mono' && (
        <div className="cn-novoice">No Korean system voice detected — the chart and IPA work; sound stays quiet until a 한국어 voice is installed.</div>
      )}

      <div className={'lantern-note' + (lit ? ' lit' : '')} aria-live="polite">
        {lit && (<><div className="head">{activeLantern.head}</div>
          <div className="body" dangerouslySetInnerHTML={{ __html: activeLantern.body }} /></>)}
      </div>
    </div>
  )
}
