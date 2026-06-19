# Polyglot Atlas — backend API

The dictionary + per-learner vocab-state API for **The Polyglot's Atlas**
(the SPA lives one level up). FastAPI, served from the homelab `polyglot_atlas`
Postgres + Garage.

## Stack

uv · FastAPI · Pydantic v2 (+ pydantic-settings) · **sync** SQLAlchemy 2.0
(typed `Mapped[...]`) over psycopg3 · Alembic · structlog · Ruff + mypy `--strict`.
`src/` layout split into `api` / `services` / `repositories` / `schemas` / `models`.
Errors are RFC 9457 `application/problem+json`; the DB pool is lifespan-managed.

## Quick start (local)

```sh
cd backend
uv sync                                   # create .venv, install deps
cp .env.example .env                       # point PA_DATABASE_URL at a local pg

# a throwaway Postgres for development:
docker run -d --name pa-pg -p 5433:5432 \
  -e POSTGRES_USER=polyglot -e POSTGRES_PASSWORD=polyglot \
  -e POSTGRES_DB=polyglot_atlas postgres:16

uv run alembic upgrade head                # create the schema
uv run python -m polyglot_atlas.seed.dictionary \
  --file ../src/data/dictionary/ko.json --lang ko   # load the 160-word bank

uv run uvicorn polyglot_atlas.main:app --reload --port 8000
# GET http://localhost:8000/v1/dictionary/ko   → the same shape the SPA loads
```

Checks:

```sh
uv run ruff check . && uv run ruff format --check .
uv run mypy
uv run pytest
```

## Endpoints (v1)

| Method | Path | Notes |
|---|---|---|
| GET | `/healthz` | liveness |
| GET | `/readyz` | readiness (DB ping) |
| GET | `/v1/dictionary/{lang}` | the whole dictionary — what `loadVocab(lang)` fetches |
| GET | `/v1/dictionary/{lang}/{slug}` | one entry |
| GET | `/v1/vocab/{lang}` | the whole per-learner state — what `useVocabStore` hydrates |
| PUT | `/v1/vocab/{lang}/{slug}` | upsert one word's state (the SPA's write-through) |
| DELETE | `/v1/vocab/{lang}/{slug}` | erase a word's state (the return to unseen) |
| GET | `/v1/vocab/{lang}/export` | every word + its known/target/unseen state — the reading generator's input |

The list response is the frontend `DictionaryEntry` contract verbatim (the entry
JSON is stored in a `data` JSONB column and validated out through Pydantic), so
the SPA swaps its local `ko.json` for a `fetch` with no transform.

## Layout

```
backend/
  pyproject.toml            uv project + ruff/mypy/pytest config
  alembic.ini
  src/polyglot_atlas/
    main.py                 app factory: lifespan, CORS, request-id, error envelope
    config.py               pydantic-settings (PA_* env)
    db.py                   engine + session (sync)
    logging.py              structlog
    errors.py               RFC 9457 problem+json
    models/                 SQLAlchemy 2.0 typed models (dictionary_entries, vocab_state)
    schemas/                Pydantic wire contract (camelCase ↔ snake_case)
    repositories/           SQL only
    services/               business logic
    api/                    routers (health, dictionary, vocab)
    alembic/                migrations (0001 initial, 0002 vocab_state)
    seed/                   ko.json → Postgres
  tests/
```

## Roadmap (next slices)

- ~~**Vocab state**~~ — done: the `vocab_state` table + `/v1/vocab` (slice / upsert /
  delete / export); the SPA hydrates and writes through (`atlas.<lang>.vocab.v1` is now
  the offline cache). Single-learner, no auth yet — a minimal identity story is the
  remaining piece before this is shared beyond one person.
- **OpenAPI contract sharing** — commit `openapi.json`, generate the SPA's TS
  client (openapi-typescript + openapi-fetch), CI drift check.
- **Observability** — OpenTelemetry → the homelab SigNoz; structlog trace correlation.
- **Packaging/CI** — uv multi-stage Dockerfile, gunicorn+uvicorn, Woodpecker
  (lint/type/test/schema-drift) → Dokploy, env injected from the vault.
- **Garage** — store generated reading passages / TTS audio in `polyglot-atlas-{dev,prod}`.
- Testing depth: Schemathesis (fuzz the OpenAPI), testcontainers (real pg in tests).
