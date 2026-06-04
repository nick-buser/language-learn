/* drawer.jsx — Modality detail drawer.
   Slides in from the right. Holds attending list, resources, signposts.
*/

function ModalityDrawer({ open, modality, onClose }) {
  // Trap escape to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={"drawer-scrim" + (open ? " open" : "")}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside
        className={"drawer" + (open ? " open" : "")}
        role="dialog"
        aria-modal={open}
        aria-label={modality ? modality.name + " — modality detail" : ""}
        data-screen-label="Modality Drawer"
      >
        <button className="drawer-close" onClick={onClose} aria-label="Close drawer">
          ◀ close · esc
        </button>

        {modality && (
          <>
            <div className="drawer-territory">Japanese · Plate II · modality</div>
            <h2>
              {modality.name}
              <span style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                color: "var(--ink-soft)",
                fontSize: 22,
                marginLeft: 14,
                fontWeight: 400,
              }}>
                {modality.latin}
              </span>
            </h2>

            <div className="modality-status-line">
              <span className="label">Current band</span>
              <span className="band">{modality.band}</span>
              <span style={{ flex: 1 }}></span>
              <span className="smallcaps">{modality.bandIndex + 1} of 5</span>
            </div>

            <div style={{ fontSize: 16.5, fontStyle: "italic", color: "var(--ink-soft)", marginBottom: 18 }}>
              {modality.shortNote}
            </div>

            <h3>Attending to</h3>
            <ul className="attend-list">
              {modality.detail.attending.map((a, i) => (
                <li key={i}>
                  <span className="priority">{a.p}</span>
                  {a.text}
                </li>
              ))}
            </ul>

            <h3>In active use</h3>
            <ul className="resource-list">
              {modality.detail.resources.map((r, i) => (
                <li key={i}>
                  <div className="title">{r.title}</div>
                  <div className="meta">{r.meta}</div>
                  <div style={{ color: "var(--ink-soft)", marginTop: 3, fontStyle: "italic", fontSize: 14.5 }}>
                    {r.gloss}
                  </div>
                </li>
              ))}
            </ul>

            <h3>Signposts</h3>
            <ul className="signposts" style={{ marginBottom: 30 }}>
              {modality.detail.signposts.map((s, i) => (
                <li key={i} className={s.state === "current" ? "current-row" : ""}>
                  <div className={"at " + (s.state || "")}>
                    <span className="strong">{s.at}</span>
                  </div>
                  <div className="text">
                    {s.text}
                    {s.state === "current" && (
                      <span className="meta">↳ presently</span>
                    )}
                    {s.state === "deferred" && (
                      <span className="meta" style={{ color: "var(--ink-faded)" }}>↳ explicitly deferred</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div style={{
              borderTop: "1px solid var(--ink)",
              paddingTop: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 9.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-faded)",
            }}>
              ↳ see also · reference plates linked from this modality
            </div>
          </>
        )}
      </aside>
    </>
  );
}

window.ModalityDrawer = ModalityDrawer;
