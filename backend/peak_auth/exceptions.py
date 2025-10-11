from rest_framework import status

from api.exceptions import APIException


class UserAlreadyAuthenticated(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "The user is already authenticated."
    default_code = "USER_ALREADY_AUTHENTICATED"


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


class CredentialInvalid(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Given credentials are invalid. Check email and password."
    default_code = "CREDENTIAL_INVALID"


class EmailNotVerified(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "The mail address was not verified."
    default_code = "MAIL_NOT_VERIFIED"


class TokenRequired(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "A token is required."
    default_code = "TOKEN_REQUIRED"


class TokenInvalid(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "The given token is invalid, expired or not found."
    default_code = "TOKEN_INVALID"


class TOTPCodeInvalid(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "The given code is invalid."
    default_code = "TOTP_CODE_INVALID"


class TokenOutOfCounts(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "Out of try counts."
    default_code = "TOKEN_OUT_OF_COUNTS"


class UnknownError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Unknown error occuered."
    default_code = "UNKNOWN_ERROR"


class EmailNotSent(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "The requested email was not sent."
    default_code = "EMAIL_NOT_SENT"


class NoPendingTOTPRegistration(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "No pending TOTP registration."
    default_code = "NO_PENDING_TOTP_REGISTRATION"
