from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login, logout, get_user
from django.shortcuts import get_object_or_404
from django.views import View

from .models import User
from .response import UserJSONResponse

@method_decorator(login_required, name="dispatch")
class UserView(View):
    def get(self, request: HttpRequest, username: str):
        user = get_object_or_404(User, username=username)
        return UserJSONResponse(request, user)
    
    def post(self, request: HttpRequest, username: str):
        pass

    def patch(self, request: HttpRequest, username: str):
        if request.user.username != username:
            return HttpResponseBadRequest()
        
        user: User = request.user._wrapped
        payload = request.POST

        overidable_fields = ["username", "display_name", "bio", "profile_img_uri"]

        for field in overidable_fields:
            if field in payload:
                setattr(user, field, payload[field])

        if "password" in payload:
            # TODO: 암호 규칙 검증
            user.set_password(payload["password"])
        
        user.validate_constraints()
        user.save()

        return HttpResponse(status=200)


    def delete(self, request: HttpRequest, username: str):
        pass

def sign_in(request: HttpRequest):
    if request.method != "POST":
        return HttpResponse("Method not allowed", status=405)
    
    email: str = request.POST["email"]
    password: str = request.POST["password"]

    user = authenticate(request, email=email, password=password)

    if user is None:
        return HttpResponseBadRequest("signed in failed")
    
    login(request, user)

    return HttpResponse(status=200)

def sign_up(request: HttpRequest):
    if request.method != "POST":
        return HttpResponse(status=405)
    
    if request.user.is_authenticated:
        return HttpResponseBadRequest()
    
    payload = request.POST
    
    required_fields = [
        "username", "display_name", "password", "email"
    ]

    new_user = User()
    for field in required_fields:
        if field not in payload:
            return HttpResponseBadRequest()
        
        setattr(new_user, field, payload[field])
    
    new_user.set_password(payload["password"])
    new_user.save()

    return HttpResponse(status=201)

@login_required
def sign_out(request: HttpRequest):
    logout(request)
    return HttpResponse(status=200)

def get_current_user(request: HttpRequest):
    user = get_user(request)

    if request.user.is_anonymous:
        return HttpResponse("login required", status=400)

    return UserJSONResponse(request, request.user._wrapped, personal=True)