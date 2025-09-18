import { useEffect, useRef } from "react"

export default function useStopScroll(enabled: boolean) {
    const previous = useRef<string>("auto")

    const rollbackScroll = () => {
        document.body.style.overflow = previous.current
    }

    useEffect(() => {
        if (!enabled) {
            return rollbackScroll
        }

        if (document.body.style.overflow === "hidden") {
            return rollbackScroll
        }

        previous.current = document.body.style.overflow
        document.documentElement.scrollTop = window.scrollY
        document.body.style.overflow = "hidden"

        return rollbackScroll
    }, [enabled])
}
