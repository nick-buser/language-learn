"""Dictionary read API — ``/v1/dictionary/...``.

The list endpoint is what the SPA's ``loadVocab(lang)`` calls; its response is
the DictionaryEntry shape the frontend already renders.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas.dictionary import DictionaryEntryOut, DictionarySlice
from ..services import dictionary as svc

router = APIRouter(prefix="/dictionary", tags=["dictionary"])

DbSession = Annotated[Session, Depends(get_db)]


@router.get("/{lang}", response_model=DictionarySlice)
def get_dictionary(lang: str, db: DbSession) -> DictionarySlice:
    """The whole dictionary for a language (what loadVocab fetches)."""
    return svc.get_slice(db, lang)


@router.get("/{lang}/{slug}", response_model=DictionaryEntryOut)
def get_entry(lang: str, slug: str, db: DbSession) -> DictionaryEntryOut:
    """A single entry by its slug."""
    entry = svc.get_entry(db, lang, slug)
    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No '{slug}' in the {lang} dictionary.",
        )
    return entry
