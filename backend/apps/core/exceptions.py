import logging

from rest_framework.views import exception_handler as drf_exception_handler

logger = logging.getLogger(__name__)


class ApplicationError(Exception):
    """Raised by service-layer code for domain/business-rule violations.

    Carries a stable `code` so the frontend can branch on machine-readable
    errors instead of parsing human copy.
    """

    def __init__(self, message, code="application_error", status_code=400, extra=None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.extra = extra or {}


def api_exception_handler(exc, context):
    from rest_framework.response import Response

    if isinstance(exc, ApplicationError):
        request = context.get("request")
        logger.warning(
            "application_error",
            extra={"code": exc.code, "path": getattr(request, "path", None)},
        )
        payload = {"error": {"code": exc.code, "message": exc.message}}
        payload["error"].update(exc.extra)
        return Response(payload, status=exc.status_code)

    response = drf_exception_handler(exc, context)
    if response is not None:
        # Normalize DRF's default error shape to {"error": {...}} as well.
        response.data = {"error": {"code": "request_error", "message": response.data}}
    return response
