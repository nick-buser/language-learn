/* folio.jsx — Japanese folio (full).
   Plates: I Aim & Bottleneck · II Modalities (spider) · III Phases · IV Bibliography.
*/

function JapaneseFolio({ onOpenModality, onBack }) {
  const f = window.JAPANESE_FOLIO;

  return (
    <div className="page" data-screen-label="02 Japanese Folio">
      {/* Folio masthead */}
      <header className="folio-mast">
        <div className="folio-num">III</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph">日本語</span>
            Japanese
          </h1>
          <div className="latin">Nihongo · the language of the sun's origin</div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Established Residence</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            in residence ~10 years · N3 → N2
          </div>
        </div>
      </header>

      {/* PLATE I — Aim & Bottleneck */}
      <section className="plate" data-screen-label="Japanese — Plate I">
        <div className="plate-header">
          <div className="plate-no">Plate I</div>
          <h2>Aim &amp; bottleneck</h2>
          <div className="latin">propositum et impedimentum</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead"><strong>Aim.</strong> {f.aim}</p>
            <p>
              <strong>The bottleneck, said plainly.</strong> {f.bottleneck.text}
            </p>
            <blockquote>
              Past the wall most people quit at. The compounding from here is favourable —
              but the remaining work is discipline, not insight.
            </blockquote>
            <p style={{ marginTop: 18 }}>
              <span className="smallcaps">What is being carried in —</span>
            </p>
            <ul style={{ paddingLeft: 20, margin: "8px 0 0" }}>
              {f.carryings.map((c, i) => (
                <li key={i} style={{ marginBottom: 6, lineHeight: 1.5 }}>{c}</li>
              ))}
            </ul>
          </div>
          <aside className="marginalia">
            <h4>Field notes</h4>
            <div className="note">
              <span className="date">20 May 2026</span>
              The shift from "reading a chapter is a session" to "reading a chapter is what
              I do before bed" happened this spring without my noticing.
            </div>
            <div className="note">
              <span className="date">12 May 2026</span>
              The first time Asano's internal monologue read at speed — three panels at
              once, no reach for Yomitan — was last week. A real event.
            </div>
            <div className="note">
              <span className="date">deferred</span>
              Bungo (pre-1900 prose), pencil-and-paper kanji writing, JLPT for its own sake.
              See Plate IV for the explicit skip list.
            </div>
          </aside>
        </div>
      </section>

      {/* PLATE II — Modalities */}
      <section className="plate" data-screen-label="Japanese — Plate II Modalities">
        <div className="plate-header">
          <div className="plate-no">Plate II</div>
          <h2>Modalities of inhabitation</h2>
          <div className="latin">modi habitandi · listening, speaking, reading, writing, script</div>
        </div>
        <div className="spider-wrap">
          <ModalitySpider
            modalities={f.modalities}
            activeId={null}
            onSelect={onOpenModality}
          />
          <div className="spider-legend">
            <div style={{ marginBottom: 14, color: "var(--ink)", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, textTransform: "none", letterSpacing: 0 }}>
              Five qualitative bands. Open any axis for the field notes attached to that modality.
            </div>
            {window.SPIDER_BANDS.map((b, i) => (
              <div className="legend-row" key={b}>
                <span className="lvl">{i + 1}</span>
                <span className="name">{b}</span>
              </div>
            ))}
            <div style={{ marginTop: 22, color: "var(--ink-faded)", fontStyle: "italic", fontFamily: "var(--font-display)", fontSize: 14, textTransform: "none", letterSpacing: 0, lineHeight: 1.5 }}>
              The shape — not the area — is what matters. A "spoken-strong,
              written-weak" silhouette is read at a glance.
            </div>
          </div>
        </div>

        {/* Quick read of each axis below the chart */}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
          {f.modalities.map(m => (
            <div
              key={m.id}
              onClick={() => onOpenModality(m.id)}
              style={{
                cursor: "pointer",
                padding: "14px 14px 16px",
                borderTop: "1px solid var(--ink)",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(122, 42, 24, 0.05)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div className="smallcaps" style={{ marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: "var(--accent)", marginBottom: 8 }}>
                {m.band}
              </div>
              <div style={{ fontSize: 14.5, lineHeight: 1.45, color: "var(--ink-soft)" }}>
                {m.shortNote}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLATE III — Phase signposts */}
      <section className="plate" data-screen-label="Japanese — Plate III Phases">
        <div className="plate-header">
          <div className="plate-no">Plate III</div>
          <h2>Phase ladder &amp; signposts</h2>
          <div className="latin">gradus inhabitationis · the arc, in four phases</div>
        </div>
        <div className="plate-two">
          <div>
            <ul className="signposts">
              {f.phases.map((p, i) => (
                <li key={i} className={p.state === "current" ? "current-row" : ""}>
                  <div className={"at " + (p.state || "")}>
                    <span className="strong">{p.strong}</span>
                    {p.at}
                  </div>
                  <div className="text">
                    {p.text}
                    {p.state === "current" && (
                      <span className="meta">↳ currently in phase</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <aside className="marginalia">
            <h4>Skipped, intentionally</h4>
            {f.skipping.map((s, i) => (
              <div className="note" key={i}>
                <span style={{ color: "var(--accent)", marginRight: 6, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase" }}>skip</span>
                {s}
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* PLATE IV — Bibliography & tools */}
      <section className="plate" data-screen-label="Japanese — Plate IV Bibliography">
        <div className="plate-header">
          <div className="plate-no">Plate IV</div>
          <h2>Annotated bibliography</h2>
          <div className="latin">elenchus librorum · what is currently in use</div>
        </div>
        <div className="bibliography">
          <div className="biblio-col">
            <h4>Reading — primary sources</h4>
            {f.bibliography.reading.map((r, i) => (
              <div className="biblio-entry" key={i}>
                <div className="title">{r.title}</div>
                <div className="meta">{r.meta}</div>
                <div className="gloss">{r.gloss}</div>
              </div>
            ))}
          </div>
          <div className="biblio-col">
            <h4>Tools &amp; structured practice</h4>
            {f.bibliography.tools.map((r, i) => (
              <div className="biblio-entry" key={i}>
                <div className="title">{r.title}</div>
                <div className="meta">{r.meta}</div>
                <div className="gloss">{r.gloss}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-folio links (placeholder note) */}
      <section className="plate" data-screen-label="Japanese — see also">
        <div className="plate-header">
          <div className="plate-no">See also</div>
          <h2>Reference plates linked into this folio</h2>
          <div className="latin">plagulae geographiae · the substrate beneath</div>
        </div>
        <div className="plate-prose" style={{ fontFamily: "var(--font-body)" }}>
          <p style={{ fontStyle: "italic", color: "var(--ink-soft)" }}>
            Six reference plates from Track IV are currently linked into this folio.
            Open any one to see the underlying linguistic substrate.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 28px", marginTop: 14 }}>
            {[
              { no: "IV·a·01", title: "IPA — pulmonic consonants" },
              { no: "IV·a·02", title: "IPA — vowel quadrilateral" },
              { no: "IV·a·03", title: "Tone systems · pitch accent" },
              { no: "IV·b·02", title: "Sinosphere — shared infrastructure" },
              { no: "IV·b·04", title: "Sound change — rendaku" },
              { no: "IV·c·01", title: "Word order — SOV, head-final" },
            ].map((r, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: "1px dotted var(--rule-soft)" }}>
                <span className="smallcaps" style={{ marginRight: 10, color: "var(--accent)" }}>{r.no}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 17 }}>{r.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Colophon />
    </div>
  );
}

window.JapaneseFolio = JapaneseFolio;
