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
// nothing else. startListening({engine}) picks an engine; everything else stays
// the same. TWO engines live here now, so a learner (or the dev) can A/B them
// against a real mic:
//
//   • 'lpc' (default) — real Linear Predictive Coding, Praat's own
//     "To Formant (burg)" recipe done in plain JS. The numeric kernel
//     (decimate → pre-emphasis → Hamming → Burg LPC → roots → poles-as-
//     formants) is lpc.js; the body here is just the audio plumbing: getUserMedia
//     (auto-gain / noise-suppression / echo-cancellation OFF — they smear
//     formants), an AnalyserNode, a rAF loop grabbing ~23 ms frames, an RMS gate
//     that bundles voiced frames into a segment and reduces them to one steady
//     reading. Output is real HERTZ. No worklet, no CDN, no Python.
//
//   • 'spectral' — round one: the pure-WebAudio `formantanalyzer` library. Reads
//     mel-bin SPECTRAL PEAKS (units are mel-filterbank indices, not Hz), kept so
//     the new engine can be compared against it. Its F2 reads bimodally — the
//     reason 'lpc' exists — but on some mics/voices it may still behave; the
//     toggle is there to find out. The library lazy-loads on first use.
//
// UNITS DIFFER BY ENGINE (Hz vs mel bins), so each engine calibrates SEPARATELY:
// the compass never names the scale — it learns an affine map from YOUR anchor
// vowels — but a map fitted under one engine is meaningless to the other, so the
// hook keys calibration per engine (…cal.<v>.lpc / .spectral). Switching engines
// loads that engine's own map (and prompts a fresh calibration if it has none).
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
// The mic path is hard to debug blind. Every reading, capture, and fit funnels
// through flog() — ON by default; set localStorage 'atlas.formant.debug' = '0'
// to silence it. Prefixed [発声] so it filters cleanly in the console.
export const FORMANT_DEBUG = (() => {
  try { return window.localStorage.getItem('atlas.formant.debug') !== '0' } catch { return true }
})()
export function flog(...args) {
  if (FORMANT_DEBUG) console.log('%c[発声]', 'color:#A9CBE4;font-weight:bold', ...args)
}

// ---- engine choice (persisted; the toggle lives in <VoiceReadout>) -------
const ENGINE_KEY = 'atlas.formant.engine'
/** The selectable engines — id drives dispatch; label/sub drive the toggle. */
export const ENGINES = [
  { id: 'lpc', label: 'LPC', sub: 'Burg · Hz' },
  { id: 'spectral', label: 'Spectral', sub: 'mel peaks' },
]
export const DEFAULT_ENGINE = 'lpc'
export function loadEngine() {
  try {
    const e = window.localStorage.getItem(ENGINE_KEY)
    return ENGINES.some(x => x.id === e) ? e : DEFAULT_ENGINE
  } catch { return DEFAULT_ENGINE }
}
export function saveEngine(e) {
  try { window.localStorage.setItem(ENGINE_KEY, e) } catch { /* ignore */ }
}

// ---- shared helpers ------------------------------------------------------
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

let active = false   // both engines share one mic stream; guard double-start

// =====================================================================
// ENGINE: 'lpc' — real LPC/Burg formants in Hz (the default)
// =====================================================================

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

