from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


# from https://stackoverflow.com/questions/4581789/how-do-i-get-user-ip-address-in-django ㅎㅎ
def get_client_ip(request: Request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(["GET"])
@permission_classes((AllowAny, ))
def get_healthcheck(request: Request):
    return Response({"data": "success", "ip": get_client_ip(request)})
