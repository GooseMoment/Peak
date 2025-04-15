from rest_framework import status

from api.exceptions import APIException


class InvalidNotificationType(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Invalid notification type(s) are in excluded_types"
    default_code = "INVALID_NOTIFICATION_TYPE"


class ExcludedTypesMissing(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "excluded_types is missing"
    default_code = "EXCLUDED_TYPES_MISSING"


class AllTypesExcluded(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "all types are excluded"
    default_code = "ALL_TYPES_EXCLUDED"
