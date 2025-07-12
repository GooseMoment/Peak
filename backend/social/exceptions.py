from rest_framework import status

from api.exceptions import APIException


class BlockSelf(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Can't block yourself."
    default_code = "BLOCK_SELF"


class FollowingRestricted(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "This action of Following is restricted."
    default_code = "FOLLOWING_RESTRICTED"
