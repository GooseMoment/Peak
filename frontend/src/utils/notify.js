import { toast } from "react-toastify"

const position = "bottom-left"

class notify {
    static any(msg) {
        return toast(msg, {
            position: position,
        })
    }
    static success(msg) {
        return toast.success(msg, {
            position: position,
        })
    }
    static error(msg) {
        return toast.error(msg, {
            position: position,
        })
    }
    static warn(msg) {
        return toast.warn(msg, {
            position: position,
        })
    }
    static info(msg) {
        return toast.info(msg, {
            position: position,
        })
    }
}

export default notify