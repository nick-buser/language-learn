// =====================================================================
// The Polyglot's Atlas — scripts · pitch (the learner's own melody)
//
// The fourth sibling: speech.js SPEAKS, song/audio.js SYNTHESIZES,
// formants.js reads the VOWEL, and this one reads the TUNE — the F0
// contour of the voice, so a learner saying はし can watch their own
// pitch trace over the target High/Low ridge and see whether it drops
// where the accent does.
//
// Why this is the easy sibling of the formant seam: pitch is the more
// solved problem. F0 comes straight off the time-domain signal (here via
// the McLeod Pitch Method, `pitchy`) — accurate, real-time, per audio
// frame, no segments and no ~2s lag. And pitch accent is RELATIVE (it's
// where High falls to Low, not any absolute hertz), so there's no
// calibration: the compass over in 母音 needs to learn your vowel space,
// but the ridge just normalises your contour into its 高/低 band.
//
// Best-effort throughout: no mic / no Web Audio → the calls no-op and the
// ridge still plays its synthesized tones. The mic (and `pitchy`) load
// only on the first startPitchTrack() — a lazy import() behind a real
// click, so neither touches a learner who never taps "say it".
// =====================================================================

// Below this RMS the mic is effectively silent — used only to auto-stop a take a
// beat after the speaker finishes. The voiced/clarity decision (and its
// thresholds) now lives in the component, which also surfaces the live input
// level and clarity so a no-response take is never a mystery.
const SILENCE_RMS = 0.005

/** Is live pitch tracking possible here? (mic + Web Audio present) */
export function pitchSupported() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const AC = window.AudioContext || window.webkitAudioContext
  return !!AC && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

// Load pitchy once, lazily, and cache the promise. Pure ESM, so the named
// export comes straight back — no UMD/.default dance.
let pitchyPromise = null
function loadPitchy() {
  if (!pitchyPromise) pitchyPromise = import('pitchy').then(m => m.PitchDetector)
  return pitchyPromise
}

/**
 * Start tracking pitch off the microphone. Calls `onFrame` ~per animation
 * frame with the current reading; voiced frames carry an `hz`, unvoiced ones
 * carry `hz: null` (so the caller can break the contour at consonants). Stops
 * itself after a beat of silence following speech (or a hard time cap), and
 * returns a stop() for manual teardown / unmount.
 *
 * @param {object} h
 * @param {(f:{hz:number,clarity:number,level:number,t:number})=>void} h.onFrame
 *        per frame: raw MPM pitch (Hz) + clarity (0–1) + input RMS level + ms
 *        since start. The component decides voiced/unvoiced and shows the rest.
 * @param {(err:any)=>void} [h.onError]
 * @param {(reason:string)=>void} [h.onStop]
 * @param {number} [h.silenceMs=650]  quiet after speech that auto-stops
 * @param {number} [h.maxMs=4000]     hard cap on a single take
 * @returns {Promise<() => void>} resolves to stop()
 */
export async function startPitchTrack({ onFrame, onError, onStop, silenceMs = 650, maxMs = 4000 } = {}) {
  if (!pitchSupported()) { onError?.(new Error('unsupported')); return () => {} }

  let PitchDetector
  try { PitchDetector = await loadPitchy() } catch (err) { onError?.(err); return () => {} }

  const AC = window.AudioContext || window.webkitAudioContext
  let ctx, stream
  try {
    ctx = new AC()
    // A context can start suspended (autoplay policy) — then the analyser only
    // ever sees silence and the take looks dead. Resume it inside the gesture.
    if (ctx.state === 'suspended') await ctx.resume()
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (err) {
    try { ctx?.close() } catch { /* ignore */ }
    onError?.(err)
    return () => {}
  }

  const src = ctx.createMediaStreamSource(stream)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 2048
  src.connect(analyser)               // analyser only — we never route mic to output
  const buf = new Float32Array(analyser.fftSize)
  const detector = PitchDetector.forFloat32Array(analyser.fftSize)
  const sampleRate = ctx.sampleRate

  let raf = 0, stopped = false
  let anyLoud = false, lastLoudAt = 0
  const t0 = performance.now()

  function teardown(reason) {
    if (stopped) return
    stopped = true
    if (raf) cancelAnimationFrame(raf)
    try { stream.getTracks().forEach(t => t.stop()) } catch { /* ignore */ }
    try { src.disconnect() } catch { /* ignore */ }
    try { ctx.close() } catch { /* ignore */ }
    onStop?.(reason)
  }

  function tick() {
    if (stopped) return
    const now = performance.now()
    const t = now - t0
    analyser.getFloatTimeDomainData(buf)
    let sum = 0
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i]
    const level = Math.sqrt(sum / buf.length)        // RMS of the time-domain frame
    const [hz, clarity] = detector.findPitch(buf, sampleRate)
    onFrame?.({ hz, clarity, level, t })

    // Auto-stop on the speaker falling quiet (level-based, not pitch-based — so
    // it ends the take even when no clean pitch was ever found).
    const loud = level >= SILENCE_RMS
    if (loud) { anyLoud = true; lastLoudAt = now }
    if (anyLoud && !loud && now - lastLoudAt > silenceMs) return teardown('silence')
    if (t > maxMs) return teardown('max')
    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)
  return () => teardown('manual')
}
