// =====================================================================
// The Polyglot's Atlas — scripts · formants (the learner's own mouth)
//
// The third sibling to speech.js (which SPEAKS syllables) and song/audio.js
// (which SYNTHESIZES tones): this one LISTENS. It pulls the speaker's vowel
// formants — F1 (mouth openness) and F2 (tongue frontness) — off the live
// microphone, so a learner's own あ/い/う can be dropped onto the same IPA
// trapezoid the ideal vowels already sit on.
//
// THE SEAM. The vowel compass calls formantsSupported()/startListening() and
// nothing else. The engine behind it lives entirely in here — swap the body,
// keep the two signatures, and no instrument changes.
//
// THE ENGINE (round two). Round one read mel-bin spectral peaks from the
// `formantanalyzer` library; its F2 read bimodally and the placement wandered
// (the WIP note). This is the rewrite that note pointed at: real Linear
// Predictive Coding — Praat's own "To Formant (burg)" recipe — done in plain
// JS. The numeric kernel (decimate → pre-emphasis → Hamming → Burg LPC → roots
// → poles-as-formants) is lpc.js; this file is the audio plumbing around it:
//
//   • CAPTURE. getUserMedia (with the browser's auto-gain / noise-suppression /
//     echo-cancellation turned OFF — they smear formants), an AnalyserNode, and
//     a rAF loop that grabs ~23 ms time-domain frames. No worklet, no CDN, no
//     Python. Round one lazy-imported its 115 kB library; the LPC kernel is a
//     few kB of pure JS, so it just rides in statically — the only thing
//     deferred to startListening() is the mic-permission prompt itself, which is
//     a runtime call, not a download.
//   • SEGMENTS, not a 60 fps stream. An RMS gate watches for a voiced stretch,
//     runs LPC on each of its frames, and on the closing pause reduces them to
//     one steady reading (per-formant medians). So the felt UX stays "say a
//     vowel → a dot drops," same as before — only the numbers are now real Hz.
//
// UNITS ARE HERTZ now (round one was mel bins). The compass never names the
// scale — it learns an affine map from YOUR anchor vowels — so the unit change
// is transparent to it, EXCEPT that a calibration fitted on the old mel-bin
// readings is meaningless against Hz: the per-language calibration keys were
// bumped alongside this swap so stale maps are dropped and learners re-anchor.
//
// Best-effort throughout: no mic, no getUserMedia, no AudioContext → the calls
// no-op and the compass shows a quiet "mic unavailable" note.
// =====================================================================
import { frameFormants, DEFAULT_FORMANT_OPTS } from './lpc.js'

/** Is live formant analysis even possible here? (mic + Web Audio present) */
export function formantsSupported() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const AC = window.AudioContext || window.webkitAudioContext
  return !!AC && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

// ---- debug logging ------------------------------------------------------
// The mic path is hard to debug blind: real Hz now, but mic gain varies wildly
// across setups, so the voicing gate and the read formants funnel through flog()
// — ON by default; set localStorage 'atlas.formant.debug' = '0' to silence it.
// Prefixed [発声] so it filters cleanly in the console.
export const FORMANT_DEBUG = (() => {
  try { return window.localStorage.getItem('atlas.formant.debug') !== '0' } catch { return true }
})()
export function flog(...args) {
  if (FORMANT_DEBUG) console.log('%c[発声]', 'color:#A9CBE4;font-weight:bold', ...args)
}

// ---- tuning knobs (mic- and speaker-dependent; overridable + logged) -----
// Mic gain, ambient noise, and vocal-tract length all vary by setup, so the
// numbers that decide "is this voiced?" and "where's the formant ceiling?" must
// be tunable, not hardcoded-and-iterated. Defaults below; override any subset by
// writing JSON to localStorage 'atlas.formant.params' (read once per start, and
// logged), e.g. {"voicedRms":0.02,"maxFormant":5000}. A future slider panel can
// write the same key.
const DEFAULT_PARAMS = {
  ...DEFAULT_FORMANT_OPTS,   // maxFormant, maxFormants, preEmph, fMin, maxBw (→ lpc.js)
  fftSize: 1024,             // ~23 ms frame at 44.1 kHz — a good formant window
  voicedRms: 0.012,          // RMS above this counts as voiced (~ −38 dBFS)
  pauseMs: 180,              // quiet this long closes a voiced segment
  minFrames: 4,              // a segment needs this many usable frames to count
}
function readParams() {
  let over = {}
  try { over = JSON.parse(window.localStorage.getItem('atlas.formant.params') || '{}') || {} } catch { /* ignore */ }
  return { ...DEFAULT_PARAMS, ...over }
}

