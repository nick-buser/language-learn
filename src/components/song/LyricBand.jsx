import React from 'react';

// =====================================================================
// The lyric band — transport-driven karaoke.
//
// Carries the shared transport controls (they belong with the words), then
// lays the song out line by line. The line under the playhead lifts and
// brightens; within it, the syllable being sung lights and the ones
// already passed dim back down. Click any line to seek there. A "now"
// gloss under the band carries the active line's translation and Japanese
// bridge. Honors showReadings (the RR under each syllable) and showJp.
// =====================================================================

const PlayIcon = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14l12-7z" /></svg>);
const PauseIcon = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>);
const RestartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
  </svg>
);

export default function LyricBand({ song, transport, showReadings, showJp }) {
  const { beat, playing, bpm, voice, tick, loop } = transport;
  const base = song.meta.bpm;
  const tempos = [
    { label: 'slow', value: Math.round(base * 0.6) },
    { label: 'easy', value: Math.round(base * 0.8) },
    { label: 'tempo', value: base },
  ];
  const progress = Math.min(100, (beat / song.beats) * 100);
  const active = transport.current;

  let lineNo = -1;

  return (
    <div className="lyric-band" data-screen-label="The lyric band">
      {/* ── the shared transport ── */}
      <div className="song-transport">
        <div className="transport-group">
          <button
            className={'play-btn' + (playing ? ' playing' : '')}
            onClick={transport.toggle}
            aria-label={playing ? 'pause' : 'play'}
            aria-pressed={playing}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="transport-icon-btn" onClick={transport.reset} aria-label="restart">
            <RestartIcon />
          </button>
        </div>

        <div className="transport-sep" aria-hidden="true" />

        <div className="transport-group">
          <span className="tempo-label">tempo</span>
          <div className="tempo-stops" role="group" aria-label="tempo">
            {tempos.map((t) => (
              <button
                key={t.label}
                className={'tempo-stop' + (Math.round(bpm) === t.value ? ' active' : '')}
                onClick={() => transport.setBpm(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="tempo-bpm"><b>{Math.round(bpm)}</b> bpm</span>
        </div>

        <div className="transport-sep" aria-hidden="true" />

        <div className="transport-group">
          <span
            className={'mini-toggle' + (voice ? ' on' : '')}
            role="switch" aria-checked={voice}
            onClick={() => transport.setVoice((v) => !v)}
            style={{ cursor: 'pointer' }}
          >
            <span className="box" />voice
          </span>
          <span
            className={'mini-toggle' + (tick ? ' on' : '')}
            role="switch" aria-checked={tick}
            onClick={() => transport.setTick((v) => !v)}
            style={{ cursor: 'pointer' }}
          >
            <span className="box" />tick
          </span>
          <span
            className={'mini-toggle' + (loop ? ' on' : '')}
            role="switch" aria-checked={loop}
            onClick={() => transport.setLoop((v) => !v)}
            style={{ cursor: 'pointer' }}
          >
            <span className="box" />loop
          </span>
        </div>
      </div>
      <div className="transport-progress">
        <div className="fill" style={{ width: progress + '%' }} />
      </div>

      {/* ── the words ── */}
      <div className="lyric-lines">
        {song.sections.map((section) =>
          section.lines.map((line) => {
            lineNo++;
            const i = lineNo;
            const isActive = active.lineIdx === i;
            return (
              <div
                key={line.id}
                className={'lyric-line' + (isActive ? ' active' : '')}
                onClick={() => transport.seekLine(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); transport.seekLine(i); } }}
                aria-label={line.rr}
              >
                {line.syls.map((s, si) => {
                  const lit = isActive && active.sylIdx === si;
                  const past = isActive && active.sylIdx > -1 && si < active.sylIdx;
                  return (
                    <span key={si} className={'lyric-syl' + (lit ? ' lit' : '') + (past ? ' past' : '')}>
                      <span className="han">{s.han}</span>
                      {showReadings && s.rr && <span className="rr">{s.rr}</span>}
                    </span>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* ── the now-gloss (only when the line carries a meaning/bridge) ── */}
      {(active.line?.en || (showJp && active.line?.jp)) && (
        <div className="lyric-now">
          <span className="glabel">
            meaning
            {active.line?.kind && active.line.kind !== 'sung' && (
              <span className="line-kind">{active.line.kind}</span>
            )}
          </span>
          <div>
            <div className="en" key={active.lineIdx}>{active.line?.en}</div>
            {showJp && active.line?.jp && <div className="jp">{active.line.jp}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
