from .models import User
from django.http import HttpRequest, HttpResponse
from django.core import serializers
import json

def __serialize_users(users, personal: bool=False):
    exclude_fields = ["password", "id", "_state", "deleted_at", "updated_at"]
    personal_fields = ["email", "last_login"]

    if not personal:
        exclude_field += personal_fields

    user_list = []
    for user in users.values():
        for exclude_field in exclude_fields:
            try:
                del user[exclude_field]
            except KeyError:
                pass
        
        user_list.append(user)
    
    return json.dumps(user_list, default=str)

def __serialize_user(user: User, personal: bool=False):
    user = user.__dict__

    exclude_fields = ["password", "id", "_state", "deleted_at", "updated_at"]
    personal_fields = ["email", "last_login"]

    if not personal:
        exclude_fields += personal_fields

    for exclude_field in exclude_fields:
        try:
            del user[exclude_field]
        except KeyError:
            pass

    return json.dumps(user, default=str)

def __serialize_users2(users: list[User], personal: bool=False):
    included_fields = [
        "id", "username", "display_name", "followings_count", "followers_count", "profile_img_uri", "bio",
        "created_at"
    ]

    if personal:
        included_fields += ["email"]

    serialized = serializers.serialize("json", users, fields=included_fields)

    return serialized

def UsersJSONResponse(request: HttpRequest, users: list[User], personal: bool=False):
    serialized = __serialize_users(users, personal=personal)
    return HttpResponse(serialized, content_type="application/json")

def UserJSONResponse(request: HttpRequest, user: User, personal: bool=False):
    serialized = __serialize_user(user, personal=personal)

    return HttpResponse(serialized, content_type="application/json")