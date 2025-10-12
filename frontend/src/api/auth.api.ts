import client, { setCurrentUsername, setToken } from "@api/client"
import { deleteSubscription } from "@api/notifications.api"

import { getClientSettings } from "@utils/clientSettings"

import { isAxiosError } from "axios"

type BaseErrorCode = "NETWORK_ERROR" | "UNKNOWN_ERROR"

type TokenErrorCode = "TOKEN_REQUIRED" | "TOKEN_INVALID"

interface BaseErrorResponse<T extends string> {
    code: T
    message?: string
}

class AbstractError<TErrorCode extends string> extends Error {
    code: TErrorCode

    constructor(code: TErrorCode, message?: string) {
        super(message)
        this.code = code
    }

    static fromAxiosUnknownError<TErrorCode extends string>(
        err: unknown,
    ): AbstractError<TErrorCode> {
        if (!isAxiosError<BaseErrorResponse<TErrorCode>>(err)) {
            return new this(
                "UNKNOWN_ERROR" as TErrorCode,
                "Unknown error occurred",
            )
        }

        if (!err.response) {
            return new this(
                "NETWORK_ERROR" as TErrorCode,
                "Network error occurred",
            )
        }

        const errorData = err.response.data
        if (!errorData || !errorData.code) {
            return new this("UNKNOWN_ERROR" as TErrorCode, errorData?.message)
        }

        return new this(errorData.code, errorData.message)
    }
}

const TwoFactorAuthTokenKey = "two_factor_auth_token"

export type SignInErrorCode =
    | BaseErrorCode
    | "CREDENTIAL_INVALID"
    | "MAIL_NOT_VERIFIED"

interface SignInResponseSuccess {
    token: string
    user: {
        username: string
        email: string
    }
}

interface SignInResponse2FARequired {
    two_factor_auth: {
        token: string
    }
}

type SignInResponse = SignInResponseSuccess | SignInResponse2FARequired

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

type TOTPAuthErrorCode =
    | BaseErrorCode
    | "TOTP_CODE_INVALID"
    | "TOTP_CODE_LENGTH" // this code is for client-side validation
    | "REQUIRED_FIELD_MISSING" // this won't be actually used, but the server might return this
    | TokenErrorCode
    | "TOKEN_OUT_OF_COUNTS"

export class TOTPAuthError extends AbstractError<TOTPAuthErrorCode> {}

export const authTOTP = async (code: string): Promise<boolean> => {
    const token = sessionStorage.getItem(TwoFactorAuthTokenKey)
    if (!token) {
        throw new TOTPAuthError("TOKEN_REQUIRED", "A token is required.")
    }

    try {
        const res = await client.post<SignInResponseSuccess>(
            "auth/two_factor/totp/",
            {
                token,
                code,
            },
        )
        setToken(res.data.token)
        setCurrentUsername(res.data.user.username)
        sessionStorage.removeItem(TwoFactorAuthTokenKey)
    } catch (err) {
        const error =
            TOTPAuthError.fromAxiosUnknownError<TOTPAuthErrorCode>(err)
        if (error.code !== "TOTP_CODE_INVALID") {
            sessionStorage.removeItem(TwoFactorAuthTokenKey)
        }
        throw error
    }

    return true
}
export interface TOTPRegisterResponse {
    enabled: boolean
    created_at: string | null
}

export const getTOTP = async (): Promise<TOTPRegisterResponse> => {
    const res = await client.get<TOTPRegisterResponse>(
        `auth/two_factor/totp/register/`,
    )
    return res.data
}

export interface TOTPCreateResponse {
    secret: string
    uri: string
}

export const createTOTP = async (): Promise<TOTPCreateResponse> => {
    const res = await client.post<TOTPCreateResponse>(
        `auth/two_factor/totp/register/`,
    )
    return res.data
}

export interface TOTPVerifyResponse {
    code: string
    message: string
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

export interface TOTPDeleteResponse {
    code: string
    message: string
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

export interface VerifyEmailVerificationResponse {
    email: string
}

export const verifyEmailVerificationToken = async (
    token: string,
): Promise<string> => {
    const res = await client.post<VerifyEmailVerificationResponse>(
        `auth/sign_up/verification/`,
        {
            token,
        },
    )

    return res.data.email
}
interface BaseErrorResponseWithSeconds<TErrorCode extends string>
    extends BaseErrorResponse<TErrorCode> {
    seconds?: number
}

class AbstractErrorWithSeconds<TErrorCode extends string> extends Error {
    code: TErrorCode
    seconds: number

    constructor(code: TErrorCode, seconds: number, message?: string) {
        super(message)
        this.code = code
        this.seconds = seconds
    }

    static fromAxiosUnknownError<TErrorCode extends string>(
        err: unknown,
    ): AbstractErrorWithSeconds<TErrorCode> {
        if (!isAxiosError<BaseErrorResponseWithSeconds<TErrorCode>>(err)) {
            return new this(
                "UNKNOWN_ERROR" as TErrorCode,
                0,
                "Unknown error occurred",
            )
        }

        if (!err.response) {
            return new this(
                "NETWORK_ERROR" as TErrorCode,
                0,
                "Network error occurred",
            )
        }

        const errorData = err.response.data
        if (!errorData || !errorData.code) {
            return new this(
                "UNKNOWN_ERROR" as TErrorCode,
                0,
                errorData?.message,
            )
        }

        if ("seconds" in errorData && errorData.seconds) {
            return new this(
                errorData.code,
                errorData.seconds,
                errorData.message,
            )
        }

        return new this(errorData.code, 0, errorData.message)
    }
}

type ResendVerificationEmailErrorCode =
    | "UNKNOWN_ERROR"
    | "REQUIRED_FIELD_MISSING"
    | "EMAIL_INVALID"
    | "RATE_LIMIT_EXCEEDED"

export class ResendVerificationEmailError extends AbstractErrorWithSeconds<ResendVerificationEmailErrorCode> {}

export const resendVerificationEmail = async (email: string) => {
    try {
        await client.post<null>(`auth/sign_up/verification/resend/`, {
            email,
        })
    } catch (err) {
        throw ResendVerificationEmailError.fromAxiosUnknownError<ResendVerificationEmailErrorCode>(
            err,
        )
    }
}

type PasswordRecoveryErrorCode =
    | BaseErrorCode
    | "REQUIRED_FIELD_MISSING"
    | "EMAIL_INVALID"
    | TokenErrorCode
    | "PASSWORD_INVALID"
    | "RATE_LIMIT_EXCEEDED"

export class PasswordRecoveryError extends AbstractErrorWithSeconds<PasswordRecoveryErrorCode> {}

export const requestPasswordRecoveryToken = async (email: string) => {
    try {
        await client.post(`auth/password_recovery/`, {
            email,
        })
    } catch (err) {
        throw PasswordRecoveryError.fromAxiosUnknownError<PasswordRecoveryErrorCode>(
            err,
        )
    }
}

export const patchPasswordWithPasswordRecoveryToken = async (
    token: string,
    newPassword: string,
) => {
    try {
        await client.patch(`auth/password_recovery/`, {
            token,
            new_password: newPassword,
        })
    } catch (err) {
        throw PasswordRecoveryError.fromAxiosUnknownError<PasswordRecoveryErrorCode>(
            err,
        )
    }
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
