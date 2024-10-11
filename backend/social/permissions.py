from rest_framework import permissions

from .models import Block


class IsUserNotBlockedOrBlocking(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        owner_username = view.kwargs["username"]

        is_authenticated = super().has_permission(request, view)
        if not is_authenticated:
            return False

        is_blocked = Block.objects.filter(blocker__username=owner_username, blockee=request.user).exists()
        if is_blocked:
            return False

        is_blocking = Block.objects.filter(blocker=request.user, blockee__username=owner_username).exists()
        if is_blocking:
            return False

        return True
    