import client from "@api/client"

export const getMe = async () => {
    try {
        const res = await client.get("users/me")
        return res.data
    } catch (e) {
        throw e
    }
}

export const getUserByUsername = async (username) => {
    try {
        const res = await client.get(`users/@${username}/`)
        return res.data
    } catch (e) {
        throw e
    }
}

export const patchUser = async (data) => {
    try {
        const me = await getMe()
        const res = await client.patch(`users/@${me.username}/`, data)
        return res.status
    } catch (e) {
        throw e
    }
}

export const signIn = async (email, password) => {
    try {
        await client.post("sign_in/", {
            email: email,
            password: password,
        })
    } catch (e) {
        return false
    }

    return true
}