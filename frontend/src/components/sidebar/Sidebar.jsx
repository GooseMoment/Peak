import styled, { css } from "styled-components"

import Footer from "./Footer"
import Header from "./Header"
import Middle from "./Middle"

import { ifMobile } from "@utils/useScreenType"
import useStopScroll from "@utils/useStopScroll"

import { cubicBeizer, slideLeftToRight } from "@assets/keyframes"

const Sidebar = ({ collapsed, setCollapsed, setSidebarHidden }) => {
    const { isMobile } = useScreenType()
    useStopScroll(isMobile)

    return (
        <SidebarBox $collapsed={collapsed}>
            <Header
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                setSidebarHidden={setSidebarHidden}
            />
            <Middle collapsed={collapsed} setSidebarHidden={setSidebarHidden} />
            <Footer collapsed={collapsed} setSidebarHidden={setSidebarHidden} />
        </SidebarBox>
    )
}

export const SidebarBox = styled.nav`
    z-index: 99;

    padding-bottom: calc(env(safe-area-inset-bottom) - 1em);
    box-sizing: border-box;

    position: fixed;
    height: 100dvh;
    width: 18rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.sidebar.backgroundColor};

    & * {
        user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }

    ${ifMobile} {
        width: 100dvw;
        padding-left: 0.75em;
        padding-right: 0.75em;

        animation: ${slideLeftToRight} 0.25s ${cubicBeizer};
    }

    ${(p) =>
        p.$collapsed &&
        css`
            width: unset;
        `}
`

export default Sidebar
