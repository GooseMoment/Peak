from django.conf import settings

from users.models import User
from .models import Notification, WebPushSubscription

from pywebpush import webpush, WebPushException
from json import dumps
from urllib3.util import parse_url

DEFAULT_PROFILE_IMG = "https://assets-dev.peak.ooo/user_profile_imgs%2Fdefault.jpg"
SUBSCRIPTION_MAX_FAILURE = 10

def _notificationToPushData(notification: Notification) -> dict[str, any]:
    # FYI: https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
    data = {
        # Texts
        "title": "",
        "body": "",

        # URLS
        "icon": "", 
        "badge": "", # only for Android Chrome

        # Unix timestamp (only int)
        "timestamp": 0,
    }

    data["timestamp"] = int(notification.created_at.strftime("%s"))
    data["icon"] = settings.WEBPUSH.get("icon")

    # TODO: i18n
    if notification.type == Notification.FOR_TASK_REMINDER:
        data["title"] = "Reminder"

    related_user: User = None

    match notification.type:
        case Notification.FOR_FOLLOW:
            related_user = notification.following.follower
            data["body"] = "follows you"
        case Notification.FOR_FOLLOW_REQUEST:
            related_user = notification.following.follower
            data["body"] = "wants to follow you"
        case Notification.FOR_FOLLOW_REQUEST_ACCEPTED:
            related_user = notification.following.followee
            data["body"] = "accepted your follow request"
        case Notification.FOR_PECK:
            related_user = notification.peck.user
            data["body"] = "pecked you"
        case Notification.FOR_REACTION:
            related_user = notification.reaction.user
            data["body"] = ":" + notification.reaction.emoji.name + ":"
        
    if related_user:
        data["title"] = "@" + related_user.username
        if related_user.profile_img:
            data["icon"] = related_user.profile_img.url
        else:
            data["icon"] = DEFAULT_PROFILE_IMG

    return data

def pushNotificationToUser(user: User, notification: Notification) -> None:
    subscriptions = WebPushSubscription.objects.filter(user=user).all()
    data = _notificationToPushData(notification)
    
    for subscription in subscriptions:
        endpoint = parse_url(subscription.subscription_info.get("endpoint"))
        aud = endpoint.scheme + "://" + endpoint.host

        try:
            webpush(
                subscription.subscription_info,
                dumps(data), 
                vapid_private_key=settings.WEBPUSH.get("vapid_private_key"),
                vapid_claims={
                    "sub": "mailto:" + settings.WEBPUSH.get("vapid_claims_email"),
                    "aud": aud,
                },
            )
        except WebPushException as wpe:
            if wpe.response and wpe.response.status_code == 401: # 401 GONE
                # unsubscribed subscription
                subscription.delete()
                continue

            subscription.fail_cnt += 1
            if subscription.fail_cnt > SUBSCRIPTION_MAX_FAILURE: # 최대 횟수를 넘어갈 시 구독 삭제
                subscription.delete()
                continue

            subscription.save()
            continue

        # 성공했으면 fail_cnt 초기화
        if subscription.fail_cnt > 0:
            subscription.fail_cnt = 0
            subscription.save()

