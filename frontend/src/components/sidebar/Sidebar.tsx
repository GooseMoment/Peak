import styled, { css } from "styled-components"

import Footer from "@components/sidebar/Footer"
import Header from "@components/sidebar/Header"
import Middle from "@components/sidebar/Middle"
import {
    type StyledCollapsedProp,
    useSidebarContext,
} from "@components/sidebar/SidebarContext"

import { ifMobile } from "@utils/useScreenType"

const Sidebar = () => {
    const { isCollapsed } = useSidebarContext()

    return (
        <SidebarBox $collapsed={isCollapsed}>
            <Header />
            <Middle />
            <Footer />
        </SidebarBox>
    )
}

export const SidebarBox = styled.nav<StyledCollapsedProp>`
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
        display: none;
    }

    ${(p) =>
        p.$collapsed &&
        css`
            width: unset;
        `}
`

export default Sidebar
