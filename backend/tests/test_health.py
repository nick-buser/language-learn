"""Liveness probe — no database required."""

from __future__ import annotations

from fastapi.testclient import TestClient

from polyglot_atlas.main import app


def test_healthz() -> None:
    client = TestClient(app)
    resp = client.get("/healthz")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}
