import React from 'react'

// One particle, one card — the Korean cabinet's anatomy, inverted:
// Japanese headword + romaji always; the Korean twin (한) is the bridge,
// gated by showJp. forms + fitting rule · role · KO twin · specimen ·
// why · faces · trap.
export default function JapaneseParticleCard({ entry, color, flash, showReadings, showJp }) {
  return (
    <article
      className={'pcard ja' + (flash ? ' flash' : '')}
      id={'jp-' + entry.id}
      style={{ '--fam': color }}
    >
      <header className="pc-head">
        <div className="pc-forms jp">{entry.forms}</div>
        <div className="pc-id">
          {showReadings && <div className="pc-rr">{entry.rr}</div>}
          <div className="pc-role">{entry.role}</div>
        </div>
        {showJp && (
          <div className="pc-ko" title="the Korean twin">
            <span className="kr">{entry.ko}</span>
            {showReadings && <span className="pc-ko-rr">{entry.koRr}</span>}
          </div>
        )}
      </header>

      <div className="pc-fit">{entry.formRule}</div>
      <p className="pc-tag">{entry.tagline}</p>

      <figure className="pc-ex">
        <div className="pc-ex-kr jp" dangerouslySetInnerHTML={{ __html: entry.ex.jp }} />
        {showReadings && <div className="pc-ex-rr">{entry.ex.jpRr}</div>}
        {showJp && (
          <div className="pc-ex-ko">
            <span className="kr">{entry.ex.ko}</span>
            {showReadings && <span className="ko-rr">{entry.ex.koRr}</span>}
          </div>
        )}
        <figcaption className="pc-ex-en">{entry.ex.en}</figcaption>
      </figure>

      <div className="pc-why" dangerouslySetInnerHTML={{ __html: entry.whyHtml }} />

      {entry.faces && (
        <ul className="pc-faces">
          {entry.faces.map((f, i) => (
            <li key={i}>
              <span className="pf-tag">{f.tag}</span>
              <span className="pf-kr jp" dangerouslySetInnerHTML={{ __html: f.jp }} />
              {showReadings && <span className="pf-rr">{f.jpRr}</span>}
              {showJp && <span className="pf-ko kr">{f.ko}</span>}
            </li>
          ))}
        </ul>
      )}

      {entry.note && (
        <div className="pc-note">
          <div className="fn-head">{entry.note.head}</div>
          <div className="fn-body" dangerouslySetInnerHTML={{ __html: entry.note.html }} />
        </div>
      )}
    </article>
  )
}
