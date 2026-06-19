"""Reading-analysis API — ``POST /v1/reading/analyze``.

Stateless: turns Korean text into morpheme tokens (Kiwi) for the SPA's coverage
join. No DB — the per-learner state join happens client-side against live state.
"""

from __future__ import annotations

from fastapi import APIRouter

from ..schemas.reading import AnalyzeRequest, AnalyzeResponse
from ..services import morphology as svc

router = APIRouter(prefix="/reading", tags=["reading"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    """Tokenize Korean text into morphemes (lemma + POS + char offsets)."""
    return AnalyzeResponse(tokens=svc.analyze(req.text))
