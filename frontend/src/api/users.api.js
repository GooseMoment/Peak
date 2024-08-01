import client, { setToken, setCurrentUsername } from "@api/client"
import { deleteSubscription } from "@api/notifications.api"
import { getClientSettings } from "@utils/clientSettings"

export const getMe = async () => {
    try {
        const res = await client.get("users/me")
        setCurrentUsername(res.data.username)
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
        const res = await client.post("sign_in/", {
            email: email,
            password: password,
        })

        setToken(res.data.token)
        setCurrentUsername(res.data.user.username)

        return true
    } catch (e) {
        throw e
    }
}

export const signUp = async (email, password, username, locale) => {
    try {
        const res = await client.post("sign_up/", {email, password, username, locale})
        return res
    } catch (err) {
        let code = ""
        if (err && err.code === "ERR_NETWORK") {
            code = "SIGNUP_NETWORK_ERROR"
        } else if (err && err.response && err.response.status === 400) {
            code = err.response.data.code
        } else if (err && err.response && err.response.status === 500) {
            code = "SIGNUP_INTERNAL_ERROR"
        } else {
            code = "SIGNUP_UNKNOWN_ERROR"
        }

        throw new Error(code)
    }
}

export const signOut = async () => {
    setToken(null)
    setCurrentUsername(null)

    const subscriptionID = getClientSettings()["push_notification_subscription"]

    try {
        await deleteSubscription(subscriptionID)

        const res = await client.get("sign_out/")
        if (res.status === 200) {
            return true
        }
    } catch (e) {
        return false
    }

    return false
}

export const patchPassword = async (current_password, new_password) => {
    try {
        const res = await client.patch("users/me/password/", {
            current_password, new_password
        })
        if (res.status === 200) {
            return true
        }

        return res.data
    } catch (e) {
        throw e
    }
}

export const uploadProfileImg = async (formData) => {
    try {
        const res = await client.post("users/me/profile_img/", formData)
        return res.status
    } catch (e) {
        throw e
    }
}

export const getBlocks = async () => {
    try {
        const res = await client.get(`users/me/blocks/`)
        return res.data
    } catch (e) {
        throw e
    }
}
