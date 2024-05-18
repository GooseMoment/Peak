from knox.auth import TokenAuthentication, get_authorization_header
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from re import compile

# https://stackoverflow.com/a/48781386
# check out LOGIN_EXEMPT_URLS in django_peak/settings.py
EXEMPT_URLS = []
if hasattr(settings, 'LOGIN_EXEMPT_URLS'):
    EXEMPT_URLS = [compile(expr) for expr in settings.LOGIN_EXEMPT_URLS]

class PeakTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth:
            # check only wheter token was given here
            # checking wheter token is invalid is done in the base class
            
            path = request.path_info.lstrip('/')
            if not any(m.match(path) for m in EXEMPT_URLS):
                msg = _("Authorization required.")
                raise AuthenticationFailed(msg)
        
        return super().authenticate(request)
