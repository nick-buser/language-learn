"""The dictionary contract — the exact shape the SPA's loadVocab expects.

These mirror the frontend's DictionaryEntry/v2 (src/data/dictionary/schema.js):
camelCase keys (``freqRank``, ``jpRr``, ``enDef``, ``krdictId``) and the Korean
sense definition under the JS keyword ``def``.
"""

from __future__ import annotations

from pydantic import Field

from .common import CamelModel


class Reading(CamelModel):
    rr: str
    kana: str | None = None


class Bridge(CamelModel):
    kanji: str
    kana: str | None = None  # '' for katakana-only loanwords
    rr: str
    kind: str  # cognate | loan | equivalent


class Note(CamelModel):
    head: str
    html: str


class Example(CamelModel):
    text: str
    rr: str | None = None
    jp: str | None = None
    jp_rr: str | None = None  # -> jpRr
    en: str | None = None


class Sense(CamelModel):
    gloss: str
    definition: str | None = Field(default=None, alias="def")  # KRDICT Korean def
    en_def: str | None = None  # -> enDef
    domain: str | None = None
    note: Note | None = None


class DictionaryEntryOut(CamelModel):
    id: str
    head: str
    hanja: str | None = None
    reading: Reading
    pos: str
    origin: str
    en: str
    senses: list[Sense]
    band: int | None = None
    freq_rank: int | None = None  # -> freqRank
    conjugation: str | None = None
    domain: str | None = None
    grade: str | None = None
    bridge: Bridge | None = None
    ex: Example | None = None
    note: Note | None = None
    source: str
    krdict_id: str | None = None  # -> krdictId


class DictionarySlice(CamelModel):
    """A whole language's dictionary — what loadVocab(lang) returns."""

    lang: str
    count: int
    entries: list[DictionaryEntryOut]
