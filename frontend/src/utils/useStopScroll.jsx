import { useEffect } from "react"

const useStopScroll = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden"
        document.querySelector("html").scrollTop = window.scrollY
        return () => document.body.style.overflow = null
    }, [])
}

export default useStopScroll
