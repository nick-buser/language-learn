#!/usr/bin/env node
// =====================================================================
// The Polyglot's Atlas — the dictionary · seeding pipeline
//
// Frequency list + gloss adapter → normalized DictionaryEntry JSON.
// Frequency-first: rank by a list, gloss top-down, so the most useful
// words land first. See docs/dictionary.md.
//
//   node tools/seed-dictionary.mjs --adapter=manual --out=src/data/dictionary/ko.generated.json
//   KRDICT_API_KEY=… node tools/seed-dictionary.mjs --adapter=krdict --freq=… --out=…
//
// The pipeline PROPOSES entries; a human hand-checks them before they
// become src/data/dictionary/ko.json and the seam points at them.
// =====================================================================

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { KO_VOCAB } from '../src/data/koreanVocab.js';
import { normalizeEntry } from '../src/data/dictionary/schema.js';
import { romanizeToken } from '../src/components/song/romanize.js';

const HERE = dirname(fileURLToPath(import.meta.url));

// ---- adapters: head → partial DictionaryEntry (no id/freqRank/source) ----

// manual — the hand-checked bank, keyed by headword. Offline + authoritative,
// covers only the pilot set (the reason a real source is needed).
function manualAdapter() {
  const byHead = new Map(KO_VOCAB.map((e) => [e.head, e]));
  return {
    name: 'atlas-seed',
    async gloss(head) {
      const e = byHead.get(head);
      if (!e) return null;
      const { id, head: _h, band, freqRank, source, ...rest } = e;
      return rest; // reading, pos, origin, en, domain, bridge, ex, note, hanja
    },
  };
}

// krdict — the real source: 국립국어원 한국어기초사전 open API.
// Free key; LICENSING must be confirmed before redistributing (docs/dictionary.md).
// The XML parse is provisional — verify against a live response before a bulk run.
function krdictAdapter() {
  const key = process.env.KRDICT_API_KEY;
  if (!key) {
    throw new Error(
      'krdict adapter needs KRDICT_API_KEY (krdict.korean.go.kr/openApi) and a licensing\n' +
      'check before redistributing glosses. See docs/dictionary.md. Use --adapter=manual to\n' +
      'run the pipeline offline.'
    );
  }
  return {
    name: 'krdict',
    async gloss(head) {
      const url =
        `https://krdict.korean.go.kr/api/search?key=${key}` +
        `&q=${encodeURIComponent(head)}&part=word&sort=popular&translated=y&trans_lang=1`;
      const res = await fetch(url);
      if (!res.ok) return null;
      return parseKrdict(await res.text(), head);
    },
  };
}

// Map KRDICT's Korean POS labels onto our small enum.
const POS_MAP = { 명사: 'noun', 대명사: 'noun', 수사: 'noun', 동사: 'verb', 형용사: 'adj', 부사: 'adverb' };

// Provisional XML extraction — KRDICT returns XML; confirm the shape live.
function parseKrdict(xml, head) {
  const item = (xml.match(/<item>([\s\S]*?)<\/item>/) || [])[1];
  if (!item) return null;
  const tag = (name, s = item) => (s.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`)) || [])[1]?.trim();
  const pos = POS_MAP[tag('pos')] || 'expression';
  const senseBlocks = [...item.matchAll(/<sense>([\s\S]*?)<\/sense>/g)].map((m) => m[1]);
  const senses = senseBlocks
    .map((b) => ({ gloss: tag('trans_word', b) || tag('definition', b) || '', domain: null, note: null }))
    .filter((s) => s.gloss);
  if (!senses.length) return null;
  return {
    reading: { rr: romanizeToken(head) }, // approximate RR from our jamo romanizer
    pos,
    origin: 'unknown',                     // stratum needs hanja analysis — hand pass
    en: senses[0].gloss,
    senses,
    domain: 'general',
  };
}

const ADAPTERS = { manual: manualAdapter, krdict: krdictAdapter };

// ---- frequency list: "rank<ws>head" or bare "head" (line number = rank) ----
function readFreqList(path) {
  return readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((line, i) => {
      const [a, b] = line.split(/\s+/);
      return b ? { rank: Number(a), head: b } : { rank: i + 1, head: a };
    });
}

async function main() {
  const args = Object.fromEntries(
    process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true])
  );
  const make = ADAPTERS[args.adapter || 'manual'];
  if (!make) throw new Error(`unknown adapter: ${args.adapter} (manual | krdict)`);
  const adapter = make();
  const freqPath = resolve(HERE, args.freq || 'data/ko-freq.sample.txt');

  const freq = readFreqList(freqPath);
  const entries = [];
  const missing = [];
  for (const { rank, head } of freq) {
    const g = await adapter.gloss(head);
    if (!g) { missing.push(head); continue; }
    const existing = KO_VOCAB.find((e) => e.head === head);
    entries.push(
      normalizeEntry({ id: existing?.id || head, head, ...g, freqRank: rank, source: adapter.name })
    );
  }

  const payload = {
    lang: 'ko',
    generatedAt: new Date().toISOString().slice(0, 10),
    count: entries.length,
    entries,
  };
  const json = JSON.stringify(payload, null, 2);
  if (args.out) {
    writeFileSync(resolve(process.cwd(), args.out), json + '\n');
    console.error(`wrote ${entries.length} entries → ${args.out}`);
  } else {
    process.stdout.write(json + '\n');
  }
  console.error(`adapter=${adapter.name} ranked=${freq.length} glossed=${entries.length} unglossed=${missing.length}`);
  if (missing.length) {
    console.error(`awaiting a real source: ${missing.join(', ')}`);
  }
}

main().catch((err) => { console.error(String(err.message || err)); process.exit(1); });
