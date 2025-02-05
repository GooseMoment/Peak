from rest_framework import status
from rest_framework.exceptions import APIException


class ClientTimezoneMissing(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "The Client-Timezone header is missing."
    default_code = "client-timezone_missing"


class ClientTimezoneInvalid(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "The Client-Timezone header is invalid."
    default_code = "client-timezone_invalid"
