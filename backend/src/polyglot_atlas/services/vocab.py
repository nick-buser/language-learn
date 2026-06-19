"""Vocab-state service.

Validate stored records into the wire contract on the way out (so the type
contract holds at the edge and the SPA gets exactly the localStorage shape), and
assemble the slice + the generator-ready export.
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from sqlalchemy.orm import Session

from ..repositories import vocab as repo
from ..schemas.dictionary import Reading
from ..schemas.vocab import (
    Srs,
    VocabExport,
    VocabExportRow,
    VocabSlice,
    WordState,
)

_STATUSES = ("unseen", "met", "learning", "known", "target")


def get_slice(db: Session, lang: str) -> VocabSlice:
    rows = repo.list_by_lang(db, lang)
    words = {row.slug: WordState.model_validate(row.data) for row in rows}
    return VocabSlice(lang=lang, count=len(words), words=words)


def put_word(db: Session, lang: str, slug: str, state: WordState) -> WordState:
    data = state.model_dump(by_alias=True, exclude_none=True)
    row = repo.upsert(db, lang, slug, data)
    return WordState.model_validate(row.data)


def delete_word(db: Session, lang: str, slug: str) -> bool:
    return repo.delete(db, lang, slug)


def export(db: Session, lang: str) -> VocabExport:
    counts: dict[str, int] = dict.fromkeys(_STATUSES, 0)
    words: list[VocabExportRow] = []
    for entry, state in repo.export_rows(db, lang):
        data: dict[str, Any] = entry.data
        status = state.status if state is not None else "unseen"
        counts[status] = counts.get(status, 0) + 1
        srs_data = state.data.get("srs") if state is not None else None
        words.append(
            VocabExportRow(
                id=data["id"],
                head=data["head"],
                reading=Reading.model_validate(data.get("reading") or {"rr": ""}),
                pos=data["pos"],
                origin=data["origin"],
                en=data["en"],
                band=data.get("band"),
                freq_rank=data.get("freqRank"),
                hanja=data.get("hanja"),
                status=status,
                since=state.since if state is not None else None,
                srs=Srs.model_validate(srs_data) if srs_data else None,
            )
        )
    return VocabExport(
        lang=lang,
        exported_at=datetime.now(UTC).isoformat(),
        counts=counts,
        words=words,
    )
