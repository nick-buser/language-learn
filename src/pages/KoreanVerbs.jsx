import React from 'react'
import VerbForge from '../components/korean/VerbForge.jsx'
import RegisterDial from '../components/korean/RegisterDial.jsx'
import AnMotSpotlight from '../components/korean/AnMotSpotlight.jsx'

function VerbColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 동사 ⟡</div>
      The Polyglot's Atlas · Korean folio · the verb forge<br />
      drawn in the Aburaya hand · pick · turn · listen — the endings answer back
    </div>
  )
}

export default function KoreanVerbs({ showReadings, showJp }) {
  return (
    <div className="page" data-screen-label="Korean — Verb forge">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">말</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">동사</span>
            The verb forge
          </h1>
          <div className="latin">
            officina verborum · where endings are fitted to stems —
            동사 <span style={{ fontStyle: 'normal' }}>(dongsa)</span> is 動詞 itself
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            pick · turn · listen
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        A Korean verb never appears naked. The dictionary hands you 가다, but the world only ever
        hears 가요, 갑니다, 가셨어요 — a stem wearing a <span className="accent">chain of fitted
        endings</span>, the same agglutination Japanese taught you in 食べさせられました. Two rules
        govern every fitting: the stem’s last <i>vowel</i> picks the connector, and the stem’s last
        <i>consonant</i> — the 받침 door again — picks its shape.
      </p>
      <p className="gram-sub">
        Two machines below, and they are not equals. The forge fits <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>tense to the stem</b> —
        mechanical, learnable in a week. The dial fits <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>the sentence to the room</b> —
        four speech levels where Japanese keeps roughly two, plus an honor infix on its own axis.
        The dial is the one K-drama is made of; it will pay rent for years.
      </p>

      {/* INSTRUMENT I — the forge */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The forge</h2>
        <div className="latin">모음조화 (moeumjohwa) · vowel harmony — the ending listens to the stem</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a verb, pull a tense — watch the joint get fitted
      </div>
      <VerbForge showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT II — the register dial */}
      <div className="instr-head">
        <div className="no">II</div>
        <h2>The register dial</h2>
        <div className="latin">높임 (nopim) · register as grammar, not manners</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> turn the dial — then flip -시- and prove the axes independent
      </div>
      <RegisterDial showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT III — 안 / 못 */}
      <div className="instr-head">
        <div className="no">III</div>
        <h2>안 &amp; 못 — the two no’s</h2>
        <div className="latin">부정 (否定) · will vs. ability</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap each side — the excuse lives in the gap
      </div>
      <AnMotSpotlight showReadings={showReadings} showJp={showJp} />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>Register is the plot</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              Conjugation is arithmetic; register is drama. The forge’s vowel fork and 받침 door
              will be muscle memory in a month. The dial is different — it is the layer subtitles
              systematically flatten, and the reason to learn Korean from Korean rather than from
              translations.
            </p>
            <p>
              When a character shifts from 가요 to 가, the English subtitle says “I’m going” both
              times — and the entire scene has happened somewhere you couldn’t see. Speech level is
              who people are to each other; changing it is an event, an insult, a confession.
              Japanese keigo gave you the conceptual frame (丁寧語 for the listener, 尊敬語 for the
              subject); Korean simply runs that frame hotter, in every exchange, with sharper edges.
            </p>
            <blockquote>
              Hear the ending before you parse the verb. The ending tells you what the scene is;
              the verb only tells you what happens in it.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">the humble half</span>
              드리다 / 뵙다 / 여쭙다 — 謙譲語’s Korean cousins, plus 께 and 께서: the full honorific
              particle set. The other half of the -시- axis.
            </div>
            <div className="note">
              <span className="date">sentence types</span>
              Each level conjugates questions, commands and proposals too — 갑니까 / 가십시오 / 갑시다.
              A full paradigm grid, one level at a time.
            </div>
            <div className="note">
              <span className="date">aspect</span>
              -고 있다 against ている — and -아/어 있다 for states. Where the two languages’ aspect
              systems agree, and the one place they don’t.
            </div>
            <div className="note">
              <span className="date">the irregular drawer</span>
              ㅂ-irregular (춥다 → 추워요), ㅅ-drop, 르-doubling — small families, each a one-evening
              plate.
            </div>
          </aside>
        </div>
      </section>

      <VerbColophon />
    </div>
  )
}
