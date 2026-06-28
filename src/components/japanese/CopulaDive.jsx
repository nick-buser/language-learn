import React, { useRef, useState } from 'react'
import { COPULA } from '../../data/grammarData.js'

// だ・です — the copula deep-dive. A builder: pick a base (そう / 学生 / きれい),
// conjugate the copula (polarity × tense × register), then cap it with a 終助詞
// (ね・よ・よね・か). The assembled tail is where spoken Japanese lives:
// そうだ → そうじゃない → そうだね → そうだよね → そうじゃないよね.
export default function CopulaDive({ showJp = true }) {
  const [baseId, setBaseId] = useState('sou')
  const [register, setRegister] = useState('plain')
  const [tense, setTense] = useState('nonpast')
  const [polarity, setPolarity] = useState('aff')
  const [particleId, setParticleId] = useState('none')
  const [lantern, setLantern] = useState(false)
  const lanternFired = useRef(false)

  const base = COPULA.bases.find(b => b.id === baseId)
  const seg = COPULA.forms[register][tense][polarity]
  const particle = COPULA.particles.find(p => p.id === particleId)

  // plain + か drops the copula だ (そうか / そう？), unlike polite ですか.
  const kaDrop = register === 'plain' && particle.id === 'ka'
  const copT = kaDrop ? '' : seg.t
  const copR = kaDrop ? '' : seg.r

  const formJp = base.jp + copT + particle.jp
  const reading = [base.reading, copR, particle.r].filter(Boolean).join(' ')
  const en = base.en[polarity][tense]
  const formNote = `${register === 'plain' ? 'plain だ' : 'polite です'} · ${polarity === 'aff' ? 'affirmative' : 'negative'} · ${tense === 'nonpast' ? 'non-past' : 'past'}`

  const pickParticle = (id) => {
    setParticleId(id)
    if (id === 'yone' && !lanternFired.current) { lanternFired.current = true; setLantern(true) }
  }

  const Seg = ({ value, set, options }) => (
    <div className="cop-seg" role="group">
      {options.map(o => (
        <button key={o.id} className={'cop-segbtn' + (value === o.id ? ' active' : '')} onClick={() => set(o.id)}>
          {o.jp && <span className="cs-jp">{o.jp}</span>}
          <span className="cs-en">{o.en}</span>
        </button>
      ))}
    </div>
  )

  return (
    <div className="copula-stage" data-screen-label="Copula dive">
      <div className="loom-prompt" style={{ marginTop: 0 }}>{COPULA.prompt}</div>

      <div className="specimen-row">
        <span className="lbl">Base</span>
        {COPULA.bases.map(b => (
          <button key={b.id} className={'specimen-chip' + (b.id === baseId ? ' active' : '')} onClick={() => setBaseId(b.id)}>
            <span className="jp">{b.jp}</span>{b.gloss}
          </button>
        ))}
      </div>

      <div className="cop-controls">
        <div className="cop-ctl"><span className="cop-ctl-lbl">register</span>
          <Seg value={register} set={setRegister} options={[{ id: 'plain', jp: 'だ', en: 'plain' }, { id: 'polite', jp: 'です', en: 'polite' }]} />
        </div>
        <div className="cop-ctl"><span className="cop-ctl-lbl">polarity</span>
          <Seg value={polarity} set={setPolarity} options={[{ id: 'aff', en: 'is' }, { id: 'neg', en: 'isn’t' }]} />
        </div>
        <div className="cop-ctl"><span className="cop-ctl-lbl">tense</span>
          <Seg value={tense} set={setTense} options={[{ id: 'nonpast', en: 'now' }, { id: 'past', en: 'was' }]} />
        </div>
      </div>

      <div className="cop-particles" role="group" aria-label="sentence-final particle">
        <span className="cop-ctl-lbl">終助詞 · the tail</span>
        {COPULA.particles.map(p => (
          <button key={p.id} className={'cop-pchip' + (p.id === particleId ? ' active' : '')} onClick={() => pickParticle(p.id)}>
            {p.jp ? <span className="jp">{p.jp}</span> : <span className="cop-pnone">—</span>}
          </button>
        ))}
      </div>

      <div className="cop-readout" key={formJp}>
        <div className="cop-form jp">{formJp}</div>
        <div className="cop-reading">{reading}</div>
        <div className="cop-en">{en}</div>
        <div className="cop-formnote">{formNote}{seg.alt && polarity === 'neg' && register === 'polite' && <> · also <span className="jp">{seg.alt}</span> <span className="cop-alt-r">({seg.altR})</span></>}</div>
        {kaDrop && <div className="cop-drop">plain + か drops だ → <span className="jp">{base.jp}か</span> (or just <span className="jp">{base.jp}？</span>)</div>}
      </div>

      <div className="cop-nuance">
        <span className="cop-nuance-tag">{particle.label}</span>
        {particle.note}
      </div>

      {showJp && (
        <div className="cop-bridge">
          <span className="cop-bridge-tag">한국어</span>
          <span>{COPULA.copulaNote}{particle.ko && <> <b className="cop-bridge-ko">{particle.ko}</b></>}</span>
        </div>
      )}

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{COPULA.lantern.head}</div><div className="body" dangerouslySetInnerHTML={{ __html: COPULA.lantern.body }} /></>)}
      </div>
    </div>
  )
}
