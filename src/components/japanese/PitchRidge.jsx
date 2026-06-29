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
// up) and lay time out left→right at a fixed rate — shape over the target, not
// snapped to morae. These are single words, so we DON'T want every millisecond
// of drift: raw MPM jitters and throws the odd octave glitch, and the clarity
// gate punches a gap at each voiceless consonant. So we bridge short gaps, fold
// octave errors toward the median, then median-despike + moving-average smooth.
const PX_PER_SEC = 150
const MIN_HZ = 70, MAX_HZ = 500   // fixed plausible voice range
const LEVEL_SILENT = 0.005        // below ≈ no sound reaching the mic at all
const LEVEL_QUIET = 0.02          // below ≈ too quiet to read reliably
const LEVEL_FULL = 0.15           // RMS that fills the input meter

// The pitch-read knobs are LIVE — exposed as sliders below the ridge — because
// the right values depend on the mic, the room, and the voice, so no single
// hardcoded set works everywhere. These defaults are a sane starting point;
// each is persisted per-browser.
const PARAM_DEFS = [
  { key: 'clarity',    label: 'pitch sensitivity', min: 0.30, max: 0.95, step: 0.01,  def: 0.70,  hint: 'lower picks up fainter / noisier pitch — more takes register, but more noise slips in' },
  { key: 'levelFloor', label: 'volume floor',      min: 0,    max: 0.04, step: 0.001, def: 0.008, hint: 'frames quieter than this don’t count as pitch' },
  { key: 'gapMs',      label: 'bridge gaps',       min: 0,    max: 500,  step: 20,    def: 200, unit: 'ms', hint: 'draw the line across silences shorter than this (voiceless consonants)' },
  { key: 'median',     label: 'despike',           min: 1,    max: 15,   step: 2,     def: 5,     hint: 'median window — removes octave spikes · 1 = off' },
  { key: 'smooth',     label: 'smoothing',         min: 1,    max: 21,   step: 2,     def: 7,     hint: 'moving-average window — flattens jitter · 1 = off' },
]
const PARAM_DEFAULTS = Object.fromEntries(PARAM_DEFS.map(p => [p.key, p.def]))
const PARAMS_KEY = 'atlas.pitch.params'
function loadParams() {
  try { const r = JSON.parse(window.localStorage.getItem(PARAMS_KEY)); return (r && typeof r === 'object') ? { ...PARAM_DEFAULTS, ...r } : { ...PARAM_DEFAULTS } }
  catch { return { ...PARAM_DEFAULTS } }
}
function saveParams(p) { try { window.localStorage.setItem(PARAMS_KEY, JSON.stringify(p)) } catch { /* ignore */ } }

const isVoiced = (f, p) => f.clarity >= p.clarity && f.hz >= MIN_HZ && f.hz <= MAX_HZ && f.level >= p.levelFloor

