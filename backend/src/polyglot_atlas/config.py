"""Typed, validated configuration (pydantic-settings) — the 12-factor piece.

Every setting is read from the environment with the ``PA_`` prefix (or a local
``.env`` in development). The homelab dev/prod DSN is injected at deploy time
from the vault; it never lives in this repo.
"""

from __future__ import annotations

import json
from functools import lru_cache
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="PA_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    environment: str = "dev"
    # Sync SQLAlchemy + psycopg3 DSN. Local throwaway Postgres by default.
    database_url: str = "postgresql+psycopg://polyglot:polyglot@localhost:5433/polyglot_atlas"
    # NoDecode: skip pydantic-settings' source-level JSON decode so a plain
    # comma-separated PA_CORS_ORIGINS reaches the validator below (without it,
    # the env source errors on a non-JSON list value before validation runs).
    cors_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:5173", "http://127.0.0.1:5173"]
    )
    log_level: str = "INFO"
    api_v1_prefix: str = "/v1"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: object) -> object:
        # Accept a comma-separated string from the environment as well as JSON.
        if isinstance(value, str):
            text = value.strip()
            if text.startswith("["):
                parsed: object = json.loads(text)
                return parsed
            return [o.strip() for o in text.split(",") if o.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
