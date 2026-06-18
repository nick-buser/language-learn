"""FastAPI application factory — middleware, lifespan, routers, error envelope."""

from __future__ import annotations

import uuid
from collections.abc import AsyncIterator, Awaitable, Callable
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from . import __version__
from .api import dictionary, health
from .config import get_settings
from .db import engine
from .errors import add_error_handlers
from .logging import configure_logging

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    configure_logging(settings.log_level, json=settings.environment != "dev")
    yield
    engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Polyglot Atlas API",
        version=__version__,
        summary="Dictionary + per-learner vocab state for The Polyglot's Atlas.",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def request_id(
        request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        rid = request.headers.get("x-request-id") or uuid.uuid4().hex
        response = await call_next(request)
        response.headers["x-request-id"] = rid
        return response

    add_error_handlers(app)

    app.include_router(health.router)
    app.include_router(dictionary.router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
