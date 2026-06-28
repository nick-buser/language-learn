import React, { useRef, useState, useCallback } from 'react'

// =====================================================================
// The keyboardless input — type Japanese/Korean from a Latin keyboard, or
// tap a glyph pad, with no OS keyboard switch. Language-blind: it's driven
// entirely by an `engine` from ime.js (kana / katakana / hangul), so the
// same component serves both folios.
//
// The composition box reads like an inline IME: committed glyphs sit solid,
// the in-progress romaji tail trails faintly after a caret, and a real (but
// chromeless) <input> at that tail is the typing surface — so editing,
// selection, and Backspace behave natively. Backspace at an empty tail pops
// the last committed glyph; the tap pad commits a kana/jamo straight.
//
// Reports the *flushed* value (a lone trailing "n" finalized to ん) on every
// change, so a parent game can match against the target as you go.
// =====================================================================
export default function RomajiInput({
  engine,
  keyboard,            // optional: { label, rows: [[{ token, key }]] } tap pad
  onChange,            // (flushedValue: string) => void
  onSubmit,            // optional Enter handler — receives flushed value
  placeholder = 'type romaji…',
  padLabel = 'glyph pad',
  disabled = false,
  autoFocus = false,
}) {
  const [state, setState] = useState(() => engine.init())
  const [showPad, setShowPad] = useState(false)
  const inputRef = useRef(null)

  const composed = engine.value(state)
  const pending = engine.pending(state)

  const apply = useCallback((next) => {
    setState(next)
    onChange?.(engine.value(engine.flush(next)))
  }, [engine, onChange])

  const onType = (e) => apply(engine.setPending(state, e.target.value))

  const onKeyDown = (e) => {
    if (e.key === 'Backspace' && engine.pending(state) === '') {
      e.preventDefault()
      apply(engine.backspace(state))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit?.(engine.value(engine.flush(state)))
    }
  }

  const tap = (token) => {
    apply(engine.tap(state, token))
    inputRef.current?.focus()
  }

  const clearAll = () => { apply(engine.init()); inputRef.current?.focus() }

  return (
    <div className={'ime' + (disabled ? ' is-disabled' : '')}>
      <div className="ime-box" onClick={() => inputRef.current?.focus()}>
        <span className="ime-composed" lang={engine.lang}>{composed}</span>
        <span className="ime-tail-wrap">
          <input
            ref={inputRef}
            className="ime-tail"
            value={pending}
            onChange={onType}
            onKeyDown={onKeyDown}
            disabled={disabled}
            autoFocus={autoFocus}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            aria-label="romaji input"
            size={Math.max(1, pending.length)}
          />
        </span>
        {!composed && !pending && <span className="ime-placeholder">{placeholder}</span>}
      </div>

      <div className="ime-controls">
        <button type="button" className="ime-btn" onClick={() => apply(engine.backspace(state))} disabled={disabled || (!composed && !pending)} aria-label="backspace">⌫</button>
        <button type="button" className="ime-btn" onClick={clearAll} disabled={disabled || (!composed && !pending)}>clear</button>
        {keyboard && (
          <button type="button" className={'ime-btn pad-toggle' + (showPad ? ' on' : '')} onClick={() => setShowPad(v => !v)} aria-pressed={showPad}>
            ⌨ {padLabel}
          </button>
        )}
      </div>

      {keyboard && showPad && (
        <div className="ime-pad" role="group" aria-label={keyboard.label || 'glyph pad'}>
          {keyboard.rows.map((row, ri) => (
            <div className="ime-pad-row" key={ri}>
              {row.map((k, ki) => (
                k
                  ? <button type="button" key={ki} className="ime-key" lang={engine.lang} onClick={() => tap(k.token)} tabIndex={-1}>{k.key ?? k.token}</button>
                  : <span key={ki} className="ime-key gap" aria-hidden="true" />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
