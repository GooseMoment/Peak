import { useRouteLoaderData } from "react-router-dom"

import Header from "./Header"
import Middle from "./Middle"
import Footer from "./Footer"

import styled, { css } from "styled-components"

const Sidebar = ({collapsed, setCollapsed}) => {
    const routeData = useRouteLoaderData("app")

    if (!routeData) {
        return null
    }

    const {projects, user} = routeData

    return <SidebarBox $collapsed={collapsed}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Middle collapsed={collapsed} projects={projects} />
        <Footer collapsed={collapsed} user={user} />
    </SidebarBox>
}

export const SidebarBox = styled.nav`
z-index: 99;

position: fixed;
height: 100vh;
width: 18rem;

display: flex;
flex-direction: column;
justify-content: space-between;

color: ${p => p.theme.textColor};
background-color: ${p => p.theme.sidebar.backgroundColor};

${({$collapsed}) => $collapsed ? css`
    width: unset;
` : null}

& * {
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
}
`

export default Sidebar