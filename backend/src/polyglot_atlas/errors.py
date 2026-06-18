"""A consistent error envelope — RFC 9457 ``application/problem+json``.

Every error the API returns (validation, 404s, unhandled) comes back as a
problem document, so the SPA has one shape to handle.
"""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

PROBLEM_JSON = "application/problem+json"


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


async def _http_exception(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    title = exc.detail if isinstance(exc.detail, str) else "Request failed"
    return problem(exc.status_code, title)


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


def add_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(StarletteHTTPException, _http_exception)  # type: ignore[arg-type]
    app.add_exception_handler(RequestValidationError, _validation_exception)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, _unhandled_exception)
