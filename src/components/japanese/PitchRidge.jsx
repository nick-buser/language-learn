import React, { useEffect, useRef, useState } from 'react'
import { PITCH_WORDS, PITCH_PAIRS, ACCENT_TYPES, PITCH_LANTERN, PITCH_VOICE } from '../../data/japanesePhonetics.js'
import { speak, primeSpeech, speechSupported, hasVoice } from '../scripts/speech.js'
import { playTone, primeAudio } from '../song/audio.js'
import { pitchSupported, startPitchTrack } from '../scripts/pitch.js'

// INSTRUMENT III — 高低アクセント the pitch ridge.
// The layer kana cannot write at all. はし is one spelling and three words —
// 箸 / 橋 / 端 — told apart by the High/Low melody over its morae (and, for
// two of them, only by the pitch of the following particle). Each mora is a
// node at H or L; tap one to hear its tone, or play the whole ridge — the
// tone synth sounds the pitch, the speech voice says the word. The accent is
// the place a High DROPS to Low.

const H_MIDI = 69 // A4 — the High tone
const L_MIDI = 62 // D4 — the Low tone
const STEP = 0.34 // seconds between morae

const NODE_DX = 64
const X0 = 44
const Y_HIGH = 42
const Y_LOW = 96

// ── the learner's voice trace ──
// Pitch accent is RELATIVE, so we normalise the spoken F0 into the 高/低 band
// (robust 10–90th percentile, with a floor so a near-monotone take doesn't blow
// up) and lay time out left→right at a fixed rate from the first voiced frame —
// shape over the target, not snapped to morae. Voiced runs break at consonants.
const PX_PER_SEC = 150
function contourFromTrace(trace) {
  const voiced = trace.filter(f => f.voiced && f.hz)
  if (voiced.length < 2) return { paths: [], head: null }
  const sorted = voiced.map(f => f.hz).sort((a, b) => a - b)
  const pct = p => sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))))]
  let lo = pct(0.1), hi = pct(0.9)
  if (hi - lo < 12) { const m = (hi + lo) / 2; lo = m - 8; hi = m + 8 }
  const t0 = voiced[0].t
  const mapX = t => X0 + ((t - t0) / 1000) * PX_PER_SEC
  const mapY = hz => Y_LOW - Math.max(0, Math.min(1, (hz - lo) / (hi - lo))) * (Y_LOW - Y_HIGH)
  const runs = []; let cur = []
  for (const f of trace) {
    if (f.voiced && f.hz && f.t >= t0) cur.push(`${mapX(f.t).toFixed(1)},${mapY(f.hz).toFixed(1)}`)
    else if (cur.length) { runs.push(cur); cur = [] }
  }
  if (cur.length) runs.push(cur)
  const last = voiced[voiced.length - 1]
  return { paths: runs.filter(r => r.length >= 2).map(r => r.join(' ')), head: [mapX(last.t), mapY(last.hz)] }
}

function pitchErrText(err) {
  const tag = (err && (err.name || err.message)) || ''
  if (/NotAllowed|Permission|denied/i.test(tag)) return 'Microphone blocked — allow mic access for this site, then try again.'
  if (/NotFound|NotReadable|Devices/i.test(tag)) return 'No microphone found to listen with.'
  if (/unsupported/i.test(tag)) return PITCH_VOICE.noMic
  return 'Could not start the microphone — ' + (tag || 'unknown error') + '.'
}

