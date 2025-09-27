from notifications.models import Notification

translation = {
    "push": {
        Notification.FOR_TASK_REMINDER: {
            "title": "⏰ {task}",
            "body": "{delta} min(s) left.",
            "body_now": "Time to work.",
        },
        Notification.FOR_TASK_REACTION: {
            "title": ":{emoji}: by @{username}",
            "body": "RE: {task_name}",
        },
        Notification.FOR_FOLLOW: {
            "title": "📩 @{username}",
            "body": "follows you.",
        },
        Notification.FOR_FOLLOW_REQUEST: {
            "title": "📩 @{username}",
            "body": "wants to follow you.",
        },
        Notification.FOR_FOLLOW_REQUEST_ACCEPTED: {
            "title": "✅ @{username}",
            "body": "accepted your follow request.",
        },
    },
}
