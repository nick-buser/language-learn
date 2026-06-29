import React, { useRef, useState } from 'react'

// The こそあど / 이·그·저 grid — the centerpiece machine of the deixis folio.
// A demonstrative is a deictic PREFIX (こ/そ/あ/ど ↔ 이/그/저/어-) bolted to a
// category SUFFIX (thing/this-N/place/direction/kind/manner). Pick a cell and
// the word decomposes into its two halves, a deixis diagram shows where the
// prefix points, and the twin in the other language lights up beside it.
//
// Language-blind: fed by japaneseDeixis.js OR koreanDeixis.js (same schema).
// `data` is the whole module namespace; CONFIG names the script/bridge classes.

// the little scene: me · you · yonder, with the referent at the active post
function DeixisDiagram({ point }) {
  return (
    <div className="dx-diagram" data-point={point} aria-hidden="true">
      <div className="dx-scene">
        <div className={'dx-post me' + (point === 'speaker' ? ' lit' : '')}>
          <span className="dx-ref">◆</span><span className="dx-post-lbl">me</span>
        </div>
        <div className={'dx-post you' + (point === 'listener' ? ' lit' : '')}>
          <span className="dx-ref">◆</span><span className="dx-post-lbl">you</span>
        </div>
        <div className={'dx-post far' + (point === 'far' ? ' lit' : '')}>
          <span className="dx-ref">◆</span><span className="dx-post-lbl">yonder</span>
        </div>
        {point === 'question' && <div className="dx-q">?</div>}
      </div>
    </div>
  )
}

export default function DeixisGrid({ data, showReadings, showJp }) {
  const { SERIES, CATEGORIES, GRID, GRID_LANTERN, CONFIG } = data
  const [sel, setSel] = useState({ s: SERIES[0].id, c: CATEGORIES[0].id })
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)

  const pick = (s, c) => {
    setSel({ s, c })
    if (!fired.current) { fired.current = true; setLantern(true) }
  }

  const series = SERIES.find(x => x.id === sel.s)
  const cat = CATEGORIES.find(x => x.id === sel.c)
  const cell = GRID[sel.s][sel.c]
  const bareSuffix = cat.suffix === '—' || cat.suffix === ''

  return (
    <div className="dx-grid-stage" data-screen-label="deixis grid">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Read a <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>row</b> and feel the prefix hold its
        ground; read a <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>column</b> and feel the suffix
        hold its category. Tap any square — the word splits into the two parts that built it.
      </div>

      <div className="dx-grid-wrap">
        <table className="dx-grid">
          <thead>
            <tr>
              <th className="dx-corner" scope="col"><span className="dx-corner-glyph">？</span></th>
              {CATEGORIES.map(c => (
                <th key={c.id} scope="col"
                    className={'dx-colhead' + (c.id === sel.c ? ' active' : '')}
                    onClick={() => pick(sel.s, c.id)}>
                  <span className="dx-cat-suffix">{c.suffix}</span>
                  <span className="dx-cat-label">{c.label}</span>
                  <span className="dx-cat-latin">{c.latin}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SERIES.map(s => (
              <tr key={s.id} className={s.id === sel.s ? 'active-row' : ''}>
                <th scope="row"
                    className={'dx-rowhead' + (s.id === sel.s ? ' active' : '') + (s.point === 'question' ? ' q' : '')}
                    onClick={() => pick(s.id, sel.c)}>
                  <span className={'dx-prefix-glyph ' + CONFIG.script}>{s.prefix}</span>
                  <span className="dx-prefix-role">{s.role}</span>
                </th>
                {CATEGORIES.map(c => {
                  const g = GRID[s.id][c.id]
                  const on = s.id === sel.s && c.id === sel.c
                  return (
                    <td key={c.id} className={'dx-cell' + (on ? ' active' : '') + (g.irregular ? ' irregular' : '')}>
                      <button onClick={() => pick(s.id, c.id)} aria-pressed={on}>
                        <span className={'dx-cell-word ' + CONFIG.script}>{g.word}</span>
                        {g.irregular && <span className="dx-cell-flag" title="irregular">✦</span>}
                        {showReadings && <span className="dx-cell-rr">{g.reading}</span>}
                        {showJp && <span className={'dx-cell-bridge ' + CONFIG.bridge}>{g.bridge}</span>}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* the readout for the selected cell */}
      <div className="dx-readout" key={sel.s + sel.c}>
        <div className="dx-readout-left">
          <div className="dx-decomp">
            <span className={'dx-decomp-part prefix ' + CONFIG.script}>{series.prefix}</span>
            <span className="dx-decomp-op">+</span>
            <span className={'dx-decomp-part suffix ' + CONFIG.script}>{bareSuffix ? '∅' : cat.suffix}</span>
            <span className="dx-decomp-op">=</span>
            <span className={'dx-decomp-word ' + CONFIG.script}>{cell.word}</span>
          </div>
          <div className="dx-decomp-keys">
            <span className="dx-key">{series.prefixRr}<i>{series.gloss}</i></span>
            <span className="dx-key">{bareSuffix ? '(bare pointer)' : cat.label}<i>{cat.latin}</i></span>
          </div>
          <div className="dx-readout-main">
            <span className={'dx-readout-word ' + CONFIG.script}>{cell.word}</span>
            {showReadings && <span className="dx-readout-rr">{cell.reading}</span>}
            <span className="dx-readout-gloss">{cell.gloss}</span>
          </div>
          <div className="dx-readout-hint">{cat.hint}</div>
          {showJp && (
            <div className="dx-readout-bridge">
              <span className="dx-bridge-tag" style={{ fontFamily: CONFIG.bridgeFont }}>{CONFIG.bridgeTag}</span>
              <span className={'dx-bridge-word ' + CONFIG.bridge}>{cell.bridge}</span>
              {showReadings && <span className="dx-bridge-rr">{cell.bridgeRr}</span>}
            </div>
          )}
          {cell.note && <div className="dx-note"><span className="dx-note-mark">✦</span>{cell.note}</div>}
        </div>
        <div className="dx-readout-right">
          <DeixisDiagram point={series.point} />
          <div className="dx-diagram-cap">{series.prefix} — <i>{series.role}</i></div>
        </div>
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{GRID_LANTERN.head}</div>
          <div className="body" dangerouslySetInnerHTML={{ __html: GRID_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
