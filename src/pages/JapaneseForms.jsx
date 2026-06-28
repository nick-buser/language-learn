import React from 'react'
import TeForm from '../components/japanese/TeForm.jsx'
import Conditional from '../components/japanese/Conditional.jsx'
import VolitionalImperative from '../components/japanese/VolitionalImperative.jsx'

function FormsColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 活用 ⟡</div>
      The Polyglot's Atlas · Japanese folio · the constructions<br />
      drawn in the Aburaya hand · the forms that don’t fall out by rule
    </div>
  )
}

export default function JapaneseForms({ showReadings, showJp }) {
  return (
    <div className="page" data-screen-label="Japanese — Constructions">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">活</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph">活用</span>
            The constructions
          </h1>
          <div className="latin">
            structurae · the forms a beginner can’t guess —
            て, the four “if”s, ましょう &amp; 食べろ
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            bolt · branch · urge
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        The <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>動詞</b> folio handles
        the conjugations that fall out by rule — tense, negation, politeness, voice. This plate is for the
        forms that <span className="accent">don’t</span>: the ones you can’t guess from the dictionary entry,
        that each need their own small explanation before they click.
      </p>
      <p className="gram-sub">
        Three of them, each given room to make its one point: the <span className="accent">て-form</span> and
        the dozen constructions that hang off it; the four ways to say <span className="accent">“if”</span>;
        and the forms for <span className="accent">urging</span> — let’s, shall we, do it. Turn on the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>한국어 bridge</b> and watch
        where Korean agrees and where it splits the work differently.
      </p>

      {/* INSTRUMENT I — the te-form */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The て-form</h2>
        <div className="latin">て形 · one shape, a dozen jobs — the spoken scaffold</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a verb (meet the 音便) — then run the rack: ている / てみる / てください / てはいけない…
      </div>
      <TeForm showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT II — the conditional */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">II</div>
        <h2>The conditional</h2>
        <div className="latin">条件形 · four “if”s — each owning a situation</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a verb, then a conditional — ば / たら / と / なら, and read what makes it the only right one
      </div>
      <Conditional showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT III — volitional & imperative */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">III</div>
        <h2>Volitional &amp; imperative</h2>
        <div className="latin">意向形・命令形 · proposing and commanding — where register bites</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> read the two ladders — let’s (よう / ましょう) and the command rungs (ろ → なさい → てください)
      </div>
      <VolitionalImperative showReadings={showReadings} showJp={showJp} />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>Understand, don’t drill</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              Three joints, and they’re of a different kind than the 動詞 folio’s paradigm. Those you drill
              until they’re reflex; these you have to <em>understand</em> first — because their difficulty
              isn’t the morphology, it’s the meaning. The te-form hides its sense in what you bolt on; the
              conditional hides four distinct situations behind one English “if”; the imperative hides a
              social ladder behind a single English “do it.”
            </p>
            <p>
              The thread through all three is the bridge. Where Japanese reaches for one て, Korean asks
              <em> list or flow</em> (-고 / -아·어). Where Japanese spends four “if”s, Korean spends mostly
              one (-(으)면). And the command ladder runs rung-for-rung in both — which is exactly why
              getting the rung right is the whole art of being polite.
            </p>
            <blockquote>
              The regular forms are arithmetic; these are judgment. One point each, made plainly, and the
              wall becomes a floor.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">the Korean 활용 mirror</span>
              this whole folio mirrors onto a Korean plate — the connective -아서 / -고, the conditional
              -(으)면, the urging forms -자 / -아라, and the voice Korean’s verb folio doesn’t host yet.
            </div>
            <div className="note">
              <span className="date">more connectives</span>
              〜たり (representative listing), 〜ながら (while), 〜ても (even if) — the joins beyond て that
              chain and qualify clauses.
            </div>
            <div className="note">
              <span className="date">keigo as verbs</span>
              いらっしゃる / 召し上がる / 申す — 尊敬語 and 謙譲語 carried by whole suppletive verbs, where
              Korean reaches for 드시다 / 계시다 / 여쭙다.
            </div>
          </aside>
        </div>
      </section>

      <FormsColophon />
    </div>
  )
}
