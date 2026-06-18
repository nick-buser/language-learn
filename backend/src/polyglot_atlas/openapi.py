"""Dump the OpenAPI schema to the committed ``openapi.json`` contract.

    uv run python -m polyglot_atlas.openapi

The SPA codegens its typed client from this file; CI fails the build on drift
(generate, then `git diff --exit-code openapi.json`).
"""

from __future__ import annotations

import json
from pathlib import Path

from .main import app

OUTPUT = Path(__file__).resolve().parents[2] / "openapi.json"


def main() -> None:
    schema = app.openapi()
    OUTPUT.write_text(json.dumps(schema, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {OUTPUT} ({len(schema['paths'])} paths)")


if __name__ == "__main__":
    main()
