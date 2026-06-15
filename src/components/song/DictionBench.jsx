import React, { useRef, useState } from 'react';

// =====================================================================
// The diction bench — written ≠ sung.
//
// Korean spelling is morphophonemic: you write the pieces, then the seams
// re-sound. Four lines of Arirang hide most of the sandhi a singer meets —
// liaison, nasalization, tensification. Each card shows the spelling, then
// (tap to reveal — sing it first) how it actually leaves the mouth, the
// one-line why, and a link to the folio that owns the rule. Reveal them
// all and a lantern lights. Honors showReadings.
// =====================================================================

// Memoized: the transport re-renders the page ~60×/s; this instrument
// doesn't depend on the playhead, so it should sit still while the song plays.
function DictionBench({ song, showReadings }) {
  const [revealed, setRevealed] = useState(() => new Set());
  const [eureka, setEureka] = useState(false);
  const fired = useRef(false);

  const total = song.diction.length;

  const toggle = (id) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      if (next.size === total && !fired.current) { fired.current = true; setEureka(true); }
      return next;
    });
  };

  const revealAll = () => {
    setRevealed(new Set(song.diction.map((d) => d.id)));
    if (!fired.current) { fired.current = true; setEureka(true); }
  };
  const hideAll = () => setRevealed(new Set());
  const allShown = revealed.size === total;

  return (
    <div data-screen-label="The diction bench">
      <div className="diction-bench">
        {song.diction.map((d) => {
          const shown = revealed.has(d.id);
          return (
            <div
              key={d.id}
              className="diction-card"
              onClick={() => toggle(d.id)}
              role="button"
              tabIndex={0}
              aria-pressed={shown}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(d.id); } }}
            >
              <div className="diction-kind">{d.kind}</div>
              <div className="diction-cross">
                <div className="diction-side written">
                  <span className="role">written</span>
                  <div className="han">{d.written.han}</div>
                  {showReadings && <div className="rr">{d.written.rr}</div>}
                </div>
                <div className="diction-arrow" aria-hidden="true">→</div>
                <div className={'diction-side sung' + (shown ? '' : ' veiled')}>
                  <span className="role">sung</span>
                  <div className="han">{d.sung.han}</div>
                  {showReadings && <div className="rr">{d.sung.rr}</div>}
                </div>
              </div>
              {shown && (
                <>
                  <div className="diction-rule" dangerouslySetInnerHTML={{ __html: d.html }} />
                  {d.link && (
                    <a
                      className="diction-link"
                      href={d.link.folio}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {d.link.label}
                    </a>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 18 }}>
        <button className="text-btn" onClick={allShown ? hideAll : revealAll}>
          {allShown ? 'veil all again' : 'reveal all'}
        </button>
      </div>

      <div className={'lantern-note' + (eureka ? ' lit' : '')} aria-live="polite">
        {eureka && (
          <>
            <div className="head">the page lies, the mouth doesn’t</div>
            <div className="body">
              Every one of these is a <b>rule</b>, not a quirk — the same liaison, nasalization,
              and tensification you’ll meet in every Korean sentence, just caught singing. Learn the
              seams once here and the spelling stops surprising you.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(DictionBench);
