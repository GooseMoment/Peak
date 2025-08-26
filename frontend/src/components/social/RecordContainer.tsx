import { type ReactElement } from "react"
import { Fragment } from "react"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import ErrorBox from "@components/errors/ErrorBox"
import { SkeletonDrawer } from "@components/project/skeletons/SkeletonProjectPage"
import LoadMoreButton from "@components/social/common/LoadMoreButton"
import TaskBox from "@components/social/logDetails/TaskBox"

import { getCurrentUsername } from "@api/client"
import { getRecord } from "@api/social.api"
import type { User } from "@api/users.api"

import { getPageFromURL } from "@utils/pagination"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import type { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

interface RecordContainerProps {
    username: User["username"]
    date: DateTime
}

export default function RecordContainer({
    username,
    date,
}: RecordContainerProps) {
    const theme = useTheme()
    const { t } = useTranslation("translation")
    const me = getCurrentUsername()
    const {
        data,
        isPending,
        isError,
        refetch,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["records", username, date.toISODate()],
        queryFn: (page) =>
            getRecord(username, date.toISODate()!, page.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    if (isPending) {
        return (
            <>
                <SkeletonDrawer key={0} taskCount={3} />
                <SkeletonDrawer key={1} taskCount={3} />
                <SkeletonDrawer key={2} taskCount={3} />
            </>
        )
    }

    if (isError) {
        return <ErrorBox onRetry={refetch} />
    }

    let lastDrawerID: null | string = null
    let lastColor = ""
    const isEmpty = data.pages.every((page) => page.results.length === 0)

    return (
        <div>
            {isEmpty && (
                <EmptyBox>
                    {t(
                        username === me
                            ? "social.records.empty_mine"
                            : "social.records.empty",
                    )}
                </EmptyBox>
            )}
            {data.pages.map((page) =>
                page.results.map((task) => {
                    let drawerInsertion: null | ReactElement = null

                    // TODO: replace task.drawer with task.drawer_id after Task fields modification
                    if (lastDrawerID !== task.drawer) {
                        lastDrawerID = task.drawer
                        lastColor = getPaletteColor(
                            theme.type,
                            task.project_color,
                        )

                        drawerInsertion = (
                            <DrawerBox $color={lastColor}>
                                <DrawerName $color={lastColor}>
                                    {task.drawer_name}
                                </DrawerName>
                            </DrawerBox>
                        )
                    }

                    return (
                        <Fragment key={task.id}>
                            {drawerInsertion}
                            <TaskBox
                                task={task}
                                color={lastColor}
                                isFollowingPage
                            />
                        </Fragment>
                    )
                }),
            )}
            {hasNextPage && (
                <LoadMoreButton
                    onClick={() => fetchNextPage()}
                    loading={isFetchingNextPage}
                    disabled={isFetchingNextPage}>
                    <FeatherIcon icon="chevrons-down" />
                    <p>{t("common.load_more")}</p>
                    <FeatherIcon icon="chevrons-down" />
                </LoadMoreButton>
            )}
        </div>
    )
}

const EmptyBox = styled.div`
    padding: 2em;
    color: ${(p) => p.theme.textColor};
    border-radius: 16px;
    margin: 1em 0;
    box-sizing: border-box;
    width: 100%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    line-height: 1.5em;
    word-break: keep-all;
`
