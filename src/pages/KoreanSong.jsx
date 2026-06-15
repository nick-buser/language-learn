import React, { useState } from 'react';
import SongStudio from '../components/song/SongStudio.jsx';
import { KO_SONGS } from '../data/koreanSongs.js';

function SongColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 노래 ⟡</div>
      The Polyglot's Atlas · Korean folio · the song<br />
      drawn in the Aburaya hand · listen · sing · read — the melody carries the words
    </div>
  );
}

export default function KoreanSong({ showReadings, showJp }) {
  const [songId, setSongId] = useState(KO_SONGS[0].id);
  const song = KO_SONGS.find((s) => s.id === songId) || KO_SONGS[0];

  return (
    <div className="page" data-screen-label="Korean — The song">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">歌</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">노래</span>
            The song
          </h1>
          <div className="latin">
            cantus · the melody as a vessel — a song is a sentence you’ll gladly repeat a hundred times
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            listen · sing · read
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Grammar is a machine and vocabulary an account; <span className="accent">a song is the
        first thing you’ll actually want to say out loud</span>. This folio takes one and opens it:
        the words on a clock, the melody as a thing you can hear and hum, the gap between how it’s
        spelled and how it’s sung, and the small harvest of words and grammar it leaves behind.
      </p>
      <p className="gram-sub">
        Four instruments on one tune. Press play and the same playhead lights the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>lyric band</b>{' '}
        and the <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>melody
        roll</b> together; the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>diction bench</b>{' '}
        catches the seams that re-sound when sung; the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>harvest</b>{' '}
        files what you’ve learned back into the atlas. Two songs are on the shelf — a folk standard
        that roams the scale, and a rap hook that barely moves; switch between them and watch the
        instruments answer differently.
      </p>

      {/* the shelf */}
      <div className="specimen-row" style={{ marginTop: 22 }}>
        <span className="lbl">song</span>
        {KO_SONGS.map((s) => (
          <button
            key={s.id}
            className={'specimen-chip' + (s.id === song.id ? ' active' : '')}
            onClick={() => setSongId(s.id)}
            aria-pressed={s.id === song.id}
          >
            <span className="kr" style={{ fontFamily: 'var(--font-kr-serif)', fontSize: 14, marginRight: 7, letterSpacing: 0 }}>
              {s.title.han}
            </span>
            {s.title.rr}
          </button>
        ))}
      </div>

      {/* the studio — remounts cleanly per song (fresh transport) */}
      <SongStudio key={song.id} song={song} showReadings={showReadings} showJp={showJp} />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>You learn a song by living inside it</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              The melodies here are deliberate sketches — study transcriptions, pitched for a
              comfortable voice, meant to be <i>felt</i> and hummed, not graded against a score.
              That is the honest state of musical content in an atlas built for grammar: the
              linguistic layer (hangul, romanization, the bridges) is hand-checked to the house
              bar; the tune is a recognizable approximation, and these instruments say so out loud.
            </p>
            <p>
              What is load-bearing is the <b>shape</b>: a song is a timeline of syllables, each with
              a pitch, a duration, and a delivery (sung or rapped), inside a context that makes a
              learner want to repeat it. That shape is written here exactly as a future songs
              backend would serve it — one data module, payload-blind instruments, one shared clock.
              Add a song by editing data; the components never notice. (Copyrighted songs are kept
              to short, attributed teaching excerpts — Arirang, being public-domain, carries its
              whole verse.)
            </p>
            <blockquote>
              A tune you can’t get out of your head is a sentence you’ll never have to revise.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">a real voice</span>
              Swap the synth for an aligned recording — a waveform under the lyric band, the
              playhead riding actual audio instead of a beat clock. The transport is already in
              beats; only the time source changes.
            </div>
            <div className="note">
              <span className="date">sing back</span>
              Pitch detection from the microphone: draw the learner’s contour over the target on
              the melody roll, so you can see where your line drifts from the air.
            </div>
            <div className="note">
              <span className="date">flow, not pitch</span>
              For rap, the roll should grow a rhythm lane — onsets against the grid — since timing,
              not melody, is what a verse actually teaches.
            </div>
            <div className="note">
              <span className="date">into the bank</span>
              Wire the harvest to the word bank: one tap files a sung word as <i>learning</i>, with
              its line as the context sentence. The vocabulary plan’s “reading is the harvest,” with
              a melody attached.
            </div>
          </aside>
        </div>
      </section>

      <SongColophon />
    </div>
  );
}
