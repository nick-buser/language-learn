#!/usr/bin/env sh
# Container entrypoint. NO migrations are APPLIED here — the runtime connects as
# the DML-only `app` role and cannot alter schema. `alembic upgrade head` runs
# separately, by the rw/owner role, in CI: migrate-dev on merge to main,
# migrate-prod on tag (see docs/db-migration-pattern.md in the homelab repo).

set -eu

if [ -z "${PA_DATABASE_URL:-}" ]; then
    echo "FATAL: PA_DATABASE_URL is not set." >&2
    exit 1
fi

# Read-only schema-drift check. MIGRATIONS_CHECK=off|warn|enforce (default warn).
# warn logs and starts anyway; enforce exits non-zero (fails the deploy) if the
# DB is behind. `alembic current` prints "(head)" only when the DB is at head —
# it applies nothing, and the app role only needs SELECT to read it.
if [ "${MIGRATIONS_CHECK:-warn}" != "off" ]; then
    if ! alembic current 2>/dev/null | grep -q '(head)'; then
        echo "[migrate-check] DB is BEHIND alembic head (or revision unreadable)"
        [ "${MIGRATIONS_CHECK:-warn}" = "enforce" ] && exit 1
    else
        echo "[migrate-check] DB at alembic head"
    fi
fi

echo "[entrypoint] exec: $*"
exec "$@"
