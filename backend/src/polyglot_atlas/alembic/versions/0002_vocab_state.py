"""vocab_state — per-learner word status + SRS

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-19
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "vocab_state",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("lang", sa.String(length=8), nullable=False),
        sa.Column("slug", sa.String(length=128), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("since", sa.String(length=10), nullable=False),
        sa.Column("source", sa.String(length=16), nullable=False),
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
        sa.PrimaryKeyConstraint("id", name="pk_vocab_state"),
        sa.UniqueConstraint("lang", "slug", name="uq_vocab_state_lang_slug"),
    )
    op.create_index("ix_vocab_state_lang_status", "vocab_state", ["lang", "status"])


def downgrade() -> None:
    op.drop_index("ix_vocab_state_lang_status", table_name="vocab_state")
    op.drop_table("vocab_state")
