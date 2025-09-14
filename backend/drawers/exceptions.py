from rest_framework import status

from api.exceptions import APIException


class DrawerNameDuplicate(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Duplicate drawer name."
    default_code = "DRAWER_NAME_DUPLICATE"


class DrawerLimitExceeded(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Drawer limit exceeded. You can only create up to 20 drawers."
    default_code = "DRAWER_LIMIT_EXCEEDED"
