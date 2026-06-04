/* track4.jsx — Reference Plates (geographia universalis).
   Browse view: grid of plate cards by section.
   Detail view: opens a single plate (e.g. IPA, family tree).
*/

function Track4Reference({ onOpenTerritory }) {
  const [selectedPlate, setSelectedPlate] = React.useState(null);

  if (selectedPlate) {
    return (
      <Track4Detail
        plateId={selectedPlate}
        onBack={() => setSelectedPlate(null)}
        onOpenTerritory={onOpenTerritory}
      />
    );
  }

  const t4 = window.TRACK4;
  return (
    <div className="page" data-screen-label="03 Track IV — Reference Plates">
      <header className="folio-mast">
        <div className="folio-num">IV</div>
        <div className="folio-title-block">
          <h1>Reference plates</h1>
          <div className="latin">{t4.intro.latin}</div>
        </div>
        <div className="stamp-block">
          <div className="stamp">Geographia Universalis</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            19 plates · 13 linked into folios
          </div>
        </div>
      </header>

      <div className="plate-prose" style={{ maxWidth: 880, marginBottom: 56, fontSize: 17.5, lineHeight: 1.65 }}>
        <p className="lead">{t4.intro.blurb}</p>
      </div>

      {t4.sections.map(section => (
        <section className="t4-section" key={section.id} data-screen-label={"Track IV — " + section.title}>
          <div className="t4-section-header">
            <h2>{section.title}</h2>
            <div className="latin">{section.latin}</div>
            <div className="meta">{section.meta}</div>
          </div>
          <div className="t4-grid">
            {section.plates.map(p => (
              <article
                className="t4-card"
                key={p.id}
                onClick={() => setSelectedPlate(p.id)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") setSelectedPlate(p.id); }}
              >
                <div className="plate-no">
                  <span>{p.plateNo}</span>
                  <span>↗ open</span>
                </div>
                <PlateOrnament id={p.id} />
                <h3>{p.title}</h3>
                <div className="latin">{p.latin}</div>
                <div className="gloss">{p.gloss}</div>
                <div className="links">
                  <span className="accent">→</span> {p.links}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <Colophon />
    </div>
  );
}

// — Detail page for an individual plate. Two are fully realised
//   (IPA, IE family tree); the rest get a respectful placeholder.
function Track4Detail({ plateId, onBack, onOpenTerritory }) {
  const t4 = window.TRACK4;
  const plate = t4.sections.flatMap(s => s.plates).find(p => p.id === plateId);
  if (!plate) return null;

  return (
    <div className="page" data-screen-label={"04 Plate detail — " + plate.title}>
      <button className="drawer-close" onClick={onBack} style={{
        position: "static",
        marginBottom: 18,
        padding: 0,
      }}>◀ back to reference plates</button>

      <header className="folio-mast">
        <div className="folio-num" style={{ fontSize: 32 }}>{plate.plateNo}</div>
        <div className="folio-title-block">
          <h1 style={{ fontSize: 44 }}>{plate.title}</h1>
          <div className="latin">{plate.latin}</div>
        </div>
        <div className="stamp-block">
          <div className="stamp">Reference plate</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            {plate.linkedTo.length} folio link{plate.linkedTo.length === 1 ? "" : "s"}
          </div>
        </div>
      </header>

      <div className="plate-prose" style={{ marginBottom: 32, maxWidth: 880 }}>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-soft)", fontStyle: "italic" }}>
          {plate.gloss}
        </p>
      </div>

      {plate.id === "ipa-consonants" && <IPAConsonantsPlate />}
      {plate.id === "ie-tree" && <IETreePlate onOpenTerritory={onOpenTerritory} />}
      {plate.id === "tone" && <TonePlate />}
      {plate.id === "cjk" && <CJKPlate />}
      {!["ipa-consonants", "ie-tree", "tone", "cjk"].includes(plate.id) && (
        <GenericPlate plate={plate} />
      )}

      {/* Links into folios */}
      {plate.linkedTo.length > 0 && (
        <section className="plate" style={{ marginTop: 56 }}>
          <div className="plate-header">
            <div className="plate-no">↳</div>
            <h2>Linked into</h2>
            <div className="latin">these folios reference this plate</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {plate.linkedTo.map(tid => {
              const terr = window.TERRITORIES.find(t => t.id === tid);
              if (!terr) return null;
              return (
                <button
                  key={tid}
                  onClick={() => onOpenTerritory(tid)}
                  style={{
                    background: "var(--plate-bg)",
                    border: "1px solid var(--rule)",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    color: "var(--ink)",
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--paper-deep)";
                    e.currentTarget.style.borderColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--plate-bg)";
                    e.currentTarget.style.borderColor = "var(--rule)";
                  }}
                >
                  <span className="accent" style={{ marginRight: 8 }}>{terr.glyph}</span>
                  {terr.name}
                  <span className="smallcaps" style={{ marginLeft: 10, fontSize: 9 }}>
                    fol. {terr.folioNum}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <Colophon />
    </div>
  );
}

// — IPA pulmonic consonants chart, with per-territory highlighting
function IPAConsonantsPlate() {
  const ipa = window.IPA_CONSONANTS;
  const [highlight, setHighlight] = React.useState("japanese");
  const presentSet = new Set(ipa.presence[highlight] || []);

  return (
    <section className="plate">
      <div className="plate-header">
        <div className="plate-no">·</div>
        <h2>Pulmonic consonants</h2>
        <div className="latin">place × manner · highlighting one folio at a time</div>
      </div>

      <div style={{ marginBottom: 18, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span className="smallcaps">Highlight folio —</span>
        {["japanese", "korean", "mandarin", "spanish", "german", "french"].map(tid => {
          const terr = window.TERRITORIES.find(t => t.id === tid);
          const active = highlight === tid;
          return (
            <button
              key={tid}
              onClick={() => setHighlight(tid)}
              style={{
                background: active ? "var(--accent)" : "transparent",
                color: active ? "var(--paper)" : "var(--ink-soft)",
                border: "1px solid " + (active ? "var(--accent)" : "var(--rule)"),
                padding: "5px 12px",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                transition: "all .15s",
              }}
            >
              {terr.glyph} {terr.name}
            </button>
          );
        })}
      </div>

      <table className="ipa-table">
        <thead>
          <tr>
            <th></th>
            {ipa.places.map(p => <th key={p}>{p}</th>)}
          </tr>
        </thead>
        <tbody>
          {ipa.manners.map(manner => (
            <tr key={manner}>
              <td className="row-label">{manner}</td>
              {ipa.places.map(place => {
                const cell = ipa.cells[manner][place];
                const [vl, vd] = cell;
                const vlOn = vl && presentSet.has(vl);
                const vdOn = vd && presentSet.has(vd);
                const anyOn = vlOn || vdOn;
                return (
                  <td
                    key={place}
                    className={"ipa-cell ipa-pair" + (anyOn ? " highlighted" : "")}
                  >
                    <span style={{ opacity: vlOn ? 1 : (vl ? 0.32 : 0.15) }}>{vl || "·"}</span>
                    <span style={{ opacity: vdOn ? 1 : (vd ? 0.32 : 0.15) }}>{vd || "·"}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 18, fontStyle: "italic", color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.55 }}>
        Each cell holds a voiceless–voiced pair. Phonemes present in the selected territory
        are shown at full ink; those absent fade. The shape of the highlighted set is the
        phonological footprint of the language — a kind of cartographic signature.
      </div>
    </section>
  );
}

// — Indo-European family tree (recursive list)
function IETreePlate({ onOpenTerritory }) {
  return (
    <section className="plate">
      <div className="plate-header">
        <div className="plate-no">·</div>
        <h2>Indo-European family tree</h2>
        <div className="latin">consanguinitates · ancestral kinship of the Romance &amp; Germanic settlements</div>
      </div>
      <div className="fam-tree">
        <Branch node={window.IE_TREE} onOpenTerritory={onOpenTerritory} />
      </div>
      <div style={{ marginTop: 22, fontStyle: "italic", color: "var(--ink-soft)", fontSize: 15.5, maxWidth: 720, lineHeight: 1.55 }}>
        Folios already settled in this family are marked in oxblood. The CJK languages
        (Japanese, Korean, Mandarin) are not on this tree — they are unrelated to
        Indo-European and to each other. Their shared character system is a separate
        plate (IV·b·02, Sinosphere).
      </div>
    </section>
  );
}

function Branch({ node, onOpenTerritory }) {
  if (node.branch) {
    return (
      <ul>
        {(node.name && (
          <li>
            <span className="branch-name">{node.name}</span>
            {node.gloss && <span className="gloss">{node.gloss}</span>}
            {node.children && (
              <Branch node={{ children: node.children }} onOpenTerritory={onOpenTerritory} />
            )}
          </li>
        )) || null}
      </ul>
    );
  }
  if (node.children) {
    return (
      <ul>
        {node.children.map((child, i) => (
          <BranchItem key={i} node={child} onOpenTerritory={onOpenTerritory} />
        ))}
      </ul>
    );
  }
  return null;
}

function BranchItem({ node, onOpenTerritory }) {
  if (node.branch) {
    return (
      <li>
        <span className="branch-name">{node.name}</span>
        {node.gloss && <span className="gloss">{node.gloss}</span>}
        {node.children && (
          <ul>
            {node.children.map((child, i) => (
              <BranchItem key={i} node={child} onOpenTerritory={onOpenTerritory} />
            ))}
          </ul>
        )}
      </li>
    );
  }
  // Leaf
  const territoryMatch = node.studied
    ? window.TERRITORIES.find(t => t.name === node.name)
    : null;
  return (
    <li>
      {territoryMatch ? (
        <span
          className="lang studied"
          style={{ cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
          onClick={() => onOpenTerritory(territoryMatch.id)}
        >
          {node.name}
        </span>
      ) : (
        <span className="lang">{node.name}</span>
      )}
      {node.gloss && <span className="gloss">{node.gloss}</span>}
    </li>
  );
}

// — Tone systems plate
function TonePlate() {
  return (
    <section className="plate">
      <div className="plate-header">
        <div className="plate-no">·</div>
        <h2>Tone, pitch accent, intonation</h2>
        <div className="latin">three different things, often confused</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
        <ToneCard
          name="Mandarin — lexical tone"
          subtitle="four contours + neutral"
          glyphs={["mā", "má", "mǎ", "mà"]}
          glossLines={["mother", "hemp", "horse", "scold"]}
          note="Tone is contrastive at the syllable. 1 high-level, 2 rising, 3 dipping, 4 falling. The 3rd tone reduces before another 3rd — sandhi. Linked from Mandarin Plate II."
        />
        <ToneCard
          name="Japanese — pitch accent"
          subtitle="binary high/low per mora"
          glyphs={["はし↘", "は↗し", "は↗し↘"]}
          glossLines={["chopsticks (Tokyo)", "bridge", "edge"]}
          note="Not tone in the Mandarin sense. Each word carries a pitch contour at the mora level. Regional accents (Kansai) invert standard patterns. Linked from Japanese Plate II — Speaking & Listening."
        />
        <ToneCard
          name="Korean — intonation"
          subtitle="no lexical tone (mostly)"
          glyphs={["~?", "~.", "~!"]}
          glossLines={["question rise", "declarative fall", "emphatic"]}
          note="Standard Korean has no lexical tone; tense vs aspirated vs plain consonants encode the contrasts other languages encode in tone. Note: South Gyeongsang dialect (Busan) is tonal — a curiosity rather than the default."
        />
      </div>
    </section>
  );
}

function ToneCard({ name, subtitle, glyphs, glossLines, note }) {
  return (
    <div style={{
      background: "var(--plate-bg)",
      border: "1px solid var(--rule)",
      padding: "20px 22px 22px",
    }}>
      <div className="smallcaps" style={{ marginBottom: 4 }}>{subtitle}</div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>{name}</h3>
      <div style={{ marginBottom: 14 }}>
        {glyphs.map((g, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px dotted var(--rule-soft)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 21, color: "var(--accent)" }}>{g}</span>
            <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--ink-soft)", fontSize: 15 }}>{glossLines[i]}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--ink-soft)", fontStyle: "italic" }}>
        {note}
      </div>
    </div>
  );
}

// — CJK shared infrastructure
function CJKPlate() {
  const examples = [
    { hanzi: "学校", j: "がっこう · gakkō", k: "학교 · hakgyo", m: "xuéxiào", gloss: "school" },
    { hanzi: "図書館 / 圖書館", j: "としょかん · toshokan", k: "도서관 · doseogwan", m: "túshūguǎn", gloss: "library" },
    { hanzi: "可能", j: "かのう · kanō", k: "가능 · ganeung", m: "kěnéng", gloss: "possible" },
    { hanzi: "電話", j: "でんわ · denwa", k: "전화 · jeonhwa", m: "diànhuà", gloss: "telephone" },
    { hanzi: "新聞", j: "しんぶん · shinbun", k: "신문 · sinmun", m: "xīnwén", gloss: "newspaper / news" },
  ];

  return (
    <section className="plate">
      <div className="plate-header">
        <div className="plate-no">·</div>
        <h2>The Sinosphere — shared infrastructure</h2>
        <div className="latin">not kinship · neighboring territories sharing a script</div>
      </div>
      <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 24, maxWidth: 820, color: "var(--ink)" }}>
        Japanese, Korean, and Mandarin are <em>not</em> related languages by any
        family-tree measure. They share, instead, a road system: the Chinese character
        set, brought into Japanese as kanji, lingering in Korean as the Sino-Korean
        vocabulary stratum (≈60% of formal Korean), still the writing system of
        Mandarin. Drivers in each territory pronounce the signs differently. A
        single character has three local readings.
      </div>

      <table className="ipa-table" style={{ marginTop: 14 }}>
        <thead>
          <tr>
            <th>Character</th>
            <th>日 Japanese · on-yomi</th>
            <th>한 Korean · Sino reading</th>
            <th>中 Mandarin · pinyin</th>
            <th>English</th>
          </tr>
        </thead>
        <tbody>
          {examples.map((ex, i) => (
            <tr key={i}>
              <td className="ipa-cell" style={{ fontSize: 22 }}>{ex.hanzi}</td>
              <td style={{ fontSize: 15, fontFamily: "var(--font-body)" }}>{ex.j}</td>
              <td style={{ fontSize: 15, fontFamily: "var(--font-body)" }}>{ex.k}</td>
              <td style={{ fontSize: 15, fontFamily: "var(--font-body)" }}>{ex.m}</td>
              <td style={{ fontStyle: "italic", color: "var(--ink-soft)", fontSize: 15 }}>{ex.gloss}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 22, fontStyle: "italic", color: "var(--ink-soft)", fontSize: 15.5, maxWidth: 820, lineHeight: 1.55 }}>
        For a settler in any one of these territories, partial competence in the
        infrastructure transfers — but the local pronunciation, grammar, and idiom must
        be acquired separately. The metaphor predicts both the synergy and the pitfalls:
        same sign, different local pronunciation, different local idiom, occasionally
        different meaning.
      </div>
    </section>
  );
}

// — Generic plate (for plates not fully realised in v1)
function GenericPlate({ plate }) {
  return (
    <section className="plate">
      <div className="plate-header">
        <div className="plate-no">·</div>
        <h2>Plate contents</h2>
        <div className="latin">in preparation</div>
      </div>
      <div style={{
        background: "var(--plate-bg)",
        border: "1px dashed var(--rule)",
        padding: "60px 40px",
        textAlign: "center",
      }}>
        <div className="smallcaps" style={{ color: "var(--accent)", marginBottom: 12 }}>plate in preparation</div>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, color: "var(--ink-soft)", marginBottom: 14 }}>
          The contents of this plate are not yet drawn in the atlas.
        </div>
        <div style={{ fontSize: 15.5, lineHeight: 1.55, color: "var(--ink-soft)", maxWidth: 520, margin: "0 auto" }}>
          Its identity, latin name, and the folios it would link into are committed.
          What goes inside — the table, the diagram, the prose — is a separate
          drawing session.
        </div>
      </div>
    </section>
  );
}

// — Small ornament per plate type, drawn top-right of card
function PlateOrnament({ id }) {
  // Stable, lightly cartographic glyphs. Drawn as simple SVG primitives.
  if (id === "ipa-consonants" || id === "ipa-vowels") {
    return (
      <svg className="ornament-svg" viewBox="0 0 38 38" stroke="currentColor" fill="none" strokeWidth="1">
        <circle cx="19" cy="19" r="14" />
        <line x1="5" y1="19" x2="33" y2="19" />
        <line x1="19" y1="5" x2="19" y2="33" />
        <circle cx="19" cy="19" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (id === "tone" || id === "sandhi") {
    return (
      <svg className="ornament-svg" viewBox="0 0 38 38" stroke="currentColor" fill="none" strokeWidth="1.2">
        <polyline points="4,28 12,8 20,16 28,4 34,22" />
      </svg>
    );
  }
  if (id === "ie-tree" || id === "cjk") {
    return (
      <svg className="ornament-svg" viewBox="0 0 38 38" stroke="currentColor" fill="none" strokeWidth="1">
        <line x1="19" y1="4" x2="19" y2="14" />
        <line x1="19" y1="14" x2="8" y2="22" />
        <line x1="19" y1="14" x2="30" y2="22" />
        <line x1="8" y1="22" x2="4" y2="32" />
        <line x1="8" y1="22" x2="12" y2="32" />
        <line x1="30" y1="22" x2="26" y2="32" />
        <line x1="30" y1="22" x2="34" y2="32" />
      </svg>
    );
  }
  if (id === "sprachbund" || id === "sound-change") {
    return (
      <svg className="ornament-svg" viewBox="0 0 38 38" stroke="currentColor" fill="none" strokeWidth="1">
        <path d="M4 24 Q12 12 19 18 T34 14" />
        <path d="M4 30 Q12 18 19 24 T34 20" />
      </svg>
    );
  }
  // word-order / aspect / honorifics
  return (
    <svg className="ornament-svg" viewBox="0 0 38 38" stroke="currentColor" fill="none" strokeWidth="1">
      <rect x="4" y="14" width="9" height="10" />
      <rect x="14.5" y="14" width="9" height="10" />
      <rect x="25" y="14" width="9" height="10" />
    </svg>
  );
}

window.Track4Reference = Track4Reference;
