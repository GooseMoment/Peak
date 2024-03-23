import axios from 'axios'

const client = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
})

export default client