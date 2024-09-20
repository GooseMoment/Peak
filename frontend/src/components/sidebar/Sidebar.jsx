import styled, { css } from "styled-components"

import Footer from "@components/sidebar/Footer"
import Header from "@components/sidebar/Header"
import Middle from "@components/sidebar/Middle"
import { useSidebarContext } from "@components/sidebar/SidebarContext"

import { ifMobile } from "@utils/useScreenType"
import useStopScroll from "@utils/useStopScroll"

import {
    cubicBeizer,
    slideLeftToRight,
    slideLeftToRightReverse,
} from "@assets/keyframes"

const Sidebar = () => {
    const { isMobile, isClosing, isCollapsed } = useSidebarContext()

    useStopScroll(isMobile)

    return (
        <SidebarBox $closing={isClosing} $collapsed={isCollapsed}>
            <Header />
            <Middle />
            <Footer />
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

        ${(p) =>
            p.$closing &&
            css`
                animation: ${slideLeftToRightReverse} 0.5s ${cubicBeizer}
                    forwards;
            `}
    }

    ${(p) =>
        p.$collapsed &&
        css`
            width: unset;
        `}
`

export default Sidebar
