// =====================================================================
// The Polyglot's Atlas — scripts · speech (the voice of the glyphs)
//
// The sibling of song/audio.js: where that synthesizes *tones*, this
// speaks *syllables*. A thin, dependency-free wrapper over the browser's
// Web Speech API (window.speechSynthesis) — the OS's own voices, so a
// kana or a hangul block (or any made-up loanword the transliteration
// game throws at it) can be *heard*, offline, with zero backend and zero
// audio assets.
//
// THE SEAM. Every instrument calls speak()/hasVoice() and nothing else.
// The day a recorded-clip set or an in-browser neural voice (Kokoro et
// al.) is worth the weight, it drops in *here* — swap the body of speak(),
// keep the signature, and no instrument changes. That's the whole reason
// this is one small module.
//
// Best-effort throughout: if the API or a matching voice is missing the
// calls no-op and the instruments carry on silently (they surface a quiet
// "no <lang> voice installed" note instead). Sound is the felt extra,
// never a dependency.
// =====================================================================

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

/** Is speech synthesis available at all in this browser? */
export function speechSupported() {
  return !!synth && typeof window.SpeechSynthesisUtterance === 'function';
}

// Voices load asynchronously in most browsers — getVoices() is empty until
// the engine fires 'voiceschanged'. We cache the latest list and let React
// subscribe so an instrument re-renders (and re-checks hasVoice) when they
// arrive.
let voices = [];
const listeners = new Set();

function refreshVoices() {
  if (!synth) return;
  const next = synth.getVoices() || [];
  if (next.length) voices = next;
  listeners.forEach(fn => { try { fn(voices); } catch { /* ignore */ } });
}

if (synth) {
  refreshVoices();
  // 'voiceschanged' is the spec event; some engines also need a poke.
  if (typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', refreshVoices);
  } else {
    synth.onvoiceschanged = refreshVoices;
  }
}

/** Subscribe to voice-list changes; returns an unsubscribe. Fires once now. */
export function subscribeVoices(fn) {
  listeners.add(fn);
  if (voices.length) fn(voices);
  return () => listeners.delete(fn);
}

// A BCP-47 prefix match: 'ja' matches 'ja-JP', 'ko' matches 'ko-KR'.
function matches(voice, langPrefix) {
  return (voice.lang || '').toLowerCase().replace('_', '-').startsWith(langPrefix);
}

/** All installed voices for a language tag ('ja' / 'ko'), for a picker. */
export function listVoices(langPrefix) {
  return voices.filter(v => matches(v, langPrefix));
}

/** Is there at least one voice that can speak this language? */
export function hasVoice(langPrefix) {
  return listVoices(langPrefix).length > 0;
}

// The learner can pin a preferred voice per language (some machines carry
// several ja-JP / ko-KR voices of uneven quality). Persisted so the choice
// survives a reload, mirroring the atlas's other localStorage stores.
const PREF_KEY = lang => `atlas.speech.voice.${lang}`;

export function getPreferredVoiceURI(langPrefix) {
  try { return window.localStorage.getItem(PREF_KEY(langPrefix)) || null; }
  catch { return null; }
}

export function setPreferredVoiceURI(langPrefix, voiceURI) {
  try {
    if (voiceURI) window.localStorage.setItem(PREF_KEY(langPrefix), voiceURI);
    else window.localStorage.removeItem(PREF_KEY(langPrefix));
  } catch { /* private mode: this session only */ }
}

// Pick the voice to speak with: the learner's pinned choice if still
// present, else prefer a local (offline, lower-latency) voice, else the
// engine default, else the first match.
function pickVoice(langPrefix) {
  const pool = listVoices(langPrefix);
  if (!pool.length) return null;
  const pinned = getPreferredVoiceURI(langPrefix);
  if (pinned) {
    const found = pool.find(v => v.voiceURI === pinned);
    if (found) return found;
  }
  return pool.find(v => v.localService) || pool.find(v => v.default) || pool[0];
}

/**
 * Wake the engine inside a user gesture. iOS Safari (and a few others)
 * drop the first utterance unless synthesis has been touched from a real
 * click/keypress first; call this from the instrument's first gesture.
 */
export function primeSpeech() {
  if (!speechSupported()) return false;
  try {
    // A silent, instantly-cancelled utterance unlocks the queue.
    const u = new window.SpeechSynthesisUtterance('');
    u.volume = 0;
    synth.speak(u);
    synth.cancel();
  } catch { /* ignore */ }
  return true;
}

/**
 * Speak text in a language. `rate` defaults a touch slow (0.85) — these are
 * syllables to learn from, not prose to skim. Cancels whatever was speaking
 * so rapid taps don't pile up. No-ops (returning false) when unsupported or
 * no matching voice is installed, so callers can fall back to a visual cue.
 *
 * @param {string} text          the kana / hangul / romaji-shaped string
 * @param {object} opts
 * @param {string} opts.lang     BCP-47 tag, e.g. 'ja-JP' / 'ko-KR'
 * @param {number} [opts.rate]   0.1–10, default 0.85
 * @param {number} [opts.pitch]  0–2, default 1
 * @param {function} [opts.onend]
 * @param {function} [opts.onerror]
 * @returns {boolean} whether an utterance was actually dispatched
 */
export function speak(text, { lang = 'ja-JP', rate = 0.85, pitch = 1, onend, onerror } = {}) {
  if (!speechSupported() || !text) return false;
  const prefix = lang.slice(0, 2).toLowerCase();
  const voice = pickVoice(prefix);
  if (!voice) { onerror?.(); return false; } // no installed voice for this language
  try {
    synth.cancel();
    const u = new window.SpeechSynthesisUtterance(String(text));
    u.voice = voice;
    u.lang = voice.lang || lang;
    u.rate = rate;
    u.pitch = pitch;
    if (onend) u.onend = onend;
    if (onerror) u.onerror = onerror;
    synth.speak(u);
    return true;
  } catch {
    onerror?.();
    return false;
  }
}

/** Stop anything in flight (e.g. on unmount, or switching cards). */
export function cancelSpeech() {
  try { synth?.cancel(); } catch { /* ignore */ }
}
