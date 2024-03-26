import SidebarLink from "@components/sidebar/SidebarLink"

import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"

const Middle = ({projects, collapsed}) => {
    return <MiddleBox>
         {items.map(item => <SidebarLink to={item.to} draggable="false" key={item.to} end={item.end}>
            <ItemBox $collapsed={collapsed} key={item.name}>   
                <FeatherIcon icon={item.icon} />
                {collapsed ? null : item.name}
            </ItemBox>
        </SidebarLink>)}

        {projects && projects.map(project => <SidebarLink to={`projects/` + project.id} draggable="false" key={project.id}>
            <ProjectItemBox $collapsed={collapsed}>
                <FeatherIcon icon="circle" fill={project.color} />
                {collapsed ? null : project.name}
            </ProjectItemBox>
        </SidebarLink>)}
    </MiddleBox>
}

const items = [
    // end가 true:  경로가 to와 완전히 일치해야 active
    //       false: to의 하위 경로에 있어도 active
    {icon: "search", name: "Search", to: "/search", end: false},
    {icon: "bell", name: "Notifications", to: "/notifications", end: false},
    {icon: "calendar", name: "Today", to: "/today", end: false},
    {icon: "users", name: "Social", to: "/social", end: false},
    {icon: "archive", name: "Projects", to: "/projects", end: true},
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