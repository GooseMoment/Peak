from rest_framework import status
from django.conf import settings

from api.exceptions import APIException


class DrawerNameDuplicate(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Duplicate drawer name."
    default_code = "DRAWER_NAME_DUPLICATE"


class DrawerLimitExceeded(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = f"Drawer limit exceeded. You can only create up to {settings.DRAWER_PER_PROJECT_MAX_COUNT} drawers."
    default_code = "DRAWER_LIMIT_EXCEEDED"
