import React, { useRef, useState } from 'react'
import { PARTICLE_FAMILIES, CABINET_FOOT } from '../data/japaneseParticles.js'
import JapaneseParticleCabinet from '../components/japanese/JapaneseParticleCabinet.jsx'
import JapaneseParticleCard from '../components/japanese/JapaneseParticleCard.jsx'

function ParticleColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 助詞 ⟡</div>
      The Polyglot's Atlas · Japanese folio · the particle cabinet<br />
      drawn in the Aburaya hand · browse · tap · cross — the small words answer back
    </div>
  )
}

export default function JapaneseParticles({ showReadings, showJp }) {
  const [flashId, setFlashId] = useState(null)
  const flashTimer = useRef(null)

  const goTo = (id) => {
    const el = document.getElementById('jp-' + id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    clearTimeout(flashTimer.current)
    setFlashId(id)
    flashTimer.current = setTimeout(() => setFlashId(null), 3600)
  }

  return (
    <div className="page" data-screen-label="Japanese — Particle cabinet">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">助</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph">助詞</span>
            The particle cabinet
          </h1>
          <div className="latin">
            armarium particularum · the joints of the sentence, catalogued —
            助詞 <span style={{ fontStyle: 'normal' }}>(joshi)</span> is 조사 itself
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            browse · tap · cross
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Take the nouns and the verb out of a Japanese sentence and what is left on the table is the{' '}
        <span className="accent">助詞</span> — the small words that pin every role. You own these
        already. This cabinet lays them out the way the Korean folio lays out 조사, so the mapping runs
        both ways — and two facts about Japanese particles come into focus only when you see Korean beside
        them.
      </p>
      <p className="gram-sub">
        First: a Japanese particle <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>never
        changes shape</b> — は is は after anything, where Korean fits 은/는 to the noun. Second: where
        Japanese spends one particle, Korean often spends several (に → 에 / 에게, で → 에서 / 으로,
        から → 에서 / 부터 / 한테서). And one whole drawer — the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>終助詞</b> — is where
        Japanese is the richer language, and Korean answers with verb endings instead.
      </p>

      {/* I — THE CABINET (index) */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The cabinet</h2>
        <div className="latin">索引 (sakuin) · every particle at a glance, twin in hand</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap a chip — the folio opens that card
      </div>
      <JapaneseParticleCabinet families={PARTICLE_FAMILIES} onPick={goTo} showJp={showJp} foot={CABINET_FOOT} />

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
              <JapaneseParticleCard
                key={e.id}
                entry={e}
                color={fam.color}
                flash={flashId === e.id}
                showReadings={showReadings}
                showJp={showJp}
              />
            ))}
          </div>
        </section>
      ))}

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
              Particles are a closed class in both languages: these twenty-eight are not the start of a
              list, they nearly <em>are</em> the list. Nouns and verbs arrive by the thousand; no new
              particle is coming. Organize the cabinet once and every sentence you parse spends from it.
            </p>
            <p>
              Read against Korean, the Japanese set tells a consistent story: it is the more economical
              of the two for nouns — one に, one で, one から doing work Korean divides — and the more
              elaborate at the sentence’s end, where its 終助詞 carry stance that Korean folds into the
              verb ending. The genuine novelties from the Korean side are few: に splits by animacy, で
              and から each split by what’s being marked, “and” inflects for register, and everything
              tailors to the 받침. Five things to watch; the rest is recognition.
            </p>
            <blockquote>
              A particle is a small word that tells you what the big words are doing. Japanese keeps about
              thirty; Korean keeps about thirty; and the two lists are nearly the same list, twice.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">は &amp; が — delivered</span>
              the topic-vs-subject spotlight already runs on the <b>文法 · grammar engine</b> folio. The
              one particle pair worth its own instrument.
            </div>
            <div className="note">
              <span className="date">に vs で</span>
              the static pin against the active stage — Japanese’s own version of the 에/에서 border the
              Korean cabinet settles. A spotlight to come.
            </div>
            <div className="note">
              <span className="date">the stack</span>
              には · では · からは · だけが — Japanese particles compound too, by the same algebra as
              Korean’s 에는 · 에선 · 만이. Adverbials stack, cases yield.
            </div>
            <div className="note">
              <span className="date">conjunction particles</span>
              が · けど · から · ので · のに — the clause-joiners, a different family from these
              noun-markers. Where Korean reaches for connective endings (-지만, -니까, -는데).
            </div>
          </aside>
        </div>
      </section>

      <ParticleColophon />
    </div>
  )
}
