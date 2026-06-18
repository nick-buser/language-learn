"""initial — dictionary_entries

Revision ID: 0001
Revises:
Create Date: 2026-06-18
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "dictionary_entries",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("lang", sa.String(length=8), nullable=False),
        sa.Column("slug", sa.String(length=128), nullable=False),
        sa.Column("head", sa.String(length=128), nullable=False),
        sa.Column("reading_rr", sa.String(length=256), nullable=False),
        sa.Column("pos", sa.String(length=32), nullable=False),
        sa.Column("origin", sa.String(length=32), nullable=False),
        sa.Column("en", sa.String(length=512), nullable=False),
        sa.Column("band", sa.Integer(), nullable=True),
        sa.Column("freq_rank", sa.Integer(), nullable=True),
        sa.Column("grade", sa.String(length=16), nullable=True),
        sa.Column("hanja", sa.String(length=64), nullable=True),
        sa.Column("domain", sa.String(length=64), nullable=True),
        sa.Column("source", sa.String(length=64), nullable=False),
        sa.Column("data", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name="pk_dictionary_entries"),
        sa.UniqueConstraint("lang", "slug", name="uq_dictionary_entries_lang_slug"),
    )
    op.create_index("ix_dictionary_entries_lang_band", "dictionary_entries", ["lang", "band"])
    op.create_index("ix_dictionary_entries_lang_head", "dictionary_entries", ["lang", "head"])


def downgrade() -> None:
    op.drop_index("ix_dictionary_entries_lang_head", table_name="dictionary_entries")
    op.drop_index("ix_dictionary_entries_lang_band", table_name="dictionary_entries")
    op.drop_table("dictionary_entries")
