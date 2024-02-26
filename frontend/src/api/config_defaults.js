import axios from 'axios'

const axios_config_defaults = () => {
    axios.defaults.baseURL = 'http://localhost:8000'
    axios.defaults.withCredentials = true // make axios send cookies automatically
}

export default axios_config_defaults