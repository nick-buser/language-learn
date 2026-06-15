import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { primeAudio, playTone, playTick } from './audio.js';

// =====================================================================
// useTransport — one clock for the whole folio.
//
// Owns a playhead measured in BEATS (tempo-independent), advanced by a
// requestAnimationFrame loop while playing. The lyric band and the melody
// roll both read `beat` and light up together — same conductor, two
// scores. The transport also *sounds* the song as it plays: each syllable
// onset plucks its melody tone (voice), and integer beats can tick
// (metronome). Pitch is the felt extra here, scheduled off the same clock.
//
// Returned: { beat, playing, bpm, voice, tick, loop, ...controls,
//             current: {lineIdx, sylIdx, line} }
// =====================================================================
export default function useTransport(song) {
  const [beat, setBeatState] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(song.meta.bpm);
  const [voice, setVoice] = useState(true);
  const [tick, setTick] = useState(false);

  // loop is a setting, not render-critical — keep it in a ref read by the
  // rAF, mirrored to state only so the toggle button reflects it.
  const [loopState, setLoopState] = useState(true);
  const loopRef = useRef(true);
  const setLoop = useCallback((v) => {
    const next = typeof v === 'function' ? v(loopRef.current) : v;
    loopRef.current = next;
    setLoopState(next);
  }, []);

  // Flat, sorted timeline of every sung syllable — the onset table the
  // clock fires against.
  const syllables = useMemo(() => {
    const out = [];
    let li = 0;
    for (const section of song.sections) {
      for (const line of section.lines) {
        for (let si = 0; si < line.syls.length; si++) {
          const s = line.syls[si];
          out.push({ ...s, lineIdx: li, sylIdx: si });
        }
        li++;
      }
    }
    return out;
  }, [song]);

  const lines = useMemo(
    () => song.sections.flatMap((sec) => sec.lines),
    [song]
  );

  // refs the rAF closure reads (avoids stale state between frames)
  const beatRef = useRef(0);
  const bpmRef = useRef(bpm);
  const voiceRef = useRef(voice);
  const tickRef = useRef(tick);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const lastSylRef = useRef(-1);     // last syllable index we voiced
  const lastFloorRef = useRef(-1);   // last integer beat we ticked
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { voiceRef.current = voice; }, [voice]);
  useEffect(() => { tickRef.current = tick; }, [tick]);

  const writeBeat = useCallback((b) => {
    beatRef.current = b;
    setBeatState(b);
  }, []);

  // Re-seat the onset/tick markers without sounding them (used on seek/reset).
  const reseat = useCallback((b) => {
    let idx = -1;
    for (let i = 0; i < syllables.length; i++) {
      if (syllables[i].beat <= b) idx = i; else break;
    }
    lastSylRef.current = idx;
    lastFloorRef.current = Math.floor(b);
  }, [syllables]);

  const frame = useCallback((ts) => {
    if (lastTsRef.current === 0) lastTsRef.current = ts;
    const dt = (ts - lastTsRef.current) / 1000;
    lastTsRef.current = ts;

    let b = beatRef.current + dt * (bpmRef.current / 60);

    if (b >= song.beats) {
      if (loopRef.current) {
        b -= song.beats;
        lastSylRef.current = -1;
        lastFloorRef.current = -1;
      } else {
        writeBeat(song.beats);
        setPlaying(false);
        return;
      }
    }

    // voice — pluck the tone of any syllable the playhead has entered
    let activeSyl = -1;
    for (let i = 0; i < syllables.length; i++) {
      if (syllables[i].beat <= b) activeSyl = i; else break;
    }
    if (activeSyl !== lastSylRef.current) {
      if (voiceRef.current && activeSyl >= 0) {
        const s = syllables[activeSyl];
        playTone(s.midi, { dur: Math.max(0.18, s.dur * (60 / bpmRef.current)) });
      }
      lastSylRef.current = activeSyl;
    }

    // metronome — one click per integer beat
    const floor = Math.floor(b);
    if (floor !== lastFloorRef.current) {
      if (tickRef.current && floor >= 0) {
        playTick(song.meta.beatsPerBar > 0 && floor % song.meta.beatsPerBar === 0);
      }
      lastFloorRef.current = floor;
    }

    writeBeat(b);
    rafRef.current = requestAnimationFrame(frame);
  }, [song, syllables, writeBeat]);

  const play = useCallback(() => {
    primeAudio();
    // restart from the top if parked at the end
    if (beatRef.current >= song.beats - 0.001) { writeBeat(0); reseat(0); }
    else reseat(beatRef.current);
    // re-seat one short so the syllable under the head sounds on the first frame
    lastSylRef.current = lastSylRef.current - 1;
    lastTsRef.current = 0;
    setPlaying(true);
  }, [song, writeBeat, reseat]);

  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => { playing ? pause() : play(); }, [playing, play, pause]);

  const seekBeat = useCallback((b) => {
    const clamped = Math.max(0, Math.min(song.beats, b));
    writeBeat(clamped);
    reseat(clamped);
  }, [song, writeBeat, reseat]);

  const seekLine = useCallback((lineIdx) => {
    const line = lines[lineIdx];
    if (line) seekBeat(line.startBeat);
  }, [lines, seekBeat]);

  const reset = useCallback(() => { setPlaying(false); seekBeat(0); }, [seekBeat]);

  // drive / tear down the rAF with the playing flag
  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
      return;
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, frame]);

  // current position derived for the views
  const current = useMemo(() => {
    let lineIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (beat >= l.startBeat && beat < l.endBeat + l.restAfter) { lineIdx = i; break; }
      if (beat >= l.startBeat) lineIdx = i;
    }
    const line = lines[lineIdx];
    let sylIdx = -1;
    if (line) {
      for (let i = 0; i < line.syls.length; i++) {
        const s = line.syls[i];
        if (beat >= s.beat && beat < s.beat + s.dur) { sylIdx = i; break; }
      }
    }
    return { lineIdx, sylIdx, line };
  }, [beat, lines]);

  return {
    beat, playing, bpm, voice, tick, loop: loopState,
    setBpm, setVoice, setTick, setLoop,
    play, pause, toggle, seekBeat, seekLine, reset,
    current, syllables, lines,
  };
}
