import React, { useState, useRef } from 'react'
import { GRAM_ROLES, LOOM_SPECIMENS } from '../data/grammarData.js'

export default function LoomInstrument({ showReadings }) {
  const [specimenId, setSpecimenId] = useState(LOOM_SPECIMENS[0].id)
  const specimen = LOOM_SPECIMENS.find(s => s.id === specimenId)

  return (
    <div className="loom-stage" data-screen-label="Loom instrument">
      <div className="specimen-row">
        <span className="lbl">Specimen</span>
        {LOOM_SPECIMENS.map(s => (
          <button
            key={s.id}
            className={'specimen-chip' + (s.id === specimenId ? ' active' : '')}
            onClick={() => setSpecimenId(s.id)}
          >
            <span className="jp">{s.jp}</span>{s.label}
          </button>
        ))}
      </div>

      <LoomBoard key={specimenId} specimen={specimen} showReadings={showReadings} />
    </div>
  )
}

function LoomBoard({ specimen, showReadings }) {
  const [order, setOrder] = useState(() => specimen.tiles.map(t => t.id))
  const [swaps, setSwaps] = useState({})
  const [eureka, setEureka] = useState(null)
  const [shake, setShake] = useState(false)
  const [drag, setDrag] = useState(null)

  const dragRef = useRef(null)
  const tileEls = useRef({})
  const reorderedOnce = useRef(false)
  const swappedOnce = useRef(false)
  const anchoredOnce = useRef(false)

  // Resolve a tile id to its current (possibly swapped) form
  const resolve = (id) => {
    const base = specimen.tiles.find(t => t.id === id)
    if (!base) return null
    if (base.swap) {
      const s = base.swap[swaps[id] || 0]
      return { ...base, particle: s.particle, particleReading: s.particleReading, role: s.role }
    }
    return base
  }

  const orderedTiles = order.map(resolve).filter(Boolean)
  const result = specimen.glossEngine(orderedTiles)
  const nuance = specimen.nuance ? specimen.nuance(orderedTiles) : null

  // ---- drag handlers (equal-width tiles → uniform pitch) ----
  const onPointerDown = (e, id, index) => {
    if (e.button != null && e.button !== 0) return
    const els = order.map(tid => tileEls.current[tid])
    const rects = els.map(el => el.getBoundingClientRect())
    const pitch = rects.length > 1 ? (rects[1].left - rects[0].left) : rects[0].width
    dragRef.current = { id, index, startX: e.clientX, rects, pitch, order: [...order], targetIndex: index }
    setDrag({ id, dx: 0, targetIndex: index })
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    const draggedCenter = d.rects[d.index].left + d.rects[d.index].width / 2 + dx
    let target = 0
    for (let i = 0; i < d.order.length; i++) {
      if (i === d.index) continue
      const c = d.rects[i].left + d.rects[i].width / 2
      if (c < draggedCenter) target++
    }
    target = Math.max(0, Math.min(d.order.length - 1, target))
    d.targetIndex = target
    setDrag({ id: d.id, dx, targetIndex: target })
  }

  const onPointerUp = () => {
    const d = dragRef.current
    if (!d) return
    const remaining = d.order.filter(x => x !== d.id)
    remaining.splice(d.targetIndex, 0, d.id)
    dragRef.current = null
    setDrag(null)
    if (remaining.join() !== d.order.join()) {
      setOrder(remaining)
      if (specimen.eurekaReorder && !reorderedOnce.current) {
        reorderedOnce.current = true
        setEureka(specimen.eurekaReorder)
      }
    }
  }

  // Transform for a given tile during a drag
  const transformFor = (id, idx) => {
    if (!drag) return { transform: 'none' }
    const d = dragRef.current
    if (id === drag.id) return { transform: `translateX(${drag.dx}px)` }
    if (!d) return { transform: 'none' }
    const r = idx < d.index ? idx : idx - 1
    const finalSlot = r >= drag.targetIndex ? r + 1 : r
    return { transform: `translateX(${(finalSlot - idx) * d.pitch}px)` }
  }

  // ---- particle swap ----
  const cycleParticle = (id) => {
    const base = specimen.tiles.find(t => t.id === id)
    if (!base || !base.swap) return
    const next = ((swaps[id] || 0) + 1) % base.swap.length
    const nextSwaps = { ...swaps }
    if (specimen.coupledSwap) {
      specimen.tiles.forEach(t => { if (t.swap) nextSwaps[t.id] = next })
    } else {
      nextSwaps[id] = next
    }
    setSwaps(nextSwaps)
    if (specimen.eurekaSwap && !swappedOnce.current) {
      const changed = Object.keys(nextSwaps).some(k => (nextSwaps[k] || 0) !== 0)
      if (changed) { swappedOnce.current = true; setEureka(specimen.eurekaSwap) }
    }
  }

  // ---- keyboard move ----
  const moveByKey = (id, dir) => {
    const i = order.indexOf(id)
    const j = i + dir
    if (j < 0 || j >= order.length) return
    const next = [...order]
    next.splice(i, 1)
    next.splice(j, 0, id)
    setOrder(next)
    if (specimen.eurekaReorder && !reorderedOnce.current) {
      reorderedOnce.current = true
      setEureka(specimen.eurekaReorder)
    }
  }

  // Predicate "tries to move" → won't. Head-final lesson.
  const nudgeAnchor = () => {
    setShake(true)
    setTimeout(() => setShake(false), 430)
    if (!anchoredOnce.current) {
      anchoredOnce.current = true
      setEureka({
        head: 'the verb keeps the end',
        body: 'It won\'t budge — and that is the rule. Japanese is <b>head-final</b>: the predicate always closes the sentence. Everything else leans toward it. You can hold a whole clause in suspense until the very last syllable tells you what happened.',
      })
    }
  }

  const rolesPresent = []
  orderedTiles.forEach(t => { if (!rolesPresent.includes(t.role)) rolesPresent.push(t.role) })

  return (
    <>
      <div className="loom-prompt">{specimen.prompt}</div>

      <div className="loom-line">
        <div
          className="loom-track"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {order.map((id, idx) => {
            const t = resolve(id)
            if (!t) return null
            const role = GRAM_ROLES[t.role]
            const isDragging = drag && drag.id === id
            return (
              <div
                key={id}
                ref={el => { if (el) tileEls.current[id] = el }}
                className={'loom-tile' + (isDragging ? ' dragging' : '')}
                style={{ ...transformFor(id, idx), '--role-color': role.color }}
                tabIndex={0}
                role="button"
                aria-label={t.gloss + ' — ' + role.tag}
                onPointerDown={(e) => onPointerDown(e, id, idx)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') { e.preventDefault(); moveByKey(id, 1) }
                  if (e.key === 'ArrowLeft')  { e.preventDefault(); moveByKey(id, -1) }
                }}
              >
                <div className="role-tag">{role.tag}</div>
                <div className="tile-main">
                  <span className="jp">{t.jp}</span>
                  <span
                    className={'loom-particle' + (t.swap ? ' swappable' : '')}
                    onPointerDown={(e) => { if (t.swap) e.stopPropagation() }}
                    onClick={(e) => { if (t.swap) { e.stopPropagation(); cycleParticle(id) } }}
                    title={t.swap ? 'click to swap が ⇅ を' : ''}
                  >{t.particle}</span>
                </div>
                <div className="reading" style={{ visibility: showReadings ? 'visible' : 'hidden' }}>
                  {t.reading}{t.particleReading ? ' ' + t.particleReading : ''}
                </div>
                <div className="gloss">{t.gloss}</div>
              </div>
            )
          })}
        </div>

        <div className="loom-flow" aria-hidden="true">→</div>

        <div
          className={'loom-predicate' + (shake ? ' shake' : '')}
          onPointerDown={nudgeAnchor}
          title="the verb is anchored at the end"
        >
          <div className="role-tag">predicate · 述語</div>
          <div className="tile-main">
            <span className="jp">{specimen.predicate.jp}</span>
          </div>
          <div className="reading" style={{ visibility: showReadings ? 'visible' : 'hidden' }}>
            {specimen.predicate.reading}
          </div>
          <div className="gloss">{specimen.predicate.gloss}</div>
        </div>
      </div>

      <div className="role-legend">
        {rolesPresent.map(r => {
          const role = GRAM_ROLES[r]
          return (
            <span className="item" key={r}>
              <span className="swatch" style={{ color: role.color }}>
                {role.tag.split('· ')[1]}
              </span>
              {role.tag.split(' ·')[0]}
            </span>
          )
        })}
      </div>

      <div className="loom-gloss-bar">
        <span className="glabel">reads as</span>
        <div>
          <div
            className={'gloss-en' + (result.valid ? '' : ' invalid')}
            dangerouslySetInnerHTML={{ __html: result.html }}
          />
          {nuance && result.valid && (
            <div className="nuance" dangerouslySetInnerHTML={{ __html: nuance }} />
          )}
        </div>
      </div>

      <div className={'lantern-note' + (eureka ? ' lit' : '')} aria-live="polite">
        {eureka && (
          <>
            <div className="head">{eureka.head}</div>
            <div className="body" dangerouslySetInnerHTML={{ __html: eureka.body }} />
          </>
        )}
      </div>

      <div className="loom-controls">
        <span className="mini-toggle" style={{ cursor: 'default', color: 'var(--ink-faded)' }}>
          {specimen.kind === 'swap'
            ? 'click a particle · が ⇅ を'
            : 'drag a tile · or focus it and press ← →'}
        </span>
        <button
          className="text-btn"
          onClick={() => { setOrder(specimen.tiles.map(t => t.id)); setSwaps({}) }}
        >
          ↺ reset arrangement
        </button>
      </div>
    </>
  )
}
