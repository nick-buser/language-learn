"""Vocab-state data access (single learner)."""

from __future__ import annotations

from typing import Any

from sqlalchemy import func, nulls_last, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session

from ..models.dictionary import DictionaryEntry
from ..models.vocab_state import VocabState


def list_by_lang(db: Session, lang: str) -> list[VocabState]:
    stmt = select(VocabState).where(VocabState.lang == lang).order_by(VocabState.slug)
    return list(db.execute(stmt).scalars().all())


def get(db: Session, lang: str, slug: str) -> VocabState | None:
    stmt = select(VocabState).where(VocabState.lang == lang, VocabState.slug == slug)
    return db.execute(stmt).scalar_one_or_none()


def upsert(db: Session, lang: str, slug: str, data: dict[str, Any]) -> VocabState:
    """Idempotent write-through on ``(lang, slug)`` — the SPA pushes one word."""
    values = {
        "lang": lang,
        "slug": slug,
        "status": data["status"],
        "since": data["since"],
        "source": data.get("source", "ledger"),
        "data": data,
    }
    stmt = insert(VocabState).values(values)
    stmt = stmt.on_conflict_do_update(
        index_elements=["lang", "slug"],
        set_={
            "status": stmt.excluded.status,
            "since": stmt.excluded.since,
            "source": stmt.excluded.source,
            "data": stmt.excluded.data,
            "updated_at": func.now(),
        },
    )
    db.execute(stmt)
    db.commit()
    row = get(db, lang, slug)
    assert row is not None  # just upserted
    return row


def delete(db: Session, lang: str, slug: str) -> bool:
    """Erase a word's state. Returns whether a row existed to erase."""
    row = get(db, lang, slug)
    if row is None:
        return False
    db.delete(row)
    db.commit()
    return True


def export_rows(db: Session, lang: str) -> list[Row[Any]]:
    """Every dictionary entry for a language, left-joined to its state row (or
    None when unseen). Frequency order, so the export reads top-down."""
    stmt = (
        select(DictionaryEntry, VocabState)
        .outerjoin(
            VocabState,
            (VocabState.lang == DictionaryEntry.lang) & (VocabState.slug == DictionaryEntry.slug),
        )
        .where(DictionaryEntry.lang == lang)
        .order_by(nulls_last(DictionaryEntry.freq_rank), DictionaryEntry.head)
    )
    return list(db.execute(stmt).all())
