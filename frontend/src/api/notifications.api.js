import client from "@api/client"

import {
    getClientSettings,
    setClientSettingsByName,
} from "@utils/clientSettings"
import getDeviceType from "@utils/getDeviceType"

export const getReminder = async (id) => {
    const res = await client.get(`notifications/reminders/${id}`)
    return res.data
}

export const postReminder = async (reminders) => {
    const res = await client.post(`notifications/reminders/`, reminders)
    return res.status
}

export const patchReminder = async (id, edit) => {
    const res = await client.patch(`notifications/reminders/${id}`, edit)
    return res.data
}

export const deleteReminder = async (id) => {
    const res = await client.delete(`notifications/reminders/${id}`)
    return res.data
}

export const getNotifications = async (query) => {
    const params = query.queryKey[1]
    const cursor = query.pageParam
    const types = params.types.types.join("|")

    const res = await client.get(
        `notifications/?types=${types}&cursor=${cursor}`,
    )
    return res.data
}

export const getNotification = async (id) => {
    const res = await client.get(`notifications/${id}`)
    return res.data
}

export const deleteNotification = async (id) => {
    return client.delete(`notifications/${id}`)
}

export const getSubscription = async (id) => {
    const res = await client.get(`notifications/subscribe/${id}`)
    return res.data
}

export const postSubscription = async (subscription) => {
    let locale = getClientSettings()["locale"]
    if (locale === "system") {
        locale = navigator.language.startsWith("ko") ? "ko" : "en"
    }

    const data = {
        subscription_info: subscription,
        locale,
        device: getDeviceType(),
        user_agent: navigator.userAgent,
    }

    const res = await client.post(`notifications/subscribe`, data)
    return res.data
}

export const patchSubscription = async (id, data) => {
    const res = await client.patch(`notifications/subscribe/${id}`, data)
    return res.data
}

export const deleteSubscription = async (id) => {
    try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        await subscription.unsubscribe()
    } catch (_) {
        // ignore errors
    }

    setClientSettingsByName("push_notification_subscription", null)

    const res = await client.delete(`notifications/subscribe/${id}`)
    return res.status
}
