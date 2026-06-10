import React, { useRef, useState } from 'react'
import {
  PARTICLE_FAMILIES,
  STACK_CATALOGUE,
  STACK_FOOTNOTES,
} from '../data/koreanParticles.js'
import ParticleCabinet from '../components/korean/ParticleCabinet.jsx'
import ParticleCard from '../components/korean/ParticleCard.jsx'
import EEseoSpotlight from '../components/korean/EEseoSpotlight.jsx'
import ParticleStack from '../components/korean/ParticleStack.jsx'

function ParticleColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 조사 ⟡</div>
      The Polyglot's Atlas · Korean folio · the particle cabinet<br />
      drawn in the Aburaya hand · browse · tap · stack — the small words answer back
    </div>
  )
}

export default function KoreanParticles({ showReadings, showJp }) {
  const [flashId, setFlashId] = useState(null)
  const flashTimer = useRef(null)

  const goTo = (id) => {
    const el = document.getElementById('p-' + id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    clearTimeout(flashTimer.current)
    setFlashId(id)
    flashTimer.current = setTimeout(() => setFlashId(null), 3600)
  }

  return (
    <div className="page" data-screen-label="Korean — Particle cabinet">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">토</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">조사</span>
            The particle cabinet
          </h1>
          <div className="latin">
            armarium particularum · the joints of the sentence, catalogued —
            조사 <span style={{ fontStyle: 'normal' }}>(josa)</span> is 助詞 itself;
            the folk name is 토씨 <span style={{ fontStyle: 'normal' }}>(tossi)</span>
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            browse · tap · stack
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Take the nouns and the verb out of a Korean sentence and what is left on the table is the{' '}
        <span className="accent">조사</span> — thirty-three small words that do all of the
        load-bearing. Japanese issued you nearly the same toolkit under different serial numbers:
        は, が, を, に, で, から, まで, も, だけ, しか, さえ, こそ — every one has a Korean twin,
        and most of the twins are exact.
      </p>
      <p className="gram-sub">
        Five drawers, one card per particle, every card cut the same way: the form and its fitting
        rule, the Japanese twin in the corner, one specimen sentence, then why it matters — and the
        trap, if it has one. At the end, <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>the stack</b>:
        what happens when particles compound, and the single rule that governs every combination.
        You already know that rule too.
      </p>

      {/* I — THE CABINET (index) */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The cabinet</h2>
        <div className="latin">색인 (saegin) · every particle at a glance, twin in hand</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap a chip — the folio opens that card
      </div>
      <ParticleCabinet families={PARTICLE_FAMILIES} onPick={goTo} showJp={showJp} />

      {/* II–VI — THE DRAWERS */}
      {PARTICLE_FAMILIES.map(fam => (
        <section key={fam.id} id={'drawer-' + fam.id}>
          <div className="instr-head">
            <div className="no">{fam.no}</div>
            <h2>{fam.name}</h2>
            <div className="latin">{fam.latin}</div>
          </div>
          <p className="fam-blurb">{fam.blurb}</p>
          <div className="pcard-grid">
            {fam.entries.map(e => (
              <ParticleCard
                key={e.id}
                entry={e}
                color={fam.color}
                flash={flashId === e.id}
                showReadings={showReadings}
                showJp={showJp}
              />
            ))}
          </div>

          {/* sub-instrument: the 에/에서 border, settled by hand */}
          {fam.id === 'place' && (
            <div className="instr-sub-block">
              <div className="instr-sub">
                <span className="instr-sub-mark">— spotlight</span>
                <h3>에 vs 에서 — the pin &amp; the stage</h3>
              </div>
              <div className="try-strip">
                <span className="dot"></span> tap each side — your に/で border, redrawn in two letters
              </div>
              <EEseoSpotlight showReadings={showReadings} showJp={showJp} />
            </div>
          )}
        </section>
      ))}

      {/* VII — THE STACK */}
      <div className="instr-head">
        <div className="no">VII</div>
        <h2>The stack</h2>
        <div className="latin">조사 결합 · compounding — には·では·からは, the same algebra</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a base, add a topic / also / only — watch who yields and who holds
      </div>
      <ParticleStack showReadings={showReadings} showJp={showJp} />

      {/* ready-made stacks + the fine print */}
      <div className="stack-cat">
        <div className="stack-cat-head">ready-made stacks worth owning as words</div>
        <div className="stack-cat-grid">
          {STACK_CATALOGUE.map((c, i) => (
            <div className="sc-item" key={i}>
              <span className="sc-kr kr">{c.kr}</span>
              {showReadings && <span className="sc-rr">{c.rr}</span>}
              {showJp && <span className="sc-jp jp">{c.jp}</span>}
              <span className="sc-en">{c.en}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="spot-footnotes stack-fn">
        {STACK_FOOTNOTES.map((f, i) => (
          <div className="spot-footnote" key={i}>
            <div className="fn-head">{f.head}</div>
            <div className="fn-body" dangerouslySetInnerHTML={{ __html: f.html }} />
          </div>
        ))}
      </div>

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>A closed drawer is good news</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              Particles are a closed class: these thirty-three are not the beginning of a list,
              they nearly <em>are</em> the list. Verbs and nouns will arrive by the thousand; no
              new particle is coming. Organize the cabinet once and every sentence you ever parse
              spends from it.
            </p>
            <p>
              The folio reads as a checklist rather than a textbook because Japanese already paid
              the tuition: almost every card was “X is Y under a new name.” The genuine novelties
              are few enough to hold in one hand — に splits by animacy (에/한테), “and” wears
              register (와/하고/랑), the particles bow (께서/께), politeness detaches (요), and
              everything tailors to the 받침. Those five are where your attention belongs; the
              rest is recognition.
            </p>
            <blockquote>
              A particle is a small word that tells you what the big words are doing. Korean keeps
              about thirty; you arrived knowing twenty-five of them by other names.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">numbers &amp; counters</span>
              하나/둘/셋 against 일/이/삼 — native vs Sino, the exact kun/on split, each with its
              own counters. The week-two investment that saves months.
            </div>
            <div className="note">
              <span className="date">connectives</span>
              -아서 / -니까 / -지만 / -고 — where the cabinet ends: the clause-joiners are endings,
              not particles, and they replace the て-form economy wholesale.
            </div>
            <div className="note">
              <span className="date">the sound bridge</span>
              学校 → がっこう → 학교. The on’yomi-to-Sino-Korean shift table (k↔g, ts↔ch, final
              ん↔ㄴ/ㅁ) — an afternoon of patterns that unlocks thousands of words you already own.
            </div>
            <div className="note">
              <span className="date">wh × cabinet</span>
              누가 · 뭐를 · 어디서 · 언제까지 — the interrogatives wearing this cabinet: one table,
              every question the language can ask.
            </div>
          </aside>
        </div>
      </section>

      <ParticleColophon />
    </div>
  )
}
