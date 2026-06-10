import React from 'react'

// One particle, one card — uniform anatomy across the whole cabinet:
// forms + fitting rule · role · JP twin · specimen · why · faces · trap.
export default function ParticleCard({ entry, color, flash, showReadings, showJp }) {
  return (
    <article
      className={'pcard' + (flash ? ' flash' : '')}
      id={'p-' + entry.id}
      style={{ '--fam': color }}
    >
      <header className="pc-head">
        <div className="pc-forms kr">{entry.forms}</div>
        <div className="pc-id">
          {showReadings && <div className="pc-rr">{entry.rr}</div>}
          <div className="pc-role">{entry.role}</div>
        </div>
        {showJp && (
          <div className="pc-jp" title="the Japanese twin">
            <span className="jp">{entry.jp}</span>
          </div>
        )}
      </header>

      <div className="pc-fit">{entry.formRule}</div>
      <p className="pc-tag">{entry.tagline}</p>

      <figure className="pc-ex">
        <div className="pc-ex-kr kr" dangerouslySetInnerHTML={{ __html: entry.ex.kr }} />
        {showReadings && <div className="pc-ex-rr">{entry.ex.rr}</div>}
        {showJp && (
          <div className="pc-ex-jp">
            <span className="jp">{entry.ex.jp}</span>
            {showReadings && <span className="jp-rr">{entry.ex.jpRr}</span>}
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
              <span className="pf-kr kr" dangerouslySetInnerHTML={{ __html: f.kr }} />
              {showReadings && <span className="pf-rr">{f.rr}</span>}
              {showJp && <span className="pf-jp jp">{f.jp}</span>}
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
