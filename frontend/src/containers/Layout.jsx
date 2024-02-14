import { useState } from "react"

import Sidebar from "@components/common/Sidebar"

import styled from "styled-components"

const Layout = ({noSidebar, children}) => {
    let [hideSidebar, setHideSidebar] = useState(false)
    
    return (
    <App>
        { noSidebar ? null : <Sidebar hide={hideSidebar} setHide={setHideSidebar} />}
        <Content $hideSidebar={hideSidebar}>
            {children}
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

padding: 3rem ${props => props.$hideSidebar ? "10rem" : "3rem"};
transition: padding 0.25s;
transition-timing-function: cubic-bezier(.86,0,.07,1);
`

// Reference: https://every-layout.dev/layouts/sidebar

export default Layout