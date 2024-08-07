import { useEffect, useState } from "react"

import styled, { css } from "styled-components"

import Navbar from "@components/navbar/Navbar"
import Sidebar from "@components/sidebar/Sidebar"

import { useClientSetting } from "@utils/clientSettings"
import useScreenType, { ifMobile, ifTablet } from "@utils/useScreenType"

import { cubicBeizer, modalFadeIn } from "@assets/keyframes"

const Layout = ({ children }) => {
    const [clientSetting] = useClientSetting()

    const [sidebarHidden, setSidebarHidden] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(
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
            {isMobile && <Navbar openSidebar={openSidebarFromNavbar} />}
            {!sidebarHidden && (
                <Sidebar
                    setSidebarHidden={setSidebarHidden}
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />
            )}
            {isMobile && !sidebarHidden && (
                <BackgroundWall onClick={() => setSidebarHidden(true)} />
            )}
            <Content
                $sidebarCollapsed={sidebarCollapsed}
                $sidePadding={contentPadding}
            >
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
        p.$sidebarCollapsed
            ? css`
                  padding: 3rem calc(${p.$sidePadding} + 7rem);
              `
            : null}

    min-height: 100dvh;
    box-sizing: border-box;
    color: ${(p) => p.theme.textColor};

    ${ifTablet} {
        padding: 2rem 1.75rem;
        padding-left: calc(6rem + 1.75rem);
    }

    ${ifMobile} {
        padding-top: max(env(safe-area-inset-top), 2rem);
        padding-right: max(env(safe-area-inset-right), 1.5rem);
        padding-bottom: calc(2rem + 6rem);
        padding-left: max(env(safe-area-inset-left), 1.5rem);
    }
`

const BackgroundWall = styled.div`
    z-index: 98;

    position: fixed;
    height: 100dvh;
    width: 100dvw;
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);

    animation: ${modalFadeIn} 0.25s ${cubicBeizer} forwards;
`

// Reference: https://every-layout.dev/layouts/sidebar

export default Layout
