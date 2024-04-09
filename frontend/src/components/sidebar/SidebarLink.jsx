import { NavLink } from "react-router-dom"
import styled, { css } from "styled-components"

const sidebarStyle = css`
    text-decoration: none;
    color: inherit;
    border-radius: 10px;

    transition: background-color 0.1s;
    transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);

    &.active {
        background-color: #D9D9D9;
    }

    &:hover {
        background-color: #FFC6C6;
    }
`

export const SidebarA = styled.a`
    ${sidebarStyle}
`

const SidebarLink = styled(NavLink)`
    ${sidebarStyle}

    &.active {
        background-color: #D9D9D9;
    }
`

export default SidebarLink