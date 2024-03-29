import axios from 'axios'

let baseURL = "https://api.peak.ooo"

if (process.env.NODE_ENV === "development") {
    baseURL = "http://localhost:8888"
}

const client = axios.create({
    baseURL: baseURL,
    withCredentials: true,
})


export default client