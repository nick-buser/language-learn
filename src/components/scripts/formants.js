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
// nothing else. The engine behind it (today the pure-WebAudio formantanalyzer
// library; tomorrow, maybe, a Praat/Parselmouth WASM build) lives entirely in
// here — swap the body, keep the two signatures, and no instrument changes.
//
// Two things to know about the engine, both encapsulated below:
//   • UNITS ARE MEL BINS, not Hz. formantanalyzer reports each formant as an
//     index into its mel filterbank (0 … N_mel_bins over f_min…f_max), not a
//     frequency in hertz. That's fine — the compass calibrates to YOUR voice
//     with an affine fit, so the absolute scale never has to be named.
//   • IT IS SEGMENT-BASED, not a 60fps stream. The library waits for a
//     pause-delimited voiced segment, then fires one callback (latency up to
//     ~2s). So the felt UX is "say a vowel → a dot drops," not a live cursor.
//
// Best-effort throughout: no mic, no getUserMedia, no AudioContext → the
// calls no-op and the compass shows a quiet "mic unavailable" note. The
// library (and the getUserMedia prompt) is loaded only on the first
// startListening() — a lazy import(), so neither the weight nor the
// permission ask touches a learner who never opens the voice view.
// =====================================================================

// Per-frame column layout of an output_level-4 segment: 3 formants, each
// [mel-bin, energy, span], sorted low→high. F1 is the lowest formant, F2 the
// next. (Indices, not Hz — see header.)
const F1_BIN = 0, F1_EN = 1
const F2_BIN = 3, F2_EN = 4
const F3_BIN = 6

/** Is live formant analysis even possible here? (mic + Web Audio present) */
export function formantsSupported() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const AC = window.AudioContext || window.webkitAudioContext
  return !!AC && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

// Load the library once, lazily, and cache the promise. The UMD bundle comes
// back as either a namespace with a `.default` (Vite's CJS interop) or the
// object directly; tolerate both.
let libPromise = null
function loadLib() {
  if (!libPromise) {
    // Literal specifier (no @vite-ignore) so the bundler code-splits it into
    // its own async chunk — the ~115 kB library lands only when first asked
    // for. The package's `main` field points at a file that isn't shipped, so
    // we import index.js (the real, self-contained UMD browser build) by path.
    libPromise = import('formantanalyzer/index.js')
      .then(mod => mod?.default ?? mod)
  }
  return libPromise
}

// ---- debug logging ------------------------------------------------------
// The mic path is hard to debug blind: mel-bin units, ~2s segment latency, a
// worklet fetched off a CDN. So every reading, capture, and fit funnels through
// flog() — ON by default; set localStorage 'atlas.formant.debug' = '0' to
// silence it. Prefixed [発声] so it filters cleanly in the console.
export const FORMANT_DEBUG = (() => {
  try { return window.localStorage.getItem('atlas.formant.debug') !== '0' } catch { return true }
})()
export function flog(...args) {
  if (FORMANT_DEBUG) console.log('%c[発声]', 'color:#A9CBE4;font-weight:bold', ...args)
}

