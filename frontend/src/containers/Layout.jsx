import { useState } from "react"

import Sidebar from "@components/sidebar/Sidebar"

import styled, { css } from "styled-components"

const Layout = ({noSidebar, children}) => {
    let [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    
    return (
    <App>
        { noSidebar ? null : <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
        <Content $sidebarCollapsed={sidebarCollapsed}>
            {children}
        </Content>
    </App>
    )
}

const App = styled.div`
`

const Content = styled.main`
padding: 3rem 3rem 3rem 22rem;
transition: padding 0.25s;
transition-timing-function: cubic-bezier(.86,0,.07,1);

${({$sidebarCollapsed}) => $sidebarCollapsed ? css`
    padding: 3rem 10rem;
` : null}
`

// Reference: https://every-layout.dev/layouts/sidebar

export default Layout