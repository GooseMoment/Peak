import { useState } from "react"

import Sidebar from "@components/sidebar/Sidebar"

import { useClientSetting } from "@utils/clientSettings"

import styled, { css } from "styled-components"

const Layout = ({noSidebar, children}) => {
    const [clientSetting, ] = useClientSetting()
    
    const [sidebarCollapsed, setSidebarCollapsed] = useState(clientSetting["close_sidebar_on_startup"])
    const contentPadding = clientSetting["main_width"] || "5rem"
    
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
    background-color: ${p => p.theme.backgroundColor};
`

const Content = styled.main`
padding: 3rem ${props => props.$sidePadding};
padding-left: calc(${props => props.$sidePadding} + 18rem);

transition: padding 0.25s;
transition-timing-function: cubic-bezier(.86,0,.07,1);

${({$sidebarCollapsed}) => $sidebarCollapsed ? css`
    padding: 3rem calc(${props => props.$sidePadding} + 7rem);
` : null}

min-height: 100vh;
box-sizing: border-box;
color: ${p => p.theme.textColor};
`

// Reference: https://every-layout.dev/layouts/sidebar

export default Layout