// Median of a numeric array (the steady centre of a held vowel beats the
// onset/offset wobble that a mean would smear).
function median(xs) {
  if (!xs.length) return null
  const s = [...xs].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

// Reduce one voiced segment (an array of 9-wide frames) to a single steady
// reading, keeping frames where both F1 and F2 are present and taking medians.
// Deliberately lax — one usable frame is enough — so short or noisy utterances
// still yield SOMETHING to look at rather than silently vanishing; the reading
// carries its own frame bookkeeping (nRaw/dropped) for the debug log.
function reduceSegment(frames) {
  if (!Array.isArray(frames) || frames.length < 1) return null
  // Trim onset/offset transitions only when the segment is long enough to spare
  // them — short utterances keep every frame rather than starve the medians.
  const core = frames.length >= 6
    ? frames.slice(Math.floor(frames.length * 0.2), Math.ceil(frames.length * 0.8))
    : frames
  const f1 = [], f2 = [], f3 = [], en = []
  let dropped = 0
  for (const fr of core) {
    if (!fr || fr.length < 6) { dropped++; continue }
    const a = fr[F1_BIN], b = fr[F2_BIN]
    if (a > 0 && b > 0 && b > a) {          // both formants present, F2 above F1
      f1.push(a); f2.push(b)
      if (fr[F3_BIN] > 0) f3.push(fr[F3_BIN])
      en.push((fr[F1_EN] || 0) + (fr[F2_EN] || 0))
    } else dropped++
  }
  if (!f1.length) return null
  return {
    f1: median(f1),
    f2: median(f2),
    f3: f3.length ? median(f3) : null,
    energy: median(en),
    nFrames: f1.length,
    nRaw: frames.length,
    dropped,
  }
}

// ---- calibration math: fit YOUR vowel space onto the trapezoid ----------
// Vowel formants are speaker-relative, so the compass learns an affine map
// (f1,f2) → (x,y) from a few anchor vowels measured in your own voice. With
// the three corner vowels the fit is exact; extra anchors least-squares-fit.
// This is what lets a mel-bin reading land in the right place without ever
// naming a frequency.

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
  // degenerate vowel triangle (two anchors that landed on the same bins). The
  // map may be rough, but the learner gets a dot instead of a dead end — and the
  // log below shows exactly which anchors collided. λ is negligible against the
  // data scale (mel bins ~0–127), so a clean triple is essentially unchanged.
  const lambda = 1e-3
  const M = [[s11 + lambda, s12, s1], [s12, s22 + lambda, s2], [s1, s2, n + lambda]]
  const px = solve3(M, [tx1, tx2, tx])
  const py = solve3(M, [ty1, ty2, ty])
  if (!px || !py) { flog('fit FAILED — singular even with ridge', samples); return null }
  const cal = { ax: px[0], bx: px[1], cx: px[2], ay: py[0], by: py[1], cy: py[2] }
  flog('fit OK from', samples.map(s => `(${s.f1},${s.f2})→(${s.x},${s.y})`).join('  '))
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

let active = false   // the library is single-stream; guard against double-start

/**
 * Start listening to the microphone. Resolves nothing useful; instead it
 * pushes a stabilized reading to `onReading` once per voiced segment the
 * speaker utters. Returns a stop() to tear the mic down (call on unmount or
 * when the learner clicks stop).
 *
 * @param {object}   handlers
 * @param {(r:{f1:number,f2:number,f3:?number,energy:number,nFrames:number})=>void} handlers.onReading
 *        one reading per voiced segment, formants in mel-bin units
 * @param {(err:any)=>void} [handlers.onError]   mic denied / engine failure
 * @param {()=>void}        [handlers.onStop]    fired once the stream ends
 * @returns {Promise<() => void>} resolves to a stop() function
 */
export async function startListening({ onReading, onError, onStop } = {}) {
  if (!formantsSupported()) { onError?.(new Error('unsupported')); return () => {} }
  if (active) { onError?.(new Error('already-listening')); return () => {} }

  let FA
  try {
    FA = await loadLib()
  } catch (err) {
    onError?.(err)
    return () => {}
  }

  // Our own readout, on our own SVG — disable the library's canvas plotter.
  //
  // configure() must be passed a COMPLETE config. The library guards several
  // fields with `!== null` (not `!= null`), so OMITTING one overwrites its own
  // default with `undefined`. Leaving out spec_type was fatal: the worklet only
  // accepts a settings message when `e.data.spec_type` is truthy, so an
  // undefined spec_type made it reject the config ("Unrecognized Rx on worklet
  // port") and run unconfigured — the main thread then expected 256 FFT bins
  // while the worklet emitted 128 mel bins ("Bins count mismatch: 256, 128"),
  // which rejected the whole launch. So: every `!== null`-guarded field is set
  // explicitly here (spec_type, f_min, high_f_emph, auto_noise_gate, voiced_min_dB).
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

  // The callback fires per segment: (index, label, [start,dur], frames).
  async function onSegment(_i, _label, _ts, frames) {
    const reading = reduceSegment(frames)
    if (reading) {
      flog('segment →',
        `F1=${reading.f1} F2=${reading.f2} F3=${reading.f3 ?? '–'}`,
        `(${reading.nFrames}/${reading.nRaw} frames, ${reading.dropped} dropped, E=${Math.round(reading.energy)})`)
      onReading?.(reading)
    } else {
      flog('segment dropped — no usable F1+F2 frames',
        Array.isArray(frames) ? `(raw=${frames.length})` : '(no frames)')
    }
  }

  active = true
  // LaunchAudioNodes(3=mic, null, cb, label, offline_mode, test_play, off, dur).
  // The promise resolves when the stream ends (we stop it) or rejects on a mic
  // error; either way the mic is done, so flip `active` and tell the caller.
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
