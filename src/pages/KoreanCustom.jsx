import React, { useMemo, useState } from 'react';
import useTransport from '../components/song/useTransport.js';
import LyricBand from '../components/song/LyricBand.jsx';
import { parseLyrics } from '../components/song/parseLyrics.js';

const EXAMPLE = `안녕 hello 친구야
오늘 weather 너무 nice
같이 coffee 한잔 할까`;

// A tiny studio: own the transport for the parsed song, render the band.
// Keyed by the build id from the page, so each "format" gives a fresh clock.
function CustomBand({ song, showReadings, showJp }) {
  const transport = useTransport(song);
  return <LyricBand song={song} transport={transport} showReadings={showReadings} showJp={showJp} />;
}

function CustomColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 자작 ⟡</div>
      The Polyglot's Atlas · Korean folio · the custom bench<br />
      drawn in the Aburaya hand · paste · format · sing — your words on the same clock
    </div>
  );
}

export default function KoreanCustom({ showReadings, showJp }) {
  const [text, setText] = useState(EXAMPLE);
  const [committed, setCommitted] = useState(EXAMPLE);
  const [buildId, setBuildId] = useState(0);

  const song = useMemo(() => parseLyrics(committed), [committed]);
  const lines = song.sections[0].lines;
  const sylCount = lines.reduce((n, l) => n + l.syls.length, 0);

  const format = () => {
    setCommitted(text);
    setBuildId((n) => n + 1);
  };

  return (
    <div className="page" data-screen-label="Korean — Custom">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">作</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">자작</span>
            The custom bench
          </h1>
          <div className="latin">
            opus tuum · your own words — paste a block, get the band
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            paste · format · sing
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        The song folio is hand-authored; <span className="accent">this one is yours</span>. Paste any
        block of lyrics — hangul, English, or a mix — and it’s organized line by line into the lyric
        band, with the same slow / easy / tempo transport and the syllable playhead.
      </p>
      <p className="gram-sub">
        Each line becomes a line; hangul splits a character at a time, English words stay whole.
        Just the words and the highlights for now — no melody, meaning, or pronunciation yet.
      </p>

      {/* The entry */}
      <div className="custom-entry">
        <label className="custom-label" htmlFor="custom-text">paste lyrics — one line per line</label>
        <textarea
          id="custom-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          rows={6}
        />
        <div className="custom-actions">
          <button className="custom-build-btn" onClick={format}>format</button>
          <span className="custom-count">
            {lines.length} {lines.length === 1 ? 'line' : 'lines'} · {sylCount} syllables
          </span>
          <span className="custom-hint">edit the text, then press format to rebuild the band</span>
        </div>
      </div>

      {/* The band */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The lyric band</h2>
        <div className="latin">가사 (gasa) · your words on a clock</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> press play and pick a pace — slow, easy, or tempo; the syllable being sung lights up; click a line to jump there
      </div>
      {lines.length > 0 ? (
        <CustomBand key={buildId} song={song} showReadings={showReadings} showJp={showJp} />
      ) : (
        <div className="custom-empty">Nothing to play yet — paste some lines above and press format.</div>
      )}

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>A scratch bench for any words</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              This page reuses the song folio’s machinery on text it’s never seen: the parser emits
              exactly the shape <code>koreanSongs.js</code> hand-writes — a timeline of syllables on
              a shared clock — so the lyric band can’t tell a typed song from an authored one. The
              other instruments (melody, diction, harvest) are left dark here on purpose; they need
              data the parser can’t infer yet.
            </p>
            <p>
              The honest gaps are the roadmap: there’s no <b>romanization</b> (it would have to be
              generated and hand-checked), no <b>meaning</b>, and the timing is uniform — one beat a
              syllable — rather than a real rhythm. Each of those is a place the future dictionary
              and a real score would plug in.
            </p>
            <blockquote>
              Give it your own words and the same clock keeps them.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">auto-romanize</span>
              Run pasted hangul through the dictionary to fill the RR line under each syllable —
              the readings toggle would finally do something here.
            </div>
            <div className="note">
              <span className="date">tap the tempo</span>
              A tap-to-set rhythm: clap a line in and let the syllables fall on your beats, instead
              of the uniform one-beat spacing.
            </div>
            <div className="note">
              <span className="date">keep a few</span>
              Save formatted blocks to <code>localStorage</code> so the bench remembers your scraps
              between visits.
            </div>
          </aside>
        </div>
      </section>

      <CustomColophon />
    </div>
  );
}
