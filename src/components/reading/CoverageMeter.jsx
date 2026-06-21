import React from 'react'
import { COVERAGE_CLASSES, coverageZone } from './coverage.js'

// =====================================================================
// The ~98% gauge — known-word coverage as a stacked bar over the passage's
// content words, with the extensive-reading floor (98%) marked. The headline
// number the whole reading room turns on.
// =====================================================================

const CLASS_COLOR = {
  known: 'var(--st-active)',
  target: 'var(--signal)',
  learning: 'var(--amber)',
  met: 'var(--st-travel)',
  unseen: 'var(--ink-faded)',
  unknown: 'var(--ink-faded)',
}
const CLASS_LABEL = {
  known: 'known', target: 'target', learning: 'learning',
  met: 'met', unseen: 'unseen', unknown: 'not in bank',
}

export default function CoverageMeter({ stats }) {
  const { contentTotal, counts, coverage } = stats
  const pct = Math.round(coverage * 100)
  const zone = coverageZone(coverage)

  return (
    <div className={'rv-meter zone-' + zone.id}>
      <div className="rv-meter-head">
        <span className="rv-pct">{pct}%</span>
        <span className="rv-pct-cap">
          known · <b>{zone.label}</b>
          <span className="rv-zone-hint">{zone.hint}</span>
        </span>
      </div>
      <div
        className="rv-bar"
        role="img"
        aria-label={`${pct}% known across ${contentTotal} content words`}
      >
        {COVERAGE_CLASSES.map(k => counts[k] > 0 && (
          <span
            key={k}
            className="seg"
            style={{ flexGrow: counts[k], background: CLASS_COLOR[k], opacity: k === 'known' ? 0.95 : 0.82 }}
          />
        ))}
        <span className="rv-floor" title="98% — the extensive-reading floor" />
      </div>
      <div className="rv-legend">
        <span className="rv-total">{contentTotal} content words</span>
        {COVERAGE_CLASSES.map(k => counts[k] > 0 && (
          <span key={k} className="rv-acct" style={{ '--st': CLASS_COLOR[k] }}>
            <span className="dot" />{CLASS_LABEL[k]}<span className="n">{counts[k]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
