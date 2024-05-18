import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASEURL

export const getToken = () => {
    return localStorage.getItem("token")
}

export const setToken = token => {
    return localStorage.setItem("token", token)
}

const client = axios.create({
    baseURL: baseURL,
    withCredentials: true,
})

client.interceptors.request.use(config => {
    const token = getToken()

    if (token) {
        config.headers.Authorization = "Token " + token
    }

    return config
})

client.interceptors.response.use(res => {
    return res
}, err => {
    if (err.response && err.response.status === 401) {
        throw new Response(
            "", {status: 401},
        )
    }
    throw err
})

export default client
