from rest_framework import status

from api.exceptions import APIException


class UserAlreadyAuthenticated(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "The user is already authenticated."
    default_code = "SIGNUP_USER_ALREADY_AUTHENTICATED"


class RequiredFieldMissing(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Some fields are missing."
    default_code = "SIGNUP_REQUIRED_FIELD_MISSING"


class EmailInvalid(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Invalid email format."
    default_code = "SIGNUP_EMAIL_INVALID"


class UsernameInvalid(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Username should be longer than 4 and contain alphanumberics and underscore only."
    default_code = "SIGNUP_USERNAME_INVALID"


class UsernameDuplicate(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Duplicate username."
    default_code = "SIGNUP_EMAIL_NOT_SENT"


class PasswordInvalid(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Password should be longer than 8."
    default_code = "SIGNUP_PASSWORD_INVALID"


class UnknownError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Unknown error occuered."
    default_code = "SIGNUP_EMAIL_NOT_SENT"


class EmailNotSent(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "The requested email was not sent."
    default_code = "SIGNUP_EMAIL_NOT_SENT"
