import React from 'react'

// =====================================================================
// The voice-mode readout column, shared by the Japanese 発声 and Korean 발성
// vowel compasses. Pure presentation over the useVoiceCompass hook's state:
// the calibrate / listen / recalibrate controls, the three-vowel calibration
// walk, the live reading prose, and the calibration-quality panel.
//
// Everything language-specific arrives as props — `copy` (the folio's
// VOICE_CALIBRATION strings + anchors), `glyphOf(vowel)` to render a kana or
// jamo, and `glyphClass` ('jp' | 'kr') to pick the matching CJK/hangul font.
// The hook's state + start/stop controls come straight through.
// =====================================================================
export default function VoiceReadout({
  formantsOk, cal, calInfo, listening, calStep, reading, micError,
  startMic, stopMic, copy, vowels, glyphOf, glyphClass = 'jp',
}) {
  const byId = React.useMemo(() => Object.fromEntries(vowels.map(v => [v.id, v])), [vowels])
  const anchorVowel = calStep !== null ? byId[copy.anchors[calStep].vowel] : null
  const glyph = v => (v ? glyphOf(v) : '')

  return (
    <div className="vc-readout vc-voice" key="voice">
      {!formantsOk ? (
        <div className="cn-novoice">{copy.noMic}</div>
      ) : (
        <>
          <div className="vc-voice-controls">
            {!cal ? (
              <button className={'vc-voice-btn primary' + (listening ? ' rec' : '')}
                      onClick={() => listening ? stopMic() : startMic(true)}>
                <span className="vc-voice-led" aria-hidden="true" />
                {listening ? 'cancel' : copy.calibrate}
              </button>
            ) : (
              <>
                <button className={'vc-voice-btn primary' + (listening && calStep === null ? ' rec' : '')}
                        onClick={() => listening ? stopMic() : startMic(false)}>
                  <span className="vc-voice-led" aria-hidden="true" />
                  {listening ? copy.stop : copy.listen}
                </button>
                <button className="vc-voice-btn ghost" onClick={() => startMic(true)} disabled={listening}>
                  {copy.recalibrate}
                </button>
              </>
            )}
          </div>

          {calStep !== null ? (
            <div className="vc-voice-cal">
              <div className="vc-voice-cal-step">{calStep + 1} / {copy.anchors.length}</div>
              <div className={'vc-voice-cal-kana ' + glyphClass}>{glyph(anchorVowel)}</div>
              <div className="vc-voice-cal-say">{copy.anchors[calStep].say}</div>
              <div className="vc-voice-cal-hold">{copy.hold}</div>
            </div>
          ) : !cal ? (
            <p className="vc-voice-intro">{copy.intro}</p>
          ) : reading ? (
            <div className="vc-voice-read">
              <div className="vc-voice-read-head">
                <span className="vc-voice-read-label">closest to</span>
                <span className={'vc-big ' + glyphClass}>{glyph(reading.vowel)}</span>
                <span className="vc-big-ipa">[{reading.vowel.ipa}]</span>
              </div>
              <p className="vc-voice-read-desc">Your vowel is {reading.text}</p>
            </div>
          ) : (
            <p className="vc-voice-ready">{listening ? copy.listening : copy.done}</p>
          )}

          {cal && calStep === null && calInfo && (
            <div className={'vc-voice-qual ' + calInfo.rating}>
              <div className="vc-voice-qual-head">
                <span className="vc-voice-qual-label">{copy.qualityLabel}</span>
                <span className="vc-voice-qual-rating">{calInfo.rating}</span>
                {calInfo.closest && (
                  <span className="vc-voice-qual-pair">
                    {copy.closest}{' '}
                    <span className={glyphClass}>{glyph(byId[calInfo.closest[0]])}</span>
                    <span className="vc-voice-qual-dot">·</span>
                    <span className={glyphClass}>{glyph(byId[calInfo.closest[1]])}</span>
                  </span>
                )}
              </div>
              <p className="vc-voice-qual-note">{copy.quality[calInfo.rating]}</p>
            </div>
          )}

          {micError && <div className="cn-novoice">{micError}</div>}
        </>
      )}
    </div>
  )
}
