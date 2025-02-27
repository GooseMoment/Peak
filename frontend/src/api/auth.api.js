import client, {
    clearUserCredentials,
    setCurrentUsername,
    setToken,
} from "@api/client"
import { deleteSubscription } from "@api/notifications.api"

import { getClientSettings } from "@utils/clientSettings"

const TwoFactorAuthTokenKey = "two_factor_auth_token"

export const signIn = async (email, password) => {
    const res = await client.post("auth/sign_in/", {
        email: email,
        password: password,
    })

    if (res.data.two_factor_auth !== undefined) {
        localStorage.setItem(
            TwoFactorAuthTokenKey,
            res.data.two_factor_auth.token,
        )
        return true // two-factor authentication required
    }

    setToken(res.data.token)
    setCurrentUsername(res.data.user.username)

    return false // signing in completed
}

export const authTOTP = async (type, code) => {
    const token = localStorage.getItem(TwoFactorAuthTokenKey)
    if (!token) {
        throw Error() // TODO: elabroate error
    }

    try {
        const res = await client.post("auth/two_factor/totp/", {
            token,
            code,
        })
        setToken(res.data.token)
        setCurrentUsername(res.data.user.username)
    } catch (e) {
        if (e?.response?.status === 403) {
            localStorage.removeItem(TwoFactorAuthTokenKey)
        }

        throw e
    }

    return true
}

export const getTOTP = async () => {
    const res = await client.get(`auth/two_factor/totp/register/`)
    return res.data
}

export const createTOTP = async () => {
    const res = await client.post(`auth/two_factor/totp/register/`)
    return res.data
}

export const verifyTOTP = async (code) => {
    const res = await client.patch(`auth/two_factor/totp/register/`, {
        code,
    })
    return res.data
}

export const deleteTOTP = async () => {
    const res = await client.delete(`auth/two_factor/totp/register/`)
    return res.data
}

export const signUp = async (email, password, username) => {
    try {
        const res = await client.post("auth/sign_up/", {
            email,
            password,
            username,
        })
        return res
    } catch (err) {
        let code = ""
        if (err && err.code === "ERR_NETWORK") {
            code = "SIGNUP_NETWORK_ERROR"
        } else if (err && err.response && err.response.status === 400) {
            code = err.response.data.code
        } else if (err && err.response && err.response.status === 500) {
            code = err?.response?.data?.code || "SIGNUP_INTERNAL_ERROR"
        } else {
            code = "SIGNUP_UNKNOWN_ERROR"
        }

        throw new Error(code)
    }
}

export const verifyEmail = async (token) => {
    const res = await client.post(`auth/sign_up/verification/`, {
        token,
    })

    return res.data.email
}

export const resendVerificationEmail = async (email) => {
    return client.post(`auth/sign_up/verification/resend/`, {
        email,
    })
}

export const requestPasswordRecoveryToken = async (email) => {
    return client.post(`auth/password_recovery/`, {
        email,
    })
}

export const patchPasswordWithPasswordRecoveryToken = async (
    token,
    newPassword,
) => {
    return client.patch(`auth/password_recovery/`, {
        token,
        new_password: newPassword,
    })
}

export const signOut = async () => {
    const subscriptionID = getClientSettings()["push_notification_subscription"]
    if (subscriptionID) {
        deleteSubscription(subscriptionID) // intentionally not awaiting
    }

    try {
        await client.post("auth/sign_out/")
    } catch (_) {
        // ignore error
    }

    clearUserCredentials()
    window.location = "/"

    return null // this function is being used as 'loader'
}
