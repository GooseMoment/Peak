from django.http import HttpRequest
from django.contrib.auth.decorators import login_required

from .models import User

def get_current_user(request: HttpRequest):
    return request.user

def get_user(request: HttpRequest, id):
    pass

def patch_user(request: HttpRequest, id):
    pass

def get_settings(request: HttpRequest, user_id):
    pass
