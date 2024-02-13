import { NavLink } from "react-router-dom"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

const Sidebar = ({hide, setHide}) => {

    return <SidebarBox hide={hide}>
        <NavItems>
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

            {mockProjects.map(project => <SidebarLink to={project.to}>
                <ProjectItemBox>
                    <FeatherIcon icon="circle" fill={project.color} />
                    {project.name}
                </ProjectItemBox>
            </SidebarLink>)}
        </NavItems>

        <Footer>
            <CurrentUserProfile>
                <img src={mockUser.profile_img_link} />
                <Username>{mockUser.username}</Username>
            </CurrentUserProfile>
            <SidebarLink to="/settings/account">
                <FeatherIcon icon="settings" />
            </SidebarLink>
        </Footer>
    </SidebarBox>
}

const SidebarBox = styled.nav`
display: flex;
flex-direction: column;
justify-content: space-between;

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

const NavItems = styled.section``

const items = [
    {icon: "search", name: "Search", to: "/search"},
    {icon: "bell", name: "Notifications", to: "/notifications"},
    {icon: "calendar", name: "Today", to: "/today"},
    {icon: "users", name: "Social", to: "/social"},
    {icon: "archive", name: "Projects", to: "/projects"},
]

const ItemBox = styled.div`
font-size: 1em;
padding: 1em 0 0em 1.1em;

& svg {
    margin-right: 0.25em;
}
`

const SidebarLink = styled(NavLink)`
text-decoration: none;
color: inherit;
`

const mockProjects = [
    {name: "Inbox", color: "#6E6E6E", type: "regular", privacy: "public", to: "/projects/inbox"},
    {name: "홍대라이프", color: "#2E61DC", type: "regular", privacy: "public", to: "/projects/홍대라이프"},
    {name: "홍대기숙사총장일", color: "#DC2E2E", type: "regular", privacy: "followers", to: "/projects/홍대기숙사총장일"},
    {name: "장충동왕족발보쌈", color: "#D92EDC", type: "regular", privacy: "me", to: "/projects/장충동왕족발보쌈"},
]

const ProjectItemBox = styled.div`
padding-top: 1em;
padding-left: 2em;

& svg {
    stroke: none;
    margin-right: 0.25em;
}
`

const Footer = styled.footer`
display: flex;
flex-direction: row;
justify-content: space-between;

margin: 1em;
`

const mockUser = {
    username: "minyoy",
    profile_img_link: "https://avatars.githubusercontent.com/u/65756020?v=4",
}

const CurrentUserProfile = styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 0.5em;

& img {
    border-radius: 50%;
    width: auto;
    height: 2em;
}
`

const Username = styled.span`
font-weight: 500;
`

export default Sidebar