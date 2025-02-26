from django.conf import settings

from users.models import User
from .models import Notification, WebPushSubscription
from social.models import Reaction, Comment
from .locale import get_translations

from pywebpush import webpush, WebPushException
from json import dumps
from urllib3.util import parse_url

SUBSCRIPTION_MAX_FAILURE = 10


def _notificationToPushData(notification: Notification, locale: str) -> dict[str, any]:
    # FYI: https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
    data = {
        # Texts
        "title": "",
        "body": "",
        # URLS
        "icon": "",
        # Unix timestamp (only int)
        "timestamp": 0,
        # any structure
        "data": {
            "click_url": "",
        },
    }

    data["timestamp"] = int(notification.created_at.timestamp() * 1e3)
    data["data"]["click_url"] = "/app/notifications?id=" + str(notification.id)

    related_user: User = None
    t = get_translations(locale)["push"]

    match notification.type:
        case Notification.FOR_TASK_REMINDER:
            t = t[Notification.FOR_TASK_REMINDER]
            data["title"] = t["title"].format(task=notification.task_reminder.task.name)

            if notification.task_reminder.delta == 0:
                data["body"] = t["body_now"]
            else:
                data["body"] = t["body"].format(delta=notification.task_reminder.delta)

        case Notification.FOR_REACTION:
            parent: str = ""
            related_user = notification.reaction.user

            if notification.reaction.parent_type == Reaction.FOR_QUOTE:
                parent = notification.reaction.quote.content
            else:
                parent = notification.reaction.task.name

            t = t[Notification.FOR_REACTION]
            data["title"] = t["title"].format(
                emoji=notification.reaction.emoji.name, username=related_user.username
            )
            data["body"] = t["body"].format(parent=parent)
        case Notification.FOR_FOLLOW:
            related_user = notification.following.follower
            t = t[Notification.FOR_FOLLOW]
            data["title"] = t["title"].format(username=related_user.username)
            data["body"] = t["body"]
        case Notification.FOR_FOLLOW_REQUEST:
            related_user = notification.following.follower
            t = t[Notification.FOR_FOLLOW_REQUEST]
            data["title"] = t["title"].format(username=related_user.username)
            data["body"] = t["body"]
        case Notification.FOR_FOLLOW_REQUEST_ACCEPTED:
            related_user = notification.following.followee
            t = t[Notification.FOR_FOLLOW_REQUEST_ACCEPTED]
            data["title"] = t["title"].format(username=related_user.username)
            data["body"] = t["body"]
        case Notification.FOR_PECK:
            related_user = notification.peck.user
            t = t[Notification.FOR_PECK]
            data["title"] = t["title"].format(username=related_user.username)
            data["body"] = t["body"].format(
                task=notification.peck.task.name, count=notification.peck.count
            )
        case Notification.FOR_COMMENT:
            related_user = notification.comment.user
            parent: str = ""

            if notification.comment.parent_type == Comment.FOR_QUOTE:
                parent = notification.comment.quote.content
            else:
                parent = notification.comment.task.name

            t = t[Notification.FOR_COMMENT]
            data["title"] = t["title"].format(username=related_user.username)
            data["body"] = t["body"].format(
                parent=parent, comment=notification.comment.comment
            )

    if related_user:
        if related_user.profile_img:
            data["icon"] = related_user.profile_img.url
        else:
            data["icon"] = settings.USER_DEFAULT_PROFILE_IMG

    return data


def pushNotificationToUser(user: User, notification: Notification) -> None:
    subscriptions = WebPushSubscription.objects.filter(user=user).all()
    dumped_datas_per_locale = dict()

    for subscription in subscriptions:
        if notification.type in subscription.excluded_types:
            continue

        endpoint = parse_url(subscription.subscription_info.get("endpoint"))
        aud = endpoint.scheme + "://" + endpoint.host

        if subscription.locale in dumped_datas_per_locale:
            data = dumped_datas_per_locale[subscription.locale]
        else:
            data = dumps(_notificationToPushData(notification, subscription.locale))
            dumped_datas_per_locale[subscription.locale] = data

        try:
            webpush(
                subscription.subscription_info,
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
