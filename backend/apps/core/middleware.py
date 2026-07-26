import uuid


class RequestIdMiddleware:
    """Attaches a unique request id to every request for structured logging and audit trails."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.request_id = request.headers.get("X-Request-Id", str(uuid.uuid4()))
        response = self.get_response(request)
        response["X-Request-Id"] = request.request_id
        return response
