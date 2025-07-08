import {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { useSearchParams } from "react-router-dom"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled, { css, keyframes } from "styled-components"

import FilterButtonGroup from "@components/common/FilterButtonGroup"
import PageTitle from "@components/common/PageTitle"
import Box, { BoxSkeleton } from "@components/notifications/Box"

import { type Notification, getNotifications } from "@api/notifications.api"

import { useClientLocale } from "@utils/clientSettings"
import { getCursorFromURL } from "@utils/pagination"

import { ImpressionArea } from "@toss/impression-area"
import FeatherIcon from "feather-icons-react"
import { type TFunction } from "i18next"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const defaultFilter = "all"

const NotificationsPage = () => {
    const locale = useClientLocale()
    const { t } = useTranslation("translation", { keyPrefix: "notifications" })

    const filters = useMemo(() => makeFilters(t), [t])

    const [searchParams, setSearchParams] = useSearchParams()
    const focusID = searchParams.get("id")
    const paramActiveFilter = searchParams.get("active") || ""

    const [activeFilter, setActiveFilter] = useState<keyof typeof filters>(
        Object.keys(filters).includes(paramActiveFilter)
            ? (paramActiveFilter as keyof typeof filters)
            : defaultFilter,
    )

    const scrollToBox = useCallback((node: HTMLElement | null) => {
        node?.scrollIntoView({ block: "center", behavior: "smooth" })
    }, [])

    const {
        data,
        isError,
        refetch,
        fetchNextPage,
        isPending,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["notifications", filters[activeFilter]] as [
            string,
            { display: string; types: Notification["type"][] },
        ],
        queryFn: (context) =>
            getNotifications(context.pageParam, context.queryKey[1].types),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        gcTime: 30 * 1000,
    })

    // useInfiniteQuery에서 제공하는 hasNextPage가 제대로 작동 안함. 어째서?
    const hasNextPage = data?.pages[data?.pages?.length - 1].next !== null
    const isNotificationEmpty = data?.pages[0]?.results?.length === 0

    const lastDate = useRef<null | string>(null)
    useEffect(() => {
        lastDate.current = null
        setSearchParams({ active: activeFilter }, { replace: true })
    }, [activeFilter])

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

                        if (
                            (i === 0 && j === 0) ||
                            thisDate !== lastDate.current
                        ) {
                            dateDelimiter = <Date>{thisDate}</Date>
                            lastDate.current = thisDate
                        }

                        return (
                            <Fragment key={notification.id}>
                                {dateDelimiter}
                                <Box
                                    notification={notification}
                                    highlight={notification.id === focusID}
                                    ref={
                                        notification.id === focusID
                                            ? scrollToBox
                                            : null
                                    }
                                />
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

type FilterChoice =
    | "all"
    | "tasks"
    | "comments"
    | "reactions"
    | "pecking"
    | "follow"

const makeFilters = (
    t: TFunction<"translation", "notifications">,
): Record<
    FilterChoice,
    { display: string; types: Notification["type"][] }
> => ({
    all: {
        display: t("type_all"),
        types: [
            "task_reminder",
            "reaction",
            "follow",
            "follow_request",
            "follow_request_accepted",
            "comment",
            "peck",
        ],
    },
    tasks: {
        display: t("type_tasks"),
        types: ["task_reminder"],
    },
    comments: {
        display: t("type_comments"),
        types: ["comment"],
    },
    reactions: {
        display: t("type_reactions"),
        types: ["reaction"],
    },
    pecking: {
        display: t("type_pecking"),
        types: ["peck"],
    },
    follow: {
        display: t("type_follow"),
        types: ["follow", "follow_request", "follow_request_accepted"],
    },
})

export default NotificationsPage
