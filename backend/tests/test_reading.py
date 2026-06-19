"""Reading analysis — the wire contract + a Kiwi smoke test."""

from __future__ import annotations

from polyglot_atlas.schemas.reading import MorphToken
from polyglot_atlas.services import morphology


def test_morphtoken_wire_shape() -> None:
    tok = MorphToken(surface="학교", lemma="학교", pos="NNG", content=True, start=0, length=2)
    out = tok.model_dump(by_alias=True)
    assert out == {
        "surface": "학교",
        "lemma": "학교",
        "pos": "NNG",
        "content": True,
        "start": 0,
        "length": 2,
    }


def test_kiwi_analyze_smoke() -> None:
    text = "학교에서 밥을 먹어요"
    toks = morphology.analyze(text)
    by_lemma = {t.lemma: t for t in toks}

    # nouns + the verb lemma surface as content morphemes
    assert by_lemma["학교"].content and by_lemma["학교"].pos == "NNG"
    assert by_lemma["밥"].content
    assert by_lemma["먹다"].content and by_lemma["먹다"].pos == "VV"  # 먹어요 → 먹다
    # the locative particle 에서 is present but NOT content
    assert any(t.surface == "에서" and not t.content for t in toks)
    # offsets map back into the original string
    h = by_lemma["학교"]
    assert text[h.start : h.start + h.length] == "학교"
