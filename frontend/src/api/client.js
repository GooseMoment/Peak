import axios from 'axios'

let baseURL = "https://api.peak.ooo"

if (process.env.NODE_ENV === "development") {
    baseURL = "http://localhost:8888"
}

export const KEY_IS_SIGNED_IN = "is_signed_in"
export const VALUE_IS_SIGNED_IN = "yeah"

const client = axios.create({
    baseURL: baseURL,
    withCredentials: true,
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