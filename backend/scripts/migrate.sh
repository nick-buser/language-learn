#!/usr/bin/env sh
# Migrate + seed — run as the rw/owner role by `labctl migrate` (and the future
# CI migrate-dev / migrate-prod steps), never by the long-running app container
# (which holds only the DML-only `app` role). PA_DATABASE_URL is the rw DSN,
# handed in by labctl via `docker run -e`.
#
#   1. apply committed schema migrations (DDL)
#   2. load the reference dictionary (idempotent upsert; data baked into the
#      image at /app/seed so the released artifact can seed itself)
set -eu

echo "[migrate] alembic upgrade head"
alembic upgrade head

echo "[migrate] seed dictionary (ko)"
python -m polyglot_atlas.seed.dictionary --file /app/seed/ko.json --lang ko

echo "[migrate] done"
