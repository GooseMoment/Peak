import { startTransition } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import styled from "styled-components"

import { cubicBeizer } from "@assets/keyframes"

const SidebarLink = styled(NavLink)`
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

export const SidebarLinkLazy = ({
    to,
    draggable,
    end,
    navigateTo,
    children,
}) => {
    const navigate = useNavigate()

    const onClickLink = (e) => {
        e.preventDefault()

        startTransition(() => {
            navigate(navigateTo || to)
        })
    }

    return (
        <SidebarLink
            onClick={onClickLink}
            to={to}
            draggable={draggable}
            end={end}
        >
            {children}
        </SidebarLink>
    )
}

export default SidebarLink