// Median of a numeric array (the steady centre of a held vowel beats the
// onset/offset wobble that a mean would smear).
function median(xs) {
  if (!xs.length) return null
  const s = [...xs].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function rms(buf) {
  let s = 0
  for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i]
  return Math.sqrt(s / buf.length)
}

// Reduce one voiced segment (an array of per-frame {f1,f2,f3,energy}) to a
// single steady reading: trim onset/offset transitions when the segment is long
// enough to spare them, then take per-formant medians. Lax on purpose — a few
// usable frames are enough — and it carries its own frame bookkeeping for the
// debug log.
function reduceSegment(frames) {
  if (!Array.isArray(frames) || frames.length < 1) return null
  const core = frames.length >= 6
    ? frames.slice(Math.floor(frames.length * 0.2), Math.ceil(frames.length * 0.8))
    : frames
  const f1 = [], f2 = [], f3 = [], en = []
  for (const fr of core) {
    if (!fr || !(fr.f1 > 0) || !(fr.f2 > 0)) continue
    f1.push(fr.f1); f2.push(fr.f2)
    if (fr.f3 > 0) f3.push(fr.f3)
    if (fr.energy > 0) en.push(fr.energy)
  }
  if (!f1.length) return null
  return {
    f1: median(f1),     // openness  (the trapezoid's y / height), Hz
    f2: median(f2),     // backness  (the trapezoid's x / front↔back), Hz
    f3: f3.length ? median(f3) : null,
    energy: en.length ? median(en) : 0,
    nFrames: f1.length,
    nRaw: frames.length,
    dropped: frames.length - f1.length,
  }
}

// ---- calibration math: fit YOUR vowel space onto the trapezoid ----------
// Vowel formants are speaker-relative, so the compass learns an affine map
// (f1,f2) → (x,y) from a few anchor vowels measured in your own voice. With
// the three corner vowels the fit is exact; extra anchors least-squares-fit.
// This is what lets a reading land in the right place without the engine ever
// having to name an absolute frequency — and it's why moving from mel bins to
// Hz needs no change here: only the inputs' scale changed, and the fit absorbs
// scale.

// Solve a symmetric 3×3 system M·p = b. M = [[a,d,e],[d,f,g],[e,g,h]].
// Returns null if singular (e.g. the anchor vowels were collinear).
function solve3(M, b) {
  const a = M[0][0], d = M[0][1], e = M[0][2]
  const f = M[1][1], g = M[1][2], h = M[2][2]
  const A = f * h - g * g
  const B = e * g - d * h
  const C = d * g - e * f
  const det = a * A + d * B + e * C
  if (Math.abs(det) < 1e-9) return null
  const D = a * h - e * e
  const E = d * e - a * g
  const F = a * f - d * d
  const inv = 1 / det
  return [
    (A * b[0] + B * b[1] + C * b[2]) * inv,
    (B * b[0] + D * b[1] + E * b[2]) * inv,
    (C * b[0] + E * b[1] + F * b[2]) * inv,
  ]
}

/**
 * Fit the affine map from formant readings to trapezoid coordinates.
 * @param {{f1:number,f2:number,x:number,y:number}[]} samples  ≥3 non-collinear
 * @returns {?{ax:number,bx:number,cx:number,ay:number,by:number,cy:number}}
 */
