import { setClientSettingsByName } from "@/utils/clientSettings"
import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASEURL

export const getToken = () => {
    const token = localStorage.getItem("token")
    if (token === "null" || token === "undefined") {
        return null
    }

    return token
}

export const setToken = (token) => {
    return localStorage.setItem("token", token)
}

export const getCurrentUsername = () => {
    const token = localStorage.getItem("username")
    if (token === "null" || token === "undefined") {
        return null
    }

    return token
}

export const setCurrentUsername = (username) => {
    return localStorage.setItem("username", username)
}

export const clearUserCredentials = () => {
    setToken(null)
    setCurrentUsername(null)
    setClientSettingsByName("push_notification_subscription", null)
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

client.interceptors.response.use(
    (res) => {
        return res
    },
    (err) => {
        if (err.response && err.response.status === 401) {
            clearUserCredentials()
            window.location = "/sign/in?flag=401"
            return
        }
        throw err
    },
)

export default client
