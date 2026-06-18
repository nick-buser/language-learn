import React, { useMemo, useRef, useState } from 'react'
import { STATUSES, STATUS_META } from './useVocabStore.js'
import { BRIDGE_KINDS } from '../../data/koreanVocab.js'
import { dayKey } from './srs.js'

// =====================================================================
// The holdings ledger — the word bank as a working table.
//
// Dictionary-shaped browser over a VocabEntry[] bank (see koreanVocab.js)
// joined live to the learner's word state. Census strip (stacked coverage
// bar + status filters), search, stratum/pos filters, sortable columns,
// and expandable rows. Opening an unseen word files it as met — browsing
// is how the bank learns what you've crossed paths with.
//
// Language-agnostic: everything script-specific comes from the `lang`
// config (VOCAB_LANG in the data modules) and the entries themselves.
// =====================================================================

const POS_LABEL = {
  noun: 'noun', verb: 'verb', adj: 'adjective', adverb: 'adverb', expression: 'expression',
}

// Show the dictionary senses (KRDICT) when an entry carries real definitions —
// hand entries lean on their specimen + note instead, so they skip this.
const hasSenses = (e) => Array.isArray(e.senses) && e.senses.some(s => s.def)

const STATUS_ORDER = { unseen: 0, met: 1, learning: 2, known: 3 }

const EUREKAS = {
  met: {
    head: 'looking is meeting',
    body: 'The ledger files what you open: an unseen word you inspect becomes <b>met</b>, ' +
          'dated today. Nothing to do — the bank simply remembers that you’ve crossed paths, ' +
          'and every later instrument (reading, review) will read that memory.',
  },
  learn: {
    head: 'the drawer below has a card now',
    body: 'Marking a word <b>learning</b> winds its clock: it enters today’s queue in the ' +
          'review drawer, and keeps resurfacing on a widening schedule until it holds for ' +
          'three weeks straight. Stock the queue from here; empty it down there.',
  },
  known: {
    head: 'an account opened',
    body: '<b>Known</b> words are your holdings — the number every later instrument reads. ' +
          'Generated reading passages will be tuned to ~97% known coverage, so each word ' +
          'banked here directly widens what you can read.',
  },
}

function daysUntil(day) {
  const [y, m, d] = day.split('-').map(Number)
  const [ty, tm, td] = dayKey().split('-').map(Number)
  return Math.round((new Date(y, m - 1, d) - new Date(ty, tm - 1, td)) / 86400000)
}

function dueLabel(srs) {
  const n = daysUntil(srs.due)
  return n <= 0 ? 'due today' : n === 1 ? 'due tomorrow' : `due in ${n} d`
}

function matches(e, q) {
  const hay = [
    e.head, e.hanja, e.en, e.reading.rr, e.reading.kana,
    e.bridge?.kanji, e.bridge?.kana, e.bridge?.rr,
  ]
  return hay.some(h => h && h.toLowerCase().includes(q))
}

