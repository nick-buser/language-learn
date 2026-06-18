"""SQLAlchemy models. Import side-effects register tables on ``Base.metadata``."""

from __future__ import annotations

from .base import Base
from .dictionary import DictionaryEntry

__all__ = ["Base", "DictionaryEntry"]
