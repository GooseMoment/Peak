import client, { setCurrentUsername, setToken } from "@api/client"
import { deleteSubscription } from "@api/notifications.api"

import { getClientSettings } from "@utils/clientSettings"

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

export const signIn = async (email, password) => {
    const res = await client.post("sign_in/", {
        email: email,
        password: password,
    })

    setToken(res.data.token)
    setCurrentUsername(res.data.user.username)

    return true
}

export const signUp = async (email, password, username) => {
    try {
        const res = await client.post("sign_up/", { email, password, username })
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

export const verifyEmail = async (token) => {
    try {
        const res = await client.post(`sign_up/verification/`, {
            token,
        })

        if (res.status === 200) {
            return res.data.email
        }
    } catch (e) {
        throw e
    }
}

export const resendVerificationEmail = async (email) => {
    return client.post(`sign_up/verification/resend/`, {
        email,
    })
}

export const requestPasswordRecoveryToken = async (email) => {
    return client.post(`password_recovery/`, {
        email,
    })
}

export const patchPasswordWithPasswordRecoveryToken = async (
    token,
    newPassword,
) => {
    return client.patch(`password_recovery/`, {
        token,
        new_password: newPassword,
    })
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
    } catch (_) {
        return false
    }

    return false
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
