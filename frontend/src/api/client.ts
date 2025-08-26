import { getClientTimezone } from "@utils/clientSettings"

import axios, { type AxiosError, isAxiosError } from "axios"

const baseURL = import.meta.env.VITE_API_BASEURL

export const getToken = () => {
    const token = localStorage.getItem("token")
    if (token === "null" || token === "undefined") {
        return null
    }

    return token
}

export const setToken = (token: string | null) => {
    return localStorage.setItem("token", token || "null")
}

export const getCurrentUsername = () => {
    const username = localStorage.getItem("username")
    if (username === "null" || username === "undefined") {
        return null
    }

    return username
}

export const setCurrentUsername = (username: string | null) => {
    return localStorage.setItem("username", username || "null")
}

const client = axios.create({
    baseURL: baseURL,
    withCredentials: true,
})

client.interceptors.request.use((config) => {
    const token = getToken()

    if (token) {
        config.headers.Authorization = "Token " + token
    }

    return config
})

const TIMEZONE_HEADER = "Client-Timezone"

client.interceptors.request.use(
    (config) => {
        const tz = getClientTimezone()
        config.headers[TIMEZONE_HEADER] = tz
        return config
    },
    (err) => err,
)

client.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
        if (err.response && err.response.status === 401) {
            localStorage.clear()
            window.location.href = "/sign/in?flag=401"
            return
        }
        throw err
    },
)

export const isAxiosErrorStatus = (error: unknown, status: number) => {
    return (
        isAxiosError(error) &&
        error.response &&
        error.response.status === status
    )
}

export default client
