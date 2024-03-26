from rest_framework import mixins, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view

class CreateMixin(mixins.CreateModelMixin):
    def create_with_user(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        for k, v in kwargs.items():
            serializer.validated_data[k] = v
        serializer.validated_data["user"] = request.user
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# from https://stackoverflow.com/questions/4581789/how-do-i-get-user-ip-address-in-django ㅎㅎ
def get_client_ip(request: Request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@api_view(["GET"])
def get_healthcheck(request: Request):
    return Response({"data": "success", "ip": get_client_ip(request)})
