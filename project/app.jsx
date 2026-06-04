/* app.jsx — Shell, routing, tweaks integration */

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "edition": "antiquarian",
  "showOrnaments": true,
  "paperGrain": true,
  "density": "comfortable"
}/*EDITMODE-END*/;

const EDITIONS = {
  "antiquarian": { dataAttr: "", label: "Antiquarian", subtitle: "cream + oxblood" },
  "field":       { dataAttr: "field", label: "Field Notebook", subtitle: "kraft + navy" },
  "minimal":     { dataAttr: "minimal", label: "Codex Minimal", subtitle: "bone + sage" },
};

function App() {
  const [route, setRoute] = React.useState({ name: "home" });
  const [drawerModalityId, setDrawerModalityId] = React.useState(null);
  const [t, setTweak] = useTweaks(DEFAULT_TWEAKS);

  // Apply edition globally
  React.useEffect(() => {
    const ed = EDITIONS[t.edition] || EDITIONS.antiquarian;
    if (ed.dataAttr) {
      document.documentElement.setAttribute("data-edition", ed.dataAttr);
    } else {
      document.documentElement.removeAttribute("data-edition");
    }
  }, [t.edition]);

  // Paper grain toggle
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--grain-opacity", t.paperGrain ? "0.45" : "0"
    );
  }, [t.paperGrain]);

  // Navigation helpers
  const navHome = () => { setRoute({ name: "home" }); setDrawerModalityId(null); window.scrollTo({ top: 0 }); };
  const navTrack4 = () => { setRoute({ name: "track4" }); setDrawerModalityId(null); window.scrollTo({ top: 0 }); };
  const navTerritory = (id) => {
    if (id === "japanese") {
      setRoute({ name: "japanese" });
    } else {
      setRoute({ name: "territory-placeholder", territoryId: id });
    }
    setDrawerModalityId(null);
    window.scrollTo({ top: 0 });
  };
  const openModality = (modId) => setDrawerModalityId(modId);
  const closeDrawer = () => setDrawerModalityId(null);

  const activeModality = drawerModalityId
    ? window.JAPANESE_FOLIO.modalities.find(m => m.id === drawerModalityId)
    : null;

  return (
    <div className="atlas-shell">
      <Binding route={route} onHome={navHome} onTrack4={navTrack4} onJapanese={() => navTerritory("japanese")} />

      <main className="atlas-content">
        {route.name === "home" && (
          <AtlasHome
            onOpenTerritory={navTerritory}
            onOpenTrack4={navTrack4}
          />
        )}
        {route.name === "japanese" && (
          <JapaneseFolio
            onOpenModality={openModality}
            onBack={navHome}
          />
        )}
        {route.name === "track4" && (
          <Track4Reference onOpenTerritory={navTerritory} />
        )}
        {route.name === "territory-placeholder" && (
          <TerritoryPlaceholder
            territoryId={route.territoryId}
            onBack={navHome}
          />
        )}
      </main>

      <ModalityDrawer
        open={drawerModalityId !== null}
        modality={activeModality}
        onClose={closeDrawer}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Edition">
          <div style={{ display: "grid", gap: 8, padding: "6px 0 10px" }}>
            {Object.entries(EDITIONS).map(([key, ed]) => (
              <button
                key={key}
                onClick={() => setTweak("edition", key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: t.edition === key ? "rgba(255,255,255,0.08)" : "transparent",
                  border: "1px solid " + (t.edition === key ? "#c8a64a" : "rgba(255,255,255,0.12)"),
                  padding: "8px 10px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  fontSize: 12,
                  color: "inherit",
                  transition: "all .15s",
                }}
              >
                <EditionSwatch edition={key} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{ed.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.6 }}>{ed.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </TweakSection>

        <TweakSection label="Texture">
          <TweakToggle
            label="Paper grain"
            value={t.paperGrain}
            onChange={(v) => setTweak("paperGrain", v)}
          />
          <TweakToggle
            label="Cartographic ornaments"
            value={t.showOrnaments}
            onChange={(v) => setTweak("showOrnaments", v)}
          />
        </TweakSection>

        <TweakSection label="Quick nav">
          <TweakButton label="Atlas home" onClick={navHome} />
          <TweakButton label="Japanese folio" onClick={() => navTerritory("japanese")} />
          <TweakButton label="Track IV — Reference plates" onClick={navTrack4} />
          <TweakButton
            label="Open Reading modality"
            onClick={() => { navTerritory("japanese"); setTimeout(() => openModality("reading"), 50); }}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function EditionSwatch({ edition }) {
  const swatches = {
    antiquarian: ["#ede1c4", "#7a2a18", "#2a1f17"],
    field:       ["#d8c8a5", "#8e2410", "#1a2030"],
    minimal:     ["#f5f1e8", "#4a5e3a", "#1c1c1a"],
  };
  const colors = swatches[edition] || swatches.antiquarian;
  return (
    <div style={{ display: "flex", gap: 0, border: "1px solid rgba(0,0,0,0.15)" }}>
      {colors.map((c, i) => (
        <div key={i} style={{ width: 16, height: 28, background: c }}></div>
      ))}
    </div>
  );
}

function Binding({ route, onHome, onTrack4, onJapanese }) {
  return (
    <div className="binding">
      <div className="binding-inner">
        <div className="binding-title" onClick={onHome}>
          The Polyglot's<span className="amp">&amp;</span>Atlas
        </div>

        <nav className="binding-nav" aria-label="Primary">
          <button
            className={route.name === "home" ? "active" : ""}
            onClick={onHome}
          >Atlas</button>
          <span className="sep">·</span>
          <button
            className={route.name === "japanese" || route.name === "territory-placeholder" ? "active" : ""}
            onClick={onJapanese}
          >Folios</button>
          <span className="sep">·</span>
          <button>Travel</button>
          <span className="sep">·</span>
          <button>Cartography</button>
          <span className="sep">·</span>
          <button
            className={route.name === "track4" ? "active" : ""}
            onClick={onTrack4}
          >Reference</button>
        </nav>

        <div className="binding-meta">
          Vol. I · 20 May 2026
        </div>
      </div>
    </div>
  );
}

function TerritoryPlaceholder({ territoryId, onBack }) {
  const terr = window.TERRITORIES.find(t => t.id === territoryId);
  if (!terr) return null;
  return (
    <div className="page" data-screen-label={"Folio placeholder — " + terr.name}>
      <button
        className="drawer-close"
        onClick={onBack}
        style={{ position: "static", marginBottom: 18, padding: 0 }}
      >◀ back to atlas</button>

      <div className="placeholder">
        <svg className="ornament-svg" width="80" height="80" viewBox="0 0 80 80" stroke="var(--ink-soft)" fill="none" strokeWidth="1">
          <circle cx="40" cy="40" r="28" />
          <circle cx="40" cy="40" r="20" strokeDasharray="2 3" />
          <line x1="12" y1="40" x2="68" y2="40" />
          <line x1="40" y1="12" x2="40" y2="68" />
          <text x="40" y="46" textAnchor="middle" fontFamily="var(--font-display)" fontSize="22" fill="var(--accent)" stroke="none" style={{ fontStyle: "italic" }}>{terr.glyph}</text>
        </svg>
        <div className="smallcaps" style={{ marginBottom: 8 }}>Folio {terr.folioNum}</div>
        <h2>
          <span className="accent" style={{ marginRight: 12 }}>{terr.glyph}</span>
          {terr.name}
        </h2>
        <div className="latin">{terr.latin} · {terr.statusLabel.toLowerCase()}</div>
        <p style={{ marginTop: 28 }}>
          <em>{terr.aim}</em>
        </p>
        <p style={{ marginTop: 22, color: "var(--ink-faded)" }}>
          This folio's plates are not yet drawn in the present edition of the atlas.
          The Japanese folio is the worked example.
        </p>
        <button
          onClick={() => { onBack(); }}
          style={{
            marginTop: 30,
            background: "transparent",
            border: "1px solid var(--ink)",
            color: "var(--ink)",
            padding: "10px 22px",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--paper)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}
        >
          ◀ return to the atlas
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