export default function PitchRidge({ showReadings = true, showJp = true }) {
  const [sel, setSel] = useState('hashi-chop')
  const [lit, setLit] = useState(-1)
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)
  const primed = useRef(false)
  const timers = useRef([])
  const noVoice = !(speechSupported() && hasVoice('ja'))

  // ── voice: the learner's own pitch trace over the ridge ──
  const pitchOk = pitchSupported()
  const [recording, setRecording] = useState(false)
  const [trace, setTrace] = useState([])
  const [micError, setMicError] = useState(null)
  const stopPitchRef = useRef(null)

  const w = PITCH_WORDS.find(x => x.id === sel)
  const acc = ACCENT_TYPES[w.type]
  const seq = [...w.pitch, w.particle]            // morae, then a following が
  const n = w.kana.length
  const width = X0 + (n + 1) * NODE_DX + 24

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => clearTimers, [])
  // tear the mic down on unmount
  useEffect(() => () => { try { stopPitchRef.current?.() } catch { /* ignore */ } }, [])

  const prime = () => {
    if (primed.current) return
    primed.current = true
    primeAudio(); primeSpeech()
  }
  const noteFired = () => { if (!fired.current) { fired.current = true; setLantern(true) } }

  const toneFor = (hl) => (hl === 'H' ? H_MIDI : L_MIDI)

  // tap a single mora (or the particle) → its tone
  const tapMora = (i) => {
    prime(); noteFired()
    playTone(toneFor(seq[i]), { dur: 0.4, type: 'triangle' })
    setLit(i); window.setTimeout(() => setLit(-1), 360)
  }

  // play the whole ridge — tones scheduled sample-accurate, highlight in step,
  // plus the spoken word for the segments.
  const play = () => {
    prime(); noteFired(); clearTimers()
    seq.forEach((hl, i) => {
      playTone(toneFor(hl), { dur: 0.3, type: 'triangle', when: i * STEP })
      timers.current.push(window.setTimeout(() => setLit(i), i * STEP * 1000))
    })
    timers.current.push(window.setTimeout(() => setLit(-1), seq.length * STEP * 1000 + 120))
    speak(w.speak, { lang: 'ja-JP', rate: 0.8 })
  }

  const stopVoice = () => { try { stopPitchRef.current?.() } catch { /* ignore */ } stopPitchRef.current = null; setRecording(false) }

  // the trace belongs to a word — switching words clears it (and any take)
  const choose = (id) => { clearTimers(); setLit(-1); stopVoice(); setTrace([]); setMicError(null); setSel(id) }

  // tap "say it" → record the word and trace the learner's F0 over the ridge.
  const toggleVoice = () => {
    if (recording) { stopVoice(); return }
    prime(); noteFired()
    setMicError(null); setTrace([]); setRecording(true)
    startPitchTrack({
      onFrame: f => setTrace(prev => (prev.length > 600 ? prev : [...prev, f])),
      onError: err => { setMicError(pitchErrText(err)); setRecording(false) },
      onStop: () => setRecording(false),
    }).then(stop => { stopPitchRef.current = stop })
  }
  const clearVoice = () => { setTrace([]); setMicError(null) }

  // node coordinates incl. the particle
  const nodes = seq.map((hl, i) => ({
    i, hl,
    x: X0 + i * NODE_DX,
    y: hl === 'H' ? Y_HIGH : Y_LOW,
    glyph: i < n ? w.kana[i] : 'が',
    particle: i >= n,
  }))
  // the drop: the first H→L step anywhere along the sequence (incl. onto が)
  const dropAt = seq.findIndex((hl, i) => i < seq.length - 1 && hl === 'H' && seq[i + 1] === 'L')

  // group the picker by minimal set
  const sets = [
    { key: 'hashi', items: PITCH_WORDS.filter(x => x.pair === 'hashi') },
    { key: 'ame', items: PITCH_WORDS.filter(x => x.pair === 'ame') },
    { key: null, items: PITCH_WORDS.filter(x => !x.pair) },
  ]

  const userContour = contourFromTrace(trace)

  return (
    <div className="pr-stage" data-screen-label="pitch ridge">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Same kana, different tune. Pick a word — its <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>pitch ridge</b> draws
        High and Low over each mora. The <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>accent</b> is where High drops to Low;
        a faint <span className="jp">が</span> shows what a following particle would do.
      </div>

      {/* picker */}
      <div className="pr-picker">
        {sets.map(s => (
          <div className="pr-set" key={s.key || 'misc'}>
            {s.key && <div className="pr-set-h">同じ綴り · <span className="jp">{PITCH_PAIRS[s.key].kana}</span></div>}
            <div className="pr-set-row">
              {s.items.map(it => (
                <button key={it.id} className={'pr-chip' + (sel === it.id ? ' active' : '')}
                        onClick={() => choose(it.id)} aria-pressed={sel === it.id}>
                  <span className="pr-chip-kanji jp">{it.kanji}</span>
                  <span className="pr-chip-gloss">{it.gloss}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pr-readout">
        {/* the ridge */}
        <div className="pr-graph-wrap">
          <svg viewBox={`0 0 ${width} 150`} className="pr-graph" role="img"
               aria-label={`pitch ridge for ${w.kanji}, ${acc.romaji}`}>
            <text className="pr-band" x="6" y={Y_HIGH + 4}>高</text>
            <text className="pr-band" x="6" y={Y_LOW + 4}>低</text>
            <line className="pr-bandline" x1={X0 - 14} y1={Y_HIGH} x2={width - 14} y2={Y_HIGH} />
            <line className="pr-bandline" x1={X0 - 14} y1={Y_LOW} x2={width - 14} y2={Y_LOW} />

            {/* the stepped contour */}
            <polyline className="pr-contour"
                      points={nodes.map(nd => `${nd.x},${nd.y}`).join(' ')} />

            {/* the learner's own pitch trace (sky), drawn over the target */}
            {userContour.paths.map((pts, i) => (
              <polyline key={i} className="pr-voice-trace" points={pts} />
            ))}
            {recording && userContour.head && (
              <circle className="pr-voice-head" cx={userContour.head[0]} cy={userContour.head[1]} r="4" />
            )}

            {/* the accent drop marker */}
            {dropAt >= 0 && (
              <g className="pr-drop">
                <line x1={nodes[dropAt].x} y1={Y_HIGH - 6} x2={nodes[dropAt + 1].x} y2={Y_LOW - 6} />
                <text className="pr-drop-mark"
                      x={(nodes[dropAt].x + nodes[dropAt + 1].x) / 2} y={Y_HIGH - 12} textAnchor="middle">accent ↓</text>
              </g>
            )}

            {/* mora nodes */}
            {nodes.map(nd => (
              <g key={nd.i}
                 className={'pr-node' + (nd.particle ? ' particle' : '') + (lit === nd.i ? ' lit' : '')}
                 onClick={() => tapMora(nd.i)} role="button" tabIndex={0}
                 aria-label={`${nd.glyph} ${nd.hl === 'H' ? 'high' : 'low'}`}
                 onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tapMora(nd.i) } }}>
                <circle className="pr-node-dot" cx={nd.x} cy={nd.y} r={lit === nd.i ? 13 : 11} />
                <text className="pr-node-glyph jp" x={nd.x} y={nd.y} dominantBaseline="central" textAnchor="middle">{nd.glyph}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* readout text */}
        <div className="pr-info" key={sel}>
          <div className="pr-headline">
            <span className="pr-kanji jp">{w.kanji}</span>
            <div className="pr-headmeta">
              <span className="pr-gloss">{w.gloss}</span>
              {showReadings && <span className="pr-kana jp">{w.kana.join('')}</span>}
              <button className="pr-play" onClick={play}>▶ play the ridge</button>
            </div>
          </div>

          {pitchOk ? (
            <>
              <div className="pr-voice">
                <button className={'pr-voice-btn' + (recording ? ' rec' : '')} onClick={toggleVoice}>
                  <span className="pr-voice-led" aria-hidden="true" /> {recording ? PITCH_VOICE.stop : PITCH_VOICE.say}
                </button>
                {trace.length > 0 && !recording && (
                  <button className="pr-voice-btn ghost" onClick={clearVoice}>{PITCH_VOICE.clear}</button>
                )}
                <span className="pr-voice-note">{recording ? PITCH_VOICE.listening : PITCH_VOICE.experimental}</span>
              </div>
              {trace.length > 0 && !recording && <p className="pr-voice-hint">{PITCH_VOICE.hint}</p>}
            </>
          ) : (
            <div className="cn-novoice" style={{ marginTop: 12 }}>{PITCH_VOICE.noMic}</div>
          )}
          {micError && <div className="cn-novoice" style={{ marginTop: 8 }}>{micError}</div>}

          <div className="pr-type">
            <span className="pr-type-badge jp">{acc.ja}</span>
            <span className="pr-type-name">{acc.romaji} · {acc.en}</span>
          </div>
          <p className="pr-type-note">{acc.note}</p>

          {w.pair && (
            <div className="pr-pair">
              <span className="pr-pair-mark">minimal set</span>
              {PITCH_PAIRS[w.pair].en} Switch between them above and watch only the ridge move.
            </div>
          )}

          {showJp && (
            <div className="jbridge">
              <span className="jbridge-mark">한국어</span>
              Seoul Korean has no lexical pitch accent — this whole axis is one Japanese carries and Korean doesn’t.
              It is the clean inverse of Korean’s three-way ㄱ/ㅋ/ㄲ, which Japanese lacks.
            </div>
          )}
        </div>
      </div>

      {noVoice && (
        <div className="cn-novoice">The pitch is synthesized tones, so it plays without a voice. Installing a 日本語 voice adds the spoken word on “play”.</div>
      )}

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{PITCH_LANTERN.head}</div>
          <div className="body" dangerouslySetInnerHTML={{ __html: PITCH_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
