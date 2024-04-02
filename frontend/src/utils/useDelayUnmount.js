import { useState, useEffect } from "react"

// from: https://stackoverflow.com/a/54114180
function useDelayUnmount(isMounted, delayTime, onUnmount=() => {}) {
    const [ shouldRender, setShouldRender ] = useState(false)

    useEffect(() => {
        let timeoutId
        // useEffect first run
        if (isMounted && !shouldRender) {
            setShouldRender(true)
        }
        // useEffect second or more run (to run setTimeout)
        else if(!isMounted && shouldRender) {
            timeoutId = setTimeout(
                () => {
                    setShouldRender(false)
                    onUnmount()
                }, 
                delayTime
            )
        }
        return () => {
            clearTimeout(timeoutId)
        }
    }, [isMounted, delayTime, shouldRender])

    return shouldRender
}

export default useDelayUnmount