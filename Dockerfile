# syntax=docker/dockerfile:1.7
# Multi-stage image for polyglot-atlas (Vite/React SPA + Python FastAPI).
# Adapted from the homelab python-fastapi-vite template to THIS repo's layout:
# the SPA is at the repo ROOT (→ dist/), the API lives in backend/.
#
#   web-builder    → vite build → /web/dist  (same-origin: VITE_API_URL="")
#   python-builder → uv sync (no dev) → /opt/venv, project at /app/src
#   runtime        → python + venv + src + dist; uvicorn serves API + SPA
#   dev            → runtime + dev deps + --reload (Dokploy dev slot)

ARG PYTHON_VERSION=3.13
ARG NODE_VERSION=22
ARG UV_VERSION=0.5.13

# Aliased uv stage — `COPY --from=` doesn't reliably expand ARGs in stage refs.
FROM ghcr.io/astral-sh/uv:${UV_VERSION} AS uv-bin

# ============================================================
# Stage 1 — build the SPA (root Vite app)
# ============================================================
FROM node:${NODE_VERSION}-alpine AS web-builder
WORKDIR /web
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . ./
# Same-origin: the deployed SPA calls /v1 on the host it's served from.
ENV VITE_API_URL=""
RUN npm run build

# ============================================================
# Stage 2 — resolve Python deps into /opt/venv (project at /app)
# ============================================================
FROM python:${PYTHON_VERSION}-slim AS python-builder
COPY --from=uv-bin /uv /uvx /usr/local/bin/
ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=never \
    UV_PROJECT_ENVIRONMENT=/opt/venv
WORKDIR /app
COPY backend/pyproject.toml backend/uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev
COPY backend/src/ ./src/
COPY backend/alembic.ini backend/README.md ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# ============================================================
# Stage 3 — runtime (serves API + SPA same-origin)
# ============================================================
FROM python:${PYTHON_VERSION}-slim AS runtime
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/opt/venv/bin:${PATH}" \
    PA_ENVIRONMENT=prod \
    PA_SPA_DIR=/app/web/dist
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN groupadd --system app \
    && useradd --system --gid app --uid 1000 --no-create-home app
WORKDIR /app
COPY --from=python-builder /opt/venv /opt/venv
COPY --from=python-builder /app /app
COPY --from=web-builder /web/dist /app/web/dist
COPY backend/scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
    && chown -R app:app /app
USER app
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=3 \
    CMD python -c "import sys, urllib.request as u; r=u.urlopen('http://127.0.0.1:8000/healthz', timeout=3); sys.exit(0 if r.status==200 else 1)" \
    || exit 1
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["uvicorn", "polyglot_atlas.main:app", "--host", "0.0.0.0", "--port", "8000"]

# ============================================================
# Stage 4 — dev (Dokploy dev slot: hot-reload + dev deps)
# ============================================================
FROM runtime AS dev
USER root
COPY --from=uv-bin /uv /uvx /usr/local/bin/
ENV UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    UV_PROJECT_ENVIRONMENT=/opt/venv \
    PA_ENVIRONMENT=dev
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen
USER app
CMD ["uvicorn", "polyglot_atlas.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
