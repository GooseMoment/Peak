import { useEffect, useState } from "react"

import Sidebar from "@components/sidebar/Sidebar"
import Navbar from "@components/navbar/Navbar"

import { ifWidthM, ifWidthS, useScreenType } from "@utils/screenType"
import { useClientSetting } from "@utils/clientSettings"

import styled, { css } from "styled-components"

const Layout = ({children}) => {
    const [clientSetting, ] = useClientSetting()
    
    const [sidebarHidden, setSidebarHidden] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(clientSetting["close_sidebar_on_startup"])
    const contentPadding = clientSetting["main_width"] || "5rem"

    const widthType = useScreenType()

    useEffect(() => {
        setSidebarHidden(widthType === "S")
    }, [widthType])

    const openSidebarFromNavbar = () => {
        setSidebarHidden(false)
        setSidebarCollapsed(false)
    }
    
    return (
    <App>
        {widthType === "S" && <Navbar openSidebar={openSidebarFromNavbar} />}
        {!sidebarHidden && <Sidebar mobile={widthType === "S"} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
        <Content $sidebarCollapsed={sidebarCollapsed} $sidePadding={contentPadding}>
            {children}
        </Content>
    </App>
    )
}

const App = styled.div`
    background-color: ${p => p.theme.backgroundColor};
`

const Content = styled.main`
    padding: 3rem ${props => props.$sidePadding};
    padding-left: calc(${props => props.$sidePadding} + 18rem);

    ${p => p.$sidebarCollapsed ? css`
        padding: 3rem calc(${p.$sidePadding} + 7rem);
    ` : null}

    min-height: 100dvh;
    box-sizing: border-box;
    color: ${p => p.theme.textColor};

    ${ifWidthM} {
        padding: 2rem 1.75rem;
        padding-left: calc(6rem + 1.75rem);
    }

    ${ifWidthS} {
        padding: 2rem 1.5rem;
        padding-bottom: calc(2rem + 6rem);
    }
`

// Reference: https://every-layout.dev/layouts/sidebar

export default Layout
