from django.http import HttpRequest, HttpResponse


class DisableCSRFMiddleware:
    def __init__(self, get_response) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        setattr(request, "_dont_enforce_csrf_checks", True)
        return self.get_response(request)
