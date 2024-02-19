import { NavLink } from "react-router-dom"
import styled from "styled-components"

const SidebarLink = styled(NavLink)`
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

export default SidebarLink