export function fitCalibration(samples) {
  if (!Array.isArray(samples) || samples.length < 3) return null
  // Normal equations for design rows [f1, f2, 1] against x and y targets.
  let s11 = 0, s12 = 0, s1 = 0, s22 = 0, s2 = 0, n = 0
  let tx1 = 0, tx2 = 0, tx = 0, ty1 = 0, ty2 = 0, ty = 0
  for (const s of samples) {
    const { f1, f2, x, y } = s
    s11 += f1 * f1; s12 += f1 * f2; s1 += f1
    s22 += f2 * f2; s2 += f2; n += 1
    tx1 += f1 * x; tx2 += f2 * x; tx += x
    ty1 += f1 * y; ty2 += f2 * y; ty += y
  }
  // A tiny ridge on the diagonal keeps the fit from HARD-failing on a thin or
  // degenerate vowel triangle (two anchors that landed on the same formants).
  // The map may be rough, but the learner gets a dot instead of a dead end —
  // and the log below shows exactly which anchors collided. λ is negligible
  // against the data scale (Hz², ~1e5–1e6), so a clean triple is unchanged.
  const lambda = 1e-3
  const M = [[s11 + lambda, s12, s1], [s12, s22 + lambda, s2], [s1, s2, n + lambda]]
  const px = solve3(M, [tx1, tx2, tx])
  const py = solve3(M, [ty1, ty2, ty])
  if (!px || !py) { flog('fit FAILED — singular even with ridge', samples); return null }
  const cal = { ax: px[0], bx: px[1], cx: px[2], ay: py[0], by: py[1], cy: py[2] }
  flog('fit OK from', samples.map(s => `(${Math.round(s.f1)},${Math.round(s.f2)})→(${s.x},${s.y})`).join('  '))
  return cal
}

/** Apply a fitted calibration to a reading → trapezoid {x,y} (unclamped). */
export function mapFormants(cal, f1, f2) {
  if (!cal) return null
  return {
    x: cal.ax * f1 + cal.bx * f2 + cal.cx,
    y: cal.ay * f1 + cal.by * f2 + cal.cy,
  }
}

/**
 * Rate how cleanly the three calibration vowels separated in formant space.
 * A thin triangle means two of them landed nearly on top of each other, so the
 * compass can barely tell those two apart — usually a mic or formant-tracking
 * limit, not the speaker. Scale-free: the ratio of the closest pair to the
 * widest, so it doesn't matter how loud or what mic. Returns the rating, that
 * closest pair, and the geometry for the readout to explain.
 * @param {{vowel:string,f1:number,f2:number}[]} samples
 * @returns {?{rating:('strong'|'fair'|'weak'),aspect:number,minDist:number,closest:[string,string]}}
 */
export function calibrationQuality(samples) {
  if (!Array.isArray(samples) || samples.length < 3) return null
  let min = Infinity, max = 0, closest = null
  for (let i = 0; i < samples.length; i++) {
    for (let j = i + 1; j < samples.length; j++) {
      const d = Math.hypot(samples[i].f1 - samples[j].f1, samples[i].f2 - samples[j].f2)
      if (d > max) max = d
      if (d < min) { min = d; closest = [samples[i].vowel, samples[j].vowel] }
    }
  }
  const aspect = max > 0 ? min / max : 0    // 1 = roomy/equilateral, 0 = collinear
  const rating = aspect >= 0.45 ? 'strong' : aspect >= 0.22 ? 'fair' : 'weak'
  flog('calibration quality:', rating, `(aspect ${aspect.toFixed(2)}, closest ${closest?.join('/')} @ ${min.toFixed(0)}Hz)`)
  return { rating, aspect, minDist: min, closest }
}

let active = false   // single mic stream; guard against double-start

/**
 * Start listening to the microphone. Resolves nothing useful; instead it
 * pushes a stabilized reading to `onReading` once per voiced segment the
 * speaker utters. Returns a stop() to tear the mic down (call on unmount or
 * when the learner clicks stop).
 *
 * @param {object}   handlers
 * @param {(r:{f1:number,f2:number,f3:?number,energy:number,nFrames:number})=>void} handlers.onReading
 *        one reading per voiced segment, formants in HERTZ
 * @param {(err:any)=>void} [handlers.onError]   mic denied / engine failure
 * @param {()=>void}        [handlers.onStop]    fired once the stream ends
 * @returns {Promise<() => void>} resolves to a stop() function
 */
