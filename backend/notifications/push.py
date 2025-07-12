from django.conf import settings

from users.models import User
from .models import Notification, WebPushSubscription
from social.models import Reaction, Comment
from .locale import get_translations

from pywebpush import webpush, WebPushException
from json import dumps
from urllib3.util import parse_url
from datetime import datetime


class PushData:
    def __init__(self) -> None:
        self.title = ""
        self.body = ""
        self.icon = ""
        self.datetime: datetime | None = None
        self.click_url = ""

    def to_json(self) -> str:
        # https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
        return dumps(
            {
                "title": self.title,
                "body": self.body,
                "icon": self.icon,
                "timestamp": int(self.datetime.timestamp() * 1e3)
                if self.datetime is not None
                else None,
                "data": {"click_url": self.click_url},
            }
        )


SUBSCRIPTION_MAX_FAILURE = 10


def _notificationToPushData(notification: Notification, locale: str) -> PushData:
    data = PushData()

    data.datetime = notification.created_at
    data.click_url = "/app/notifications?id=" + str(notification.id)

    related_user: User | None = None
    t = get_translations(locale)["push"]

    match notification.type:
        case Notification.FOR_TASK_REMINDER:
            assert notification.task_reminder is not None

            t = t[Notification.FOR_TASK_REMINDER]
            data.title = t["title"].format(task=notification.task_reminder.task.name)

            if notification.task_reminder.delta == 0:
                data.body = t["body_now"]
            else:
                data.body = t["body"].format(delta=notification.task_reminder.delta)

        case Notification.FOR_REACTION:
            assert notification.reaction is not None
            assert notification.reaction.emoji is not None

            parent: str = ""
            related_user = notification.reaction.user

            if notification.reaction.parent_type == Reaction.FOR_QUOTE:
                assert notification.reaction.quote is not None
                parent = notification.reaction.quote.content
            else:
                assert notification.reaction.task is not None
                parent = notification.reaction.task.name

            t = t[Notification.FOR_REACTION]
            data.title = t["title"].format(
                emoji=notification.reaction.emoji.name, username=related_user.username
            )
            data.body = t["body"].format(parent=parent)
        case Notification.FOR_FOLLOW:
            assert notification.following is not None
            related_user = notification.following.follower
            t = t[Notification.FOR_FOLLOW]
            data.title = t["title"].format(username=related_user.username)
            data.body = t["body"]
        case Notification.FOR_FOLLOW_REQUEST:
            assert notification.following is not None
            related_user = notification.following.follower
            t = t[Notification.FOR_FOLLOW_REQUEST]
            data.title = t["title"].format(username=related_user.username)
            data.body = t["body"]
        case Notification.FOR_FOLLOW_REQUEST_ACCEPTED:
            assert notification.following is not None
            related_user = notification.following.followee
            t = t[Notification.FOR_FOLLOW_REQUEST_ACCEPTED]
            data.title = t["title"].format(username=related_user.username)
            data.body = t["body"]
        case Notification.FOR_PECK:
            assert notification.peck is not None
            related_user = notification.peck.user
            t = t[Notification.FOR_PECK]
            data.title = t["title"].format(username=related_user.username)
            data.body = t["body"].format(
                task=notification.peck.task.name, count=notification.peck.count
            )
        case Notification.FOR_COMMENT:
            assert notification.comment is not None
            related_user = notification.comment.user
            parent: str = ""

            if notification.comment.parent_type == Comment.FOR_QUOTE:
                assert notification.comment.quote is not None
                parent = notification.comment.quote.content
            else:
                assert notification.comment.task is not None
                parent = notification.comment.task.name

            t = t[Notification.FOR_COMMENT]
            data.title = t["title"].format(username=related_user.username)
            data.body = t["body"].format(
                parent=parent, comment=notification.comment.comment
            )

    if related_user:
        if related_user.profile_img:
            data.icon = related_user.profile_img.url
        else:
            data.icon = settings.USER_DEFAULT_PROFILE_IMG

    return data


def pushNotificationToUser(user: User, notification: Notification) -> None:
    subscriptions = WebPushSubscription.objects.filter(token__user=user).all()
    dumped_datas_per_locale: dict[str, str] = dict()

    for subscription in subscriptions:
        if notification.type in subscription.excluded_types:
            continue

        endpoint = parse_url(subscription.endpoint)
        if endpoint.scheme is None or endpoint.host is None:
            subscription.delete()
            continue

        aud = endpoint.scheme + "://" + endpoint.host

        locale = (
            subscription.locale
            if subscription.locale is not None
            else settings.LANGUAGE_CODE
        )

        if subscription.locale in dumped_datas_per_locale:
            data = dumped_datas_per_locale[subscription.locale]
        else:
            try:
                data = _notificationToPushData(notification, locale).to_json()
            except AssertionError:
                return

            dumped_datas_per_locale[locale] = data

        try:
            webpush(
                subscription.to_push_subscription(),
                data,
                vapid_private_key=settings.WEBPUSH.get("vapid_private_key"),
                vapid_claims={
                    "sub": "mailto:" + settings.WEBPUSH.get("vapid_claims_email"),
                    "aud": aud,
                },
            )
        except WebPushException as wpe:
            if wpe.response and wpe.response.status_code == 401:  # 401 GONE
                # unsubscribed subscription
                subscription.delete()
                continue

            subscription.fail_cnt += 1
            if (
                subscription.fail_cnt > SUBSCRIPTION_MAX_FAILURE
            ):  # 최대 횟수를 넘어갈 시 구독 삭제
                subscription.delete()
                continue

            subscription.save()
            continue

        # 성공했으면 fail_cnt 초기화
        if subscription.fail_cnt > 0:
            subscription.fail_cnt = 0
            subscription.save()
