import React, { useRef, useState } from 'react'
import { PHASES, STRANDS, STRAND_ORDER, PROFILES, PACES, ROADMAP_EUREKAS } from '../../data/koreanRoadmap.js'

// The waymark dossiers — Instrument II of the roadmap folio.
// One deep chart per waymark: six skill strands, each with its
// goal-post (can-do), its explanation, its Japanese bridge, and its
// checklist; then the effort panel — where the hours go, and how many
// weeks of walking the waymark costs at your pace.

function Strand({ strand, checks, onToggle, showReadings, showJp }) {
  const meta = STRANDS[strand.id]
  const done = strand.items.filter(it => checks[it.id]).length
  return (
    <div className="strand">
      <div className="strand-head">
        <span className="s-dot" style={{ background: meta.color }}></span>
        <span className="s-glyph kr">{meta.glyph}</span>
        {showReadings && <span className="s-rr">{meta.rr}</span>}
        <span className="s-en">{meta.en}</span>
        <span className="s-count">{done} / {strand.items.length}</span>
      </div>
      <p className="s-cando">{strand.cando}</p>
      <div className="s-body" dangerouslySetInnerHTML={{ __html: strand.bodyHtml }} />
      {showJp && strand.bridgeHtml && (
        <div className="s-bridge">
          <span className="s-bridge-tag">日本語</span>
          <span dangerouslySetInnerHTML={{ __html: strand.bridgeHtml }} />
        </div>
      )}
      <div className="s-items">
        {strand.items.map(it => {
          const when = checks[it.id]
          return (
            <div key={it.id} className={'rm-item' + (when ? ' done' : '')}>
              <button
                className="rm-check"
                role="checkbox"
                aria-checked={!!when}
                onClick={() => onToggle(it.id)}
              ></button>
              <span className="rm-text" dangerouslySetInnerHTML={{ __html: it.html }} />
              {when && <span className="rm-when">{when}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MixPanel({ phase, profileId, onProfile, pace, onPace }) {
  const mix = phase.mixes[profileId] || phase.mixes[phase.defaultProfile]
  const profile = PROFILES.find(p => p.id === profileId) || PROFILES[0]
  const paceOpt = PACES.find(p => p.h === pace) || PACES[1]
  const weeks = phase.hours
    ? [Math.ceil(phase.hours[0] / paceOpt.h), Math.ceil(phase.hours[1] / paceOpt.h)]
    : null

  return (
    <div className="mix-panel">
      <div className="mix-head">
        <h3>Where the hours go</h3>
        <div className="mix-profiles">
          {PROFILES.map(p => (
            <button
              key={p.id}
              className={'specimen-chip' + (p.id === profileId ? ' active' : '')}
              onClick={() => onProfile(p.id)}
            >
              {p.label}
              {p.id === phase.defaultProfile && <span className="mix-default">·rec</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="mix-bar" role="img" aria-label={'Effort mix — ' + profile.label}>
        {STRAND_ORDER.map(id => (
          <span
            key={id}
            className="mix-seg"
            style={{ width: mix[id] + '%', background: STRANDS[id].color }}
            title={`${STRANDS[id].en} — ${mix[id]}%`}
          ></span>
        ))}
      </div>
      <div className="mix-legend">
        {STRAND_ORDER.map(id => (
          <span key={id} className="mix-key">
            <span className="s-dot" style={{ background: STRANDS[id].color }}></span>
            <span className="kr">{STRANDS[id].glyph}</span> {mix[id]}%
          </span>
        ))}
      </div>
      <p className="mix-why">{profile.why}</p>

      <div className="pace-row">
        <span className="pace-lbl">your pace</span>
        {PACES.map(p => (
          <button
            key={p.h}
            className={'specimen-chip' + (p.h === pace ? ' active' : '')}
            onClick={() => onPace(p.h)}
          >
            {p.label}
          </button>
        ))}
        {weeks && (
          <span className="pace-math">
            at this pace, the waymark is <b>~{weeks[0]}–{weeks[1]} weeks</b> of walking
          </span>
        )}
      </div>
    </div>
  )
}

export default function WaymarkDossier({
  selected, checks, onToggle, profiles, onProfile, pace, onPace, showReadings, showJp,
}) {
  const [eureka, setEureka] = useState(null)
  const lampLit = useRef(false)
  const mixShifted = useRef(false)

  const phase = PHASES.find(p => p.id === selected) || PHASES[0]
  const profileId = profiles[phase.id] || phase.defaultProfile

  const toggle = (id) => {
    if (!checks[id] && !lampLit.current) {
      lampLit.current = true
      setEureka(ROADMAP_EUREKAS.firstLamp)
    }
    onToggle(id)
  }

  const pickProfile = (pid) => {
    if (pid !== phase.defaultProfile && !mixShifted.current) {
      mixShifted.current = true
      setEureka(ROADMAP_EUREKAS.mixShift)
    }
    onProfile(phase.id, pid)
  }

  return (
    <div className="dossier-stage" data-screen-label={'Dossier — ' + phase.name}>
      <div className="dossier-head">
        <div className="d-title">
          <span className="d-glyph kr">{phase.glyph}</span>
          <div className="d-name-block">
            <span className="d-name">{phase.name}</span>
            <span className="d-sub">
              {showReadings && <i>{phase.rr}</i>}
              {showJp && <span className="d-ja"> · {phase.jaBridge} — the name itself crosses the bridge</span>}
            </span>
          </div>
        </div>
        <div className="d-meta">
          <span className="cap-chip">CEFR · {phase.cefr}</span>
          <span className="cap-chip">{phase.topik}</span>
          <span className="cap-chip">{phase.words} words</span>
        </div>
      </div>

      <div className="dossier-gates">
        <div className="gate-line">
          <span className="gate-lbl">you stand here when</span>
          <span className="gate-text">{phase.enter}</span>
        </div>
        {phase.gate && (
          <div className="gate-line">
            <span className="gate-lbl open">the gate opens when</span>
            <span className="gate-text">{phase.gate}</span>
          </div>
        )}
        {phase.signpost && <div className="d-signpost">{phase.signpost}</div>}
        {phase.kit && (
          <div className="d-kit"><span className="kit-lbl">the kit</span>{phase.kit}</div>
        )}
      </div>

      {phase.strands.length > 0 ? (
        <>
          <div className="strand-list">
            {phase.strands.map(s => (
              <Strand
                key={s.id}
                strand={s}
                checks={checks}
                onToggle={toggle}
                showReadings={showReadings}
                showJp={showJp}
              />
            ))}
          </div>
          <MixPanel
            phase={phase}
            profileId={profileId}
            onProfile={pickProfile}
            pace={pace}
            onPace={onPace}
          />
        </>
      ) : (
        <div className="dossier-far">
          <p dangerouslySetInnerHTML={{ __html: phase.sketchHtml }} />
          <div className="far-landmarks">
            {phase.landmarks.map(l => (
              <div key={l.kr} className="far-landmark">
                <div className="fl-head">
                  <span className="kr">{l.kr}</span>
                  {showReadings && <i>{l.rr}</i>}
                  <span className="fl-en">{l.en}</span>
                </div>
                <p dangerouslySetInnerHTML={{ __html: l.html }} />
              </div>
            ))}
          </div>
        </div>
      )}

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
