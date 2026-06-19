"""The vocab-state wire contract — a stored word record must serialize to the
exact shape the SPA's ``useVocabStore`` keeps in localStorage (camelCase srs
keys). No database required.
"""

from __future__ import annotations

from typing import Any

from polyglot_atlas.schemas.vocab import WordState

# A learning word as stored in `data` JSONB / localStorage.
SAMPLE: dict[str, Any] = {
    "status": "learning",
    "since": "2026-06-19",
    "source": "ledger",
    "srs": {"reps": 3, "lapses": 1, "ease": 2.35, "interval": 12, "due": "2026-07-01"},
    "log": [{"date": "2026-06-19", "grade": "good"}],
}


def test_wordstate_roundtrips_to_localstorage_shape() -> None:
    state = WordState.model_validate(SAMPLE)
    out = state.model_dump(by_alias=True, exclude_none=True)

    assert out["status"] == "learning"
    assert out["srs"]["ease"] == 2.35
    assert out["srs"]["due"] == "2026-07-01"
    assert out["log"][0]["grade"] == "good"


def test_target_word_carries_no_srs() -> None:
    # A flagged gap: deliberately not-known, not yet wound into the SRS queue.
    state = WordState.model_validate(
        {"status": "target", "since": "2026-06-19", "source": "ledger"}
    )

    assert state.status == "target"
    assert state.srs is None
    out = state.model_dump(by_alias=True, exclude_none=True)
    assert "srs" not in out
