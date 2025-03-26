import {
    type MouseEvent,
    type MouseEventHandler,
    type ReactNode,
    startTransition,
} from "react"
import { NavLink, type To, useNavigate } from "react-router-dom"

import styled from "styled-components"

import { cubicBeizer } from "@assets/keyframes"

const StyledNavLink = styled(NavLink)`
    text-decoration: none;
    color: inherit;
    border-radius: 10px;

    transition: background-color 0.1s;
    transition-timing-function: ${cubicBeizer};

    &.active {
        color: ${(p) => p.theme.sidebar.activeColor};
        background-color: ${(p) => p.theme.sidebar.activeBackgroundColor};
    }

    &:hover:not(.active) {
        color: ${(p) => p.theme.sidebar.hoverColor};
        background-color: ${(p) => p.theme.sidebar.hoverBackgroundColor};
    }
`

interface SidebarLinkProp {
    onClick?: MouseEventHandler
    to: To
    activePath: To
    end?: boolean
    children?: ReactNode
    lazy?: boolean
    noNavigate?: boolean
}

const SidebarLink = ({
    onClick, // onClick is called before navigate().
    to,
    activePath, // use if navigated path and active path are different. If empty, then 'to' is used.
    end = false,
    children,
    lazy = false, // if true, then navigate() is called inside startTransition().
    noNavigate = false, // if true, then navigate() isn't called.
}: SidebarLinkProp) => {
    const navigate = useNavigate()

    const onClickThis = (e: MouseEvent) => {
        e.preventDefault()

        if (onClick) {
            onClick(e)
        }

        if (noNavigate) {
            return
        }

        if (lazy) {
            startTransition(() => {
                navigate(to)
            })
        } else {
            navigate(to)
        }
    }

    return (
        <StyledNavLink
            onClick={onClickThis}
            to={activePath || to}
            draggable="false"
            end={end}>
            {children}
        </StyledNavLink>
    )
}

export default SidebarLink