function median(arr) {
  const s = [...arr].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
function windowed(xs, win, fn) {
  const half = win >> 1
  return xs.map((_, i) => fn(xs.slice(Math.max(0, i - half), Math.min(xs.length, i + half + 1))))
}

function contourFromTrace(trace, p) {
  const voiced = trace.filter(f => isVoiced(f, p))
  if (voiced.length < 3) return { paths: [], head: null }

  // 1) split into segments only at LONG gaps; short ones (voiceless consonants)
  //    stay in one segment so the line draws through them.
  const segs = []
  let cur = [voiced[0]]
  for (let i = 1; i < voiced.length; i++) {
    if (voiced[i].t - voiced[i - 1].t > p.gapMs) { segs.push(cur); cur = [] }
    cur.push(voiced[i])
  }
  if (cur.length) segs.push(cur)

  // 2) per segment: fold octave glitches toward the median, then despike + smooth.
  const smoothed = segs.map(seg => {
    const med = median(seg.map(f => f.hz))
    let hz = seg.map(f => {
      let v = f.hz
      while (v > med * 1.6) v /= 2
      while (v < med / 1.6) v *= 2
      return v
    })
    hz = windowed(hz, p.median, median)
    hz = windowed(hz, p.smooth, a => a.reduce((s, v) => s + v, 0) / a.length)
    return seg.map((f, i) => ({ t: f.t, hz: hz[i] }))
  }).filter(s => s.length >= 2)
  if (!smoothed.length) return { paths: [], head: null }

  // 3) normalise the smoothed F0 into the 高/低 band, lay time out from the start.
  const all = smoothed.flat().map(p => p.hz).sort((a, b) => a - b)
  const pct = p => all[Math.min(all.length - 1, Math.max(0, Math.round(p * (all.length - 1))))]
  let lo = pct(0.1), hi = pct(0.9)
  if (hi - lo < 12) { const m = (hi + lo) / 2; lo = m - 8; hi = m + 8 }
  const t0 = smoothed[0][0].t
  const mapX = t => X0 + ((t - t0) / 1000) * PX_PER_SEC
  const mapY = hz => Y_LOW - Math.max(0, Math.min(1, (hz - lo) / (hi - lo))) * (Y_LOW - Y_HIGH)

  const paths = smoothed.map(seg => seg.map(p => `${mapX(p.t).toFixed(1)},${mapY(p.hz).toFixed(1)}`).join(' '))
  const lastSeg = smoothed[smoothed.length - 1]
  const lastPt = lastSeg[lastSeg.length - 1]
  return { paths, head: [mapX(lastPt.t), mapY(lastPt.hz)] }
}

// The mic's live state, read off the recent trace — an input level for the meter
// and a plain-language status, so a no-response take is never silent again.
function micReadout(trace, p) {
  const last = trace.length ? trace[trace.length - 1] : null
  const recent = trace.slice(-12)
  const maxRecent = recent.reduce((m, f) => Math.max(m, f.level || 0), 0)
  const meterPct = Math.min(100, Math.round(((last?.level || 0) / LEVEL_FULL) * 100))
  let status
  if (maxRecent < LEVEL_SILENT) status = PITCH_VOICE.diag.silent
  else if (maxRecent < LEVEL_QUIET) status = PITCH_VOICE.diag.quiet
  else if (recent.some(f => isVoiced(f, p))) status = PITCH_VOICE.diag.voiced
  else status = PITCH_VOICE.diag.noPitch
  return { meterPct, status }
}

// After a take that drew nothing, the same triage as a sentence: dead mic, too
// quiet, sound-but-no-pitch, or just too short.
function takeSummary(trace, drew, p) {
  if (drew || !trace.length) return null
  const voicedN = trace.filter(f => isVoiced(f, p)).length
  const maxLevel = trace.reduce((m, f) => Math.max(m, f.level || 0), 0)
  if (!voicedN) {
    if (maxLevel < LEVEL_SILENT) return PITCH_VOICE.summary.silent
    if (maxLevel < LEVEL_QUIET) return PITCH_VOICE.summary.quiet
    return PITCH_VOICE.summary.noPitch
  }
  return voicedN < 3 ? PITCH_VOICE.summary.short : null
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
  const [params, setParams] = useState(loadParams)   // live, persisted read knobs
  const [tuning, setTuning] = useState(false)         // tuning panel open?
  const stopPitchRef = useRef(null)
  const setParam = (k, v) => setParams(prev => { const next = { ...prev, [k]: v }; saveParams(next); return next })
  const resetParams = () => { setParams({ ...PARAM_DEFAULTS }); saveParams(PARAM_DEFAULTS) }

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

  const userContour = contourFromTrace(trace, params)
  const micLive = recording ? micReadout(trace, params) : null
  const summary = !recording ? takeSummary(trace, userContour.paths.length > 0, params) : null

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
                <button className={'pr-voice-btn ghost' + (tuning ? ' on' : '')} onClick={() => setTuning(t => !t)}
                        aria-expanded={tuning}>⚙ tune</button>
                {!recording && <span className="pr-voice-note">{PITCH_VOICE.experimental}</span>}
              </div>

              {/* live mic legibility — input meter + plain-language status */}
              {recording && micLive && (
                <div className="pr-mic" aria-live="polite">
                  <span className="pr-mic-cap">{PITCH_VOICE.level}</span>
                  <div className="pr-mic-meter"><span className="pr-mic-fill" style={{ width: micLive.meterPct + '%' }} /></div>
                  <span className={'pr-mic-status' +
                    (micLive.status === PITCH_VOICE.diag.voiced ? ' ok'
                      : micLive.status === PITCH_VOICE.diag.silent ? ' bad' : ' warn')}>
                    {micLive.status}
                  </span>
                </div>
              )}

              {summary && <p className="pr-voice-summary">{summary}</p>}
              {!recording && userContour.paths.length > 0 && <p className="pr-voice-hint">{PITCH_VOICE.hint}</p>}

              {/* live tuning — the read knobs depend on mic / room / voice, so they
                  are the learner's to turn rather than baked in */}
              {tuning && (
                <div className="pr-tune">
                  {PARAM_DEFS.map(d => (
                    <div className="pr-tune-row" key={d.key}>
                      <label className="pr-tune-label" htmlFor={'tune-' + d.key} title={d.hint}>{d.label}</label>
                      <input className="pr-tune-range" id={'tune-' + d.key} type="range"
                             min={d.min} max={d.max} step={d.step} value={params[d.key]}
                             onChange={e => setParam(d.key, Number(e.target.value))} />
                      <input className="pr-tune-num" type="number"
                             min={d.min} max={d.max} step={d.step} value={params[d.key]}
                             onChange={e => setParam(d.key, Number(e.target.value))} />
                      {d.unit && <span className="pr-tune-unit">{d.unit}</span>}
                    </div>
                  ))}
                  <div className="pr-tune-foot">
                    <button className="pr-voice-btn ghost" onClick={resetParams}>reset</button>
                    <span className="pr-tune-hint">hover a label for what it does · saved per browser</span>
                  </div>
                </div>
              )}
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
