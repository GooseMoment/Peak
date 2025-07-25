from rest_framework import status
from rest_framework.exceptions import APIException as BaseAPIException


class APIException(BaseAPIException):
    def __init__(self, detail=None, code=None):
        if detail is None:
            detail = self.default_detail
        if code is None:
            code = self.default_code

        self.detail = {"detail": detail, "code": code}


class ClientTimezoneMissing(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "The Client-Timezone header is missing."
    default_code = "client-timezone_missing"


class ClientTimezoneInvalid(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "The Client-Timezone header is invalid."
    default_code = "client-timezone_invalid"


class RequiredFieldMissing(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Some fields are missing."
    default_code = "REQUIRED_FIELD_MISSING"


class UnknownError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Unknown error occuered."
    default_code = "UNKNOWN_ERROR"
