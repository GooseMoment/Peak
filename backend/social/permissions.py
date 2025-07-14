from rest_framework import permissions, views
from rest_framework.request import Request

from .models import Block


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


class BlockPermission(permissions.BasePermission):
    # allow only blocker to see their own blocks
    def has_permission(self, request: Request, view: views.APIView):
        blocker_username: str = view.kwargs["blocker_username"]

        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.get_username() == blocker_username
        )
