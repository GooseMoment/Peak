import { Fragment, Suspense, useEffect, useMemo, useState } from "react"
import { Outlet, useSearchParams } from "react-router-dom"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled, { css, keyframes } from "styled-components"

import FilterButtonGroup from "@components/common/FilterButtonGroup"
import ModalLoader from "@components/common/ModalLoader"
import PageTitle from "@components/common/PageTitle"
import Box, { BoxSkeleton } from "@components/notifications/Box"

import { type Notification, getNotifications } from "@api/notifications.api"

import { useClientLocale } from "@utils/clientSettings"
import { getCursorFromURL } from "@utils/pagination"

import { ImpressionArea } from "@toss/impression-area"
import FeatherIcon from "feather-icons-react"
import type { TFunction } from "i18next"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const defaultFilter = "all"

const NotificationsPage = () => {
    const locale = useClientLocale()
    const { t } = useTranslation("translation", { keyPrefix: "notifications" })

    const filters = useMemo(() => makeFilters(t), [t])

    const [searchParams, setSearchParams] = useSearchParams()
    const paramActiveFilter = searchParams.get("active") || ""

    const [activeFilter, setActiveFilter] = useState<keyof typeof filters>(
        Object.keys(filters).includes(paramActiveFilter)
            ? (paramActiveFilter as keyof typeof filters)
            : defaultFilter,
    )

    const {
        data,
        isError,
        refetch,
        hasNextPage,
        fetchNextPage,
        isPending,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["notifications", filters[activeFilter]] as [
            string,
            FilterValue,
        ],
        queryFn: (context) =>
            getNotifications(context.pageParam, context.queryKey[1].types),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        gcTime: 30 * 1000,
    })

    const isNotificationEmpty = data?.pages[0]?.results?.length === 0

    useEffect(() => {
        setSearchParams({ active: activeFilter }, { replace: true })
    }, [activeFilter, setSearchParams])

    const header = (
        <>
            <TitleWrapper onClick={!isFetching ? () => refetch() : undefined}>
                <PageTitle>{t("title")}</PageTitle>
                <RefetchIcon $loading={isFetching}>
                    <FeatherIcon icon="rotate-cw" />
                </RefetchIcon>
            </TitleWrapper>
            <FilterButtonGroup
                filters={filters}
                active={activeFilter}
                setActive={setActiveFilter}
            />
            <Blank />
        </>
    )

    if (isError) {
        toast.error(t("fail_to_load"), {
            toastId: "notifications_fail_to_load",
        })
        return (
            <>
                {header}
                {[...Array(10)].map((e, i) => (
                    <BoxSkeleton key={i} />
                ))}
            </>
        )
    }

    let lastDate: string | null = null

    return (
        <>
            {header}
            {data?.pages.map((group, i) => (
                <Fragment key={i}>
                    {group.results.map((notification, j) => {
                        let dateDelimiter = null
                        const thisDate = DateTime.fromISO(
                            notification.created_at,
                        )
                            .setLocale(locale)
                            .toRelativeCalendar({ unit: "days" })

                        if ((i === 0 && j === 0) || thisDate !== lastDate) {
                            dateDelimiter = <Date>{thisDate}</Date>
                            lastDate = thisDate
                        }

                        return (
                            <Fragment key={notification.id}>
                                {dateDelimiter}
                                <Box notification={notification} />
                            </Fragment>
                        )
                    })}
                </Fragment>
            ))}
            {isPending && !isFetchingNextPage ? (
                <>
                    <Date $loading />
                    {[...Array(10)].map((e, i) => (
                        <BoxSkeleton key={i} />
                    ))}
                </>
            ) : null}
            <ImpressionArea
                onImpressionStart={() => fetchNextPage()}
                timeThreshold={200}>
                {hasNextPage && <BoxSkeleton />}
                {!hasNextPage && !isNotificationEmpty && (
                    <NoMore>{t("no_more")}</NoMore>
                )}
            </ImpressionArea>
            {isNotificationEmpty && <NoMore>{t("empty")}</NoMore>}
            <Suspense name="notification-outlet" fallback={<ModalLoader />}>
                <Outlet />
            </Suspense>
        </>
    )
}

const TitleWrapper = styled.div`
    display: flex;
`

const rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`

const RefetchIcon = styled.div<{ $loading?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.75em;
    padding: 0 0.5em;
    cursor: pointer;

    & svg {
        stroke-width: 3px;
        top: 0;
        margin-right: 0;
        height: 1.25em;
        ${(p) =>
            p.$loading &&
            css`
                animation: ${rotate} 0.75s linear 0.1s infinite;
            `}
    }
`

const Blank = styled.div`
    height: 3em;
`

const NoMore = styled.div`
    box-sizing: border-box;

    height: 7em;
    padding: 1em;
    margin: 1em;
    margin-bottom: 3em;

    display: flex;
    align-items: center;
    justify-content: center;
`

const Date = styled.h2<{ $loading?: boolean }>`
    font-weight: bold;

    ${(p) =>
        p.$loading &&
        css`
            width: 5em;
            height: 1em;
            background-color: ${(p) => p.theme.skeleton.defaultColor};
        `}
`

type FilterChoice = "all" | "tasks" | "reactions" | "follow"

type FilterValue = { display: string; types: Notification["type"][] }

const makeFilters = (
    t: TFunction<"translation", "notifications">,
): Record<FilterChoice, FilterValue> => ({
    all: {
        display: t("type_all"),
        types: [
            "task_reminder",
            "task_reaction",
            "follow",
            "follow_request",
            "follow_request_accepted",
        ],
    },
    tasks: {
        display: t("type_tasks"),
        types: ["task_reminder"],
    },
    reactions: {
        display: t("type_reactions"),
        types: ["task_reaction"],
    },
    follow: {
        display: t("type_follow"),
        types: ["follow", "follow_request", "follow_request_accepted"],
    },
})

export default NotificationsPage
