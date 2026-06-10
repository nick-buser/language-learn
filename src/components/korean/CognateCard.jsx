import React from 'react'
import { BRIDGE_RULES, COGNACY } from '../../data/koreanCognates.js'

// One cognate, one card — uniform anatomy across the ledger:
// hanja headword · KR / JP readings · cognacy badge · per-character
// derivation (rule chips link back into the sound bridge) · specimen · trap.
export default function CognateCard({ entry, onRulePick, showReadings, showJp }) {
  const cog = COGNACY[entry.cognacy]
  return (
    <article className="cgcard" id={'cg-' + entry.id} style={{ '--cog': cog.color }}>
      <header className="cg-head">
        <div className="cg-hanja">{entry.hanja}</div>
        <div className="cg-id">
          <div className="cg-kr kr">
            {entry.ko.hangul}
            {showReadings && <span className="cg-kr-rr">{entry.ko.rr}</span>}
          </div>
          {showJp && (
            <div className="cg-ja">
              <span className="jp">{entry.ja.kana}</span>
              {showReadings && <span className="cg-ja-rr">{entry.ja.rr}</span>}
            </div>
          )}
          <div className="cg-en">{entry.en}</div>
        </div>
        <div className="cg-badge" title={cog.blurb}>{cog.label}</div>
      </header>

      {showJp && (
        <div className="cg-derive">
          {entry.chars.map((c, i) => {
            const rule = c.ruleId && BRIDGE_RULES.find(r => r.id === c.ruleId)
            return (
              <span className="cg-char" key={i}>
                <span className="cg-char-hanja">{c.hanja}</span>
                <span className="cg-char-ja">{c.ja.kana}</span>
                <span className="cg-char-arrow">→</span>
                <span className="cg-char-ko kr">{c.ko.hangul}</span>
                {showReadings && (
                  <span className="cg-char-rr">{c.ja.rr} → {c.ko.rr}</span>
                )}
                {rule && (
                  <button
                    className="cg-rule-chip"
                    style={{ '--rule-c': rule.color }}
                    title={rule.mc + ' — open this rule on the bridge'}
                    onClick={() => onRulePick(rule.id)}
                  >
                    {rule.krRr}
                  </button>
                )}
                {c.ini && <span className="cg-ini-chip" title="initial correspondence — see the initials drawer">{c.ini}</span>}
              </span>
            )
          })}
        </div>
      )}

      <figure className="cg-ex">
        <div className="cg-ex-kr kr" dangerouslySetInnerHTML={{ __html: entry.ex.kr }} />
        {showReadings && <div className="cg-ex-rr">{entry.ex.rr}</div>}
        {showJp && (
          <div className="cg-ex-jp">
            <span className="jp">{entry.ex.jp}</span>
            {showReadings && <span className="jp-rr">{entry.ex.jpRr}</span>}
          </div>
        )}
        <figcaption className="cg-ex-en">{entry.ex.en}</figcaption>
      </figure>

      {entry.note && (
        <div className="cg-note">
          <div className="fn-head">{entry.note.head}</div>
          <div className="fn-body" dangerouslySetInnerHTML={{ __html: entry.note.html }} />
        </div>
      )}
    </article>
  )
}
