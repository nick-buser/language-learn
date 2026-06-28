import React, { useRef, useState } from 'react'
import { POLITENESS } from '../../data/japaneseVerbs.js'

// Politeness — the lane as its own axis, and the rule English speakers miss:
// in a long sentence, politeness lands ONCE, on the final verb. Toggle the
// register and only the last word changes; every te-form / -고 clause before
// it is register-neutral.
export default function Politeness({ showReadings, showJp }) {
  const [sentId, setSentId] = useState('morning')
  const [register, setRegister] = useState('plain')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)

  const sent = POLITENESS.sentences.find(s => s.id === sentId)

  const flip = (r) => {
    setRegister(r)
    if (r === 'polite' && !fired.current) { fired.current = true; setLantern(true) }
  }

  const Line = ({ clauses, final, dir }) => (
    <div className={'pol-line ' + dir}>
      {clauses.map((cl, i) => <span key={i} className="pol-clause">{cl.jp}</span>)}
      <span className="pol-final" key={register}>{final[register].jp}</span>
      <span className="pol-period">。</span>
    </div>
  )
  const readingOf = (obj) => [...obj.clauses.map(c => c.reading), obj.final[register].reading].join(' ').replace(/\s+/g, ' ').trim()

  return (
    <div className="pol-stage" data-screen-label="Politeness">
      <div className="loom-prompt" style={{ marginTop: 0 }}>{POLITENESS.prompt}</div>

      <div className="pol-controls">
        <div className="specimen-row" style={{ marginBottom: 0 }}>
          <span className="lbl">Sentence</span>
          {POLITENESS.sentences.map(s => (
            <button key={s.id} className={'specimen-chip' + (s.id === sentId ? ' active' : '')} onClick={() => setSentId(s.id)}>
              {s.en}
            </button>
          ))}
        </div>
        <div className="cop-seg" role="group" aria-label="register">
          <button className={'cop-segbtn' + (register === 'plain' ? ' active' : '')} onClick={() => flip('plain')}>
            <span className="cs-jp">だ</span><span className="cs-en">plain · 반말</span>
          </button>
          <button className={'cop-segbtn' + (register === 'polite' ? ' active' : '')} onClick={() => flip('polite')}>
            <span className="cs-jp">です</span><span className="cs-en">polite · 해요체</span>
          </button>
        </div>
      </div>

      <div className="pol-readout">
        <Line clauses={sent.clauses} final={sent.final} dir="jp" />
        {showReadings && <div className="pol-reading">{readingOf(sent)}</div>}
        <div className="pol-en">{sent.en}</div>

        {showJp && (
          <div className="pol-bridge">
            <Line clauses={sent.ko.clauses} final={sent.ko.final} dir="kr" />
            {showReadings && <div className="pol-reading">{readingOf(sent.ko)}</div>}
            <div className="pol-bridge-tag">한국어 — only the final verb flips here too; -고 / -아서 clauses are level-neutral</div>
          </div>
        )}
      </div>

      <div className="pol-note">{POLITENESS.note}</div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{POLITENESS.lantern.head}</div><div className="body" dangerouslySetInnerHTML={{ __html: POLITENESS.lantern.body }} /></>)}
      </div>
    </div>
  )
}
