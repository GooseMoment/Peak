from rest_framework import mixins, status
from rest_framework.response import Response

class CreateMixin(mixins.CreateModelMixin):
    def create_with_user(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        for k, v in kwargs:
            serializer.validated_data[k] = v
        serializer.validated_data["user"] = request.user
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)