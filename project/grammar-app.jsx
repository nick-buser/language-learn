/* grammar-app.jsx — the page shell for the Japanese grammar plate.
   Aburaya night is home. Reuses the atlas vocabulary (binding, folio
   masthead, plates, marginalia, colophon) around three instruments.
*/

function HagaSpotlight() {
  const sp = window.HAGA_SPOTLIGHT;
  const [side, setSide] = React.useState("wa");

  const Half = ({ id, data }) => (
    <div
      className={"spot-half" + (side === id ? " active" : "")}
      onClick={() => setSide(id)}
      role="button"
      aria-pressed={side === id}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSide(id); } }}
    >
      <div className="spot-particle">{data.particle}</div>
      <div className="spot-name">{data.name}</div>
      <div className="spot-sentence" dangerouslySetInnerHTML={{ __html: data.sentenceHtml }} />
      <div className="spot-q">{data.question}</div>
      <div className="spot-en" dangerouslySetInnerHTML={{ __html: data.enHtml }} />
    </div>
  );

  return (
    <div data-screen-label="は/が spotlight">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The same four words, one particle apart. Tap each side — the difference is not
        meaning, it is <i>what the sentence is doing</i>.
      </div>
      <div className="spot-stage">
        <Half id="wa" data={sp.wa} />
        <Half id="ga" data={sp.ga} />
      </div>
      <div className="spot-rule" dangerouslySetInnerHTML={{ __html: sp.rule }} />

      <div className="double-subject">
        <div className="ds-jp" dangerouslySetInnerHTML={{ __html: sp.doubleSubject.jpHtml }} />
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-faded)", letterSpacing: "0.06em", margin: "6px 0 2px" }}>
          {sp.doubleSubject.reading}
        </div>
        <div className="ds-note" dangerouslySetInnerHTML={{ __html: sp.doubleSubject.noteHtml }} />
      </div>
    </div>
  );
}

function GrammarColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 文法 ⟡</div>
      The Polyglot's Atlas · Japanese folio · the grammar engine<br />
      drawn in the Aburaya hand · drag · turn · tap — the grammar answers back
    </div>
  );
}

