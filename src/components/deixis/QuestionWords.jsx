import React, { useRef, useState } from 'react'

// Question words (疑問詞 / 의문사) — the interrogatives that aren't just the
// ど-/어- column of the grid (何·誰·いつ… ↔ 무엇·누구·언제…), each opening a
// specimen question; then the indefinite machine: a question word + a clitic
// becomes some- / any- / none.
//
// Language-blind: fed by either deixis module. `data` is the module namespace.

export default function QuestionWords({ data, showReadings, showJp }) {
  const { QUESTION_WORDS, QW_FROM_GRID, QW_INDEFINITES, QW_LANTERN, CONFIG } = data
  const [selIdx, setSelIdx] = useState(0)
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)

  const pick = (i) => {
    setSelIdx(i)
    if (!fired.current) { fired.current = true; setLantern(true) }
  }

  const qw = QUESTION_WORDS[selIdx]

  return (
    <div className="dx-qw-stage" data-screen-label="question words">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The grid’s last row already <i>asks</i> — {QW_FROM_GRID.slice(0, 3).join(' · ')}… These are the rest
        of the question set. Tap one to hear it in a real question.
      </div>

      {/* the interrogatives already living in the grid */}
      <div className="dx-fromgrid">
        <span className="dx-fromgrid-lbl">already in the grid</span>
        {QW_FROM_GRID.map(w => <span key={w} className={'dx-fromgrid-chip ' + CONFIG.script}>{w}</span>)}
      </div>

      {/* the non-grid interrogatives, as selectable chips */}
      <div className="dx-qw-chips" role="tablist" aria-label="question words">
        {QUESTION_WORDS.map((q, i) => (
          <button key={q.word} role="tab" aria-selected={i === selIdx}
            className={'dx-qw-chip' + (i === selIdx ? ' active' : '')} onClick={() => pick(i)}>
            <span className={'dx-qw-chip-word ' + CONFIG.script}>{q.word}</span>
            <span className="dx-qw-chip-gloss">{q.gloss}</span>
          </button>
        ))}
      </div>

      {/* the specimen question for the selected word */}
      <div className="dx-qw-card" key={qw.word}>
        <div className="dx-qw-head">
          <span className={'dx-qw-word ' + CONFIG.script}>{qw.word}</span>
          {showReadings && <span className="dx-qw-rr">{qw.reading}</span>}
          <span className="dx-qw-gloss">{qw.gloss}</span>
          {qw.also && <span className="dx-qw-also">{qw.also}</span>}
        </div>
        <div className="dx-qw-specimen">
          <div className={'dx-qw-q ' + CONFIG.script}>{qw.ex.q}</div>
          {showReadings && <div className="dx-qw-q-rr">{qw.ex.qRr}</div>}
          <div className="dx-qw-q-en">{qw.ex.en}</div>
          {showJp && (
            <div className="dx-qw-bridge">
              <span className="dx-bridge-tag" style={{ fontFamily: CONFIG.bridgeFont }}>{CONFIG.bridgeTag}</span>
              <span className={'dx-qw-bridge-q ' + CONFIG.bridge}>{qw.ex.bridgeQ}</span>
              {showReadings && <span className="dx-qw-bridge-rr">{qw.ex.bridgeQRr}</span>}
            </div>
          )}
        </div>
      </div>

      {/* the indefinite machine: question word + clitic → some / any / none */}
      <div className="dx-indef">
        <div className="dx-indef-title">one seed, three harvests<span> — a question word + a clitic</span></div>
        <table className="dx-indef-table">
          <thead>
            <tr>
              <th className="dx-indef-corner" scope="col">＋</th>
              {QW_INDEFINITES.cols.map(col => (
                <th key={col.id} scope="col" className="dx-indef-colhead">
                  <span className="dx-indef-clitic">{col.clitic}</span>
                  <span className="dx-indef-collabel">{col.label}</span>
                  <span className="dx-indef-collatin">{col.latin}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {QW_INDEFINITES.rows.map(row => (
              <tr key={row.base}>
                <th scope="row" className={'dx-indef-base ' + CONFIG.script}>{row.base}</th>
                {QW_INDEFINITES.cols.map(col => {
                  const [word, rr, gloss] = row[col.id]
                  return (
                    <td key={col.id} className="dx-indef-cell">
                      <span className={'dx-indef-word ' + CONFIG.script}>{word}</span>
                      {showReadings && <span className="dx-indef-rr">{rr}</span>}
                      <span className="dx-indef-gloss">{gloss}</span>
                      {showJp && <span className={'dx-indef-bridge ' + CONFIG.bridge}>{row.bridge[col.id]}</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="dx-indef-note"><span className="dx-note-mark">✦</span>{QW_INDEFINITES.note}</div>
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{QW_LANTERN.head}</div>
          <div className="body" dangerouslySetInnerHTML={{ __html: QW_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
