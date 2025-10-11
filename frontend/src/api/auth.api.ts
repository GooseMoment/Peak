import client, { setCurrentUsername, setToken } from "@api/client"
import { deleteSubscription } from "@api/notifications.api"

import { getClientSettings } from "@utils/clientSettings"

import { isAxiosError } from "axios"

type BaseErrorCode = "NETWORK_ERROR" | "UNKNOWN_ERROR"

interface BaseErrorResponse<T extends string> {
    code: T
    message?: string
}

class AbstractError<T extends string> extends Error {
    code: T

    constructor(code: T, message?: string) {
        super(message)
        this.code = code
    }

    static fromAxiosUnknownError<T extends string>(
        err: unknown,
    ): AbstractError<T> {
        if (isAxiosError<BaseErrorResponse<T>>(err)) {
            if (!err.response) {
                return new this<T>(
                    "NETWORK_ERROR" as T,
                    "Network error occurred",
                )
            }

            const errorData = err.response.data
            if (!errorData || !errorData.code) {
                return new this<T>("UNKNOWN_ERROR" as T, errorData?.message)
            }

            return new this<T>(errorData.code as T, errorData.message)
        }

        return new this<T>("UNKNOWN_ERROR" as T, "Unknown error occurred")
    }
}

const TwoFactorAuthTokenKey = "two_factor_auth_token"

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
    message?: SignInErrorCode
}

export type SignInErrorCode =
    | BaseErrorCode
    | "CREDENTIAL_INVALID"
    | "MAIL_NOT_VERIFIED"

interface SignInResponseWithout2FA {
    token: string
    user: {
        username: string
        email: string
    }
}

interface SignInResponseWith2FA {
    two_factor_auth: {
        token: string
    }
}

type SignInResponse = SignInResponseWithout2FA | SignInResponseWith2FA

export class SignInError extends AbstractError<SignInErrorCode> {}

export const signIn = async (
    email: string,
    password: string,
): Promise<boolean> => {
    try {
        const res = await client.post<SignInResponse>("auth/sign_in/", {
            email,
            password,
        })

        if ("two_factor_auth" in res.data) {
            sessionStorage.setItem(
                TwoFactorAuthTokenKey,
                res.data.two_factor_auth.token,
            )
            return true // two-factor authentication required
        }

        if ("token" in res.data && "user" in res.data) {
            setToken(res.data.token)
            setCurrentUsername(res.data.user.username)
        }

        return false // signing in completed
    } catch (err) {
        throw SignInError.fromAxiosUnknownError<SignInErrorCode>(err)
    }
}

export const authTOTP = async (code: string): Promise<boolean> => {
    const token = sessionStorage.getItem(TwoFactorAuthTokenKey)
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
        sessionStorage.removeItem(TwoFactorAuthTokenKey)
    } catch (error) {
        if (isAxiosError(error) && error?.response?.status === 403) {
            sessionStorage.removeItem(TwoFactorAuthTokenKey)
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

export type SignUpErrorCode =
    | BaseErrorCode
    | "USER_ALREADY_AUTHENTICATED"
    | "REQUIRED_FIELD_MISSING"
    | "EMAIL_INVALID"
    | "USERNAME_INVALID_LENGTH"
    | "USERNAME_INVALID_FORMAT"
    | "USERNAME_DUPLICATE"
    | "PASSWORD_INVALID"
    | "INTERNAL_ERROR"
    | "EMAIL_NOT_SENT"

export class SignUpError extends AbstractError<SignUpErrorCode> {}

export const signUp = async (
    email: string,
    password: string,
    username: string,
) => {
    try {
        await client.post<null>("auth/sign_up/", {
            email,
            password,
            username,
        })
    } catch (err) {
        throw SignUpError.fromAxiosUnknownError<SignUpErrorCode>(err)
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
