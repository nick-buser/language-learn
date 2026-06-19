"""The vocab-state contract — the exact shapes the SPA's ``useVocabStore`` keeps.

``WordState`` mirrors one entry of the localStorage ``words`` map (camelCase srs
keys); ``VocabSlice`` mirrors the whole map so the SPA hydrates with no transform.
``VocabExport`` is the generator-ready join (state × dictionary projection) the
future extensive-reading writer consumes.
"""

from __future__ import annotations

from pydantic import Field

from .common import CamelModel
from .dictionary import Reading


class Srs(CamelModel):
    reps: int
    lapses: int
    ease: float
    interval: int
    due: str


class ReviewLog(CamelModel):
    date: str
    grade: str


class WordState(CamelModel):
    """One word's per-learner record — ``unseen`` is never stored (no record)."""

    status: str  # met | learning | known | target
    since: str
    source: str = "ledger"
    srs: Srs | None = None
    log: list[ReviewLog] | None = None


class VocabSlice(CamelModel):
    """A whole language's per-learner state — the localStorage ``words`` map."""

    lang: str
    count: int
    words: dict[str, WordState]


class VocabExportRow(CamelModel):
    """One word in the export — the dictionary projection joined to its state."""

    id: str
    head: str
    reading: Reading
    pos: str
    origin: str
    en: str
    band: int | None = None
    freq_rank: int | None = None  # -> freqRank
    hanja: str | None = None
    status: str
    since: str | None = None
    srs: Srs | None = None


class VocabExport(CamelModel):
    """The generator-ready export: every word with its known/target/unseen state.

    The extensive-reading generator reads ``words``: the known pool is the ~98%
    coverage floor; unknowns are sampled heavily from ``status == "target"``.
    """

    lang: str
    exported_at: str = Field(alias="exportedAt")
    counts: dict[str, int]
    words: list[VocabExportRow]
