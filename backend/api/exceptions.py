from rest_framework import status
from rest_framework.exceptions import APIException as BaseAPIException

from typing import Iterable, Optional


class APIException(BaseAPIException):
    def __init__(self, detail=None, code=None, **kwargs):
        if detail is None:
            detail = self.default_detail
        if code is None:
            code = self.default_code

        self.detail = {"detail": detail, "code": code, **kwargs}


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

    def __init__(
        self,
        missing_fields: Optional[Iterable[str]] = None,
    ):
        detail = ", ".join(missing_fields) if missing_fields else None
        super().__init__(
            detail=detail,
        )


class UnknownError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Unknown error occurred."
    default_code = "UNKNOWN_ERROR"


class RateLimitExceeded(APIException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail = "Your rate limit has been exceeded."
    default_code = "RATE_LIMIT_EXCEEDED"

    def __init__(self, seconds: int = 0):
        super().__init__(seconds=seconds)
