import React, { useRef, useState } from 'react'

// Personal pronouns (人称代名詞 / 인칭대명사) — the register ladder. Both
// languages avoid pronouns (pro-drop) and load the ones they keep with
// formality: which "I" or "you" you pick says who you are. Pick a person
// (I / you / he·she), read the rail formal→blunt, tap a pronoun for who says
// it and its twin across the bridge. A pro-drop demo shows the word falling away.
//
// Language-blind: fed by either deixis module.

export default function PronounLadder({ data, showReadings, showJp }) {
  const { PRONOUNS, PRO_LANTERN, CONFIG } = data
  const [personId, setPersonId] = useState(PRONOUNS.persons[0].id)
  const [word, setWord] = useState(PRONOUNS.persons[0].items[0].word)
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)

  const person = PRONOUNS.persons.find(p => p.id === personId)
  const sel = person.items.find(i => i.word === word) || person.items[0]

  const pickPerson = (p) => { setPersonId(p.id); setWord(p.items[0].word) }
  const pickWord = (w) => {
    setWord(w)
    if (!fired.current) { fired.current = true; setLantern(true) }
  }

  const drop = PRONOUNS.proDrop

  return (
    <div className="dx-pro-stage" data-screen-label="personal pronouns">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        There is no neutral “I” or “you” here — every pronoun is dressed for an occasion. Pick a person,
        then slide along the rail from <i>formal</i> to <i>blunt</i>.
      </div>

      {/* person tabs */}
      <div className="dx-pro-persons" role="tablist" aria-label="grammatical person">
        {PRONOUNS.persons.map(p => (
          <button key={p.id} role="tab" aria-selected={p.id === personId}
            className={'dx-pro-person' + (p.id === personId ? ' active' : '')} onClick={() => pickPerson(p)}>
            <span className={'dx-pro-person-glyph ' + CONFIG.script}>{p.latin}</span>
            <span className="dx-pro-person-label">{p.label}</span>
          </button>
        ))}
      </div>

      {/* the formal→blunt rail */}
      <div className="dx-rail">
        <div className="dx-rail-end left">{PRONOUNS.rail.left}</div>
        <div className="dx-rail-track">
          {person.items.map(it => (
            <button key={it.word}
              className={'dx-rail-mark' + (it.word === word ? ' active' : '') + (it.warn ? ' warn' : '')}
              style={{ left: (it.rank / 4 * 100) + '%' }}
              aria-pressed={it.word === word}
              onClick={() => pickWord(it.word)}>
              <span className={'dx-rail-word ' + CONFIG.script}>{it.word}</span>
              {showReadings && <span className="dx-rail-rr">{it.reading}</span>}
            </button>
          ))}
        </div>
        <div className="dx-rail-end right">{PRONOUNS.rail.right}</div>
      </div>

      {/* the detail for the selected pronoun */}
      <div className="dx-pro-card" key={person.id + sel.word}>
        <div className="dx-pro-card-head">
          <span className={'dx-pro-word ' + CONFIG.script}>{sel.word}</span>
          {showReadings && <span className="dx-pro-rr">{sel.reading}</span>}
          <span className="dx-pro-gloss">{sel.gloss}</span>
          {sel.warn && <span className="dx-pro-warn">careful</span>}
        </div>
        <div className="dx-pro-who">{sel.who}</div>
        {showJp && (
          <div className="dx-pro-bridge">
            <span className="dx-bridge-tag" style={{ fontFamily: CONFIG.bridgeFont }}>{CONFIG.bridgeTag}</span>
            <span className={'dx-pro-bridge-word ' + CONFIG.bridge}>{sel.bridge}</span>
            {showReadings && <span className="dx-pro-bridge-rr">{sel.bridgeRr}</span>}
          </div>
        )}
        <div className="dx-pro-plural"><span className="dx-pro-plural-lbl">plural</span>{person.plural}</div>
      </div>

      {/* pro-drop: the pronoun normally isn't said at all */}
      <div className="dx-prodrop">
        <div className="dx-prodrop-lbl">and the usual move — drop it</div>
        <div className="dx-prodrop-line">
          <span className={'dx-prodrop-dropped ' + CONFIG.script}>{drop.dropWord}</span>
          <span className={'dx-prodrop-rest ' + CONFIG.script}>{drop.drop}</span>
        </div>
        {showReadings && <div className="dx-prodrop-rr">{drop.rr}</div>}
        <div className="dx-prodrop-en">{drop.en}</div>
        {showJp && (
          <div className="dx-prodrop-bridge">
            <span className="dx-bridge-tag" style={{ fontFamily: CONFIG.bridgeFont }}>{CONFIG.bridgeTag}</span>
            <span className={'dx-prodrop-bridge-line ' + CONFIG.bridge}>{drop.bridge}</span>
            {showReadings && <span className="dx-prodrop-bridge-rr">{drop.bridgeRr}</span>}
          </div>
        )}
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{PRO_LANTERN.head}</div>
          <div className="body" dangerouslySetInnerHTML={{ __html: PRO_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
