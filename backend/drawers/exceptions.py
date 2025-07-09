from rest_framework import status

from api.exceptions import APIException
    
    
class DrawerNameDuplicate(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Duplicate drawer name."
    default_code = "DRAWER_NAME_DUPLICATE"

