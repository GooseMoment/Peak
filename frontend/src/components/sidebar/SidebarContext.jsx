import { createContext, useContext, useEffect, useState } from "react"

import { useClientSetting } from "@utils/clientSettings"
import useScreenType, { WIDTH_TABLET } from "@utils/useScreenType"

const startUpWidth = window.innerWidth

const SidebarContext = createContext()

export const SidebarContextProvider = ({ children }) => {
    const [clientSetting] = useClientSetting()

    const { isMobile } = useScreenType()

    const [isClosing, setClosing] = useState(false)
    const [isCollapsed, setCollapsed] = useState(
        startUpWidth <= WIDTH_TABLET ||
            clientSetting["close_sidebar_on_startup"],
    )
    const [isHidden, setHidden] = useState(true)

    useEffect(() => {
        setHidden(isMobile)
    }, [isMobile])

    const openFromNav = () => {
        setHidden(false)
        setCollapsed(false)
    }

    const startClosing = () => {
        setClosing(true)
        setTimeout(() => {
            setHidden(true)
            setClosing(false)
        }, 250)
    }

    const contextValue = {
        isClosing,
        isCollapsed,
        setCollapsed,
        isHidden,
        isMobile,
        openFromNav,
        startClosing,
    }

    return (
        <SidebarContext.Provider value={contextValue}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebarContext = () => {
    return useContext(SidebarContext)
}
