"""The reading-analysis contract — morpheme tokens for coverage.

The SPA POSTs raw text to ``/v1/reading/analyze`` and joins the returned lemmas to
the dictionary + the learner's live vocab state to compute known-word coverage.
Only morphology lives here (stateless); the join + classification stay client-side
so coverage recomputes instantly as words are marked.
"""

from __future__ import annotations

from .common import CamelModel


class AnalyzeRequest(CamelModel):
    text: str


class MorphToken(CamelModel):
    surface: str  # the morpheme as it appears in the text
    lemma: str  # dictionary form (Kiwi's lemma — 먹어요 → 먹다, 예쁜 → 예쁘다)
    pos: str  # Kiwi POS tag (NNG, VV, JKB, EF, …)
    content: bool  # a lexical/content morpheme (vs particle / ending / punctuation)
    start: int  # char offset into the request text
    length: int  # char length (so the SPA can highlight the span)


class AnalyzeResponse(CamelModel):
    tokens: list[MorphToken]
