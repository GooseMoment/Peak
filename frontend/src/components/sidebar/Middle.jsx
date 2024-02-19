import SidebarLink from "@components/sidebar/SidebarLink"

import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"

const Middle = ({projects, collapsed}) => {
    return <MiddleBox>
         {items.map(item => <SidebarLink to={item.to} draggable="false" key={item.to}>
            <ItemBox $collapsed={collapsed} key={item.name}>   
                <FeatherIcon icon={item.icon} />
                {collapsed ? null : item.name}
            </ItemBox>
        </SidebarLink>)}

        {projects && projects.map(project => <SidebarLink to={project.to} draggable="false" key={project.to}>
            <ProjectItemBox $collapsed={collapsed}>
                <FeatherIcon icon="circle" fill={project.color} />
                {collapsed ? null : project.name}
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

background-color: inherit;

${({$collapsed}) => $collapsed ? css`
    text-align: center;
    padding: 0.5em 0.25em;
    margin: 0 1em;

    & svg {
        margin-right: 0;
    }
` : null}
`

const ProjectItemBox = styled.div`
padding: 0.5em 0.5em;
margin: 0 1.5em;
background-color: inherit;
border-radius: 10px;

& svg {
    stroke: none;
}

${({$collapsed}) => $collapsed ? css`
    text-align: center;
    padding: 0.5em 0.25em;
    margin: 0 1em;

    & svg {
        margin-right: 0;
    }
` : null}
`

export default Middle;