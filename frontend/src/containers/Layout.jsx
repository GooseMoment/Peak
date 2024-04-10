import { useState } from "react"

import Sidebar from "@components/sidebar/Sidebar"

import { getClientSettings } from "@utils/clientSettings"

import styled, { css } from "styled-components"

const closeSidebarOnStartUp = getClientSettings()["close_sidebar_on_startup"]
const contentPadding = getClientSettings()["main_width"] || "5rem"

const Layout = ({noSidebar, children}) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(closeSidebarOnStartUp)
    
    return (
    <App>
        { noSidebar ? null : <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
        <Content $sidebarCollapsed={sidebarCollapsed} $sidePadding={contentPadding}>
            {children}
        </Content>
    </App>
    )
}

const App = styled.div`
`

const Content = styled.main`
padding: 3rem ${props => props.$sidePadding};
padding-left: calc(${props => props.$sidePadding} + 18rem);

transition: padding 0.25s;
transition-timing-function: cubic-bezier(.86,0,.07,1);

${({$sidebarCollapsed}) => $sidebarCollapsed ? css`
    padding: 3rem calc(${props => props.$sidePadding} + 7rem);
` : null}
`

// Reference: https://every-layout.dev/layouts/sidebar

export default Layout