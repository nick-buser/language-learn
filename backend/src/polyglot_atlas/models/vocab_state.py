"""The per-learner vocabulary-state table.

Single learner (no auth yet — this app is private/narrow-share). Mirrors the
dictionary table's hybrid shape: queryable typed columns for the generator's
known/target scans, plus a JSONB ``data`` column holding the word record exactly
as the SPA's ``useVocabStore`` keeps it in localStorage (``status``, ``since``,
``source``, ``srs``, ``log``). Reads return ``data`` verbatim, so the API and the
localStorage cache are byte-identical — the same contract trick the dictionary uses.

``unseen`` is never stored: the absence of a row *is* the unseen state, so filing
a word back to unseen deletes its row.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import BigInteger, DateTime, Index, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class VocabState(Base):
    __tablename__ = "vocab_state"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    # identity — single learner, keyed by the dictionary entry's slug
    lang: Mapped[str] = mapped_column(String(8), nullable=False)
    slug: Mapped[str] = mapped_column(String(128), nullable=False)

    # queryable projection of the word record
    status: Mapped[str] = mapped_column(String(16), nullable=False)  # met|learning|known|target
    since: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD frontend dayKey
    source: Mapped[str] = mapped_column(String(16), nullable=False)

    # the full per-word record (status, since, source, srs?, log?), returned verbatim
    data: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("lang", "slug", name="uq_vocab_state_lang_slug"),
        Index("ix_vocab_state_lang_status", "lang", "status"),
    )
