from django.http import HttpRequest, HttpResponse
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from re import compile

# https://stackoverflow.com/a/48781386
# settings.py에 LOGIN_EXEMPT_URLS가 있음!
EXEMPT_URLS = []
if hasattr(settings, 'LOGIN_EXEMPT_URLS'):
    EXEMPT_URLS = [compile(expr) for expr in settings.LOGIN_EXEMPT_URLS]

print("EXEMPT_URLS:", EXEMPT_URLS)

class AuthWallMiddleware(MiddlewareMixin):
    def process_request(self, request: HttpRequest):
        if request.user.is_anonymous:
            path = request.path_info.lstrip('/')
            if not any(m.match(path) for m in EXEMPT_URLS):
                return HttpResponse(status=401)
