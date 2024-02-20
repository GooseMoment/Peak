from django.http import HttpRequest, JsonResponse, HttpResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login

from .models import User

def all_user(request: HttpRequest, username: str):
    if request.method == "GET":
        return get_user(request, username)

    elif request.method == "PATCH":
        return patch_user(request, username)
    
    return HttpResponse("Method not allowed", status=405)

def sign_in(request: HttpRequest):
    if request.method != "POST":
        return HttpResponse("Method not allowed", status=405)
    
    email: str = request.POST["email"]
    password: str = request.POST["password"]

    user = authenticate(request, email=email, password=password)

    if user is None:
        return HttpResponseBadRequest("signed in failed")
    
    login(request, user)

    return HttpResponse("Welcome")

@login_required
def get_current_user(request: HttpRequest):
    print(request.user)
    return JsonResponse(request.user)

@login_required
def get_user(request: HttpRequest, username: str):
    return JsonResponse(User.objects.get(username=username))

def patch_user(request: HttpRequest, username: str):
    pass

def get_settings(request: HttpRequest, username: str):
    pass
