import axios from 'axios'

const axios_config_defaults = () => {
    axios.defaults.baseURL = 'https://api.peak.ooo'

    if (process.env.NODE_ENV === "development") {
        axios.defaults.baseURL = 'http://localhost:8888'
    }

    axios.defaults.withCredentials = true // make axios send cookies automatically
}

export default axios_config_defaults