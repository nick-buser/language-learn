"""Load a frontend dictionary JSON (e.g. ko.json) into Postgres.

Idempotent upsert on (lang, slug). The JSON is the generated, KRDICT-backed
dictionary the SPA ships locally; this copies it into the bank the API serves.

    uv run python -m polyglot_atlas.seed.dictionary \
        --file ../src/data/dictionary/ko.json --lang ko
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from sqlalchemy import func
from sqlalchemy.dialects.postgresql import insert

from ..db import SessionLocal
from ..models.dictionary import DictionaryEntry

_QUERYABLE = (
    "head",
    "reading_rr",
    "pos",
    "origin",
    "en",
    "band",
    "freq_rank",
    "grade",
    "hanja",
    "domain",
    "source",
    "data",
)


def _row(lang: str, entry: dict[str, Any]) -> dict[str, Any]:
    reading = entry.get("reading") or {}
    return {
        "lang": lang,
        "slug": entry["id"],
        "head": entry["head"],
        "reading_rr": reading.get("rr", ""),
        "pos": entry["pos"],
        "origin": entry["origin"],
        "en": entry["en"],
        "band": entry.get("band"),
        "freq_rank": entry.get("freqRank"),
        "grade": entry.get("grade"),
        "hanja": entry.get("hanja"),
        "domain": entry.get("domain"),
        "source": entry.get("source", "unknown"),
        "data": entry,
    }


def seed(file: Path, lang: str) -> int:
    payload = json.loads(file.read_text(encoding="utf-8"))
    entries: list[dict[str, Any]] = payload["entries"]
    if not entries:
        return 0
    rows = [_row(lang, e) for e in entries]
    stmt = insert(DictionaryEntry).values(rows)
    set_ = {col: getattr(stmt.excluded, col) for col in _QUERYABLE}
    set_["updated_at"] = func.now()
    stmt = stmt.on_conflict_do_update(
        index_elements=["lang", "slug"],
        set_=set_,
    )
    with SessionLocal() as db:
        db.execute(stmt)
        db.commit()
    return len(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed the dictionary from a frontend JSON.")
    parser.add_argument("--file", required=True, type=Path)
    parser.add_argument("--lang", required=True)
    args = parser.parse_args()
    count = seed(args.file, args.lang)
    print(f"seeded {count} entries ({args.lang}) from {args.file}")


if __name__ == "__main__":
    main()
