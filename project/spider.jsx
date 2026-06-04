/* spider.jsx — Radial modality chart for a folio.
   No numbers exposed. Five qualitative bands.
   Click an axis or node → onSelect(modality.id).
*/

const SPIDER_BANDS = ["untrained", "nascent", "developing", "established", "deep"];

function ModalitySpider({ modalities, activeId, onSelect }) {
  const cx = 280, cy = 280, rMax = 200;
  const n = modalities.length;
  // distribute axes: start at top, go clockwise
  const angleFor = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const rForBand = (idx) => ((idx + 1) / 5) * rMax;
  // node radii based on bandIndex (0..4)

  // Concentric rings: 5 levels
  const rings = SPIDER_BANDS.map((band, i) => {
    const r = ((i + 1) / 5) * rMax;
    return { band, r, idx: i };
  });

  // Polygon points connecting current band of each modality
  const polyPts = modalities.map((m, i) => {
    const a = angleFor(i);
    const r = rForBand(m.bandIndex);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const polyStr = polyPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <div className="spider-stage" data-screen-label="Japanese · Modality Spider">
      <svg viewBox="0 0 560 560" aria-label="Modality proficiency, radial">
        {/* Concentric rings */}
        {rings.map((ring, i) => (
          <circle
            key={ring.band}
            cx={cx} cy={cy} r={ring.r}
            className={"spider-ring" + (i === 4 ? " solid" : "")}
          />
        ))}

        {/* Spokes */}
        {modalities.map((m, i) => {
          const a = angleFor(i);
          const x2 = cx + Math.cos(a) * rMax;
          const y2 = cy + Math.sin(a) * rMax;
          return (
            <line
              key={"spoke-" + m.id}
              x1={cx} y1={cy} x2={x2} y2={y2}
              className="spider-spoke"
            />
          );
        })}

        {/* Band labels along top spoke (12 o'clock) */}
        {rings.map((ring, i) => (
          <text
            key={"bandlabel-" + ring.band}
            x={cx + 4}
            y={cy - ring.r + 3}
            className="spider-band-label"
            textAnchor="start"
          >
            {ring.band}
          </text>
        ))}

        {/* Filled current polygon */}
        <polygon points={polyStr} className="spider-poly" />

        {/* Nodes & axis labels */}
        {modalities.map((m, i) => {
          const a = angleFor(i);
          const r = rForBand(m.bandIndex);
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          // axis label is at the rim, slightly offset
          const lr = rMax + 36;
          const lx = cx + Math.cos(a) * lr;
          const ly = cy + Math.sin(a) * lr;
          const subLy = ly + 16;
          const isActive = activeId === m.id;

          // text anchor depending on angle quadrant
          let anchor = "middle";
          if (Math.cos(a) > 0.3) anchor = "start";
          else if (Math.cos(a) < -0.3) anchor = "end";

          return (
            <g key={m.id} onClick={() => onSelect(m.id)} style={{ cursor: "pointer" }}>
              <circle
                cx={x} cy={y} r={7.5}
                className={"spider-node" + (isActive ? " active" : "")}
              />
              <text
                x={lx} y={ly}
                textAnchor={anchor}
                className={"spider-modality-label" + (isActive ? " active" : "")}
              >
                {m.name}
              </text>
              <text
                x={lx} y={subLy}
                textAnchor={anchor}
                className="spider-modality-sub"
              >
                {m.band}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

window.ModalitySpider = ModalitySpider;
window.SPIDER_BANDS = SPIDER_BANDS;
