from notifications.models import Notification

translation = {
    "push": {
        Notification.FOR_TASK_REMINDER: {
            "title": "⏰ {task}",
            "body": "{delta}분 남았습니다.",
            "body_now": "작업할 시간입니다.",
        },
        Notification.FOR_TASK_REACTION: {
            "title": ":{emoji}: by @{username}",
            "body": "RE: {task_name}",
        },
        Notification.FOR_FOLLOW: {
            "title": "📩 @{username}",
            "body": "나를 팔로우합니다.",
        },
        Notification.FOR_FOLLOW_REQUEST: {
            "title": "📩 @{username}",
            "body": "팔로우 요청을 보냈습니다.",
        },
        Notification.FOR_FOLLOW_REQUEST_ACCEPTED: {
            "title": "✅ @{username}",
            "body": "내 팔로우 요청을 승인했습니다.",
        },
        Notification.FOR_PECK: {
            "title": "👈 @{username}",
            "body": "{count}번 쪼았습니다.\n\nRE: {task}",
        },
        Notification.FOR_COMMENT: {
            "title": "💬 @{username}",
            "body": "{comment}\n\nRE: {parent}",
        },
    },
}
