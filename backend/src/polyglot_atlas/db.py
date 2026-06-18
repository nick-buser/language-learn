"""Database engine + session lifecycle.

Sync SQLAlchemy 2.0 over psycopg3 — deliberately not async. FastAPI runs sync
dependencies in a threadpool, which is simpler and free of async session
lifecycle traps; we'd only reach for async with a concrete I/O-concurrency
reason. The engine is module-level; the lifespan in main.py disposes it.
"""

from __future__ import annotations

from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from .config import get_settings

_settings = get_settings()

engine = create_engine(
    _settings.database_url,
    pool_pre_ping=True,
    future=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False,
)


def get_db() -> Iterator[Session]:
    """FastAPI dependency — one session per request, always closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
