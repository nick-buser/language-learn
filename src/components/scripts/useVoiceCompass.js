// =====================================================================
// The Polyglot's Atlas — scripts · useVoiceCompass (the 発声 / 발성 seam)
//
// The shared brain of the live-voice vowel mode. Both vowel compasses — the
// Japanese 母音 and the Korean 모음 — want the SAME machine: calibrate a
// learner's mic to the trapezoid off three corner vowels, then drop their live
// vowel as a dot among the ideal set. That machine — the calibration walk, the
// affine persistence, the segment → reading → placement pipeline — is identical
// across languages; only the vowels, the anchors, the copy, and the glyph
// differ. So it lives here as a hook, the way the mic ITSELF lives in
// formants.js. The compass renders the dots and the <VoiceReadout> from what
// this returns; the fiddly audio state machine is written once.
//
// What's language-specific (passed in): the plotted monophthongs, the three
// calibration anchors, a glyphOf(vowel) for the prose, the "no mic" copy, and
// the localStorage keys. The keys MUST be per-language: a Japanese calibration
// anchored on unrounded う must not leak onto a Korean compass anchored on
// rounded ㅜ, or the う-rounding lesson inverts (calibrate on a rounded back
// vowel and an unrounded one would wrongly drift off the corner). What's
// universal — the whole pipeline below — lives here.
// =====================================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  formantsSupported, startListening,
  fitCalibration, mapFormants, calibrationQuality, flog,
} from './formants.js'

const clamp01 = v => Math.max(0, Math.min(1, v))

// ---- calibration persistence (per-language localStorage keys) -----------
function loadCal(key) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const c = JSON.parse(raw)
    return (c && typeof c.ax === 'number') ? c : null
  } catch { return null }
}
function saveCal(key, c) {
  try {
    if (c) window.localStorage.setItem(key, JSON.stringify(c))
    else window.localStorage.removeItem(key)
  } catch { /* private mode: this session only */ }
}
// The calibration's separation quality, persisted alongside the coeffs so the
// readout can keep explaining how trustworthy the mapping is across reloads.
function loadCalInfo(key) {
  try { const r = window.localStorage.getItem(key); return r ? JSON.parse(r) : null } catch { return null }
}
function saveCalInfo(key, q) {
  try { q ? window.localStorage.setItem(key, JSON.stringify(q)) : window.localStorage.removeItem(key) } catch { /* ignore */ }
}

// Turn a mic error into one plain sentence for the quiet note. `noMic` is the
// folio's own "no microphone here" copy (the unsupported branch).
function micErrText(err, noMic) {
  const tag = (err && (err.name || err.message)) || ''
  if (/NotAllowed|Permission|denied/i.test(tag)) return 'Microphone blocked — allow mic access for this site, then try again.'
  if (/NotFound|NotReadable|Devices/i.test(tag)) return 'No microphone found to listen with.'
  if (/already/i.test(tag)) return 'Already listening.'
  if (/unsupported/i.test(tag)) return noMic
  return 'Could not start the microphone — ' + (tag || 'unknown error') + '.'
}

// Nearest plotted vowel to a mapped (x,y), plus a short positional read of how
// the learner's dot sits relative to that ideal vowel. `vowels` are the
// monophthongs on the trapezoid; `glyphOf` renders one for the prose.
function describePlacement(vowels, glyphOf, x, y) {
  let best = vowels[0], bd = Infinity
  for (const v of vowels) {
    const d = Math.hypot(x - v.x, y - v.y)
    if (d < bd) { bd = d; best = v }
  }
  const dx = x - best.x, dy = y - best.y
  const back = Math.abs(dx) < 0.06 ? null
    : dx > 0 ? (dx > 0.16 ? 'well back' : 'a touch back')
    : (dx < -0.16 ? 'well forward' : 'a touch forward')
  const open = Math.abs(dy) < 0.06 ? null
    : dy > 0 ? (dy > 0.16 ? 'much more open' : 'a little more open')
    : (dy < -0.16 ? 'much closer' : 'a little closer')
  const parts = [back, open].filter(Boolean)
  const g = glyphOf(best)
  const text = parts.length
    ? `sitting ${parts.join(' and ')} than ${g}.`
    : `landing right on ${g} — clean.`
  return { vowel: best, text }
}

/**
 * The live-voice vowel mode, as a hook. Owns the mic, the calibration walk, the
 * affine persistence, and the reading → placement pipeline; the instrument
 * supplies the vowels, anchors, glyph, copy, and storage keys, and renders the
 * dots + the <VoiceReadout> from what this returns.
 *
 * @param {object}      opts
 * @param {Array}       opts.vowels   plotted monophthongs ({id,x,y,...}); the
 *                                    placement search and anchor targets read these
 * @param {Array}       opts.anchors  calibration anchors [{vowel:id, say}]
 * @param {(v)=>string} opts.glyphOf  a vowel → its display glyph (kana / jamo)
 * @param {string}      opts.noMic    the folio's "no mic" copy (for error text)
 * @param {string}      opts.calKey   localStorage key for the fitted map (per language)
 * @param {string}      opts.calqKey  localStorage key for the calibration quality
 * @param {boolean}     opts.active   is the voice view on-screen? (off → tear the mic down)
 * @returns the formant support flag, all voice state, and start/stop controls
 */
