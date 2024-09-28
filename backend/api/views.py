from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from api.utils import get_client_ip


@api_view(["GET"])
@permission_classes((AllowAny, ))
def get_healthcheck(request: Request):
    return Response({"data": "success", "ip": get_client_ip(request)})
