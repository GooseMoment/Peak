import {
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    createContext,
    useContext,
    useState,
} from "react"

import { useClientSetting } from "@utils/clientSettings"
import { WIDTH_TABLET } from "@utils/useScreenType"

const startUpWidth = window.innerWidth

export interface StyledCollapsedProp {
    $collapsed?: boolean
}

interface SidebarCollapsed {
    isCollapsed: boolean
    setCollapsed: Dispatch<SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarCollapsed>({
    isCollapsed: false,
    setCollapsed: () => {},
})

export const SidebarContextProvider = ({
    children,
}: {
    children?: ReactNode
}) => {
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
