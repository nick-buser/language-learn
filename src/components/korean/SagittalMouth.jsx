import React from 'react'

// A midsagittal (side-view) schematic of the vocal tract — the "mouth
// position" diagram. Lips face LEFT, the throat drops away at the RIGHT,
// as in every phonetics textbook. It lights the active articulation place
// so a consonant's SHAPE can be read against where it is actually made.
//
// Props:
//   region — velum | ridge | lips | teeth | glottis | null  (the lit place)
//   labels — show the place captions (default true)
//
// Schematic, not anatomical: five hotspots on the tract, the active one lit
// gold with a halo, the rest faint. Tongue + palate drawn as simple curves.

const PLACE_POINTS = {
  lips:    { x: 36,  y: 110, label: 'lips' },
  teeth:   { x: 60,  y: 116, label: 'teeth' },
  ridge:   { x: 78,  y: 104, label: 'ridge' },
  velum:   { x: 138, y: 96,  label: 'soft palate' },
  glottis: { x: 170, y: 158, label: 'throat' },
}

// Which broad part of the tongue rises for a given place (drawn as an accent).
const TONGUE_ACCENT = {
  ridge: 'M 56 122 Q 70 104 84 110',   // tip up to the ridge
  velum: 'M 120 124 Q 142 104 158 124', // back hump up to the soft palate
}

export default function SagittalMouth({ region = null, labels = true }) {
  return (
    <svg className="sag-mouth" viewBox="0 0 210 200" role="img"
         aria-label={region ? `vocal tract, articulation at the ${PLACE_POINTS[region]?.label || region}` : 'vocal tract'}>
      {/* nasal cavity hint (top) */}
      <path className="sag-soft" d="M 40 60 Q 100 44 150 58 L 150 72 Q 100 60 44 76 Z" />

      {/* roof of the mouth — lips → teeth → alveolar ridge → hard/soft palate → back wall */}
      <path className="sag-roof"
            d="M 30 104 L 52 110 Q 72 96 78 100 Q 110 74 150 92 Q 166 100 170 120 L 170 178" />

      {/* tongue — a mound on the floor, tip near the teeth, root toward the throat */}
      <path className="sag-tongue"
            d="M 44 168 Q 56 124 104 116 Q 146 110 158 150 Q 162 168 158 180 L 50 180 Z" />

      {/* lower jaw / floor line */}
      <path className="sag-jaw" d="M 30 116 L 30 184 Q 100 196 172 184 L 172 178" />

      {/* active-region tongue accent (tip or back hump) */}
      {region && TONGUE_ACCENT[region] && (
        <path className="sag-accent-tongue" d={TONGUE_ACCENT[region]} />
      )}

      {/* the five articulation hotspots */}
      {Object.entries(PLACE_POINTS).map(([id, p]) => {
        const on = id === region
        return (
          <g key={id} className={'sag-spot' + (on ? ' lit' : '')}>
            {on && <circle className="sag-halo" cx={p.x} cy={p.y} r="13" />}
            <circle className="sag-dot" cx={p.x} cy={p.y} r={on ? 5.2 : 3} />
            {labels && on && (
              <text className="sag-caption" x={p.x} y={p.y - 17} textAnchor="middle">{p.label}</text>
            )}
          </g>
        )
      })}

      {/* orientation cue */}
      {labels && <text className="sag-orient" x="14" y="98" textAnchor="middle">front</text>}
    </svg>
  )
}
