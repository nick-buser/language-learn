# Pronunciation feedback — feature plan

*Drafted 2026-06-29. The phonetics folios (소리, 発音) teach the learner to **hear and place**
sounds — the articulators on the mouth diagram, the vowels on the compass, the pitch on the
ridge. This plan covers the missing half: letting the learner **check their own production**
against those same diagrams. It is a roadmap, not a spec — each tier gets its own design pass
when it starts. Read `docs/vocabulary-plan.md` for the format this follows.*

## The shape of the problem

Every phonetics instrument today runs one direction: the app speaks (Web Speech / the Web Audio
synth), the learner listens and points. The obvious next move is to close the loop — record the
learner, and show them where their sound landed. Two traps to avoid first:

- **Spectral diff is a trap.** Record a native reference, record the learner, align (MFCC + DTW)
  and take a distance, and you are mostly measuring *speaker identity* — vocal-tract length,
  timbre, pitch, mic. Two natives "diff" enormously. The score punishes the learner for not
  being the reference speaker and is near-blind to the actual phoneme error. It demos well and
  teaches nothing.
- **The unlock is that the instruments already define the coordinate systems the feedback should
  live in.** `VowelCompass` plots vowels on an IPA trapezoid whose axes *are* the formant plane.
  `PitchRidge` already draws H/L per mora. The right feedback is not a "73% correct" readout —
  it is the learner's own production dropped as a dot/contour onto the diagram they already
  learned to read. That is the Tufte move, and it is the spine of this plan.

### The cost constraint (shapes the whole architecture)

The public web build ships to Cloudflare Pages and must stay **$0 to serve** — no inference
endpoint paid for on behalf of strangers. The homelab (a 16 GB RTX 5060 behind the tailnet) is
fine to lean on, but **only for the single-learner lab build**, never as a public dependency.

This maps cleanly onto the existing seam. Analysis lives behind an abstraction (mirroring
`speech.js`, "THE SEAM"). The **default path is browser-local DSP** that ships to CF Pages with
zero server cost. When `VITE_API_URL` points at the lab, an **optional homelab path** can upgrade
precision — exactly the degrade pattern `analyzeReading.js` already uses (`API_ENABLED =
VITE_API_URL defined`, degrade to offline). The difference: here the offline fallback is *good*,
because classical formant/pitch DSP is genuinely adequate for steady vowels and pitch.

The consequence per tier: **Tier 0 ships fully client-side** (free, public). **Tiers 1–2 are
homelab-only** (the models are too big to bundle into a web build) and are simply absent on the
public deploy — present only when the build is pointed at the lab. That is acceptable: they are
the learner's personal practice tools, not the public exhibit.

---

## Tier 0 — measure, don't classify (frontend-first; the focus)

No ML. Classical DSP, all of it runnable in the browser. Highest value-per-day, most on-brand,
and a complete vertical slice (mic seam → analysis → overlay) that de-risks everything above it.

### The capture seam — `listen.js`

A new seam mirroring `src/components/scripts/speech.js`: request the mic once, capture a short
utterance via `MediaRecorder` / Web Audio, hand back 16 kHz mono `Float32Array` PCM. All input
capture goes through this one wrapper, never raw Web APIs in components — same discipline
`speak()` enforces for output. Permission/availability handled here (like `hasVoice`).

### Instrument 1 — the vowel dot (the headline; vowels are robust)

`VowelCompass` already maps `x ∈ [0,1]` front→back, `y ∈ [0,1]` close→open onto the trapezoid via
`plot(vx, vy)` (corners `TL/TR/BR/BL`). That plane *is* acoustic:

- compass `y` ≈ normalized **F1** (vowel height — high F1 = open = low on the trapezoid)
- compass `x` ≈ inverted normalized **F2** (frontness — high F2 = front = `x` near 0)

