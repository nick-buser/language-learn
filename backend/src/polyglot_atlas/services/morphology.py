"""Korean morphology — in-process via Kiwi (kiwipiepy).

No separate service: Kiwi is a pip dependency, loaded once and reused. ``analyze``
turns raw text into morpheme tokens (lemma + POS + char offsets); the coverage
join happens in the SPA against the live vocab state. CPU-bound and synchronous —
which suits the backend's sync-in-threadpool model (see ``db.py``).
"""

from __future__ import annotations

import threading

from kiwipiepy import Kiwi

from ..schemas.reading import MorphToken

# Lexical / content morphemes — the ones that map to dictionary headwords and so
# count toward known-word coverage. Everything else (particles J*, endings E*,
# derivational suffixes XS*, copula VCP, punctuation/symbols S*, digits SN) is
# grammatical scaffolding, excluded from the coverage denominator.
CONTENT_TAGS = frozenset(
    {
        "NNG",
        "NNP",
        "NNB",
        "NP",
        "NR",  # nouns, pronouns, numerals
        "VV",
        "VA",
        "VX",  # verbs, adjectives, auxiliaries
        "MAG",
        "MAJ",
        "MM",
        "IC",  # adverbs, determiners, interjections
        "XR",
        "SL",
        "SH",  # roots, foreign words, hanja
    }
)

_kiwi: Kiwi | None = None
_lock = threading.Lock()


def _engine() -> Kiwi:
    # Lazy singleton: the model is tens of MB, so it isn't loaded at import time
    # (the openapi dump and most tests never tokenize). Double-checked lock so
    # concurrent first requests don't build two engines.
    global _kiwi
    if _kiwi is None:
        with _lock:
            if _kiwi is None:
                _kiwi = Kiwi()
    return _kiwi


def analyze(text: str) -> list[MorphToken]:
    return [
        MorphToken(
            surface=t.form,
            lemma=t.lemma,
            pos=t.tag,
            content=t.tag in CONTENT_TAGS,
            start=t.start,
            length=t.len,
        )
        for t in _engine().tokenize(text)
    ]
