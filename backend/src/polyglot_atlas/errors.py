"""A consistent error envelope — RFC 9457 ``application/problem+json`` — and,
when a built SPA is configured, same-origin SPA serving.

Every error the API returns (validation, 404s, unhandled) comes back as a
problem document, so the SPA has one shape to handle. When ``spa_dir`` is set,
the 404 handler does double duty: a GET to a non-API path falls back to the
SPA (a real static file if one exists, else index.html for client-side
routing). It's a 404 *handler*, not a catch-all GET route, so non-GET methods
to missing paths keep clean method semantics (no spurious 405s on the API).
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse, Response
from starlette.exceptions import HTTPException as StarletteHTTPException

PROBLEM_JSON = "application/problem+json"

# Paths the SPA fallback must never absorb — they 404 as JSON so API clients
# (and curl/scripts) see the right status, not HTML.
_API_PREFIXES = ("/v1", "/healthz", "/readyz", "/docs", "/redoc", "/openapi", "/assets/")


def _is_api_path(path: str) -> bool:
    return any(path == p or path.startswith(p + "/") or path.startswith(p) for p in _API_PREFIXES)


def problem(
    status_code: int,
    title: str,
    detail: str | None = None,
    *,
    type_: str = "about:blank",
    **extra: Any,
) -> JSONResponse:
    body: dict[str, Any] = {"type": type_, "title": title, "status": status_code}
    if detail is not None:
        body["detail"] = detail
    body.update(extra)
    return JSONResponse(status_code=status_code, content=body, media_type=PROBLEM_JSON)


async def _validation_exception(request: Request, exc: RequestValidationError) -> JSONResponse:
    return problem(
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "Request validation failed",
        "The request did not match the expected schema.",
        errors=exc.errors(),
    )


async def _unhandled_exception(request: Request, exc: Exception) -> JSONResponse:
    return problem(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "Internal server error",
        "An unexpected error occurred.",
    )


def add_error_handlers(app: FastAPI, spa_dir: Path | None = None) -> None:
    async def _http_exception(request: Request, exc: StarletteHTTPException) -> Response:
        # SPA fallback: a GET 404 to a non-API path serves the frontend.
        if (
            spa_dir is not None
            and exc.status_code == status.HTTP_404_NOT_FOUND
            and request.method == "GET"
            and not _is_api_path(request.url.path)
        ):
            rel = request.url.path.lstrip("/")
            if rel:
                candidate = (spa_dir / rel).resolve()
                if candidate.is_file() and spa_dir.resolve() in candidate.parents:
                    return FileResponse(candidate)
            return FileResponse(spa_dir / "index.html")
        title = exc.detail if isinstance(exc.detail, str) else "Request failed"
        return problem(exc.status_code, title)

    app.add_exception_handler(StarletteHTTPException, _http_exception)  # type: ignore[arg-type]
    app.add_exception_handler(RequestValidationError, _validation_exception)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, _unhandled_exception)