So: learner holds a vowel, we measure F1/F2, drop their dot onto the compass they already know.
Drift of 어 toward 오's slot becomes *visible* — and that is precisely the ㅓ/ㅗ and ㅜ/ㅡ splits the
Japanese 5→10 ghost overlay already dramatizes. This is the single most "Aburaya" thing we could
add, and the lantern-note eureka panel fits it perfectly (fires once when the dot first lands).

- **Browser DSP:** formant extraction is established prior art in-browser — VowelWorm
  (`getFormants()` via LPC + Bark normalization) and ZPeech both do it with Web Audio, no Praat,
  no WASM port. The kernel is small: autocorrelation → Levinson-Durbin → LPC polynomial roots →
  root angles to frequencies. Hand-roll it (~a few hundred lines, vendored under
  `src/components/phonetics/dsp/`) or adapt VowelWorm. No GPU, no server.
- **The one real care item — speaker normalization.** Raw F1/F2 vary with vocal-tract length, so
  the plane must be normalized to *this* learner. Calibrate once against the point-vowel triangle
  (their own ㅣ / ㅏ / ㅜ corners), or apply Lobanov/Nearey z-scoring. Store the calibration like a
  preference. Without this the dots are meaningless across speakers; with it they are trustworthy.
- **Homelab upgrade (optional):** route to `parselmouth` (Praat's Burg formant tracker) when
  `VITE_API_URL` is set, for cleaner estimates on high-F0 voices (where LPC formants get biased).
  A precision boost, not a requirement.

### Instrument 2 — the pitch contour (Japanese; cleanly client-side)

`PitchRidge` already renders H/L per mora (`H_MIDI`/`L_MIDI`, `PITCH_WORDS[].pitch`). Track the
learner's F0 over their utterance and overlay the measured contour on the ridge. 箸 vs 橋 (はし,
pitch-distinguished) becomes self-evident from the learner's own voice.

- **Browser DSP:** pitch detection is mature and pure-JS — `pitchfinder` (YIN / McLeod / AMDF)
  or `pitchy` (McLeod). Real-time, tiny, no server. Segment the contour into morae by even
  division or energy/duration; study-grade alignment is enough (the ridge is already a study
  diagram, not a score).
- No homelab path needed — F0 tracking is solved in the browser.

### Instrument 3 — the stop triad (stretch; the honest-hard one)

A *new* instrument: a VOT × F0-onset scatter where ㄱ/ㄲ/ㅋ (plain/tense/aspirated — the
`CONSONANTS[].phon` axis already in `koreanPhonetics.js`) occupy regions, and the learner's
production lands as a dot. Measurable with DSP (VOT from burst-to-voicing, F0 from the following
vowel onset). **Linguistic subtlety to honor:** in modern Seoul Korean the lax/aspirated contrast
has largely migrated from VOT to the **F0 of the following vowel** (tonogenesis in progress), so
both axes carry weight. This is the contrast a Japanese-L1 learner most needs — and (see Risks)
the one automation is least sure of. As *measurement-and-display* it degrades gracefully; ship it
only as "here is where your production sits," never a confident verdict. More bespoke than the
first two; defer until 1 & 2 feel right.

### Tier 0 file plan (follows the folio conventions)

- `src/components/scripts/listen.js` — the mic/capture seam.
- `src/components/phonetics/dsp/` — vendored DSP (LPC formants, F0, normalization); language-blind,
  like `SagittalMouth.jsx`.
- A `formant`/`pitch` analysis seam with two backends (local DSP default; homelab `parselmouth`
  when `VITE_API_URL` set), shaped like `src/api/client.js` + `analyzeReading.js`.
- Overlay props added to existing `VowelCompass.jsx` / `PitchRidge.jsx` — feed in a measured
  dot/contour; no new visual system, no component surgery elsewhere.
- Styles extend `phonetics.css` / `jphonetics.css`; tokens only, per the Aburaya rule.

---

## Tier 1 — phoneme recognition / mispronunciation diagnosis (homelab-only)

