from django.db import models

import uuid

from ..users.models import User

class UserSetting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    follow_request_approval_manually = models.BooleanField(default=False)
    # TODO: 만들고 추가하세요 구영서씨

