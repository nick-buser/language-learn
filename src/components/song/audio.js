// =====================================================================
// The Polyglot's Atlas — song · audio (the voice of the instruments)
//
// A tiny, dependency-free Web Audio helper. No samples, no files — just
// synthesized tones so a pitch can be *heard*, hummed against, and a beat
// can be felt. The AudioContext is created lazily on the first user
// gesture (play / click), which is what browser autoplay policy wants.
//
// Everything here is best-effort: if Web Audio is unavailable the calls
// no-op, and the visual instruments carry on. Pitch is the felt extra,
// never a dependency.
// =====================================================================

let ctx = null;

function ac() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Wake the context inside a user gesture (call from a click handler). */
export function primeAudio() { return !!ac(); }

export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Pluck one note. `when` is an offset in seconds from now (for scheduling
 * ahead of the visual playhead). Returns nothing useful — fire and forget.
 */
export function playTone(midi, { dur = 0.5, type = 'triangle', gain = 0.16, when = 0 } = {}) {
  const c = ac();
  if (c == null || midi == null) return;
  const t = c.currentTime + Math.max(0, when);
  const osc = c.createOscillator();
  const g = c.createGain();
  const hold = Math.max(0.12, dur * 0.9);
  osc.type = type;
  osc.frequency.setValueAtTime(midiToFreq(midi), t);
  osc.connect(g);
  g.connect(c.destination);
  // a gentle struck envelope — quick attack, soft exponential release
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + hold);
  osc.start(t);
  osc.stop(t + hold + 0.05);
}

/** A short metronome click; accented (downbeat) ticks ring a little higher. */
export function playTick(accent = false) {
  const c = ac();
  if (c == null) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(accent ? 1760 : 1100, t);
  osc.connect(g);
  g.connect(c.destination);
  g.gain.setValueAtTime(accent ? 0.09 : 0.05, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  osc.start(t);
  osc.stop(t + 0.06);
}

/**
 * A sustained tonic drone for singing against. Returns a stop() that
 * fades it out, so the caller can toggle it cleanly.
 */
export function startDrone(midi, { type = 'sine', gain = 0.06 } = {}) {
  const c = ac();
  if (c == null || midi == null) return () => {};
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(midiToFreq(midi), t);
  osc.connect(g);
  g.connect(c.destination);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.25);
  osc.start(t);
  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    const now = c.currentTime;
    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(g.gain.value, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    osc.stop(now + 0.25);
  };
}
