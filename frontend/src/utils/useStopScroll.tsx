import { useEffect, useRef } from "react"

export default function useStopScroll(enabled: boolean) {
    const previous = useRef<string>("auto")

    const rollbackScroll = () => {
        document.body.style.overflow = previous.current
        document.documentElement.scrollTop = 0
    }

    useEffect(() => {
        if (!enabled) {
            return rollbackScroll
        }

        if (document.body.style.overflow === "hidden") {
            return rollbackScroll
        }

        previous.current = document.body.style.overflow
        document.body.style.overflow = "hidden"
        document.documentElement.scrollTop = window.scrollY

        return rollbackScroll
    }, [enabled])
}
