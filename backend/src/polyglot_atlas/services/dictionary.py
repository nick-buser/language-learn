"""Dictionary service — validate stored payloads into the wire contract.

Each row's JSONB ``data`` is validated through ``DictionaryEntryOut`` on the way
out, so the type contract holds at the edge and the SPA gets exactly the shape
it already knows.
"""

from __future__ import annotations

from sqlalchemy.orm import Session

from ..repositories import dictionary as repo
from ..schemas.dictionary import DictionaryEntryOut, DictionarySlice


def get_slice(db: Session, lang: str) -> DictionarySlice:
    rows = repo.list_by_lang(db, lang)
    entries = [DictionaryEntryOut.model_validate(row.data) for row in rows]
    return DictionarySlice(lang=lang, count=len(entries), entries=entries)


def get_entry(db: Session, lang: str, slug: str) -> DictionaryEntryOut | None:
    row = repo.get(db, lang, slug)
    if row is None:
        return None
    return DictionaryEntryOut.model_validate(row.data)
