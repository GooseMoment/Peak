import { toast } from "react-toastify"

const commonOption = {}

class notify {
    static any(msg, option = {}) {
        return toast(msg, Object.assign(option, commonOption))
    }
    static success(msg, option = {}) {
        return toast.success(msg, Object.assign(option, commonOption))
    }
    static error(msg, option = {}) {
        return toast.error(msg, Object.assign(option, commonOption))
    }
    static warn(msg, option = {}) {
        return toast.warn(msg, Object.assign(option, commonOption))
    }
    static info(msg, option = {}) {
        return toast.info(msg, Object.assign(option, commonOption))
    }
}

export default notify
