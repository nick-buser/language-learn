import React from 'react';
import useTransport from './useTransport.js';
import LyricBand from './LyricBand.jsx';
import MelodyRoll from './MelodyRoll.jsx';
import DictionBench from './DictionBench.jsx';
import Harvest from './Harvest.jsx';

// =====================================================================
// SongStudio — everything song-specific, under one shared transport.
//
// The page mounts this keyed by song id, so switching songs remounts the
// whole apparatus cleanly: a fresh clock, parked at the top. The band and
// the roll read the same useTransport; the bench and harvest ride along.
// =====================================================================
export default function SongStudio({ song, showReadings, showJp }) {
  const transport = useTransport(song);
  const reg = song.context.register.split(' · ');

  return (
    <>
      {/* the song's context */}
      <div className="song-context">
        <div className="ctx-title" style={{ gridColumn: '1 / -1' }}>
          <span className="kr" style={{ fontSize: 34, color: 'var(--accent)', fontFamily: 'var(--font-kr-serif)' }}>
            {song.title.han}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink-soft)', marginLeft: 14 }}>
            {song.title.rr}
          </span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faded)', marginTop: 8, lineHeight: 1.6, letterSpacing: '0.04em' }}>
            {song.origin}
          </div>
        </div>
        <div className="ctx-blurb" dangerouslySetInnerHTML={{ __html: song.context.blurbHtml }} />
        <div>
          <span className="ctx-why-head">why this song</span>
          <div className="ctx-why" dangerouslySetInnerHTML={{ __html: song.context.whyHtml }} />
          <div className="ctx-meta">
            <span className="ctx-chip"><b>{song.meta.bpm}</b> bpm · {song.meta.beatsPerBar}/4 feel</span>
            <span className="ctx-chip">{song.meta.mode}</span>
            <span className="ctx-chip">register · <span className="kr">{reg[0]}</span> {reg[1]}</span>
            {song.context.tags.map((t) => (
              <span className="ctx-chip" key={t}><span className="kr">{t.split(' ')[0]}</span> {t.split(' ').slice(1).join(' ')}</span>
            ))}
          </div>
        </div>
      </div>

      {/* INSTRUMENT I — the lyric band */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The lyric band</h2>
        <div className="latin">가사 (gasa) · the libretto — the words on a clock</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> press play — the syllable being sung lights up; click a line to jump there; turn the voice on to hear the tune carry the words
      </div>
      <LyricBand song={song} transport={transport} showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT II — the melody roll */}
      <div className="instr-head">
        <div className="no">II</div>
        <h2>The melody roll</h2>
        <div className="latin">가락 (garak) · the air — pitch you can see and hear</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> the same playhead, now over the notes — click any block to hear its pitch, hold the tonic drone and hum the line against it
      </div>
      <MelodyRoll song={song} transport={transport} />

      {/* INSTRUMENT III — the diction bench */}
      <div className="instr-head">
        <div className="no">III</div>
        <h2>The diction bench</h2>
        <div className="latin">발음 (bareum) · diction — what the page hides from the mouth</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> sing it from the spelling first, then tap to reveal how it actually sounds — every gap is a rule, not a quirk
      </div>
      <DictionBench song={song} showReadings={showReadings} />

      {/* INSTRUMENT IV — the harvest */}
      <div className="instr-head">
        <div className="no">IV</div>
        <h2>The harvest</h2>
        <div className="latin">갈무리 (galmuri) · the gathering — what the lines leave behind</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> the words and structures the song carries — follow a link to the folio that teaches each one
      </div>
      <Harvest song={song} showReadings={showReadings} showJp={showJp} />
    </>
  );
}
