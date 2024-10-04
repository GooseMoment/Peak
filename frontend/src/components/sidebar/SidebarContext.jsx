import { createContext, useContext, useState } from "react"

import { useClientSetting } from "@utils/clientSettings"
import { WIDTH_TABLET } from "@utils/useScreenType"

const startUpWidth = window.innerWidth

const SidebarContext = createContext()

export const SidebarContextProvider = ({ children }) => {
    const [clientSetting] = useClientSetting()

    const [isCollapsed, setCollapsed] = useState(
        startUpWidth <= WIDTH_TABLET ||
            clientSetting["close_sidebar_on_startup"],
    )
    const contextValue = {
        isCollapsed,
        setCollapsed,
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
