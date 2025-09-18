import client from "@api/client"
import type { Base, PaginationData } from "@api/common"
import type { Comment, Following, Peck, TaskReaction } from "@api/social.api"
import type { User } from "@api/users.api"

import {
    getClientSettings,
    setClientSettingsByName,
} from "@utils/clientSettings"

export interface TaskReminder extends Base {
    // TODO: replace any with Task
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: any
    delta: number
    scheduled: string
    task_name: string
    project_color: string
    project_id: string
}

export const getReminder = async (id: string) => {
    const res = await client.get(`notifications/reminders/${id}/`)
    return res.data
}

export const postReminder = async (reminders: TaskReminder) => {
    const res = await client.post(`notifications/reminders/`, reminders)
    return res.status
}

export const patchReminder = async (
    id: string,
    edit: Partial<TaskReminder>,
) => {
    const res = await client.patch(`notifications/reminders/${id}/`, edit)
    return res.data
}

export const deleteReminder = async (id: string) => {
    const res = await client.delete(`notifications/reminders/${id}/`)
    return res.data
}

export interface NotificationTaskReminder extends Base {
    username: User["username"]
    type: "task_reminder"
    task_reminder: TaskReminder
}

export interface NotificationTaskReaction extends Base {
    username: User["username"]
    type: "task_reaction"
    task_reaction: TaskReaction
}

export interface NotificationFollowing extends Base {
    username: User["username"]
    type: "follow" | "follow_request" | "follow_request_accepted"
    following: Following
}

export interface NotificationPeck extends Base {
    username: User["username"]
    type: "peck"
    peck: Peck
}

export interface NotificationComment extends Base {
    username: User["username"]
    type: "comment"
    comment: Comment
}

export type Notification =
    | NotificationTaskReminder
    | NotificationTaskReaction
    | NotificationFollowing
    | NotificationPeck
    | NotificationComment

export const getNotifications = async (
    cursor: string,
    types: Notification["type"][],
) => {
    const res = await client.get<PaginationData<Notification>>(
        `notifications/`,
        {
            params: { cursor, types: types.join("|") },
        },
    )
    return res.data
}

export const getNotification = async (id: string) => {
    const res = await client.get<Notification>(`notifications/${id}/`)
    return res.data
}

export const getRelatedUserFromNotification = (notification: Notification) => {
    return (
        (notification.type === "task_reaction" &&
            notification.task_reaction.user) ||
        (notification.type === "peck" && notification.peck.user) ||
        (notification.type === "comment" && notification.comment.user) ||
        (notification.type === "follow" && notification.following?.follower) ||
        (notification.type === "follow_request" &&
            notification.following?.follower) ||
        (notification.type === "follow_request_accepted" &&
            notification?.following?.followee) ||
        undefined
    )
}

export interface WebPushSubscription {
    id: string
    auth: string
    p256dh: string
    endpoint: PushSubscription["endpoint"]
    expiration_time: PushSubscription["expirationTime"]
    locale: string
    fail_cnt: number
    excluded_types: Notification["type"][]
}

export const getSubscription = async (id: string) => {
    const res = await client.get<WebPushSubscription>(
        `notifications/subscribe/${id}/`,
    )
    return res.data
}

export const postSubscription = async (subscription: PushSubscription) => {
    let locale = getClientSettings()["locale"]
    if (locale === "system") {
        locale = navigator.language.startsWith("ko") ? "ko" : "en"
    }

    const subscriptionJSON = subscription.toJSON()

    const data: Partial<WebPushSubscription> = {
        auth: subscriptionJSON.keys?.auth,
        p256dh: subscriptionJSON.keys?.p256dh,
        endpoint: subscription.endpoint,
        expiration_time: subscription.expirationTime,
        locale,
    }

    const res = await client.post<WebPushSubscription>(
        `notifications/subscribe/`,
        data,
    )
    return res.data
}

export const patchSubscription = async (
    id: string,
    data: Partial<WebPushSubscription>,
) => {
    const res = await client.patch<WebPushSubscription>(
        `notifications/subscribe/${id}/`,
        data,
    )
    return res.data
}

export const deleteSubscription = async (id: string) => {
    try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        await subscription?.unsubscribe()
    } catch (_) {
        // ignore errors
    }

    setClientSettingsByName("push_notification_subscription", undefined)

    await client.delete(`notifications/subscribe/${id}/`)
}
