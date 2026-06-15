import React from 'react';
import useTransport from '../components/song/useTransport.js';
import LyricBand from '../components/song/LyricBand.jsx';
import MelodyRoll from '../components/song/MelodyRoll.jsx';
import DictionBench from '../components/song/DictionBench.jsx';
import Harvest from '../components/song/Harvest.jsx';
import { ARIRANG } from '../data/koreanSongs.js';

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
  const song = ARIRANG;
  // One clock for the folio — the band and the roll share the playhead,
  // the way the word bank's two instruments share one store.
  const transport = useTransport(song);

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
        first thing you’ll actually want to say out loud</span>. This folio takes one — Korea’s
        most Korean song — and opens it: the words on a clock, the melody as a thing you can hear
        and hum, the gap between how it’s spelled and how it’s sung, and the small harvest of words
        and grammar it leaves behind.
      </p>
      <p className="gram-sub">
        Four instruments on one tune. Press play and the same playhead lights the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>lyric band</b>{' '}
        and the <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>melody
        roll</b> together; the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>diction bench</b>{' '}
        catches the seams that re-sound when sung; the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>harvest</b>{' '}
        files what you’ve learned back into the atlas.
      </p>

      {/* The song's context */}
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
            <span className="ctx-chip">register · <span className="kr">{song.context.register.split(' · ')[0]}</span> {song.context.register.split(' · ')[1]}</span>
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
        <div className="latin">갈무리 (galmuri) · the gathering — what four lines leave behind</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> the words and structures the song carries — follow a link to the folio that teaches each one
      </div>
      <Harvest song={song} showReadings={showReadings} showJp={showJp} />

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
              The melody here is a deliberate sketch — a five-note study transcription, pitched for
              a comfortable voice, meant to be <i>felt</i> and hummed, not graded against a score.
              That is the honest state of musical content in an atlas built for grammar: the
              linguistic layer (hangul, romanization, the bridges) is hand-checked to the house
              bar; the tune is a recognizable approximation, and these instruments say so out loud.
            </p>
            <p>
              What is load-bearing is the <b>shape</b>: a song is a timeline of syllables, each with
              a pitch and a duration, and a context that makes a learner want to repeat it. That
              shape is written here exactly as a future songs backend would serve it — one data
              module, four payload-blind instruments, one shared clock. When real audio and a real
              library arrive, nothing on this page changes but the source of the score.
            </p>
            <blockquote>
              아리랑 아리랑 아라리요 — you will have it by heart before you have decided to learn it.
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
              <span className="date">loop a phrase</span>
              Per-line looping with a slow-down drill — set in/out points on the transport and
              grind one hard phrase until the diction settles.
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
