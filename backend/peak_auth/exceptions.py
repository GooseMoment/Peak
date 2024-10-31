from rest_framework import status

from api.exceptions import APIException


class UserAlreadyAuthenticated(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "The user is already authenticated."
    default_code = "USER_ALREADY_AUTHENTICATED"


class RequiredFieldMissing(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Some fields are missing."
    default_code = "REQUIRED_FIELD_MISSING"


class EmailInvalid(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Invalid email format."
    default_code = "EMAIL_INVALID"


class UsernameInvalidLength(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Username should be between 4 and 15."
    default_code = "USERNAME_INVALID_LENGTH"


class UsernameInvalidFormat(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Username should contain alphanumberics and underscore only."
    default_code = "USERNAME_INVALID_FORMAT"


class UsernameDuplicate(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Duplicate username."
    default_code = "USERNAME_DUPLICATE"


class PasswordInvalid(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Password should be longer than 8."
    default_code = "PASSWORD_INVALID"


class UnknownError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Unknown error occuered."
    default_code = "UNKNOWN_ERROR"


class EmailNotSent(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "The requested email was not sent."
    default_code = "EMAIL_NOT_SENT"
