import SidebarLink from "@components/sidebar/SidebarLink"

import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"
import { cubicBeizer } from "@assets/keyframes"

import { useClientLocale } from "@utils/clientSettings"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"

const Middle = ({projects, collapsed}) => {
    const locale = useClientLocale()
    const { t } = useTranslation("", {lng: locale, keyPrefix: "sidebar"})

    const items = useMemo(() => getItems(t), [t])

    return <MiddleBox>
        {items.map(item => <SidebarLink to={item.to} draggable="false" key={item.to} end={item.end}>
            <ItemBox $collapsed={collapsed} key={item.name}>   
                <FeatherIcon icon={item.icon} />
                {collapsed ? null : item.name}
            </ItemBox>
        </SidebarLink>)}

        <ProjectItemsContainer $collapsed={collapsed}>
            {projects && projects.map(project => <SidebarLink to={`projects/` + project.id} draggable="false" key={project.id}>
                <ProjectItemBox $collapsed={collapsed}>
                    <FeatherIcon icon="circle" fill={`#` + project.color} />
                    {collapsed ? null : project.name}
                </ProjectItemBox>
            </SidebarLink>)}
        </ProjectItemsContainer>
    </MiddleBox>
}

const getItems = t => [
    // end가 true:  경로가 to와 완전히 일치해야 active
    //       false: to의 하위 경로에 있어도 active
    {icon: "search", name: t("search"), to: "search", end: false},
    {icon: "home", name: t("home"), to: "", end: true},
    {icon: "bell", name: t("notifications"), to: "notifications", end: false},
    {icon: "calendar", name: t("today"), to: "today", end: false},
    {icon: "users", name: t("social"), to: "social", end: false},
    {icon: "archive", name: t("projects"), to: "projects", end: true},
]

export const MiddleBox = styled.div`
flex-grow: 99;
`

export const ItemBox = styled.div`
font-size: 1em;
padding: 0.75em 0 0.75em 0.5em;
margin: 0 0.75em;

border-radius: 10px;
box-sizing: border-box;

background-color: inherit;

transition: padding 0.25s ${cubicBeizer}, margin 0.25s ${cubicBeizer};

${({$collapsed}) => $collapsed ? css`
    text-align: center;
    padding-left: 0.2em;
    padding-right: 0.2em;
    margin-left: 1em;
    margin-right: 1em;

    & svg {
        margin-right: 0;
    }
` : null}
`

const ProjectItemsContainer = styled.div`
    overflow-y: auto;

    scrollbar-width: thin;
    scrollbar-color: #FFC6C6 transparent;
    height: calc(100vh - 24em);

    ${props => props.$collapsed && css`
        scrollbar-width: none;
    `}
`

const ProjectItemBox = styled.div`
padding: 0.5em 0.5em;
margin: 0 1.5em;
background-color: inherit;
border-radius: 10px;

text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
box-sizing: border-box;

& svg {
    stroke: none;
}

${({$collapsed}) => $collapsed ? css`
    text-align: center;

    padding-left: 0.2em;
    padding-right: 0.2em;
    margin-left: 1em;
    margin-right: 1em;

    & svg {
        margin-right: 0;
    }
` : null}
`

export default Middle;