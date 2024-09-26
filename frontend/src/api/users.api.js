import client, { setCurrentUsername } from "@api/client"

export const getMe = async () => {
    const res = await client.get("users/me")
    setCurrentUsername(res.data.username)
    return res.data
}

export const getUserByUsername = async (username) => {
    const res = await client.get(`users/@${username}/`)
    return res.data
}

export const patchUser = async (data) => {
    const me = await getMe()
    const res = await client.patch(`users/@${me.username}/`, data)
    return res.status
}

export const patchPassword = async (current_password, new_password) => {
    const res = await client.patch("users/me/password/", {
        current_password,
        new_password,
    })
    if (res.status === 200) {
        return true
    }

    return res.data
}

export const uploadProfileImg = async (formData) => {
    const res = await client.post("users/me/profile_img/", formData)
    return res.status
}

export const getBlocks = async () => {
    const res = await client.get(`users/me/blocks/`)
    return res.data
}
