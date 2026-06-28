import React from 'react'
import TeForm from '../components/japanese/TeForm.jsx'

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

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>Two more joints to come</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              The te-form is the first of three constructions that reward being shown rather than listed.
              It’s the one a learner uses a hundred times a day and still mis-builds, because its meaning
              lives in what you bolt onto it — and because the 音便 makes its shape unpredictable until the
              rule is felt.
            </p>
            <p>
              The conditional is next: Japanese spends <em>four</em> words on “if” — ば, たら, と, なら —
              each owning a situation the others can’t enter, where English makes do with one. And then the
              volitional and imperative — 食べよう, 食べましょう, 食べろ — the grammar of proposing and
              commanding, which is where register suddenly matters most.
            </p>
            <blockquote>
              The regular forms you can drill; these you have to <em>understand</em>. One point each, made
              plainly, and they stop being the wall.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">the conditional</span>
              ば / たら / と / なら — four “if”s, each failing in its own situation, against Korean’s
              -(으)면 and -거든. Joining this folio next.
            </div>
            <div className="note">
              <span className="date">volitional &amp; imperative</span>
              よう / ましょう (let’s) and 食べろ / しなさい / な (do it) — the urging forms, faced with Korean’s
              -자 / -(으)ㅂ시다 and -아라 / -(으)세요.
            </div>
            <div className="note">
              <span className="date">the Korean mirror</span>
              this whole folio mirrors onto a Korean <b>활용</b> plate — the connective -아서 / -고, the
              conditional, the urging forms — the constructions Korean’s verb folio doesn’t yet host.
            </div>
          </aside>
        </div>
      </section>

      <FormsColophon />
    </div>
  )
}
