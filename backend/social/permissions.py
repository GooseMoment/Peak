from rest_framework import permissions, views
from rest_framework.request import Request

from .models import Following, Block
from user_setting.models import UserSetting
from api.models import PrivacyMixin


def is_either_blocked(username_a: str, username_b: str) -> bool:
    if username_a == username_b:
        return False

    return (
        Block.objects.filter(
            blocker__username=username_a, blockee__username=username_b
        ).exists()
        or Block.objects.filter(
            blocker__username=username_b, blockee__username=username_a
        ).exists()
    )


class IsUserNotBlockedOrBlocking(permissions.IsAuthenticated):
    def has_permission(self, request: Request, view: views.APIView):
        owner_username: str = view.kwargs["username"]

        is_authenticated = super().has_permission(request, view)
        if not is_authenticated:
            return False

        if is_either_blocked(owner_username, request.user.get_username()):
            return False

        return True


class RemarkDetailPermission(permissions.IsAuthenticated):
    def has_permission(self, request: Request, view: views.APIView) -> bool:
        is_authenticated = super().has_permission(request, view)
        if not is_authenticated:
            return False

        username = view.kwargs["username"]
        if is_either_blocked(request.user.get_username(), username):
            return False

        return (
            request.user.get_username() == username
            or request.method in permissions.SAFE_METHODS
        )


class FollowingPermission(permissions.IsAuthenticated):
    def has_permission(self, request: Request, view: views.APIView) -> bool:
        is_authenticated = super().has_permission(request, view)
        if not is_authenticated:
            return False

        follower_username = view.kwargs["follower_username"]
        followee_username = view.kwargs["followee_username"]

        if is_either_blocked(
            request.user.get_username(), followee_username
        ) or is_either_blocked(request.user.get_username(), follower_username):
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        match request.method:
            case "PUT":
                return request.user.get_username() == follower_username
            case "PATCH":
                return request.user.get_username() == followee_username
            case "DELETE":
                return request.user.get_username() == follower_username

        return False


class FollowingListPermission(IsUserNotBlockedOrBlocking):
    def has_permission(self, request: Request, view: views.APIView):
        if not super().has_permission(request, view):
            return False

        if request.user.get_username() == view.kwargs["username"]:
            return True

        user_setting = UserSetting.objects.filter(user=request.user).first()
        if user_setting is None:
            return True

        if user_setting.follow_list_privacy == PrivacyMixin.FOR_PUBLIC:
            return True

        if user_setting.follow_list_privacy == PrivacyMixin.FOR_PRIVATE:
            return False

        return Following.objects.filter(
            follower=request.user,
            followee__username=view.kwargs["username"],
            status=Following.ACCEPTED,
        ).exists()


class BlockPermission(permissions.BasePermission):
    # allow only blocker to see their own blocks
    def has_permission(self, request: Request, view: views.APIView):
        blocker_username: str = view.kwargs["blocker_username"]

        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.get_username() == blocker_username
        )
