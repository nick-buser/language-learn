"""Config parsing — the CORS list must accept a comma-separated env string
(the deploy form), not just JSON. Regression for the pydantic-settings
source-level JSON-decode gotcha.
"""

from __future__ import annotations

import pytest

from polyglot_atlas.config import Settings


def test_cors_origins_from_comma_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("PA_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    settings = Settings()
    assert settings.cors_origins == ["http://localhost:5173", "http://127.0.0.1:5173"]


def test_cors_origins_from_json_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("PA_CORS_ORIGINS", '["http://a", "http://b"]')
    settings = Settings()
    assert settings.cors_origins == ["http://a", "http://b"]


def test_cors_origins_default() -> None:
    assert Settings().cors_origins == ["http://localhost:5173", "http://127.0.0.1:5173"]
