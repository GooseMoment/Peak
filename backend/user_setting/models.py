from django.db import models

from api.models import Base
from users.models import User

class UserSetting(Base):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    follow_request_approval_manually = models.BooleanField(default=False)
    # TODO: 만들고 추가하세요 구영서씨