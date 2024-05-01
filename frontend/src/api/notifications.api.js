import client from "@api/client"

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
        return res.status
    } catch (e) {
        throw e
    }
}
