import { useCallback, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import styled, { css } from "styled-components"

import { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"

const items = [
    {
        to: "search",
        match: "search",
        icon: "search",
    },
    {
        to: "today",
        match: "today",
        icon: "calendar",
    },
    {
        to: "home",
        match: "home",
        icon: "home",
    },
    {
        to: "projects",
        match: "projects",
        icon: "archive",
    },
    {
        to: "social/following",
        match: "social",
        icon: "users",
    },
]

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [activeItemLeft, setActiveItemLeft] = useState(0)
    const [activeItemVisible, setActiveItemVisible] = useState(false)
    const [transition, setTransition] = useState(false)

    const onRefChange = useCallback(
        (node) => {
            if (!node) {
                setActiveItemVisible(false)
                return
            }

            if (!transition) {
                setTimeout(() => setTransition(true), 250)
            }

            setActiveItemVisible(true)
            setActiveItemLeft(node.offsetLeft)
        },
        [location.pathname],
    )

    return (
        <Frame>
            <Box>
                <ActiveItemBackground
                    $left={activeItemLeft}
                    $visible={activeItemVisible}
                    $transition={transition}
                />
                {items.map((item) => (
                    <Item
                        key={item.match}
                        onClick={() => navigate("/app/" + item.to)}
                        ref={
                            location.pathname.startsWith("/app/" + item.match)
                                ? onRefChange
                                : null
                        }>
                        <FeatherIcon icon={item.icon} />
                    </Item>
                ))}
            </Box>
        </Frame>
    )
}

const Frame = styled.nav`
    z-index: 97;

    box-sizing: border-box;
    width: 100dvw;

    pointer-events: none;

    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    padding-left: max(env(safe-area-inset-left, 1em), 1em);
    padding-right: max(env(safe-area-inset-right, 1em), 1em);
    padding-bottom: max(env(safe-area-inset-bottom, 1em), 2em);

    justify-content: center;
    align-items: center;

    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;

    display: none;

    ${ifMobile} {
        display: flex;
    }
`

const Box = styled.div`
    display: flex;

    justify-content: center;
    align-items: center;
    gap: 0.5em;

    pointer-events: all;

    padding: 0.25em;

    border-radius: 32px;

    background-color: ${(p) => p.theme.navbar.backgroundColor};
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);

    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
`

const Item = styled.div`
    color: ${(p) => p.theme.textColor};

    box-sizing: border-box;
    height: 3em;
    width: 3.25em;
    padding: 0.5em;

    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;

    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -webkit-tap-highlight-color: transparent;

    & svg {
        font-size: 1.5em;
        stroke-width: 2.5px;

        top: 0;
        margin-right: unset;
    }
`

const ActiveItemBackground = styled.div`
    position: absolute;

    background-color: ${(p) => p.theme.navbar.activeBackgroundColor};

    top: 0.25em;
    left: ${(p) =>
        p.$left ? css`calc(${(props) => props.$left}px + 0.125em)` : "7.75em"};
    width: 3em;
    height: 3em;

    opacity: ${(p) => (p.$visible ? 1 : 0)};

    transition: ${(p) =>
        p.$transition
            ? css`
        left 0.25s var(--cubic),
        opacity 0.25s var(--cubic)`
            : css`unset`};

    border-radius: 50px;
`

export default Navbar
