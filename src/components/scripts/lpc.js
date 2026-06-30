// =====================================================================
// The Polyglot's Atlas — scripts · lpc (the formant kernel)
//
// Pure DSP, no Web Audio, no React — just numbers in, formants out. This is
// the numeric heart of the 発声 / 발성 voice mode: given one short frame of
// microphone samples, it estimates the vowel's FORMANTS (F1 = mouth openness,
// F2 = tongue frontness, F3 …) in real HERTZ.
//
// It is the same recipe Praat runs under "Sound → To Formant (burg)", minus
// the rest of Praat. A resonant vocal tract is an all-pole filter; LPC fits
// that filter to the frame and its poles ARE the formants:
//
//   1. decimate to ~2·max-formant (≈11 kHz) — concentrate the model on the
//      0–5.5 kHz formant band instead of squandering poles up at 24 kHz, the
//      reason Praat resamples before it fits. A windowed-sinc FIR anti-aliases.
//   2. pre-emphasis (+6 dB/oct) — lift the higher formants the glottal source
//      rolls off, so they aren't drowned by F1's energy.
//   3. Hamming window — tame the frame edges before the autocorrelation.
//   4. Burg LPC — fit the all-pole filter (Numerical Recipes' `memcof`; Burg's
//      method is what gives clean, low-variance poles from a short frame).
//   5. roots of the LPC polynomial (Durand–Kerner) — each complex-conjugate
//      pole pair is one resonance.
//   6. pole → (frequency, bandwidth): angle → Hz, radius → bandwidth. Keep the
//      ones inside the formant band and order them low→high: F1, F2, F3.
//
// Why this and not the old mel-bin spectral-peak reader: spectral peaks smear
// and F2 read bimodally (the WIP note). LPC poles are the resonances directly,
// in Hz, far steadier — which is the whole point of the swap.
//
// Everything here is deterministic and side-effect-free, so it tests in plain
// Node against synthesized vowels (see the scratchpad harness). frameFormants()
// is the one entry point the engine calls; the rest is exported for tests.
// =====================================================================

// ---- complex helpers (tiny; degree ~12 polynomials don't need a library) ----
const cmul = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re })
const csub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im })
function cdiv(a, b) {
  const d = b.re * b.re + b.im * b.im || 1e-30
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }
}

// ---- windowed-sinc low-pass, cached per decimation factor -------------------
// Anti-alias before decimation: cutoff at 0.9·(output Nyquist), Hamming-tapered.
const tapCache = new Map()
function lowpassTaps(factor) {
  if (tapCache.has(factor)) return tapCache.get(factor)
  const numtaps = 8 * factor + 1          // odd → an integer group delay
  const M = numtaps - 1
  const fc = 0.45 / factor                // cycles/sample at the INPUT rate
  const h = new Float64Array(numtaps)
  let sum = 0
  for (let i = 0; i < numtaps; i++) {
    const n = i - M / 2
    const sinc = n === 0 ? 2 * fc : Math.sin(2 * Math.PI * fc * n) / (Math.PI * n)
    const w = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / M)   // Hamming
    h[i] = sinc * w
    sum += h[i]
  }
  for (let i = 0; i < numtaps; i++) h[i] /= sum   // unity DC gain
  tapCache.set(factor, h)
  return h
}

/** Anti-aliased decimation by an integer factor (linear-phase FIR, delay-compensated). */
export function decimate(x, factor) {
  if (factor <= 1) return Float64Array.from(x)
  const h = lowpassTaps(factor)
  const M = h.length, half = (M - 1) >> 1, N = x.length
  const outLen = Math.floor(N / factor)
  const y = new Float64Array(outLen)
  for (let i = 0; i < outLen; i++) {
    const center = i * factor + half        // compensate the FIR group delay
    let acc = 0
    for (let k = 0; k < M; k++) {
      const idx = center - k
      if (idx >= 0 && idx < N) acc += h[k] * x[idx]
    }
    y[i] = acc
  }
  return y
}

// ---- Burg LPC ---------------------------------------------------------------
/**
 * Burg's method for the AR (all-pole) coefficients of a frame. A direct port of
 * Numerical Recipes' `memcof` (maximum-entropy / Burg) — chosen because it gives
 * low-variance poles from a SHORT frame, exactly what formant tracking needs.
 * @param {ArrayLike<number>} data  windowed frame
 * @param {number} m  model order (≈ 2·#formants + 2)
 * @returns {?{a:Float64Array, xms:number}}  a = [1, a1…am] for A(z)=Σ a_i z^-i; null if degenerate
 */
export function burgLPC(data, m) {
  const n = data.length
  if (n <= m + 1) return null
  const d = new Float64Array(m + 1)        // d[1..m]: prediction coeffs (NR convention)
  const wk1 = new Float64Array(n)
  const wk2 = new Float64Array(n)
  const wkm = new Float64Array(m + 1)
  let p = 0
  for (let j = 0; j < n; j++) p += data[j] * data[j]
  let xms = p / n
  if (!(xms > 0)) return null

  wk1[0] = data[0]
  wk2[n - 2] = data[n - 1]
  for (let j = 1; j < n - 1; j++) { wk1[j] = data[j]; wk2[j - 1] = data[j] }

  for (let k = 1; k <= m; k++) {
    let num = 0, denom = 0
    for (let j = 0; j < n - k; j++) {
      num += wk1[j] * wk2[j]
      denom += wk1[j] * wk1[j] + wk2[j] * wk2[j]
    }
    if (!(denom > 0)) return null
    d[k] = (2 * num) / denom
    xms *= 1 - d[k] * d[k]
    for (let i = 1; i <= k - 1; i++) d[i] = wkm[i] - d[k] * wkm[k - i]
    if (k === m) break
    for (let i = 1; i <= k; i++) wkm[i] = d[i]
    for (let j = 0; j < n - k - 1; j++) {
      wk1[j] -= wkm[k] * wk2[j]
      wk2[j] = wk2[j + 1] - wkm[k] * wk1[j + 1]
    }
  }

  // Prediction is data[j] ≈ Σ d[i]·data[j-i], so A(z) = 1 − Σ d[i] z^-i.
  const a = new Float64Array(m + 1)
  a[0] = 1
  for (let i = 1; i <= m; i++) a[i] = -d[i]
  return { a, xms }
}

