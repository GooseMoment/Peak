import { startTransition } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import styled from "styled-components"

import { useSidebarContext } from "@components/sidebar/SidebarContext"

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

const SidebarLink = ({
    onClick, // onClick is called before navigate().
    to,
    activePath, // use if navigated path and active path are different. If empty, then 'to' is used.
    end,
    children,
    lazy = false, // if true, then navigate() is called inside startTransition().
    noNavigate = false, // if true, then navigate() isn't called.
}) => {
    const navigate = useNavigate()
    const { isMobile, startClosing } = useSidebarContext()

    const onClickThis = (e) => {
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

        if (isMobile) {
            startClosing()
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
