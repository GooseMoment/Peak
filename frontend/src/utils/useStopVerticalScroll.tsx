import { CSSProperties, useEffect, useRef } from "react"

export default function useStopVerticalScroll(enabled: boolean) {
    const previous = useRef<CSSProperties["overflowY"]>("inherit")
    const wasSet = useRef(false)

    const rollbackScroll = () => {
        if (!wasSet.current) {
            return
        }

        document.body.style.overflowY = previous.current || "inherit"
    }

    useEffect(() => {
        if (!enabled) {
            return rollbackScroll
        }

        if (document.body.style.overflowY === "hidden") {
            return rollbackScroll
        }

        wasSet.current = true
        previous.current = document.body.style
            .overflowY as CSSProperties["overflowY"]
        document.documentElement.scrollTop = window.scrollY
        document.body.style.overflowY = "hidden"

        return rollbackScroll
    }, [enabled])
}
