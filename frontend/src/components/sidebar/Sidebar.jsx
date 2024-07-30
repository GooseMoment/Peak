import { useRouteLoaderData } from "react-router-dom"

import Header from "./Header"
import Middle from "./Middle"
import Footer from "./Footer"

import { cubicBeizer, slideLeftToRight } from "@assets/keyframes"
import { ifMobile } from "@utils/useScreenType"

import styled, { css } from "styled-components"

const Sidebar = ({collapsed, setCollapsed, setSidebarHidden, isMobile}) => {
    const routeData = useRouteLoaderData("app")

    if (!routeData) {
        return null
    }

    const {projects, user} = routeData

    return <SidebarBox $collapsed={collapsed}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} setSidebarHidden={setSidebarHidden} isMobile={isMobile} />
        <Middle collapsed={collapsed} projects={projects} />
        <Footer collapsed={collapsed} user={user} />
    </SidebarBox>
}

export const SidebarBox = styled.nav`
z-index: 99;

position: fixed;
height: 100dvh;
width: 18rem;

padding-bottom: calc(env(safe-area-inset-bottom) - 1em);
box-sizing: border-box;

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

    ${ifMobile} {
        width: 100dvw;
        padding-left: 1em;
        padding-right: 1em;

        animation: ${slideLeftToRight} 0.25s ${cubicBeizer};
    }
`

export default Sidebar