export function useVoiceCompass({ vowels, anchors, glyphOf, noMic, calKey, calqKey, active }) {
  const formantsOk = formantsSupported()
  const byId = useMemo(() => Object.fromEntries(vowels.map(v => [v.id, v])), [vowels])

  const [cal, setCal] = useState(() => loadCal(calKey))            // fitted affine map, or null
  const [calInfo, setCalInfo] = useState(() => loadCalInfo(calqKey)) // calibration separation quality, or null
  const [listening, setListening] = useState(false)
  const [calStep, setCalStep] = useState(null)       // null, or 0..anchors-1 during calibration
  const [dots, setDots] = useState([])               // trail of mapped {x,y}
  const [reading, setReading] = useState(null)       // { vowel, text } of the latest dot
  const [micError, setMicError] = useState(null)
  const [lit, setLit] = useState(false)              // the lantern-fires-once flag

  const stopRef = useRef(null)                        // the startListening() teardown
  const calRef = useRef(cal)                          // fresh value for the mic callback
  const calibratingRef = useRef(null)                 // { step, samples } during calibration
  const litRef = useRef(false)
  useEffect(() => { calRef.current = cal }, [cal])

  const stopMic = () => {
    try { stopRef.current?.() } catch { /* ignore */ }
    stopRef.current = null
    calibratingRef.current = null
    setCalStep(null)
    setListening(false)
  }

  // One reading per voiced segment. During calibration we collect the corner
  // vowels and fit; otherwise we map the reading and drop a dot.
  const handleReading = (r) => {
    const job = calibratingRef.current
    if (job) {
      const anchor = anchors[job.step]
      const n = anchors.length
      flog(`capture ${job.step + 1}/${n} [${anchor.vowel}] → F1=${Math.round(r.f1)}Hz F2=${Math.round(r.f2)}Hz (F3=${r.f3 ? Math.round(r.f3) + 'Hz' : '–'})`)
      const samples = [...job.samples, { vowel: anchor.vowel, f1: r.f1, f2: r.f2 }]
      const nextStep = job.step + 1
      if (nextStep >= n) {
        flog('calibration triple:', samples.map(s => `${s.vowel}(${Math.round(s.f1)},${Math.round(s.f2)})`).join('  '))
        const fitPts = samples.map(s => { const t = byId[s.vowel]; return { f1: s.f1, f2: s.f2, x: t.x, y: t.y } })
        const coeffs = fitCalibration(fitPts)
        const quality = calibrationQuality(samples)
        stopMic()
        if (coeffs) {
          calRef.current = coeffs; setCal(coeffs); saveCal(calKey, coeffs)
          setCalInfo(quality); saveCalInfo(calqKey, quality)
          setReading(null); setDots([])
        } else {
          setMicError('Calibration couldn’t fit those three — open the console (filter “発声”) to see what was captured.')
        }
      } else {
        calibratingRef.current = { step: nextStep, samples }
        setCalStep(nextStep)
      }
      return
    }
    if (!calRef.current) return
    const p = mapFormants(calRef.current, r.f1, r.f2)
    if (!p) return
    const x = clamp01(p.x), y = clamp01(p.y)
    flog(`reading → F1=${Math.round(r.f1)}Hz F2=${Math.round(r.f2)}Hz → x=${p.x.toFixed(2)} y=${p.y.toFixed(2)}${(x !== p.x || y !== p.y) ? ' (clamped)' : ''}`)
    setDots(prev => [...prev, { x, y }].slice(-6))
    setReading(describePlacement(vowels, glyphOf, x, y))
    if (!litRef.current) { litRef.current = true; setLit(true) }
  }

  const startMic = async (calibrating) => {
    if (listening) return
    setMicError(null)
    if (calibrating) { calibratingRef.current = { step: 0, samples: [] }; setCalStep(0); setReading(null); setDots([]) }
    else { calibratingRef.current = null }
    setListening(true)
    try {
      const stop = await startListening({
        onReading: handleReading,
        onError: (err) => { setMicError(micErrText(err, noMic)); stopMic() },
        onStop: () => setListening(false),
      })
      stopRef.current = stop
    } catch (err) {
      setMicError(micErrText(err, noMic)); stopMic()
    }
  }

  // Tear the mic down on unmount, and whenever the voice view goes off-screen.
  useEffect(() => () => { try { stopRef.current?.() } catch { /* ignore */ } }, [])
  useEffect(() => { if (!active) stopMic() }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  return { formantsOk, cal, calInfo, listening, calStep, dots, reading, micError, lit, startMic, stopMic }
}