// ---- polynomial roots (Durand–Kerner / Weierstrass) -------------------------
function horner(c, z) {                     // P(z) for real descending coeffs c
  let re = c[0], im = 0
  for (let i = 1; i < c.length; i++) {
    const nr = re * z.re - im * z.im + c[i]
    const ni = re * z.im + im * z.re
    re = nr; im = ni
  }
  return { re, im }
}

/**
 * All complex roots of a polynomial given in DESCENDING powers
 * (coeffs[0]·z^n + … + coeffs[n]). Durand–Kerner converges fast and reliably for
 * the well-separated in-the-unit-disk roots an LPC polynomial produces.
 */
export function polyRoots(coeffs) {
  const n = coeffs.length - 1
  if (n < 1) return []
  const c = new Float64Array(n + 1)
  const lead = coeffs[0] || 1e-30
  for (let i = 0; i <= n; i++) c[i] = coeffs[i] / lead   // monic
  // Seed off a spiral (the classic 0.4+0.9i powers) so no two guesses collide.
  const roots = new Array(n)
  let cur = { re: 1, im: 0 }
  const seed = { re: 0.4, im: 0.9 }
  for (let k = 0; k < n; k++) { roots[k] = { re: cur.re, im: cur.im }; cur = cmul(cur, seed) }

  for (let iter = 0; iter < 200; iter++) {
    let maxDelta = 0
    for (let i = 0; i < n; i++) {
      const num = horner(c, roots[i])
      let den = { re: 1, im: 0 }
      for (let j = 0; j < n; j++) {
        if (j === i) continue
        den = cmul(den, csub(roots[i], roots[j]))
      }
      const delta = cdiv(num, den)
      roots[i] = csub(roots[i], delta)
      const d = Math.hypot(delta.re, delta.im)
      if (d > maxDelta) maxDelta = d
    }
    if (maxDelta < 1e-12) break
  }
  return roots
}

// ---- frame → formants -------------------------------------------------------
function hammingInPlace(x) {
  const M = x.length - 1
  for (let i = 0; i <= M; i++) x[i] *= 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / M)
}

/** @typedef {{maxFormant:number, maxFormants:number, preEmph:number, fMin:number, maxBw:number}} FormantOpts */

/** Sensible defaults for an adult speaker; the engine may override per setup. */
export const DEFAULT_FORMANT_OPTS = {
  maxFormant: 5500,   // LPC ceiling — raise for shorter tracts, lower for longer
  maxFormants: 5,     // formants expected in the band → LPC order = 2·this + 2
  preEmph: 0.97,      // +6 dB/oct tilt before the fit
  fMin: 90,           // floor: ignore poles below this (glottal / DC)
  maxBw: 400,         // gate: real resonances are narrow (≲200 Hz); wide poles
                      // are spectral tilt / junk and would steal a formant slot

}

/**
 * Estimate formants from one frame of microphone samples.
 * @param {ArrayLike<number>} frame  time-domain samples (any amplitude)
 * @param {number} sampleRate        Hz of the incoming frame
 * @param {Partial<FormantOpts>} [opts]
 * @returns {?{f1:number,f2:number,f3:?number,b1:number,b2:number,nPoles:number}}
 *          formants in Hz (f3 null if only two found), or null if the frame
 *          yields fewer than two in-band poles
 */
export function frameFormants(frame, sampleRate, opts) {
  const o = { ...DEFAULT_FORMANT_OPTS, ...(opts || {}) }
  const targetRate = 2 * o.maxFormant
  const factor = Math.max(1, Math.round(sampleRate / targetRate))
  const effRate = sampleRate / factor

  const x = decimate(frame, factor)
  const N = x.length
  const order = 2 * o.maxFormants + 2
  if (N < order + 8) return null

  // DC removal — a bias term would otherwise plant a spurious pole at 0 Hz.
  let mean = 0
  for (let i = 0; i < N; i++) mean += x[i]
  mean /= N
  for (let i = 0; i < N; i++) x[i] -= mean

  // Pre-emphasis (in place, back-to-front so each x[i-1] is still the original).
  for (let i = N - 1; i > 0; i--) x[i] -= o.preEmph * x[i - 1]

  hammingInPlace(x)

  const lp = burgLPC(x, order)
  if (!lp) return null
  const roots = polyRoots(lp.a)

  const fs = []
  for (const r of roots) {
    if (r.im <= 0) continue                     // one pole per conjugate pair
    const freq = (Math.atan2(r.im, r.re) * effRate) / (2 * Math.PI)
    const mag = Math.hypot(r.re, r.im)
    const bw = (-Math.log(mag) * effRate) / Math.PI
    if (freq >= o.fMin && freq <= o.maxFormant && bw > 0 && bw < o.maxBw) fs.push({ freq, bw })
  }
  if (fs.length < 2) return null
  fs.sort((a, b) => a.freq - b.freq)
  return {
    f1: fs[0].freq, f2: fs[1].freq, f3: fs[2] ? fs[2].freq : null,
    b1: fs[0].bw, b2: fs[1].bw,
    nPoles: fs.length,
  }
}