export async function startListening({ onReading, onError, onStop } = {}) {
  if (!formantsSupported()) { onError?.(new Error('unsupported')); return () => {} }
  if (active) { onError?.(new Error('already-listening')); return () => {} }

  const P = readParams()
  const fopts = { maxFormant: P.maxFormant, maxFormants: P.maxFormants, preEmph: P.preEmph, fMin: P.fMin, maxBw: P.maxBw }

  // No auto-gain / noise-suppression / echo-cancellation: each one reshapes the
  // spectrum and would bend the formants we're trying to read.
  let stream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    })
  } catch (err) { onError?.(err); return () => {} }

  const AC = window.AudioContext || window.webkitAudioContext
  const ctx = new AC()
  try { await ctx.resume() } catch { /* started suspended is fine; rAF will drive it */ }
  const sampleRate = ctx.sampleRate
  flog('mic open —', `${Math.round(sampleRate)} Hz, fft ${P.fftSize}`,
    `| voicedRms ${P.voicedRms}, pause ${P.pauseMs}ms, maxFormant ${P.maxFormant}, order ${2 * P.maxFormants + 2}, maxBw ${P.maxBw}`)

  const source = ctx.createMediaStreamSource(stream)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = P.fftSize
  analyser.smoothingTimeConstant = 0
  source.connect(analyser)   // NOT to destination — no monitoring, no feedback
  const buf = new Float32Array(analyser.fftSize)

  active = true
  let stopped = false
  let raf = 0
  let inSeg = false
  let frames = []
  let silenceMs = 0
  let segPeak = 0          // loudest frame in the current segment (debug)
  let ambient = P.voicedRms   // slow ambient-RMS estimate (debug aid for tuning)
  let last = (typeof performance !== 'undefined' ? performance.now() : 0)

  const closeSegment = () => {
    const reading = reduceSegment(frames)
    if (reading && reading.nFrames >= P.minFrames) {
      flog('segment →',
        `F1=${Math.round(reading.f1)}Hz F2=${Math.round(reading.f2)}Hz F3=${reading.f3 ? Math.round(reading.f3) + 'Hz' : '–'}`,
        `(${reading.nFrames}/${reading.nRaw} frames, ${reading.dropped} dropped, peak RMS ${segPeak.toFixed(3)})`)
      onReading?.(reading)
    } else {
      flog('segment dropped —',
        reading ? `only ${reading.nFrames} usable frames (need ${P.minFrames})` : 'no usable F1+F2 frames',
        `(raw ${frames.length}, peak RMS ${segPeak.toFixed(3)})`)
    }
    inSeg = false; frames = []; silenceMs = 0; segPeak = 0
  }

  const tick = () => {
    if (stopped) return
    raf = requestAnimationFrame(tick)
    const now = (typeof performance !== 'undefined' ? performance.now() : last + 16)
    const dt = now - last; last = now

    analyser.getFloatTimeDomainData(buf)
    const level = rms(buf)
    const voiced = level > P.voicedRms

    if (voiced) {
      if (!inSeg) { inSeg = true; frames = []; segPeak = 0 }
      if (level > segPeak) segPeak = level
      const fr = frameFormants(buf, sampleRate, fopts)
      if (fr) frames.push({ f1: fr.f1, f2: fr.f2, f3: fr.f3, energy: level })
      silenceMs = 0
    } else {
      // a slow floor estimate, only while quiet — logged on segment drops so a
      // mis-set voicedRms is obvious (ambient creeping up to the threshold).
      ambient += (level - ambient) * 0.05
      if (inSeg) {
        silenceMs += dt
        if (silenceMs >= P.pauseMs) closeSegment()
      }
    }
  }
  raf = requestAnimationFrame(tick)

  return () => {
    if (stopped) return
    stopped = true
    active = false
    try { cancelAnimationFrame(raf) } catch { /* ignore */ }
    try { source.disconnect() } catch { /* ignore */ }
    try { stream.getTracks().forEach(t => t.stop()) } catch { /* ignore */ }
    try { ctx.close() } catch { /* ignore */ }
    flog('mic closed', `(ambient RMS ≈ ${ambient.toFixed(3)})`)
    onStop?.()
  }
}
