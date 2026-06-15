import React, { useEffect, useRef, useState } from 'react';
import { DEG_ORDER, DEG_LABEL } from '../../data/koreanSongs.js';
import { primeAudio, playTone, startDrone } from './audio.js';

// =====================================================================
// The melody roll — a piano-roll of the air.
//
// Time runs left→right in beats; pitch stacks bottom→top across the five
// pentatonic lanes. Each sung syllable is a block at its (beat, pitch);
// the same playhead that drives the lyric band sweeps across and lights
// each note as it's struck. Click any block to hear its pitch; hold the
// tonic drone and hum the contour against it. The dashed line through the
// note centers is the melodic shape at a glance.
//
// Reads the shared transport — no clock of its own.
// =====================================================================

const ROW_H = 36;     // px per pitch lane
const PX_BEAT = 26;   // px per beat

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
function noteName(midi) {
  return NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
}

export default function MelodyRoll({ song, transport }) {
  const { beat, playing } = transport;
  const scrollRef = useRef(null);
  const [drone, setDrone] = useState(false);

  const tonicMidi = song.sections[0].lines[0].syls.find((s) => s.deg === 'd')?.midi ?? 72;
  const rows = DEG_ORDER;                 // ['m','r','d','l','s'] top → bottom
  const rowOf = (deg) => rows.indexOf(deg);
  const stageW = song.beats * PX_BEAT;
  const stageH = rows.length * ROW_H;

  const notes = transport.syllables;

  // a single dashed contour through note centers
  const contourPts = notes
    .map((s) => `${(s.beat + s.dur / 2) * PX_BEAT},${rowOf(s.deg) * ROW_H + ROW_H / 2}`)
    .join(' ');

  // keep the playhead in view while it sweeps
  useEffect(() => {
    if (!playing) return;
    const el = scrollRef.current;
    if (!el) return;
    const x = beat * PX_BEAT;
    if (x > el.scrollLeft + el.clientWidth * 0.7 || x < el.scrollLeft) {
      el.scrollLeft = Math.max(0, x - el.clientWidth * 0.4);
    }
  }, [beat, playing]);

  // the tonic drone — start/stop with the toggle, clean fade on tear-down
  useEffect(() => {
    if (!drone) return undefined;
    const stop = startDrone(tonicMidi);
    return stop;
  }, [drone, tonicMidi]);

  const strike = (s) => { primeAudio(); playTone(s.midi, { dur: 0.6 }); };

  return (
    <div className="melody-roll" data-screen-label="The melody roll">
      <div className="roll-controls">
        <span className="tempo-label">the air · 가락</span>
        <span
          className={'mini-toggle' + (drone ? ' on' : '')}
          role="switch" aria-checked={drone}
          onClick={() => { primeAudio(); setDrone((v) => !v); }}
          style={{ cursor: 'pointer' }}
        >
          <span className="box" />tonic drone
        </span>
        <span className="roll-hint">click a note to hear its pitch — hold the drone and hum the line</span>
      </div>

      <div className="roll-frame" style={{ '--row-h': ROW_H + 'px' }}>
        {/* pitch axis */}
        <div className="roll-axis">
          {rows.map((deg) => {
            const midi = notes.find((n) => n.deg === deg)?.midi;
            return (
              <div key={deg} className={'axis-row' + (deg === 'd' ? ' tonic' : '')}>
                <span className="solfa">{DEG_LABEL[deg]}</span>
                {midi != null && <span className="note-name">{noteName(midi)}</span>}
              </div>
            );
          })}
        </div>

        {/* the scrolling stage */}
        <div className="roll-scroll" ref={scrollRef}>
          <div className="roll-stage" style={{ width: stageW, height: stageH }}>
            {/* pitch lanes */}
            {rows.map((deg, ri) => (
              <div
                key={deg}
                className={'roll-lane' + (deg === 'd' ? ' tonic' : '')}
                style={{ top: ri * ROW_H }}
              />
            ))}

            {/* beat lines, downbeats emphasized */}
            {Array.from({ length: Math.ceil(song.beats) + 1 }).map((_, b) => (
              <div
                key={b}
                className={'roll-bar' + (b % song.meta.beatsPerBar === 0 ? ' downbeat' : '')}
                style={{ left: b * PX_BEAT }}
              />
            ))}

            {/* the contour */}
            <svg className="roll-contour" width={stageW} height={stageH}>
              <polyline points={contourPts} />
            </svg>

            {/* the notes */}
            {notes.map((s, i) => {
              const lit = playing
                ? beat >= s.beat && beat < s.beat + s.dur
                : false;
              return (
                <button
                  key={i}
                  className={'roll-note' + (lit ? ' lit' : '')}
                  style={{
                    left: s.beat * PX_BEAT,
                    top: rowOf(s.deg) * ROW_H + 4,
                    width: Math.max(14, s.dur * PX_BEAT - 3),
                    height: ROW_H - 8,
                  }}
                  onClick={() => strike(s)}
                  aria-label={`${s.han} — ${DEG_LABEL[s.deg]}`}
                >
                  <span className="nh">{s.han}</span>
                </button>
              );
            })}

            {/* the sweeping playhead */}
            <div className="roll-playhead" style={{ left: beat * PX_BEAT }} />
          </div>
        </div>
      </div>
    </div>
  );
}
