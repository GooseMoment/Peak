import { setClientSettingsByName } from "@utils/clientSettings"
import client from "@api/client"

export const getReminder = async (id) => {
    try {
        const res = await client.get(`notifications/reminders/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const postReminder = async (reminder) => {
    try {
        const res = await client.post(`notifications/reminders/`, reminder)
        return res.status
    } catch (e) {
        throw e
    }
}

export const patchReminder = async (id, edit) => {
    try {
        const res = await client.patch(`notifications/reminders/${id}`, edit)
        return res.data
    } catch (e) {
        throw e
    }

}

export const deleteReminder = async (id) => {
    try {
        const res = await client.delete(`notifications/reminders/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const getNotifications = async (query) => {
    const params = query.queryKey[1]
    const cursor = query.pageParam
    const types = params.types.types.join("|")

    try {
        const res = await client.get(`notifications/?types=${types}&cursor=${cursor}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const getNotification = async (id) => {
    try {
        const res = await client.get(`notifications/${id}`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const deleteNotification = async (id) => {
    return client.delete(`notifications/${id}`)
}

export const postSubscription = async (subscription) => {
    const data = {
        subscription_info: subscription,
        browser: "Firefox",
        user_agent: navigator.userAgent,
    }

    try {
        const res = await client.post(`notifications/subscribe`, data)
        return res.data
    } catch (e) {
        throw e
    }
}

export const deleteSubscription = async (id) => {
    try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        await subscription.unsubscribe()
    } catch (e) {
        // ignore errors
    }

    setClientSettingsByName("push_notification_subscription", null)
    
    try {
        const res = await client.delete(`notifications/subscribe/${id}`)
        return res.status
    } catch (e) {
        throw e
    }
}
