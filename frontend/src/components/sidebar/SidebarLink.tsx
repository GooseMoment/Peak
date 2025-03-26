import { type MouseEvent } from "react"
import {
    NavLink,
    type NavLinkProps,
    type To,
    useNavigate,
} from "react-router-dom"

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

interface SidebarLinkProp extends NavLinkProps {
    // use if navigated path and active path are different. If empty, then 'to' is used.
    activePath: To
}

const SidebarLink = ({
    to,
    activePath,
    children,
    ...others
}: SidebarLinkProp) => {
    const navigate = useNavigate()

    const onClick = (e: MouseEvent) => {
        e.preventDefault()
        navigate(to)
    }

    return (
        <StyledNavLink
            onClick={onClick}
            to={activePath || to}
            draggable="false"
            {...others}>
            {children}
        </StyledNavLink>
    )
}

export default SidebarLink
