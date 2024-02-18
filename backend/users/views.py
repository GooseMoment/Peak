from django.shortcuts import render

from .models import User

def get_current_user(request):
    return User()

def get_user(request, id):
    pass

def patch_user(request, id):
    pass

def get_settings(request, user_id):
    pass
