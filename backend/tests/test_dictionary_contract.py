"""The wire contract — a stored entry must serialize to the exact shape the
SPA's loadVocab already consumes (camelCase keys, ``def`` for the KRDICT sense
definition). No database required.
"""

from __future__ import annotations

from typing import Any

from polyglot_atlas.schemas.dictionary import DictionaryEntryOut

# A merged (KRDICT + hand bank) entry, as stored in `data` JSONB.
SAMPLE: dict[str, Any] = {
    "id": "hakgyo",
    "head": "학교",
    "hanja": "学校",
    "reading": {"rr": "hakgyo"},
    "pos": "noun",
    "origin": "sino",
    "en": "school",
    "senses": [
        {
            "gloss": "school",
            "def": "학생을 교육하는 기관.",
            "enDef": "An institution...",
            "domain": None,
            "note": None,
        }
    ],
    "band": 1,
    "freqRank": 15,
    "conjugation": None,
    "domain": "school",
    "grade": "초급",
    "bridge": {"kanji": "学校", "kana": "がっこう", "rr": "gakkō", "kind": "cognate"},
    "ex": {
        "text": "<m>학교</m>에 가요.",
        "rr": "hakgyoe gayo",
        "jp": "学校に行きます。",
        "jpRr": "gakkō ni ikimasu",
        "en": "I’m going to school.",
    },
    "note": {"head": "the bridge’s poster word", "html": "がっこう → 학교 ..."},
    "source": "krdict+atlas-seed",
    "krdictId": "73276",
}


def test_entry_roundtrips_to_frontend_shape() -> None:
    entry = DictionaryEntryOut.model_validate(SAMPLE)
    out = entry.model_dump(by_alias=True, exclude_none=False)

    # camelCase + the JS-keyword sense key survive the round trip
    assert out["freqRank"] == 15
    assert out["krdictId"] == "73276"
    assert out["senses"][0]["def"] == "학생을 교육하는 기관."
    assert out["senses"][0]["enDef"] == "An institution..."
    assert out["ex"]["jpRr"] == "gakkō ni ikimasu"
    assert out["bridge"]["kind"] == "cognate"


def test_krdict_only_entry_without_bridge_or_ex() -> None:
    # KRDICT-only entries carry no Japanese bridge and no specimen sentence.
    sample = {
        "id": "sarang",
        "head": "사랑",
        "hanja": None,
        "reading": {"rr": "sarang"},
        "pos": "noun",
        "origin": "native",
        "en": "love",
        "senses": [{"gloss": "love", "def": "열렬히 좋아하는 마음."}],
        "band": 1,
        "freqRank": 21,
        "domain": "general",
        "grade": "초급",
        "source": "krdict",
    }
    entry = DictionaryEntryOut.model_validate(sample)
    assert entry.bridge is None
    assert entry.ex is None
    assert entry.senses[0].definition == "열렬히 좋아하는 마음."
