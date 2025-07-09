from typing import TYPE_CHECKING
from rest_framework.request import Request

if TYPE_CHECKING:
    from users.models import User


class AuthenticatedRequest(Request):
    user: "User"  # pyright: ignore [reportIncompatibleMethodOverride]
