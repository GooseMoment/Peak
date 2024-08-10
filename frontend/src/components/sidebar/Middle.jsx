import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"
import styled, { css, useTheme } from "styled-components"

import SidebarLink from "@components/sidebar/SidebarLink"
import { getProjectColor } from "@components/project/Creates/palettes"

import { getProjectList } from "@api/projects.api"

import useScreenType, { ifMobile } from "@utils/useScreenType"

import { cubicBeizer } from "@assets/keyframes"
import { skeletonCSS } from "@assets/skeleton"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Middle = ({ collapsed, closeSidebar }) => {
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
    const { isMobile } = useScreenType()
    const items = useMemo(() => getItems(t), [t])

    const onClickLink = () => {
        if (isMobile) {
            closeSidebar()
        }
    }

    const onClickErrorBox = () => {
        refetch()
    }

    return (
        <MiddleBox>
            {items.map((item) => (
                <SidebarLink
                    to={item.to}
                    draggable="false"
                    key={item.to}
                    end={item.end}
                    onClick={onClickLink}
                >
                    <ItemBox $collapsed={collapsed} key={item.name}>
                        <FeatherIcon icon={item.icon} />
                        {collapsed ? null : item.name}
                    </ItemBox>
                </SidebarLink>
            ))}

            <ProjectItemsContainer
                $collapsed={collapsed}
                $noScrollbar={isPending}
            >
                {isPending &&
                    [...Array(10)].map((e, i) => (
                        <ProjectItemBox key={i} $skeleton />
                    ))}

                {isError && (
                    <ProjectLoadErrorBox
                        $collapsed={collapsed}
                        onClick={onClickErrorBox}
                    >
                        <FeatherIcon icon="alert-triangle" />
                        {!collapsed && t("projects_list_refetch")}
                    </ProjectLoadErrorBox>
                )}

                {projects?.map((project) => (
                    <SidebarLink
                        to={`projects/` + project.id}
                        draggable="false"
                        key={project.id}
                        onClick={onClickLink}
                    >
                        <ProjectItemBox $collapsed={collapsed}>
                            <FeatherIcon
                                icon="circle"
                                fill={getProjectColor(theme.type, project.color)}
                            />
                            {!collapsed && project.name}
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
    { icon: "users", name: t("social"), to: "social", end: false },
    { icon: "archive", name: t("projects"), to: "projects", end: true },
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

    ${ifMobile} {
        font-size: 1.1em;
        padding: 1em 0 1em 1em;
    }
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

    ${ifMobile} {
        height: 30dvh;
    }
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

    ${ifMobile} {
        font-size: 1.1em;
        padding: 1em;
    }
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
