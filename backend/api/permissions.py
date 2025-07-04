from rest_framework import permissions


class IsUserOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsUserSelfRequest(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        username = view.kwargs["username"]

        return (
            super().has_permission(request, view)
            and request.user.get_username() == username
        )
