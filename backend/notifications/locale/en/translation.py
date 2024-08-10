from notifications.models import Notification

translation = {
    "push": {
        Notification.FOR_TASK_REMINDER: {
            "title": "⏰ {task}",
            "body": "{delta} min(s) left.",
            "body_now": "Time to work.",
        },
        Notification.FOR_REACTION: {
            "title": ":{emoji}: @{username}",
            "body": "RE: {parent}",
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
        Notification.FOR_PECK: {
            "title": "👈 @{username}",
            "body": "pecked {count} time(s).\n\nRE: {task}",
        },
        Notification.FOR_COMMENT: {
            "title": "💬 @{username}",
            "body": "{comment}\n\nRE: {parent}",
        },
    },
}
