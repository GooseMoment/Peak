import client, { getCurrentUsername } from "@api/client"

export const getAnnouncements = async (
    lang,
    pinned_only = false,
    page = "",
) => {
    const res = await client.get(`announcements`, {
        params: { lang, page, pinned_only },
    })
    return res.data
}

export const getAnnouncement = async (id) => {
    const res = await client.get(`announcements/${id}/`)
    return res.data
}

export const getHeart = async (announcement_id) => {
    const username = getCurrentUsername()

    try {
        await client.get(
            `announcements/${announcement_id}/hearts/@${username}/`,
        )
    } catch (e) {
        if (e.response.status === 404) {
            return false
        }

        throw e
    }

    return true
}

export const postHeart = async (announcement_id) => {
    const username = getCurrentUsername()
    return client.post(`announcements/${announcement_id}/hearts/@${username}/`)
}

export const deleteHeart = async (announcement_id) => {
    const username = getCurrentUsername()
    return client.delete(
        `announcements/${announcement_id}/hearts/@${username}/`,
    )
}
