import client from "@api/client"

import {
    getClientSettings,
    setClientSettingsByName,
} from "@utils/clientSettings"
import getDeviceType from "@utils/getDeviceType"

// TODO: Define TaskReminder properly
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TaskReminder = any

export const getReminder = async (id: string) => {
    const res = await client.get(`notifications/reminders/${id}`)
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
    const res = await client.patch(`notifications/reminders/${id}`, edit)
    return res.data
}

export const deleteReminder = async (id: string) => {
    const res = await client.delete(`notifications/reminders/${id}`)
    return res.data
}

export type NotificationType =
    | "task_reminder"
    | "reaction"
    | "follow"
    | "follow_request"
    | "follow_request_accepted"
    | "comment"
    | "peck"

export interface Notification {
    // TODO: Replace user after declaring User
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any
    type: NotificationType
    task_reminder: TaskReminder
    // TODO: Replace reaction after declaring User
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reaction?: any
    // TODO: Replace following after declaring User
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    following?: any
    // TODO: Replace peck after declaring User
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    peck?: any
    // TODO: Replace comment after declaring User
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comment?: any
}

export const getNotifications = async (
    cursor: string,
    types: NotificationType[],
) => {
    const res = await client.get<Notification>(`notifications/`, {
        params: { cursor, types: types.join("|") },
    })
    return res.data
}

export const getNotification = async (id: string) => {
    const res = await client.get(`notifications/${id}`)
    return res.data
}

export const deleteNotification = async (id: string) => {
    return client.delete(`notifications/${id}`)
}

export interface WebPushSubscription {
    user: object
    subscription_info: PushSubscription
    locale: string
    device: string
    user_agent: (typeof navigator)["userAgent"]
    fail_cnt: number
    excluded_types: NotificationType[]
}

export const getSubscription = async (id: string) => {
    const res = await client.get<WebPushSubscription>(
        `notifications/subscribe/${id}`,
    )
    return res.data
}

export const postSubscription = async (subscription: PushSubscription) => {
    let locale = getClientSettings()["locale"]
    if (locale === "system") {
        locale = navigator.language.startsWith("ko") ? "ko" : "en"
    }

    const data: Partial<WebPushSubscription> = {
        subscription_info: subscription,
        locale,
        device: getDeviceType(),
        user_agent: navigator.userAgent,
    }

    const res = await client.post(`notifications/subscribe`, data)
    return res.data
}

export const patchSubscription = async (
    id: string,
    data: Partial<WebPushSubscription>,
) => {
    const res = await client.patch(`notifications/subscribe/${id}`, data)
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

    setClientSettingsByName("push_notification_subscription", null)

    const res = await client.delete(`notifications/subscribe/${id}`)
    return res.status
}
