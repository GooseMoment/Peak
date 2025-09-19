import { useMemo } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled, { css, useTheme } from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import {
    type StyledCollapsedProp,
    useSidebarContext,
} from "@components/sidebar/SidebarContext"
import SidebarLink from "@components/sidebar/SidebarLink"

import { getProjectList } from "@api/projects.api"

import { getPageFromURL } from "@utils/pagination"

import { cubicBeizer } from "@assets/keyframes"
import { getPaletteColor } from "@assets/palettes"
import { skeletonCSS } from "@assets/skeleton"

import FeatherIcon from "feather-icons-react"
import { type TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const Middle = () => {
    const {
        data: projects,
        isPending,
        isError,
        refetch,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["projects"],
        queryFn: (context) => getProjectList(context.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const hasNextPage =
        projects?.pages[projects?.pages?.length - 1].next !== null

    const { t } = useTranslation("translation")
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
                    {isCollapsed ? null : t("sidebar.social")}
                </ItemBox>
            </SidebarLink>

            <SidebarLink to="projects" key="projects" end>
                <ItemBox $collapsed={isCollapsed}>
                    <FeatherIcon icon="archive" />
                    {isCollapsed ? null : t("sidebar.projects")}
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
                        {!isCollapsed && t("sidebar.projects_list_refetch")}
                    </ProjectLoadErrorBox>
                )}

                {projects?.pages.map((group) =>
                    group.results.map((project) => (
                        <SidebarLink
                            to={
                                project.type === "inbox"
                                    ? "/app/projects/inbox"
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
                                {!isCollapsed &&
                                    (project.type === "inbox"
                                        ? t("sidebar.inbox")
                                        : project.name)}
                            </ProjectItemBox>
                        </SidebarLink>
                    )),
                )}

                {hasNextPage ? (
                    <ButtonGroup $justifyContent="center" $margin="1em">
                        <MoreButton
                            disabled={isFetchingNextPage}
                            loading={isFetchingNextPage}
                            onClick={() => fetchNextPage()}>
                            {isPending
                                ? t("common.loading")
                                : t("common.load_more")}
                        </MoreButton>
                    </ButtonGroup>
                ) : null}
            </ProjectItemsContainer>
        </MiddleBox>
    )
}

const getItems = (t: TFunction<"translation">) => [
    // end가 true:  경로가 to와 완전히 일치해야 active
    //       false: to의 하위 경로에 있어도 active
    {
        icon: "search" as const,
        name: t("sidebar.search"),
        to: "search",
        end: false,
    },
    { icon: "home" as const, name: t("sidebar.home"), to: "home", end: true },
    {
        icon: "bell" as const,
        name: t("sidebar.notifications"),
        to: "notifications",
        end: false,
    },
    {
        icon: "calendar" as const,
        name: t("sidebar.today"),
        to: "today",
        end: false,
    },
]

export const MiddleBox = styled.div`
    flex-grow: 99;
`

export const ItemBox = styled.div<StyledCollapsedProp>`
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

const ProjectItemsContainer = styled.div<{
    $collapsed?: boolean
    $noScrollbar?: boolean
}>`
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

const ProjectItemBox = styled.div<{
    $skeleton?: boolean
    $collapsed?: boolean
}>`
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

const ProjectLoadErrorBox = styled(ProjectItemBox)<StyledCollapsedProp>`
    cursor: pointer;
    color: ${(p) => p.theme.white};
    background-color: ${(p) => p.theme.primaryColors.danger};

    & svg {
        stroke: ${(p) => p.theme.textColor};
    }
`

const MoreButton = styled(Button)`
    width: 80%;
`

export default Middle
