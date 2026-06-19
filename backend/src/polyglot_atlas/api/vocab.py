"""Vocab-state read/write API — ``/v1/vocab/...``.

Single-learner per-word state (status/SRS), the persistent home of what the SPA
once kept only in localStorage. The slice endpoint is what ``useVocabStore``
hydrates from; the export endpoint is the generator-ready join the reading writer
consumes.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas.vocab import VocabExport, VocabSlice, WordState
from ..services import vocab as svc

router = APIRouter(prefix="/vocab", tags=["vocab"])

DbSession = Annotated[Session, Depends(get_db)]


# exclude_none on the state responses so the wire omits absent srs/log keys —
# the SPA hydrates into the exact shape localStorage keeps (no explicit nulls).
@router.get("/{lang}", response_model=VocabSlice, response_model_exclude_none=True)
def get_vocab(lang: str, db: DbSession) -> VocabSlice:
    """The whole per-learner state for a language (what useVocabStore hydrates)."""
    return svc.get_slice(db, lang)


@router.get("/{lang}/export", response_model=VocabExport, response_model_exclude_none=True)
def export_vocab(lang: str, db: DbSession) -> VocabExport:
    """Every word with its known/target/unseen state — the generator's input."""
    return svc.export(db, lang)


@router.put("/{lang}/{slug}", response_model=WordState, response_model_exclude_none=True)
def put_vocab(lang: str, slug: str, state: WordState, db: DbSession) -> WordState:
    """Upsert one word's state (the SPA's write-through)."""
    return svc.put_word(db, lang, slug, state)


@router.delete("/{lang}/{slug}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vocab(lang: str, slug: str, db: DbSession) -> Response:
    """Erase a word's state — the transition back to unseen."""
    svc.delete_word(db, lang, slug)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
