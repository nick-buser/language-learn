# The dictionary — schema, data-access seam, and the seeding pipeline

*Phase 2 of [`vocabulary-plan.md`](./vocabulary-plan.md). Started 2026-06-17. This document is
the contract for how words enter and leave the atlas.*

## The shape (schema v2)

Defined in [`src/data/dictionary/schema.js`](../src/data/dictionary/schema.js) as
`DictionaryEntry`, the generalized successor to the pilot `VocabEntry`. Over the pilot it adds:

| field | meaning |
|---|---|
| `senses[]` | a headword can mean several things (말 = words / horse / measure). `senses[0]` mirrors the flat `en` / `domain` / `note`, so old readers keep working. |
| `freqRank` | integer rank from a frequency list; `null` until a list seeds it. |
| `band` | 1 / 2 / 3, derived from `freqRank` (`bandFromRank`): ≤2000 survival core, ≤6000 everyday, else extended. |
| `conjugation` | inflection class for verbs/adjectives (e.g. `ㅡ-irregular`), else `null`. |
| `source` | provenance — which seed or edit produced the entry (`atlas-seed`, `krdict`, …). |

Everything the pilot carried (`head`, `hanja`, `reading`, `pos`, `origin`, `bridge`, `ex`,
`note`) is preserved. The new fields are **additive and optional**, so the instruments keep
reading `entry.en` / `entry.reading` / `entry.bridge` / `entry.ex` unchanged.

## The seam

All word access goes through [`src/data/dictionary/index.js`](../src/data/dictionary/index.js):

```js
const { lang, entries } = await loadVocab('ko')   // entries: DictionaryEntry[]
```

`loadVocab` is **async on purpose**. Today its body reads the local hand-authored banks and
normalizes them; when the backend exists, the body becomes
`await fetch('https://dict.lab/api/vocab/ko')` and nothing upstream changes. No instrument
imports a raw data module anymore — the backend lands here, and only here.

**Backend rollout (not started):** a small service on the homelab (DB + read API serving this
schema) replaces the `SEEDS` map with a base-URL lookup. The per-learner vocab state
(`atlas.<lang>.vocab.v1`, still localStorage) is a *separate* concern and migrates on its own
schedule — dictionary = shared content, vocab state = per-learner.

## The seeding pipeline

[`tools/seed-dictionary.mjs`](../tools/seed-dictionary.mjs) turns a **frequency list** plus a
**gloss adapter** into normalized `DictionaryEntry` JSON. Frequency-first: we rank by a
frequency list and gloss top-down, so the most useful words land first.

```sh
# offline — gloss the ranked list from the hand-checked bank (proves the pipeline)
node tools/seed-dictionary.mjs --adapter=manual --out=src/data/dictionary/ko.generated.json

# the real source — needs a key AND a licensing check (see below)
KRDICT_API_KEY=… node tools/seed-dictionary.mjs --adapter=krdict --freq=tools/data/ko-freq.full.txt --out=…
```

Adapters (`head → partial DictionaryEntry`):
- **`manual`** — the existing hand-checked bank (`koreanVocab.js`), keyed by headword. Offline
  and authoritative, but only covers the pilot set — which is exactly why we need a real source.
- **`krdict`** — the [국립국어원 한국어기초사전 open API](https://krdict.korean.go.kr/openApi/openApiInfo).
  Reads `KRDICT_API_KEY`; generates an approximate RR with our own
  [`romanize.js`](../src/components/song/romanize.js); maps KRDICT `pos` → our enum and each
  `sense` → a `Sense`. **The XML parse is provisional** — verify it against a live response
  before trusting a bulk run.

Output is `{ lang, generatedAt, count, entries }`. Unglossed ranked words are reported, not
emitted — they're the queue the real source fills.

## KRDICT — source & **licensing** (confirm before redistributing)

The open API key is free (register at krdict.korean.go.kr). Licensing is the gate, not the key:

- **한국어기초사전 (Basic Korean Dictionary)** — NIKL learner dictionary; terms vary by field and
  must be checked per the API's usage notice.
- **우리말샘 (Woori Mal Saem)** — community dictionary, **CC BY-SA 2.0 KR**: redistributable
  *with attribution and share-alike*. If we commit glosses/examples sourced here, the repo must
  carry the attribution and the share-alike obligation.

House rule (unchanged from the cognate ledger): **anything surfaced in an instrument is
hand-checked.** So the pipeline's role is to *propose* ranked, glossed entries; a human pass
approves them into `src/data/dictionary/ko.json`, and only then does `loadVocab` point at it.
Until that pass and the licensing sign-off, the seam keeps serving the hand-authored bank.

## Sequencing

1. ✅ schema v2 + the data-access seam (`loadVocab`) — done.
2. ✅ the pipeline + a sample frequency list — done (this commit).
3. ◻ a real frequency list (NIKL 빈도 조사 / a corpus list) → `tools/data/ko-freq.full.txt`.
4. ◻ run `--adapter=krdict`, hand-check, write `ko.json`, point `SEEDS.ko` at it.
5. ◻ the homelab backend serves the same schema; `loadVocab` swaps local JSON for `fetch`.
