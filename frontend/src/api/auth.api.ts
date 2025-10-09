import client, { setCurrentUsername, setToken } from "@api/client"
import { deleteSubscription } from "@api/notifications.api"

import { getClientSettings } from "@utils/clientSettings"

import { isAxiosError } from "axios"

const TwoFactorAuthTokenKey = "two_factor_auth_token"

export type SignUpError =
    | "NETWORK_ERROR"
    | "USER_ALREADY_AUTHENTICATED"
    | "REQUIRED_FIELD_MISSING"
    | "EMAIL_INVALID"
    | "USERNAME_INVALID_LENGTH"
    | "USERNAME_INVALID_FORMAT"
    | "USERNAME_DUPLICATE"
    | "PASSWORD_INVALID"
    | "INTERNAL_ERROR"
    | "EMAIL_NOT_SENT"
    | "UNKNOWN_ERROR"
    | "ENTER_6_DIGIT"

// Types based on backend models and API responses
export interface SignInResponse {
    token?: string
    user?: {
        username: string
        email: string
    }
    two_factor_auth?: {
        token: string
    }
}

export interface TOTPRegisterResponse {
    enabled: boolean
    created_at: string | null
}

export interface TOTPCreateResponse {
    secret: string
    uri: string
}

export interface TOTPVerifyResponse {
    code: string
    message: string
}

export interface TOTPDeleteResponse {
    code: string
    message: string
}

export interface AuthTokenResponse {
    token: string
    user: {
        username: string
    }
}

export interface EmailVerificationResponse {
    email: string
}

export interface ResendResponse {
    seconds?: number
}

// Error types for API responses
export interface ApiError {
    response?: {
        status: number
        data?: {
            code?: string
            seconds?: number
        }
    }
    code?: string
    message?: SignUpError
}

export const signIn = async (
    email: string,
    password: string,
): Promise<boolean> => {
    const res = await client.post<SignInResponse>("auth/sign_in/", {
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

    if (res.data.token && res.data.user) {
        setToken(res.data.token)
        setCurrentUsername(res.data.user.username)
    }

    return false // signing in completed
}

export const authTOTP = async (code: string): Promise<boolean> => {
    const token = localStorage.getItem(TwoFactorAuthTokenKey)
    if (!token) {
        throw new Error("No two-factor authentication token found")
    }

    try {
        const res = await client.post<AuthTokenResponse>(
            "auth/two_factor/totp/",
            {
                token,
                code,
            },
        )
        setToken(res.data.token)
        setCurrentUsername(res.data.user.username)
        localStorage.removeItem(TwoFactorAuthTokenKey)
    } catch (error) {
        if (isAxiosError(error) && error?.response?.status === 403) {
            localStorage.removeItem(TwoFactorAuthTokenKey)
        }

        throw error
    }

    return true
}

export const getTOTP = async (): Promise<TOTPRegisterResponse> => {
    const res = await client.get<TOTPRegisterResponse>(
        `auth/two_factor/totp/register/`,
    )
    return res.data
}

export const createTOTP = async (): Promise<TOTPCreateResponse> => {
    const res = await client.post<TOTPCreateResponse>(
        `auth/two_factor/totp/register/`,
    )
    return res.data
}

export const verifyTOTP = async (code: string): Promise<TOTPVerifyResponse> => {
    const res = await client.patch<TOTPVerifyResponse>(
        `auth/two_factor/totp/register/`,
        {
            code,
        },
    )
    return res.data
}

export const deleteTOTP = async (): Promise<TOTPDeleteResponse> => {
    const res = await client.delete<TOTPDeleteResponse>(
        `auth/two_factor/totp/register/`,
    )
    return res.data
}

export const signUp = async (
    email: string,
    password: string,
    username: string,
) => {
    try {
        const res = await client.post("auth/sign_up/", {
            email,
            password,
            username,
        })
        return res
    } catch (err: unknown) {
        const error = err as ApiError
        let code = ""
        if (error && error.code === "ERR_NETWORK") {
            code = "SIGNUP_NETWORK_ERROR"
        } else if (error && error.response && error.response.status === 400) {
            code = error.response.data?.code || "SIGNUP_BAD_REQUEST"
        } else if (error && error.response && error.response.status === 500) {
            code = error?.response?.data?.code || "SIGNUP_INTERNAL_ERROR"
        } else {
            code = "SIGNUP_UNKNOWN_ERROR"
        }

        throw new Error(code)
    }
}

export const verifyEmail = async (token: string): Promise<string> => {
    const res = await client.post<EmailVerificationResponse>(
        `auth/sign_up/verification/`,
        {
            token,
        },
    )

    return res.data.email
}

export const resendVerificationEmail = async (email: string) => {
    return client.post<ResendResponse>(`auth/sign_up/verification/resend/`, {
        email,
    })
}

export const requestPasswordRecoveryToken = async (email: string) => {
    return client.post(`auth/password_recovery/`, {
        email,
    })
}

export const patchPasswordWithPasswordRecoveryToken = async (
    token: string,
    newPassword: string,
) => {
    return client.patch(`auth/password_recovery/`, {
        token,
        new_password: newPassword,
    })
}

export const signOut = async (): Promise<null> => {
    const subscriptionID = getClientSettings()["push_notification_subscription"]
    if (subscriptionID) {
        deleteSubscription(subscriptionID) // intentionally not awaiting
    }

    try {
        await client.post("auth/sign_out/")
    } catch (_) {
        // ignore error
    }

    localStorage.clear()
    window.location.href = "/"

    return null // this function is being used as 'loader'
}