export default function WordLedger({ entries, lang, store, showReadings, showJp }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)
  const [stratumFilter, setStratumFilter] = useState(null)
  const [posFilter, setPosFilter] = useState(null)
  const [sort, setSort] = useState({ by: 'band', dir: 1 })
  const [openId, setOpenId] = useState(null)
  const [eureka, setEureka] = useState(null)
  const fired = useRef({})

  const withBridge = lang.hasBridge && showJp
  const { statusOf, setStatus } = store

  const fire = (id) => {
    if (!fired.current[id]) {
      fired.current[id] = true
      setEureka(EUREKAS[id])
    }
  }

  const census = useMemo(() => {
    const c = { unseen: 0, met: 0, learning: 0, known: 0 }
    entries.forEach(e => { c[statusOf(e.id)] += 1 })
    return c
  }, [entries, statusOf])

  const poses = useMemo(() => [...new Set(entries.map(e => e.pos))], [entries])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = entries.filter(e =>
      (!q || matches(e, q)) &&
      (!statusFilter || statusOf(e.id) === statusFilter) &&
      (!stratumFilter || e.origin === stratumFilter) &&
      (!posFilter || e.pos === posFilter)
    )
    const dir = sort.dir
    return list.sort((a, b) => {
      if (sort.by === 'word') return dir * a.head.localeCompare(b.head, lang.id)
      if (sort.by === 'band') {
        // prefer the finer frequency rank; fall back to the coarse band
        const ra = a.freqRank ?? (a.band ?? 3) * 100000
        const rb = b.freqRank ?? (b.band ?? 3) * 100000
        return dir * (ra - rb) || a.reading.rr.localeCompare(b.reading.rr)
      }
      // status: by state, then the soonest-due learning words first
      const sa = STATUS_ORDER[statusOf(a.id)]
      const sb = STATUS_ORDER[statusOf(b.id)]
      if (sa !== sb) return dir * (sa - sb)
      const da = store.words[a.id]?.srs?.due || ''
      const db = store.words[b.id]?.srs?.due || ''
      return da.localeCompare(db)
    })
  }, [entries, query, statusFilter, stratumFilter, posFilter, sort, statusOf, store.words, lang.id])

  const filtered = shown.length !== entries.length

  const sortBy = (by) =>
    setSort(s => ({ by, dir: s.by === by ? -s.dir : 1 }))

  const toggleOpen = (e) => {
    const opening = openId !== e.id
    setOpenId(opening ? e.id : null)
    if (opening && statusOf(e.id) === 'unseen') {
      setStatus(e.id, 'met')
      fire('met')
    }
  }

  const move = (id, status) => {
    setStatus(id, status)
    if (status === 'learning') fire('learn')
    if (status === 'known') fire('known')
  }

  const clearFilters = () => {
    setQuery(''); setStatusFilter(null); setStratumFilter(null); setPosFilter(null)
  }

  const sortGlyph = (by) => sort.by === by ? (sort.dir === 1 ? ' ▴' : ' ▾') : ''

  return (
    <div className="wb-stage" data-screen-label="Word ledger">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Every word in the bank, joined to what the bank knows about you. Open a row to read the
        specimen and the fine print — opening an unseen word files it as <b>met</b>. From there:
        words you already own go straight to <b>known</b>; words worth drilling go to{' '}
        <b>learning</b>, which stocks the review drawer below.
      </div>

      {/* census — the coverage bar and the status accounts */}
      <div className="wb-census">
        <div className="wb-census-bar" role="img"
          aria-label={STATUSES.map(s => `${census[s.id]} ${s.label}`).join(', ')}>
          {STATUSES.map(s => census[s.id] > 0 && (
            <span key={s.id} className="seg" style={{
              flexGrow: census[s.id],
              background: s.color,
              opacity: s.id === 'unseen' ? 0.25 : 0.9,
            }} />
          ))}
        </div>
        <div className="wb-census-row">
          <span className="wb-total">{entries.length} words</span>
          {STATUSES.map(s => (
            <button
              key={s.id}
              className={'wb-acct' + (statusFilter === s.id ? ' active' : '')}
              style={{ '--st': s.color }}
              title={s.hint}
              onClick={() => setStatusFilter(f => f === s.id ? null : s.id)}
            >
              <span className="dot" />
              {s.label}
              <span className="n">{census[s.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* search + filters */}
      <div className="wb-tools">
        <input
          className="wb-search"
          type="search"
          placeholder={lang.hasBridge ? 'search — hangul, RR, English, kanji…' : 'search — kanji, kana, romaji, English…'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search the word bank"
        />
        <div className="wb-chiprow">
          {lang.strata.map(st => (
            <button
              key={st.id}
              className={'specimen-chip wb-chip' + (stratumFilter === st.id ? ' active' : '')}
              title={st.hint}
              onClick={() => setStratumFilter(f => f === st.id ? null : st.id)}
            >
              <span className="glyph" style={{ fontFamily: lang.font }}>{st.glyph}</span>
              {st.label}
              <span className="n">{entries.filter(e => e.origin === st.id).length}</span>
            </button>
          ))}
          <span className="wb-chip-sep" />
          {poses.map(p => (
            <button
              key={p}
              className={'specimen-chip wb-chip' + (posFilter === p ? ' active' : '')}
              onClick={() => setPosFilter(f => f === p ? null : p)}
            >
              {POS_LABEL[p]}
            </button>
          ))}
        </div>
        <div className="wb-showing">
          {filtered ? <>showing <b>{shown.length}</b> of {entries.length} — <button className="wb-clear" onClick={clearFilters}>clear</button></> : <>all {entries.length} shown</>}
        </div>
      </div>

      {/* the table */}
      <div className={'wb-table' + (withBridge ? ' with-bridge' : '')} role="table" aria-label="Word bank">
        <div className="wb-row wb-head" role="row">
          <button role="columnheader" className="wb-th sortable" onClick={() => sortBy('word')}>
            word{sortGlyph('word')}
          </button>
          {withBridge && <span role="columnheader" className="wb-th">日本語 bridge</span>}
          <span role="columnheader" className="wb-th">gloss</span>
          <span role="columnheader" className="wb-th wb-col-tags">filed as</span>
          <button role="columnheader" className="wb-th sortable" onClick={() => sortBy('band')}
            title="frequency band — fuller is more common">
            freq{sortGlyph('band')}
          </button>
          <button role="columnheader" className="wb-th sortable" onClick={() => sortBy('status')}>
            status{sortGlyph('status')}
          </button>
          <span role="columnheader" className="wb-th" aria-label="actions" />
        </div>

        {shown.map(e => {
          const status = statusOf(e.id)
          const word = store.words[e.id]
          const open = openId === e.id
          return (
            <React.Fragment key={e.id}>
              <div
                className={'wb-row wb-entry' + (open ? ' open' : '')}
                style={{ '--st': STATUS_META[status].color }}
                role="row"
                onClick={() => toggleOpen(e)}
              >
                <span className="wb-word" role="cell">
                  <span className={'head ' + lang.scriptClass} style={{ fontFamily: lang.font }}>{e.head}</span>
                  {showReadings && (
                    <span className="reading">
                      {e.reading.kana && <span className="kana" style={{ fontFamily: lang.font }}>{e.reading.kana} · </span>}
                      {e.reading.rr}
                    </span>
                  )}
                </span>
                {withBridge && (
                  <span className="wb-bridge" role="cell">
                    {e.bridge && (
                      <>
                        <span className="jp">{e.bridge.kanji}</span>
                        {showReadings && e.bridge.kana && <span className="kana">{e.bridge.kana}</span>}
                        <span className={'kind kind-' + e.bridge.kind} title={BRIDGE_KINDS[e.bridge.kind].hint}>
                          {BRIDGE_KINDS[e.bridge.kind].label}
                        </span>
                      </>
                    )}
                  </span>
                )}
                <span className="wb-gloss" role="cell">{e.en}</span>
                <span className="wb-tags wb-col-tags" role="cell">
                  <span className="tag">{POS_LABEL[e.pos]}</span>
                  <span className="tag">{lang.strata.find(s => s.id === e.origin)?.label}</span>
                </span>
                <span className="wb-band" role="cell" title={'frequency band ' + e.band}>
                  {'●'.repeat(4 - e.band)}{'○'.repeat(e.band - 1)}
                </span>
                <span className="wb-status" role="cell">
                  <span className="pill">{STATUS_META[status].label}</span>
                  {status === 'learning' && word?.srs && <span className="due">{dueLabel(word.srs)}</span>}
                </span>
                <span className="wb-actions" role="cell" onClick={ev => ev.stopPropagation()}>
                  {(status === 'unseen' || status === 'met') && (
                    <>
                      <button className="wb-act" onClick={() => move(e.id, 'learning')}>learn</button>
                      <button className="wb-act know" onClick={() => move(e.id, 'known')}>know</button>
                    </>
                  )}
                  {status === 'learning' && (
                    <button className="wb-act know" onClick={() => move(e.id, 'known')}>know</button>
                  )}
                  {status === 'known' && (
                    <button className="wb-act" onClick={() => move(e.id, 'learning')}>relearn</button>
                  )}
                </span>
              </div>

              {open && (
                <div className="wb-detail" role="row">
                  <div className="wb-detail-main">
                    {e.ex && (
                      <div className="wb-ex">
                        <div className={'ex-text ' + lang.scriptClass} style={{ fontFamily: lang.font }}
                          dangerouslySetInnerHTML={{ __html: e.ex.text }} />
                        {showReadings && <div className="ex-rr">{e.ex.rr}</div>}
                        {showJp && e.ex.jp && (
                          <div className="ex-jp">
                            <span className="jp">{e.ex.jp}</span>
                            {showReadings && <span className="jp-rr">{e.ex.jpRr}</span>}
                          </div>
                        )}
                        <div className="ex-en">{e.ex.en}</div>
                      </div>
                    )}
                    {hasSenses(e) && (
                      <ol className="wb-senses">
                        {e.senses.map((s, i) => (
                          <li key={i}>
                            <span className="s-gloss">{s.gloss}</span>
                            {s.def && <span className={'s-def ' + lang.scriptClass}>{s.def}</span>}
                          </li>
                        ))}
                      </ol>
                    )}
                    {e.note && (
                      <div className="wb-note">
                        <span className="fn-head">{e.note.head}</span>
                        <span className="fn-body" dangerouslySetInnerHTML={{ __html: e.note.html }} />
                      </div>
                    )}
                  </div>
                  <aside className="wb-detail-side">
                    {e.hanja && lang.hasBridge && (
                      <div className="wb-fact"><span className="k">hanja</span><span className="v jp">{e.hanja}</span></div>
                    )}
                    <div className="wb-fact"><span className="k">domain</span><span className="v">{e.domain}</span></div>
                    {word?.since && (
                      <div className="wb-fact"><span className="k">{STATUS_META[status].label} since</span><span className="v">{word.since}</span></div>
                    )}
                    {word?.srs && word.srs.reps + word.srs.lapses > 0 && (
                      <>
                        <div className="wb-fact"><span className="k">interval</span><span className="v">{word.srs.interval} d · ease {word.srs.ease.toFixed(2)}</span></div>
                        <div className="wb-fact"><span className="k">reviews</span><span className="v">{word.srs.reps} held · {word.srs.lapses} lapsed</span></div>
                      </>
                    )}
                    <div className="wb-move">
                      <span className="k">file under</span>
                      <div className="opts">
                        {STATUSES.map(s => (
                          <button
                            key={s.id}
                            className={'wb-move-opt' + (status === s.id ? ' active' : '')}
                            style={{ '--st': s.color }}
                            title={s.hint}
                            onClick={() => move(e.id, s.id)}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </aside>
                </div>
              )}
            </React.Fragment>
          )
        })}

        {shown.length === 0 && (
          <div className="wb-empty">nothing in the bank matches — <button className="wb-clear" onClick={clearFilters}>clear the filters</button></div>
        )}
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
