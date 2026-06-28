import React from 'react'
import Connective from '../components/korean/Connective.jsx'
import KoConditional from '../components/korean/KoConditional.jsx'
import KoVolitionalImperative from '../components/korean/KoVolitionalImperative.jsx'
import VoiceDial from '../components/korean/VoiceDial.jsx'

function FormsColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 활용 ⟡</div>
      The Polyglot's Atlas · Korean folio · the constructions<br />
      drawn in the Aburaya hand · the joints that don’t fall out of the forge
    </div>
  )
}

export default function KoreanForms({ showReadings, showJp }) {
  return (
    <div className="page" data-screen-label="Korean — Constructions">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">활</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">활용</span>
            The constructions
          </h1>
          <div className="latin">
            structurae · the joints a beginner can’t guess —
            -고/-아서, -(으)면, -자/-아라, and voice
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            join · branch · urge · turn
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        The <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>동사</b> forge handles
        what falls out by rule — tense, the register dial, negation. This plate is the
        <span className="accent"> 활용</span> the forge can’t reach: the joints that each need their own small
        explanation before they click. It is the deliberate mirror of Japanese’s <span className="accent">活用</span>{' '}
        folio — but run the other way, with the <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>日本語 bridge</b>{' '}
        showing the form you already own.
      </p>
      <p className="gram-sub">
        Four instruments, each making one point. The <span className="accent">connective</span> — where Japanese
        spends one て, Korean splits the work across two stems. The <span className="accent">conditional</span> —
        where Japanese spends four “if”s, Korean spends mostly one. <span className="accent">Urging</span> — a
        four-rung command ladder where Japanese keeps about two. And <span className="accent">voice</span>, which
        the verb folio doesn’t host yet — one Japanese rule against Korean’s two layers, lexical and productive.
      </p>

      {/* INSTRUMENT I — the connective */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The connective</h2>
        <div className="latin">연결어미 · -고 vs -아/어(서) — the te-form, split in two</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a verb (meet both stems) — then run the rack: -고 있다 / -아/어 보다 / -아/어 주세요…
      </div>
      <Connective showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT II — the conditional */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">II</div>
        <h2>The conditional</h2>
        <div className="latin">조건 · -(으)면 — one “if” where Japanese spends four</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> watch -(으)면 built (the buffer’s back), then read which Japanese “if” each form absorbs
      </div>
      <KoConditional showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT III — volitional & imperative */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">III</div>
        <h2>Volitional &amp; imperative</h2>
        <div className="latin">청유형・명령형 · proposing and commanding — where register bites</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> read the two ladders — let’s (-자 / -(으)ㅂ시다 / -(으)ㄹ까요?) and the command rungs
      </div>
      <KoVolitionalImperative showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT IV — voice */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">IV</div>
        <h2>Voice</h2>
        <div className="latin">태 · 피동・사동 — lexical vs productive, the machine Korean splits in two</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a verb — see which voice cells it fills, and which it leaves to -게 하다
      </div>
      <VoiceDial showReadings={showReadings} showJp={showJp} />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>Understand, then drill</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              These are a different kind of grammar than the forge’s paradigm. Tense you drill until it’s
              reflex; these you have to <em>understand</em> first, because their difficulty isn’t the
              morphology — it’s the meaning. The connective hides two jobs behind Japanese’s one て; the
              conditional hides one Korean form behind Japanese’s four; the imperative hides four social rungs
              behind English’s one “do it”; voice hides a whole irregular vocabulary behind one Japanese rule.
            </p>
            <p>
              The thread is the bridge, and it runs both directions at once. Where Japanese spends <em>one</em>{' '}
              form, Korean often spends two (て → -고 / -아서; 〜られる/〜させる → lexical / productive). Where
              Japanese spends <em>four</em>, Korean spends one (ば/たら/と/なら → -(으)면). Knowing which way the
              split runs is most of the work.
            </p>
            <blockquote>
              The forge is arithmetic; these are judgment. One point each, made plainly, and the wall becomes
              a floor.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">more connectives</span>
              -(으)니까 (reason, and it <i>can</i> take a command), -는데 (the all-purpose
              background/contrast joint), -지만 (but), -(으)면서 (while) — the joins beyond -고/-아서.
            </div>
            <div className="note">
              <span className="date">the modifier forms</span>
              -는/-(으)ㄴ/-(으)ㄹ — the relative-clause endings that turn a verb into an adjective
              (먹는 사람, 먹은 사람, 먹을 사람), against Japanese’s one 連体形.
            </div>
            <div className="note">
              <span className="date">the irregular drawer</span>
              ㅂ (춥다 → 추워), ㅅ-drop, 르-doubling — the small stem families the forge previewed, each one a
              one-evening plate. They reshape the -아/어 stem these constructions all lean on.
            </div>
          </aside>
        </div>
      </section>

      <FormsColophon />
    </div>
  )
}
