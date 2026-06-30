#!/usr/bin/env node
// =====================================================================
// The Polyglot's Atlas — the dictionary · seeding pipeline
//
// Frequency list + gloss adapter → normalized DictionaryEntry JSON.
// Frequency-first: rank by a list, gloss top-down, so the most useful
// words land first. See docs/dictionary.md.
//
//   node tools/seed-dictionary.mjs --adapter=manual --out=…
//   KRDICT_API_KEY=… node tools/seed-dictionary.mjs --adapter=krdict \
//        --freq=tools/data/ko-freq.core.txt --out=src/data/dictionary/ko.json
//
// KRDICT breadth (hanja, learner grade, glosses, multi-sense definitions)
// is MERGED with the hand-checked bank's depth (Japanese bridge, specimen
// sentence, trap notes) — so the pilot words keep their bridges and new
// words gain real definitions. Source of definitions/readings: the
// 국립국어원 「한국어기초사전」 (KRDICT) Open API. Credit it loudly.
// =====================================================================

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { KO_VOCAB } from '../src/data/koreanVocab.js';
import { normalizeEntry } from '../src/data/dictionary/schema.js';
import { romanizeToken } from '../src/components/song/romanize.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- adapters: head → partial DictionaryEntry (no id/freqRank/source) ----

// manual — the hand-checked bank, keyed by headword. Offline + authoritative,
// covers only the pilot set (the reason a real source is needed).
function manualAdapter() {
  const byHead = new Map(KO_VOCAB.map((e) => [e.head, e]));
  return {
    name: 'atlas-seed',
    delay: 0,
    async gloss(head) {
      const e = byHead.get(head);
      if (!e) return null;
      const { id, head: _h, band, freqRank, source, ...rest } = e;
      return rest;
    },
  };
}

// krdict — the real source: 국립국어원 한국어기초사전 open API. Free key.
function krdictAdapter() {
  const key = process.env.KRDICT_API_KEY;
  if (!key) {
    throw new Error(
      'krdict adapter needs KRDICT_API_KEY (krdict.korean.go.kr/openApi). Use\n' +
      '--adapter=manual to run the pipeline offline. See docs/dictionary.md.'
    );
  }
  return {
    name: 'krdict',
    delay: 130, // be polite to the API
    async gloss(head) {
      const url =
        `https://krdict.korean.go.kr/api/search?key=${key}` +
        `&q=${encodeURIComponent(head)}&part=word&sort=popular&translated=y&trans_lang=1`;
      // curl is more reliable than node fetch in this environment; retry a
      // couple of times so one transient hiccup doesn't drop a word.
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const xml = execFileSync(
            'curl',
            ['-s', '--max-time', '25', '-A', 'Mozilla/5.0 (polyglots-atlas seed)', url],
            { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }
          );
          if (xml && xml.includes('<channel>')) return parseKrdict(xml, head);
        } catch { /* retry */ }
        await sleep(400 * (attempt + 1));
      }
      return null;
    },
  };
}

// KRDICT Korean POS labels → our small enum.
const POS_MAP = { 명사: 'noun', 대명사: 'noun', 수사: 'noun', 동사: 'verb', 형용사: 'adj', 부사: 'adverb' };

const cdata = (s) => (s || '').replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim();
const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? cdata(m[1]) : '';
};

// Parse the KRDICT search XML for the exact-headword item.
function parseKrdict(xml, head) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  if (!items.length) return null;
  const item = items.find((b) => tag(b, 'word') === head) || items[0];

  const pos = POS_MAP[tag(item, 'pos')] || 'expression';
  const hanja = tag(item, 'origin') || null;
  const grade = tag(item, 'word_grade') || null;
  const krdictId = tag(item, 'target_code') || null;

  const senses = [...item.matchAll(/<sense>([\s\S]*?)<\/sense>/g)]
    .map((m) => m[1])
    .map((b) => ({
      gloss: (tag(b, 'trans_word') || tag(b, 'trans_dfn') || tag(b, 'definition')).split(';')[0].trim(),
      def: tag(b, 'definition') || null,
      enDef: tag(b, 'trans_dfn') || null,
      domain: null,
      note: null,
    }))
    .filter((s) => s.gloss);
  if (!senses.length) return null;

  return {
    hanja,
    reading: { rr: romanizeToken(head) },       // standard RR from the headword
    pos,
    origin: hanja ? 'sino' : 'native',          // heuristic; the hand pass fixes loanwords
    grade,
    krdictId,
    en: senses[0].gloss,
    senses,
    domain: 'general',
  };
}

const ADAPTERS = { manual: manualAdapter, krdict: krdictAdapter };

// ---- frequency list: "rank<ws>head" or bare "head" (line number = rank) ----
function readFreqList(path) {
  const seen = new Set();
  const out = [];
  readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .forEach((line, i) => {
      const [a, b] = line.split(/\s+/);
      const head = b || a;
      const rank = b ? Number(a) : i + 1;
      if (seen.has(head)) return; // dedupe (homonyms share a headword)
      seen.add(head);
      out.push({ rank, head });
    });
  return out;
}

// Overlay the hand bank's curated depth on a base entry (krdict or none).
const HAND = new Map(KO_VOCAB.map((e) => [e.head, e]));
function withHandDepth(base, head) {
  const hand = HAND.get(head);
  if (!hand) return { base, hand: false };
  const { id, band, freqRank, source, ...handRest } = hand;
  return { base: { ...(base || {}), ...handRest }, hand: true };
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
    const got = await adapter.gloss(head);
    const { base, hand } = withHandDepth(got, head);
    if (!got && !hand) { missing.push(head); continue; }
    const id = HAND.get(head)?.id || romanizeToken(head) || ('w' + (base.krdictId || rank));
    const source = got && hand ? `${adapter.name}+atlas-seed` : hand ? 'atlas-seed' : adapter.name;
    entries.push(normalizeEntry({ id, head, ...base, freqRank: rank, source }));
    if (adapter.delay) await sleep(adapter.delay);
  }

  const payload = {
    lang: 'ko',
    generatedAt: new Date().toISOString().slice(0, 10),
    source: '국립국어원 한국어기초사전 (KRDICT) Open API + atlas hand-checked bank',
    license:
      "Entries whose `source` includes 'krdict' are derived from 국립국어원 한국어기초사전 " +
      '(National Institute of Korean Language, Basic Korean Dictionary — https://krdict.korean.go.kr) ' +
      'and are licensed CC BY-SA 2.0 KR (https://creativecommons.org/licenses/by-sa/2.0/kr/): ' +
      "attribution required, adaptations share-alike. Hand-checked entries (source 'atlas-seed') " +
      "and the Japanese bridges / specimen sentences are the atlas author's, under the project's MIT license.",
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
  if (missing.length) console.error(`unglossed: ${missing.join(', ')}`);
}

main().catch((err) => { console.error(String(err.message || err)); process.exit(1); });
