from rest_framework import status
from rest_framework.exceptions import APIException


class EmailNotSent(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "The requested email was not sent."
    default_code = "email_not_sent"

