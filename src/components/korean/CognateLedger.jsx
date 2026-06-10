import React, { useState, useRef } from 'react'
import { LEDGER, COGNACY, LEDGER_EUREKAS } from '../../data/koreanCognates.js'
import CognateCard from './CognateCard.jsx'

const FILTERS = ['all', 'true', 'skewed', 'false-friend']

// The cognate ledger — a dictionary-shaped browser over exemplar entries.
// This is the pilot interface for the future dictionary system: it must
// work from the CognateEntry payload alone (see koreanCognates.js).
export default function CognateLedger({ onRulePick, showReadings, showJp }) {
  const [filter, setFilter] = useState('all')
  const [eureka, setEureka] = useState(null)
  const trollsShown = useRef(false)

  const pick = (f) => {
    setFilter(f)
    if (f === 'false-friend' && !trollsShown.current) {
      trollsShown.current = true
      setEureka(LEDGER_EUREKAS.trolls)
    }
  }

  const entries = filter === 'all' ? LEDGER : LEDGER.filter(e => e.cognacy === filter)

  return (
    <div className="ledger-stage" data-screen-label="Cognate ledger">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        A first page of the dictionary-to-be — every entry a word you already own in Japanese,
        filed with its toll receipt. Read the derivation line: each character names the rule it
        crossed by. And check the badge before you trust a twin.
      </div>

      <div className="specimen-row cg-filter">
        <span className="lbl">Show</span>
        {FILTERS.map(f => {
          const n = f === 'all' ? LEDGER.length : LEDGER.filter(e => e.cognacy === f).length
          return (
            <button
              key={f}
              className={'specimen-chip cg-filter-chip' + (f === filter ? ' active' : '')}
              style={f !== 'all' ? { '--cog': COGNACY[f].color } : undefined}
              onClick={() => pick(f)}
            >
              {f === 'all' ? 'the whole page' : COGNACY[f].label + 's'}
              <span className="cg-count">{n}</span>
            </button>
          )
        })}
      </div>

      <div className="cgcard-grid">
        {entries.map(e => (
          <CognateCard
            key={e.id}
            entry={e}
            onRulePick={onRulePick}
            showReadings={showReadings}
            showJp={showJp}
          />
        ))}
      </div>

      <div className={'lantern-note' + (eureka ? ' lit' : '')} aria-live="polite">
        {eureka && (
          <>
            <div className="head">{eureka.head}</div>
            <div className="body" dangerouslySetInnerHTML={{ __html: eureka.body }} />
          </>
        )}
      </div>
    </div>
  )
}
