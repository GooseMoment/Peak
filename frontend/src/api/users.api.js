import client, { setToken } from "@api/client"
import { deleteSubscription } from "./notifications.api"
import { getClientSettings } from "@/utils/clientSettings"

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
        const res = await client.post("sign_in/", {
            email: email,
            password: password,
        })

        setToken(res.data.token)
        return true

    } catch (e) {
        return false
    }
}

export const signUp = async (email, password, username) => {
    try {
        const res = await client.post("sign_up/", {email, password, username})
        return res
    } catch (err) {
        let msg = ""
        if (err && err.code === "ERR_NETWORK") {
            msg = "Please check your network."
        } else if (err && err.response && err.response.status === 400) {
            switch (err.response.data.code) {
                case 'SIGNUP_SIGNED_IN_USER':
                    msg = "You already signed in! Please go back to your app."
                    break
                case 'SIGNUP_USERNAME_TOO_SHORT':
                    msg = "username should be more than 4 characters."
                    break
                case 'SIGNUP_PASSWORD_TOO_SHORT':
                    msg = "You already signed in! Please go back to your app."
                    break
                case 'SIGNUP_USERNAME_WRONG':
                    msg = "username should only contain alphabets, underscore, and digits."
                    break
            }
        } else if (err && err.response && err.response.status === 500) {
            msg = "Something's wrong with our server. Please try later."
            return
        } else {
            throw err
        }

        throw new Error(msg)
    }
}

export const signOut = async () => {
    setToken(null)

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
