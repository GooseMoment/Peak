import SidebarLink from "@components/sidebar/SidebarLink"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

const Middle = ({projects}) => {
    return <MiddleBox>
         {items.map(item => <SidebarLink to={item.to} draggable="false" key={item.to}>
            <ItemBox key={item.name}>   
                <FeatherIcon icon={item.icon} />
                {item.name} 
            </ItemBox>
        </SidebarLink>)}

        {projects && projects.map(project => <SidebarLink to={project.to} draggable="false" key={project.to}>
            <ProjectItemBox>
                <FeatherIcon icon="circle" fill={project.color} />
                {project.name}
            </ProjectItemBox>
        </SidebarLink>)}
    </MiddleBox>
}

const items = [
    {icon: "search", name: "Search", to: "/search"},
    {icon: "bell", name: "Notifications", to: "/notifications"},
    {icon: "calendar", name: "Today", to: "/today"},
    {icon: "users", name: "Social", to: "/social"},
    {icon: "archive", name: "Projects", to: "/projects"},
]

const MiddleBox = styled.div`
flex-grow: 99;
`

const ItemBox = styled.div`
font-size: 1em;
padding: 0.75em 0 0.75em 0.5em;
margin: 0 0.75em;

border-radius: 10px;

& svg {
    margin-right: 0.25em;
}

background-color: inherit;
`

const ProjectItemBox = styled.div`
padding: 0.5em 0.5em;
margin: 0 1.5em;
background-color: inherit;
border-radius: 10px;

& svg {
    stroke: none;
    margin-right: 0.25em;
}
`

export default Middle;