from rest_framework import status

from api.exceptions import APIException


class RequiredFieldMissing(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Some fields are missing."
    default_code = "REQUIRED_FIELD_MISSING"
