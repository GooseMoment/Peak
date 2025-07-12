from rest_framework import status

from api.exceptions import APIException


class ProjectNameDuplicate(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Duplicate project name."
    default_code = "PROJECT_NAME_DUPLICATE"
