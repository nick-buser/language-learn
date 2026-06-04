/* home.jsx — Atlas Home page.
   Three columns: Index of folios · Recent encounters · Marginalia
*/

function AtlasHome({ onOpenTerritory, onOpenTrack4 }) {
  const tracksById = Object.fromEntries(window.TRACKS.map(t => [t.id, t]));
  const territoriesByTrack = window.TRACKS.reduce((acc, t) => {
    acc[t.id] = window.TERRITORIES.filter(x => x.track === t.id);
    return acc;
  }, {});

  return (
    <div className="page" data-screen-label="01 Atlas Home — Currently in Residence">
      <header className="folio-mast">
        <div className="folio-num">·</div>
        <div className="folio-title-block">
          <h1>Currently in residence</h1>
          <div className="latin">quod nunc colitur · what one is presently tending</div>
        </div>
        <div className="stamp-block">
          <div className="stamp">Vol. I · Edition 14</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>20 May 2026</div>
        </div>
      </header>

      <div className="codex">
        {/* LEFT — Index of folios */}
        <aside className="column-rule" aria-label="Index of folios">
          <IndexOfFolios
            territoriesByTrack={territoriesByTrack}
            tracksById={tracksById}
            onOpen={onOpenTerritory}
            onOpenTrack4={onOpenTrack4}
          />
        </aside>

        {/* CENTER — Recent encounters */}
        <section>
          <RecentEncounters onOpen={onOpenTerritory} />
        </section>

        {/* RIGHT — Marginalia + standing notes */}
        <aside className="column-rule-l">
          <StandingNotes />
          <Marginalia />
        </aside>
      </div>

      <Colophon />
    </div>
  );
}

function IndexOfFolios({ territoriesByTrack, tracksById, onOpen, onOpenTrack4 }) {
  const tracks = ["settlement", "travel", "cartography", "geography"];
  return (
    <>
      {tracks.map(trackId => {
        const t = tracksById[trackId];
        const territories = territoriesByTrack[trackId] || [];
        return (
          <div className="index-block" key={trackId}>
            <h3>
              <span>Track {t.roman} · {t.name}</span>
              <span className="track-roman">{territories.length || (trackId === "geography" ? "—" : "—")}</span>
            </h3>
            {trackId === "geography" ? (
              <div
                className="index-row"
                onClick={onOpenTrack4}
              >
                <div className="row-top">
                  <div className="name">Reference plates <span className="latin">geographia universalis</span></div>
                  <div className="folio-page">IV</div>
                </div>
                <div className="status-pill">19 plates · cross-folio</div>
              </div>
            ) : trackId === "cartography" ? (
              <div className="faded" style={{ fontSize: 14, padding: "8px 0", fontStyle: "italic" }}>
                no folios yet · queue: Vietnamese, Quechua, Tagalog
              </div>
            ) : territories.map(terr => (
              <div
                key={terr.id}
                className={"index-row" + (terr.id === "japanese" ? " is-current" : "")}
                onClick={() => onOpen(terr.id)}
              >
                <div className="row-top">
                  <div className="name">
                    <span className="glyph">{terr.glyph}</span>
                    {terr.name}
                    <span className="latin">{terr.latin}</span>
                  </div>
                  <div className="folio-page">fol. {terr.folioNum}</div>
                </div>
                <div className={"status-pill " + terr.status}>
                  {terr.statusLabel}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

function RecentEncounters({ onOpen }) {
  const enc = window.ENCOUNTERS;
  // group consecutive same-day entries — show day on first only
  return (
    <>
      <header className="encounter-mast">
        <h2>Recent encounters</h2>
        <div className="subtitle">
          <span>activity across all folios, newest first</span>
          <span className="smallcaps">· 10 entries this week</span>
        </div>
      </header>

      {enc.map((e, i) => {
        const prev = enc[i - 1];
        const showDay = !prev || prev.day !== e.day;
        return (
          <React.Fragment key={e.id}>
            {showDay && i > 0 && (
              <div className="encounter-day-rule">
                {e.dayLatin || `${e.day} May`}
              </div>
            )}
            <article
              className="encounter"
              onClick={() => e.territory !== "geography" && onOpen(e.territory)}
            >
              <div className="when">
                {showDay && (
                  <>
                    <span className="day">{e.day}</span>
                    {e.dayLatin || `${monthShort(e.monthYear)}`}
                  </>
                )}
              </div>
              <div className="body">
                <h3>
                  <span className="glyph">{e.glyph}</span>
                  {e.title}
                </h3>
                <div className="source">{e.source}</div>
                <div className="gloss">{e.gloss}</div>
              </div>
              <div className="tags">
                <span>{e.kind}</span>
                <span className="modality">{e.modality}</span>
                <span>fol. {territoryFolio(e.territory)}</span>
              </div>
            </article>
          </React.Fragment>
        );
      })}
    </>
  );
}

function monthShort(s) {
  if (!s) return "";
  return s.split(" ")[0].slice(0, 3);
}

function territoryFolio(id) {
  const map = {
    japanese: "III", korean: "V", mandarin: "VII",
    german: "XI", spanish: "XIV", french: "XVI",
    italian: "XIX", thai: "XX", geography: "IV",
  };
  return map[id] || "—";
}

function StandingNotes() {
  return (
    <>
      {window.STANDING_NOTES.map((block, i) => (
        <div className="marginalia" key={i} style={{ marginBottom: 28 }}>
          <h4>{block.label}</h4>
          {block.items.map((it, j) => (
            <div className="note" key={j} style={{ fontStyle: "normal" }}>
              <span className="accent" style={{ marginRight: 8, fontFamily: "var(--font-display)" }}>{it.glyph}</span>
              {it.text}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function Marginalia() {
  return (
    <div className="marginalia">
      <h4>Editor's marginalia</h4>
      {window.MARGINALIA.map((m, i) => (
        <div className="note" key={i}>
          <span className="date">{m.date}</span>
          {m.text}
        </div>
      ))}
    </div>
  );
}

function Colophon() {
  return (
    <footer className="colophon">
      <div className="ornament">·  ※  ·</div>
      The Polyglot's Atlas · a personal edition · stewarded since 2016
    </footer>
  );
}

window.AtlasHome = AtlasHome;
window.territoryFolio = territoryFolio;
