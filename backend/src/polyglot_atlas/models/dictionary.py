"""The dictionary table.

Hybrid shape: queryable typed columns for filter/sort/search, plus a JSONB
``data`` column holding the full entry exactly as the SPA consumes it (the
DictionaryEntry contract piloted in the frontend). Reads return ``data``
verbatim, so the API and the local ``ko.json`` are byte-identical — which is
the whole point of the frontend's loadVocab seam.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import BigInteger, DateTime, Index, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class DictionaryEntry(Base):
    __tablename__ = "dictionary_entries"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    # identity / contract
    lang: Mapped[str] = mapped_column(String(8), nullable=False)
    slug: Mapped[str] = mapped_column(String(128), nullable=False)  # the frontend entry id

    # queryable projection of the payload
    head: Mapped[str] = mapped_column(String(128), nullable=False)
    reading_rr: Mapped[str] = mapped_column(String(256), nullable=False)
    pos: Mapped[str] = mapped_column(String(32), nullable=False)
    origin: Mapped[str] = mapped_column(String(32), nullable=False)
    en: Mapped[str] = mapped_column(String(512), nullable=False)
    band: Mapped[int | None] = mapped_column(nullable=True)
    freq_rank: Mapped[int | None] = mapped_column(nullable=True)
    grade: Mapped[str | None] = mapped_column(String(16), nullable=True)
    hanja: Mapped[str | None] = mapped_column(String(64), nullable=True)
    domain: Mapped[str | None] = mapped_column(String(64), nullable=True)
    source: Mapped[str] = mapped_column(String(64), nullable=False)

    # the full DictionaryEntry payload, returned verbatim
    data: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("lang", "slug", name="uq_dictionary_entries_lang_slug"),
        Index("ix_dictionary_entries_lang_band", "lang", "band"),
        Index("ix_dictionary_entries_lang_head", "lang", "head"),
    )
