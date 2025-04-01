import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"
import styled, { css, useTheme } from "styled-components"

import { useSidebarContext } from "@components/sidebar/SidebarContext"
import SidebarLink from "@components/sidebar/SidebarLink"

import { getProjectList } from "@api/projects.api"

import { cubicBeizer } from "@assets/keyframes"
import { getPaletteColor } from "@assets/palettes"
import { skeletonCSS } from "@assets/skeleton"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Middle = () => {
    const {
        data: projects,
        isPending,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: () => getProjectList(),
    })

    const { t } = useTranslation("", { keyPrefix: "sidebar" })
    const theme = useTheme()
    const items = useMemo(() => getItems(t), [t])

    const { isCollapsed } = useSidebarContext()

    const onClickErrorBox = () => {
        refetch()
    }

    return (
        <MiddleBox>
            {items.map((item) => (
                <SidebarLink to={item.to} key={item.to} end={item.end}>
                    <ItemBox $collapsed={isCollapsed}>
                        <FeatherIcon icon={item.icon} />
                        {isCollapsed ? null : item.name}
                    </ItemBox>
                </SidebarLink>
            ))}

            <SidebarLink
                to="social/following"
                activePath="social"
                key="social"
                end={false}>
                <ItemBox $collapsed={isCollapsed}>
                    <FeatherIcon icon="users" />
                    {isCollapsed ? null : t("social")}
                </ItemBox>
            </SidebarLink>

            <SidebarLink to="projects" key="projects" end>
                <ItemBox $collapsed={isCollapsed}>
                    <FeatherIcon icon="archive" />
                    {isCollapsed ? null : t("projects")}
                </ItemBox>
            </SidebarLink>

            <ProjectItemsContainer
                $collapsed={isCollapsed}
                $noScrollbar={isPending}>
                {isPending &&
                    [...Array(10)].map((e, i) => (
                        <ProjectItemBox key={i} $skeleton />
                    ))}

                {isError && (
                    <ProjectLoadErrorBox
                        $collapsed={isCollapsed}
                        onClick={onClickErrorBox}>
                        <FeatherIcon icon="alert-triangle" />
                        {!isCollapsed && t("projects_list_refetch")}
                    </ProjectLoadErrorBox>
                )}

                {projects?.map((project) => (
                    <SidebarLink
                        to={
                            project.type === "inbox"
                                ? "/app/inbox"
                                : `/app/projects/${project.id}`
                        }
                        key={project.id}>
                        <ProjectItemBox $collapsed={isCollapsed}>
                            <FeatherIcon
                                icon="circle"
                                fill={getPaletteColor(
                                    theme.type,
                                    project.color,
                                )}
                            />
                            {!isCollapsed && project.name}
                        </ProjectItemBox>
                    </SidebarLink>
                ))}
            </ProjectItemsContainer>
        </MiddleBox>
    )
}

const getItems = (t) => [
    // end가 true:  경로가 to와 완전히 일치해야 active
    //       false: to의 하위 경로에 있어도 active
    { icon: "search", name: t("search"), to: "search", end: false },
    { icon: "home", name: t("home"), to: "home", end: true },
    { icon: "bell", name: t("notifications"), to: "notifications", end: false },
    { icon: "calendar", name: t("today"), to: "today", end: false },
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

    transition:
        padding 0.25s ${cubicBeizer},
        margin 0.25s ${cubicBeizer};

    ${(p) =>
        p.$collapsed &&
        css`
            text-align: center;
            padding-left: 0.2em;
            padding-right: 0.2em;
            margin-left: 1em;
            margin-right: 1em;

            & svg {
                margin-right: 0;
            }
        `}
`

const ProjectItemsContainer = styled.div`
    overflow-y: auto;
    height: calc(100dvh - 25em);

    scrollbar-width: thin;
    scrollbar-color: ${(p) => p.theme.sidebar.scrollbarColor} transparent;
    box-sizing: border-box;

    ${(props) =>
        props.$collapsed &&
        css`
            scrollbar-width: none;
        `}

    ${(p) =>
        p.$noScrollbar &&
        css`
            overflow-y: hidden;
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

    ${(p) =>
        p.$skeleton &&
        css`
            height: 2em;
            margin: 0.25em 1.5em;
            ${skeletonCSS("-100px", "300px", "2s")}
        `}

    ${(p) =>
        p.$collapsed &&
        css`
            text-align: center;

            padding-left: 0.2em;
            padding-right: 0.2em;
            margin-left: 1em;
            margin-right: 1em;

            & svg {
                margin-right: 0;
            }
        `}
`

const ProjectLoadErrorBox = styled(ProjectItemBox)`
    cursor: pointer;
    color: ${(p) => p.theme.white};
    background-color: ${(p) => p.theme.primaryColors.danger};

    & svg {
        stroke: ${(p) => p.theme.textColor};
    }
`

export default Middle
