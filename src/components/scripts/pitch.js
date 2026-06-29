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

// Plausible human voice F0, and the MPM clarity below which a frame is
// treated as unvoiced (a consonant, a breath, silence) and left as a gap.
const MIN_HZ = 70, MAX_HZ = 500
const CLARITY_MIN = 0.9

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
 * @param {(f:{hz:?number,clarity:number,t:number,voiced:boolean})=>void} h.onFrame
 *        t is ms since tracking began
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
  let anyVoiced = false, lastVoicedAt = 0
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
    const [hz, clarity] = detector.findPitch(buf, sampleRate)
    const voiced = clarity >= CLARITY_MIN && hz >= MIN_HZ && hz <= MAX_HZ
    if (voiced) { anyVoiced = true; lastVoicedAt = now }
    onFrame?.({ hz: voiced ? hz : null, clarity, t, voiced })

    if (anyVoiced && !voiced && now - lastVoicedAt > silenceMs) return teardown('silence')
    if (t > maxMs) return teardown('max')
    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)
  return () => teardown('manual')
}
