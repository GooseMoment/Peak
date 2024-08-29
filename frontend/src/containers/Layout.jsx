import { useEffect, useState } from "react"

import styled, { css } from "styled-components"

import Navbar from "@components/navbar/Navbar"
import Sidebar from "@components/sidebar/Sidebar"

import { useClientSetting } from "@utils/clientSettings"
import useScreenType, {
    WIDTH_TABLET,
    ifMobile,
    ifTablet,
} from "@utils/useScreenType"

const startUpWidth = window.innerWidth

const Layout = ({ children }) => {
    const [clientSetting] = useClientSetting()

    const [sidebarHidden, setSidebarHidden] = useState(true)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(
        startUpWidth <= WIDTH_TABLET ||
            clientSetting["close_sidebar_on_startup"],
    )
    const contentPadding = clientSetting["main_width"] || "5rem"

    const { isMobile } = useScreenType()

    useEffect(() => {
        setSidebarHidden(isMobile)
    }, [isMobile])

    const openSidebarFromNavbar = () => {
        setSidebarHidden(false)
        setSidebarCollapsed(false)
    }

    return (
        <App>
            <Navbar openSidebar={openSidebarFromNavbar} />
            {!sidebarHidden && (
                <Sidebar
                    setSidebarHidden={setSidebarHidden}
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />
            )}
            <Content
                $sidebarCollapsed={sidebarCollapsed}
                $sidePadding={contentPadding}>
                {children}
            </Content>
        </App>
    )
}

const App = styled.div`
    background-color: ${(p) => p.theme.backgroundColor};
`

const Content = styled.main`
    padding: 3rem ${(props) => props.$sidePadding};
    padding-left: calc(${(props) => props.$sidePadding} + 18rem);

    ${(p) =>
        p.$sidebarCollapsed &&
        css`
            padding-left: calc(${p.$sidePadding} + 7rem);
        `}

    min-height: 100dvh;
    box-sizing: border-box;
    color: ${(p) => p.theme.textColor};

    ${ifTablet} {
        padding-top: max(env(safe-area-inset-top), 2rem);
        padding-right: max(env(safe-area-inset-right), 1.75rem);
        padding-bottom: calc(2rem);
        padding-left: calc(max(env(safe-area-inset-left), 1.75rem) + 6rem);
    }

    ${ifMobile} {
        padding-top: max(env(safe-area-inset-top), 2rem);
        padding-right: max(env(safe-area-inset-right), 1.5rem);
        padding-bottom: calc(2rem + 6rem);
        padding-left: max(env(safe-area-inset-left), 1.5rem);
    }
`

// Reference: https://every-layout.dev/layouts/sidebar

export default Layout
