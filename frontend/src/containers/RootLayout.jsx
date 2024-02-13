import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "@components/sidebar/Sidebar"

import styled from "styled-components"

const RootLayout = ({noSidebar, children}) => {
    let [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    
    return (
    <App>
        { noSidebar ? null : <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
        <Content $sidebarCollapsed={sidebarCollapsed}>
            <Outlet />
        </Content>
    </App>
    )
}

const App = styled.div`
display: flex;
flex-wrap: wrap;
height: 100vh;
`

const Content = styled.main`
flex-basis: 0;
flex-grow: 999;

padding: 3rem ${props => props.$sidebarCollapsed ? "10rem" : "3rem"};
transition: padding 0.25s;
transition-timing-function: cubic-bezier(.86,0,.07,1);
`

// Reference: https://every-layout.dev/layouts/sidebar

export default RootLayout