"Did the right sound come out?" Run a phone recognizer on the learner audio and compare the
recognized phone string to the canonical sequence; substitutions/deletions become "you said ㅓ,
it came out closer to ㅗ" or "your ㅋ came out as ㄱ."

- **Model:** wav2vec2 / XLSR fine-tuned for phoneme recognition, or **Allosaurus** (universal
  phone recognition; runs even on CPU). ~300 M params — trivial on the 5060, **too big to bundle
  into a web build**, so backend-only. A new `/v1/phonetics/analyze` endpoint following the
  `/v1/reading/analyze` → kiwipiepy pattern (FastAPI on the homelab; `API_ENABLED` gates it;
  absent on the public deploy).
- **Work is linguistic, not infra:** canonical phone sequences per study item, mapping recognized
  phones → feedback, forced alignment (torchaudio CTC aligner / MFA) to know which audio span is
  which expected phone.
- Feedback still renders into the Tier 0 instruments (the substituted vowel's dot, the swapped
  consonant's place on `SagittalMouth`).

## Tier 2 — Goodness-of-Pronunciation + practice loop (homelab-only)

Full CAPT, and the thing the original ask described ("classifier for practice loops"). Force-align
against the expected phoneme sequence, take per-phoneme posteriors from the acoustic model, low
posterior = mispronunciation. Speaker-independent (posteriors, not spectral matching). Wrap it in
a practice loop that feeds the SRS roadmap — words drilled by ear, scored, re-queued. Ties
directly into `useVocabStore` and the reading/SRS phases of `docs/vocabulary-plan.md`. Most effort;
start only after Tier 1's diagnosis is calibrated and trusted.

---

## The honest risk (read before trusting any automated verdict)

The contrasts a Japanese-L1 learner most needs are exactly the ones automation is least reliable
at: the three-way stop contrast ㄱ/ㄲ/ㅋ (ㅂ/ㅃ/ㅍ, ㄷ/ㄸ/ㅌ) — acoustically subtle (VOT + F0 onset +
phonation) — and ㅓ vs ㅗ, ㅜ vs ㅡ. Off-the-shelf models train mostly on L1 speech; Korean **L2**
pronunciation data is thinner than English (speechocean762 is English-only; AI-Hub Korea has some
Korean-as-foreign-language speech — validate against it before trusting diagnosis).

The design consequence is the reason Tier 0 comes first: **measurement-and-display degrades
gracefully** (a vowel dot that is slightly off is still honest and useful), while **ML
classification can be confidently wrong** on precisely the hardest, highest-value contrast. Vowel
formants (Tier 0) are trustworthy today. Automated *diagnosis* of the tense/lax/aspirated stop is
the least trustworthy thing here — never ship it as a confident "wrong!".

## What ships where

| | Effort | Frontend-only? | Public CF Pages | Pedagogically sound |
|---|---|---|---|---|
| Naive spectral diff | ~1 day | yes | yes | ✗ misleading — do not build |
| **Tier 0** formants/F0 onto the instruments | ~3–5 days | **yes** | **yes ($0)** | ✓ excellent (vowels, pitch) |
| Tier 1 phone-recognition diagnosis | ~1–2 wk | no (≈300 M model) | no (lab build only) | ⚠ good — validate KR contrasts |
| Tier 2 GOP + practice loop | ~3–4 wk | no | no (lab build only) | ✓ if calibrated |

## Start here — the Tier 0 slice

Vowels only, Korean compass: `listen.js` mic seam → in-browser LPC formant extraction →
self-calibrated normalization → learner dot on `VowelCompass`, with the lantern firing when it
first lands. Pure client-side, ships free, complete loop. Pitch overlay on `PitchRidge` is the
natural second slice; the stop triad and the homelab `parselmouth` upgrade follow once the shape
is proven.

*Status 2026-06-29: planning only. No capture/DSP code exists yet — the app is listen-and-respond
(`speech.js`, `audio.js`); no microphone, no phonetics endpoint. This doc is the interface-first
sketch; the Tier 0 slice is the first build.*