function GrammarPage() {
  const [showReadings, setShowReadings] = React.useState(true);

  return (
    <div className="atlas-shell">
      {/* Binding — links back to the atlas */}
      <div className="binding">
        <div className="binding-inner">
          <a className="binding-title" href="The Polyglot's Atlas - Aburaya.html" style={{ textDecoration: "none" }}>
            The Polyglot's<span className="amp">&amp;</span>Atlas
          </a>
          <nav className="binding-nav" aria-label="Primary">
            <a href="The Polyglot's Atlas - Aburaya.html" style={{ color: "inherit", textDecoration: "none" }}>
              <button>Atlas</button>
            </a>
            <span className="sep">·</span>
            <button className="active">Grammar</button>
          </nav>
          <div className="binding-meta" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 18 }}>
            <span
              className={"mini-toggle" + (showReadings ? " on" : "")}
              style={{ cursor: "pointer" }}
              onClick={() => setShowReadings(v => !v)}
              role="switch"
              aria-checked={showReadings}
            >
              <span className="box"></span>
              readings
            </span>
            <span style={{ fontFamily: "var(--font-cjk-serif)" }}>文法</span>
          </div>
        </div>
      </div>

      <main className="atlas-content">
        <div className="page" data-screen-label="Japanese — Grammar engine">

          {/* Masthead */}
          <header className="folio-mast">
            <div className="folio-num">文</div>
            <div className="folio-title-block">
              <h1>
                <span className="glyph">文法</span>
                The grammar engine
              </h1>
              <div className="latin">machina grammatica · how a Japanese sentence holds together</div>
            </div>
            <div className="stamp-block">
              <div className="stamp double">Working Instrument</div>
              <div className="smallcaps" style={{ marginTop: 10 }}>
                drag · turn · tap
              </div>
            </div>
          </header>

          {/* Lede */}
          <p className="gram-lede">
            Japanese grammar is the part of this language that is already <span className="accent">done</span> —
            built deep enough to parse complex prose once the vocabulary is known. This plate is not a
            grammar to <i>learn</i>; it is one to <i>play with</i>, until three patterns stop being rules
            and start being obvious.
          </p>
          <p className="gram-sub">
            The whole of it rests on one move that English never makes: a Japanese sentence marks each
            phrase with a <b style={{ fontStyle: "normal", color: "var(--accent)", fontWeight: 500 }}>particle</b> —
            a tiny role-tag — so word order is freed to do other work, and the verb is left to close the sentence.
          </p>

          {/* INSTRUMENT I — the loom */}
          <div className="instr-head">
            <div className="no">I</div>
            <h2>The loom</h2>
            <div className="latin">助詞 · roles, not order</div>
          </div>
          <div className="try-strip">
            <span className="dot"></span> grab a tile and move it — watch the meaning stay put
          </div>
          <LoomInstrument showReadings={showReadings} />

          {/* INSTRUMENT II — the dial */}
          <div className="instr-head">
            <div className="no">II</div>
            <h2>The verb dial</h2>
            <div className="latin">態 · the same 私, four roles</div>
          </div>
          <p className="gram-sub" style={{ marginBottom: 0 }}>
            The causative-passive — 〜させられる — is the form that tangles fluent speakers mid-sentence.
            It untangles the moment you stop translating and watch where <b style={{ fontStyle: "normal", color: "var(--accent)", fontWeight: 500 }}>私</b> stands.
          </p>
          <div className="try-strip">
            <span className="dot"></span> turn the dial left to right — follow 私
          </div>
          <VerbDial />

          {/* INSTRUMENT III — は / が */}
          <div className="instr-head">
            <div className="no">III</div>
            <h2>は &amp; が — the spotlight</h2>
            <div className="latin">主題と主語 · topic vs. selection</div>
          </div>
          <div className="try-strip">
            <span className="dot"></span> tap each side — one particle apart
          </div>
          <HagaSpotlight />

          {/* Closing marginalia, atlas voice */}
          <section className="plate" style={{ marginTop: 64 }}>
            <div className="plate-header">
              <div className="plate-no">coda</div>
              <h2>What the instruments are really showing</h2>
              <div className="latin">nota in margine · the field note</div>
            </div>
            <div className="plate-two">
              <div className="plate-prose">
                <p className="lead">
                  Three toys, one idea. Japanese hands meaning to <em>particles</em>, and in return it
                  gives away the things English clings to — fixed word order, and an early verb.
                </p>
                <p>
                  Once that trade is felt rather than memorised, the rest of the grammar reads as
                  consequence. Free order is why a writer can hold a subject in suspense for a whole
                  paragraph. Head-final is why a Japanese sentence can keep you waiting — and why the
                  last syllable can overturn everything before it. And は against が is simply the
                  question of whether you are naming the topic or choosing the one.
                </p>
                <blockquote>
                  Grammar stops being the wall and becomes the floor — the thing you stand on to reach
                  the vocabulary above it.
                </blockquote>
              </div>
              <aside className="marginalia">
                <h4>For the next plate</h4>
                <div className="note">
                  <span className="date">conditionals</span>
                  ば / たら / と / なら — four ways to say “if,” each failing in its own situation. A loom
                  of its own.
                </div>
                <div className="note">
                  <span className="date">aspect</span>
                  ている / てある / ておく / てしまう — what an action <i>leaves behind</i>. Best shown as a
                  single sentence morphing through each.
                </div>
                <div className="note">
                  <span className="date">keigo</span>
                  尊敬語 / 謙譲語 / 丁寧語 — register as grammar, not vocabulary. A dial that raises and
                  lowers the whole sentence by social distance.
                </div>
              </aside>
            </div>
          </section>

          <GrammarColophon />
        </div>
      </main>
    </div>
  );
}

const grammarRoot = ReactDOM.createRoot(document.getElementById("root"));
grammarRoot.render(<GrammarPage />);
