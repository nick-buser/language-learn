/* app.aburaya.jsx — Aburaya skin shell.
   Same atlas, re-lit. The three antiquarian editions are replaced by the
   two canonical moments of the bath-house: Night (lantern-lit, home) and
   Daylight (the painted-tile afternoon). */

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "hour": "night",
  "showOrnaments": true,
  "gouacheGrain": true
}/*EDITMODE-END*/;

const HOURS = {
  "night": { theme: "",    label: "Night",    subtitle: "lantern-lit · home" },
  "day":   { theme: "day", label: "Daylight", subtitle: "painted tile · sun" },
};

function App() {
  const [route, setRoute] = React.useState({ name: "home" });
  const [drawerModalityId, setDrawerModalityId] = React.useState(null);
  const [t, setTweak] = useTweaks(DEFAULT_TWEAKS);

  // Apply hour (theme) globally
  React.useEffect(() => {
    const h = HOURS[t.hour] || HOURS.night;
    if (h.theme) document.documentElement.setAttribute("data-theme", h.theme);
    else document.documentElement.removeAttribute("data-theme");
  }, [t.hour]);

  // Gouache grain toggle — when on, let the per-hour CSS default stand
  React.useEffect(() => {
    if (t.gouacheGrain) document.documentElement.style.removeProperty("--grain-opacity");
    else document.documentElement.style.setProperty("--grain-opacity", "0");
  }, [t.gouacheGrain, t.hour]);

  // Cartographic ornaments toggle
  React.useEffect(() => {
    if (t.showOrnaments) document.documentElement.removeAttribute("data-ornaments");
    else document.documentElement.setAttribute("data-ornaments", "off");
  }, [t.showOrnaments]);

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
        <TweakSection label="The hour">
          <div style={{ display: "grid", gap: 8, padding: "6px 0 10px" }}>
            {Object.entries(HOURS).map(([key, h]) => (
              <button
                key={key}
                onClick={() => setTweak("hour", key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: t.hour === key ? "rgba(219,179,92,0.14)" : "transparent",
                  border: "1px solid " + (t.hour === key ? "#DBB35C" : "rgba(120,120,120,0.28)"),
                  padding: "8px 10px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  fontSize: 12,
                  color: "inherit",
                  transition: "all .15s",
                }}
              >
                <HourSwatch hour={key} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{h.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.6 }}>{h.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </TweakSection>

        <TweakSection label="Material">
          <TweakToggle
            label="Gouache grain"
            value={t.gouacheGrain}
            onChange={(v) => setTweak("gouacheGrain", v)}
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

function HourSwatch({ hour }) {
  const swatches = {
    night: ["#11151D", "#B23A2E", "#DBB35C"],   // night · lacquer · gilt
    day:   ["#F6EFE3", "#B23A2E", "#A8842F"],   // paper · lacquer · gilt
  };
  const colors = swatches[hour] || swatches.night;
  return (
    <div style={{ display: "flex", gap: 0, border: "1px solid rgba(120,120,120,0.3)" }}>
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
            border: "1px solid var(--accent)",
            color: "var(--accent)",
            padding: "10px 22px",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--signal)"; e.currentTarget.style.borderColor = "var(--signal)"; e.currentTarget.style.color = "#F6EFE3"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
        >
          ◀ return to the atlas
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
