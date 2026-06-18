"""Dictionary data access."""

from __future__ import annotations

from sqlalchemy import nulls_last, select
from sqlalchemy.orm import Session

from ..models.dictionary import DictionaryEntry


def list_by_lang(db: Session, lang: str) -> list[DictionaryEntry]:
    stmt = (
        select(DictionaryEntry)
        .where(DictionaryEntry.lang == lang)
        .order_by(nulls_last(DictionaryEntry.freq_rank), DictionaryEntry.head)
    )
    return list(db.execute(stmt).scalars().all())


def get(db: Session, lang: str, slug: str) -> DictionaryEntry | None:
    stmt = select(DictionaryEntry).where(
        DictionaryEntry.lang == lang,
        DictionaryEntry.slug == slug,
    )
    return db.execute(stmt).scalar_one_or_none()


def langs(db: Session) -> list[str]:
    stmt = select(DictionaryEntry.lang).distinct().order_by(DictionaryEntry.lang)
    return list(db.execute(stmt).scalars().all())
