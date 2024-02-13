import { NavLink } from "react-router-dom"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

const Sidebar = ({hide, setHide}) => {

    return <SidebarBox hide={hide}>
        <button onClick={() => setHide(previous => !previous)}>
            <FeatherIcon dominantBaseline="central" icon="chevrons-left" />
        </button>
    
        <div>LOGO HERE</div>
        {items.map(item => <SidebarLink to={item.to}>
            <ItemBox key={item.name}>   
                <FeatherIcon icon={item.icon} />
                {item.name} 
            </ItemBox>
        </SidebarLink>)}

    </SidebarBox>
}

const SidebarBox = styled.nav`
background-color: #F9F7F6;
flex-basis: ${props => props.hide ? "0rem" : "18rem"};
transform: ${props => props.hide ? "translateX(-0%)" : "none"};
flex-grow: 1;

transition: transform 1s, flex-basis 1s;
transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

& button {
    float: right;
}
`

const items = [
    {icon: "search", name: "Search", to: "/search"},
    {icon: "bell", name: "Notifications", to: "/notifications"},
    {icon: "calendar", name: "Today", to: "/today"},
    {icon: "users", name: "Social", to: "/social"},
    {icon: "archive", name: "Projects", to: "/projects"},
]

const ItemBox = styled.div`
font-size: 24px;
margin: 2em 0 1em 1em;

& svg {
    position: relative;
    top: .13em;
    width: 1em;
    height: 1em;
    margin-right: .5em;
    display: inline-block;
    vertical-align: auto;
}
`

const SidebarLink = styled(NavLink)`
text-decoration: none;
color: inherit;
`

export default Sidebar