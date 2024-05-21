from rest_framework import permissions

class IsUserMatch(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
