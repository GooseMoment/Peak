import { Fragment, useState } from "react"

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import DrawerBox, { DrawerName } from "@components/drawers/DrawerBox"
import { getProjectColor } from "@components/project/common/palettes"
import { SkeletonProjectPage } from "@components/project/skeletons/SkeletonProjectPage"
import InteractionBox from "@components/social/interaction/InteractionBox"
import Quote from "@components/social/logDetails/Quote"
import FollowButton from "@components/users/FollowButton"

import TaskBox from "./TaskBox"

import { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { getCurrentUsername } from "@/api/client"
import { getDailyLogDetails, getQuote, postQuote } from "@/api/social.api"
import { ImpressionArea } from "@toss/impression-area"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const getCursorFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const cursor = u.searchParams.get("cursor")
    return cursor
}

const LogDetails = ({ pageType = "following", username, selectedDate }) => {
    const { t } = useTranslation("", { keyPrefix: "social.log_details" })
    const theme = useTheme()
    
    const me = getCurrentUsername()

    // quote
    const { data: quote, isPending: isQuotePending } = useQuery({
        queryKey: ["quote", username, selectedDate],
        queryFn: () => getQuote(username, selectedDate),
        enabled: !!selectedDate, // && pageType === "following"
    })

    const QuoteMutation = useMutation({
        mutationFn: ({ day, content }) => {
            return postQuote(day, content)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["quote", me, selectedDate],
            })
        },
        onError: (e) => {
            toast.error(e)
        },
    })

    const saveQuote = (content) => {
        QuoteMutation.mutate({ day: selectedDate, content })
    }

    // logDetails
    const {
        data: logDetailsPage,
        fetchNextPage: fetchNextLogDetailsPage,
        isPending: isLogDetailsPending,
        refetch: refetchLogDetails,
    } = useInfiniteQuery({
        queryKey: ["daily", "log", "details", username, selectedDate],
        queryFn: (page) =>
            getDailyLogDetails(username, selectedDate, page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        // enabled: pageType === "following",   // 나중에 백엔드에서 Explore 용 view 따로 만들고 enabled 조건 추가
    })

    const isLogDetailsEmpty = logDetailsPage?.pages[0]?.results?.length === 0

    // TODO: Drawer 접기
    const [hiddenDrawers, setHiddenDrawers] = useState(new Set())

    const handleHiddenDrawer = (drawer) => {
        if (hiddenDrawers.has(drawer))
            setHiddenDrawers((prev) => new Set(prev).delete(drawer))
        else setHiddenDrawers((prev) => new Set(prev).add(drawer))
    }

    return isQuotePending | isLogDetailsPending ? (
        <SkeletonProjectPage />
    ) : (
        <DetailBox>
            <DetailHeader data-accpet="true">
                {quote && (
                    <>
                        <Quote
                            user={quote.user}
                            quote={quote}
                            saveQuote={saveQuote || null}
                        />
                        {pageType === "following" ? (
                            quote?.id && (
                                <InteractionBox
                                    parentType={"quote"}
                                    parent={quote}
                                />
                            )
                        ) : (
                            <FollowButton user={quote.user} />
                        )}
                    </>
                )}
            </DetailHeader>

            {/* TODO: When there are no task */}
            <DetailBody>
                {isLogDetailsEmpty && <NoContent>{t("no_content")}</NoContent>}

                {logDetailsPage?.pages.map((group) =>
                    group.results.map((task, index, array) => {
                        const color = getProjectColor(
                            theme.type,
                            task.project_color,
                        )
                        return (
                            <Fragment key={task.id}>
                                {(index === 0 ||
                                    array[index - 1].drawer !==
                                        task.drawer) && (
                                    <DrawerBox $color={color}>
                                        <DrawerName $color={color}>
                                            {" "}
                                            {task.drawer_name}{" "}
                                        </DrawerName>
                                    </DrawerBox>
                                )}

                                {!hiddenDrawers.has(task.drawer) && (
                                    <TaskBox
                                        task={task}
                                        color={color}
                                        isFollowingPage={
                                            pageType === "following"
                                        }
                                    />
                                )}
                            </Fragment>
                        )
                    }),
                )}

                <ImpressionArea
                    onImpressionStart={() => fetchNextLogDetailsPage()}
                    timeThreshold={200}
                />
            </DetailBody>
        </DetailBox>
    )
}

const DetailBox = styled.div`
    display: flex;
    flex-direction: column;
`

const DetailHeader = styled.div`
    padding: 1.2em 1em 0.2em;

    display: flex;
    flex-direction: column;
    gap: 0.7em;

    ${ifMobile} {
        padding: 0em 0 0.2em;
    }
`

const DetailBody = styled.div`
    max-height: 70%;
    overflow-y: auto;

    // IE and Edge
    -ms-overflow-style: none;
    // Firefox
    scrollbar-width: none;
    // Chrome, Safari, Opera
    &::-webkit-scrollbar {
        display: none;
    }
`

const NoContent = styled.div`
    margin: 2em;
    
    display: flex;
    align-items: center;
    justify-content: center;
`

export default LogDetails
