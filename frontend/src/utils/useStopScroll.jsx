import { useEffect } from "react"

const useStopScroll = (enabled) => {
    useEffect(() => {
        if (!enabled) {
            return
        }

        if (document.body.style.overflow === "hidden") {
            return
        }

        document.body.style.overflow = "hidden"
        document.querySelector("html").scrollTop = window.scrollY
        return () => (document.body.style.overflow = null)
    }, [])
}

export default useStopScroll
