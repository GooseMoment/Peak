import client from "@api/client"

export const getNotifications = async (cursor) => {
    try {
        const res = await client.get(`notifications/?from=${cursor}`)
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