// Reduce one voiced segment (an array of per-frame {f1,f2,f3,energy}) to a
// single steady reading: trim onset/offset transitions when the segment is long
// enough to spare them, then take per-formant medians.
function reduceLpc(frames) {
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

async function startLpc({ onReading, onError, onStop } = {}) {
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
  flog('mic open (lpc) —', `${Math.round(sampleRate)} Hz, fft ${P.fftSize}`,
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
    const reading = reduceLpc(frames)
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
      // a slow floor estimate, only while quiet — logged on close so a mis-set
      // voicedRms is obvious (ambient creeping up to the threshold).
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
    flog('mic closed (lpc)', `(ambient RMS ≈ ${ambient.toFixed(3)})`)
    onStop?.()
  }
}

// =====================================================================
// ENGINE: 'spectral' — round one, the formantanalyzer library (mel bins)
// =====================================================================

// Per-frame layout of an output_level-4 segment: 3 formant peaks, each
// [mel-bin, energy, span], sorted low→high. EMPIRICALLY (from the 発声 logs) the
// LOWEST peak (index 0) is a dead band — it sits at ~the same bin for every
// vowel, even open あ — so we drop it and read the 2nd and 3rd peaks: peak 1
// rises as the jaw OPENS (≈ true F1), peak 2 spreads FRONT→BACK (≈ true F2).
const OPEN_BIN = 3, OPEN_EN = 4   // openness  (≈ F1) — climbs for あ
const BACK_BIN = 6, BACK_EN = 7   // backness  (≈ F2) — high for い, low for う
const JUNK_BIN = 0                // the dead low band — kept only for the debug log

// Load the library once, lazily, and cache the promise. The UMD bundle comes
// back as either a namespace with a `.default` (Vite's CJS interop) or the
// object directly; tolerate both. The package's `main` field points at a file
// that isn't shipped, so we import index.js (the real UMD browser build) by path.
let libPromise = null
function loadLib() {
  if (!libPromise) libPromise = import('formantanalyzer/index.js').then(mod => mod?.default ?? mod)
  return libPromise
}

// Reduce one voiced segment (an array of 9-wide frames) to a single steady
// reading, keeping frames where both useful peaks are present and taking medians.
function reduceSpectral(frames) {
  if (!Array.isArray(frames) || frames.length < 1) return null
  const core = frames.length >= 6
    ? frames.slice(Math.floor(frames.length * 0.2), Math.ceil(frames.length * 0.8))
    : frames
  const open = [], back = [], lo = [], en = []
  let dropped = 0
  for (const fr of core) {
    if (!fr || fr.length < 8) { dropped++; continue }
    const a = fr[OPEN_BIN], b = fr[BACK_BIN]
    if (a > 0 && b > 0 && b > a) {          // both useful peaks present (sorted)
      open.push(a); back.push(b)
      if (fr[JUNK_BIN] > 0) lo.push(fr[JUNK_BIN])
      en.push((fr[OPEN_EN] || 0) + (fr[BACK_EN] || 0))
    } else dropped++
  }
  if (!open.length) return null
  return {
    f1: median(open),   // openness  (the trapezoid's y / height), mel bins
    f2: median(back),   // backness  (the trapezoid's x / front↔back), mel bins
    f3: null,
    energy: median(en),
    nFrames: open.length,
    nRaw: frames.length,
    dropped,
  }
}

async function startSpectral({ onReading, onError, onStop } = {}) {
  if (!formantsSupported()) { onError?.(new Error('unsupported')); return () => {} }
  if (active) { onError?.(new Error('already-listening')); return () => {} }

  let FA
  try { FA = await loadLib() } catch (err) { onError?.(err); return () => {} }

  // configure() must be passed a COMPLETE config. The library guards several
  // fields with `!== null` (not `!= null`), so OMITTING one overwrites its own
  // default with `undefined` — fatal for spec_type (the worklet then rejects the
  // config and the bin counts mismatch). So every guarded field is set here.
  FA.configure({
    plot_enable: false,
    spec_type: 1,          // 1 = mel filterbank (must be explicit — see note)
    output_level: 4,       // per-segment raw formants: F1/F2/F3 × [bin, energy, span]
    f_min: 50,
    f_max: 4000,
    N_fft_bins: 256,
    N_mel_bins: 128,       // → spec_bands; must match what the worklet sends
    window_width: 25,
    window_step: 25,
    pre_norm_gain: 1000,
    high_f_emph: 0.0,
    pause_length: 180,     // ms of quiet that closes a segment
    min_seg_length: 60,    // ms — ignore clicks and lip smacks
    auto_noise_gate: true,
    voiced_max_dB: 100,
    voiced_min_dB: 10,
  })
  flog('mic open (spectral) — formantanalyzer, mel bins')

  // The callback fires per segment: (index, label, [start,dur], frames).
  function onSegment(_i, _label, _ts, frames) {
    const reading = reduceSpectral(frames)
    if (reading) {
      flog('segment →',
        `open=${reading.f1} back=${reading.f2} (mel bins)`,
        `(${reading.nFrames}/${reading.nRaw} frames, ${reading.dropped} dropped, E=${Math.round(reading.energy)})`)
      onReading?.(reading)
    } else {
      flog('segment dropped — no usable F1+F2 frames',
        Array.isArray(frames) ? `(raw=${frames.length})` : '(no frames)')
    }
  }

  active = true
  // LaunchAudioNodes(3=mic, null, cb, label, offline, test_play, off, dur).
  // The promise resolves when the stream ends or rejects on a mic error; either
  // way the mic is done, so flip `active` and tell the caller.
  FA.LaunchAudioNodes(3, null, onSegment, ['mic'], false, false, null, null)
    .then(() => { active = false; onStop?.() })
    .catch(err => { active = false; onError?.(err); onStop?.() })

  let stopped = false
  return () => {
    if (stopped) return
    stopped = true
    try { FA.StopAudioNodes('compass-stop') } catch { /* ignore */ }
    active = false
  }
}

// ---- calibration math: fit YOUR vowel space onto the trapezoid ----------
// Vowel formants are speaker-relative, so the compass learns an affine map
// (f1,f2) → (x,y) from a few anchor vowels measured in your own voice. With
// the three corner vowels the fit is exact; extra anchors least-squares-fit.
// This is engine-agnostic: it absorbs whatever scale the inputs carry (Hz or
// mel bins), which is exactly why each engine just needs its own fitted map.

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
  // degenerate vowel triangle (two anchors that landed on the same readings).
  // The map may be rough, but the learner gets a dot instead of a dead end —
  // and the log below shows which anchors collided. λ is negligible against the
  // data scale (Hz² or mel-bin², ≫1), so a clean triple is essentially unchanged.
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
  flog('calibration quality:', rating, `(aspect ${aspect.toFixed(2)}, closest ${closest?.join('/')} @ ${min.toFixed(0)})`)
  return { rating, aspect, minDist: min, closest }
}

// ---- the dispatcher (the one signature the seam exposes) -----------------
/**
 * Start listening to the microphone with the chosen engine. Pushes a stabilized
 * reading to `onReading` once per voiced segment; returns a stop() to tear the
 * mic down. Readings are in HERTZ for 'lpc', mel-bin indices for 'spectral'.
 *
 * @param {object}   opts
 * @param {('lpc'|'spectral')} [opts.engine]  defaults to the persisted choice
 * @param {(r:{f1:number,f2:number,f3:?number,energy:number,nFrames:number})=>void} opts.onReading
 * @param {(err:any)=>void} [opts.onError]   mic denied / engine failure
 * @param {()=>void}        [opts.onStop]    fired once the stream ends
 * @returns {Promise<() => void>} resolves to a stop() function
 */
export function startListening({ engine, onReading, onError, onStop } = {}) {
  const eng = engine === 'spectral' || engine === 'lpc' ? engine : loadEngine()
  const start = eng === 'spectral' ? startSpectral : startLpc
  return start({ onReading, onError, onStop })
}
