import client from "@api/client"

export const getSettings = async () => {
    const res = await client.get(`users/me/setting/`)
    return res.data
}

export const patchSettings = async (data) => {
    const res = await client.patch(`users/me/setting/`, data)
    return res.data
}
