import { useEffect, useRef, useState } from "react"

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import InteractionBox from "@components/social/interaction/InteractionBox"
import DrawerBundle from "@components/social/logDetails/DrawerBundle"
import Quote from "@components/social/logDetails/Quote"
import FollowButton from "@components/users/FollowButton"

import queryClient from "@queries/queryClient"

import { getCurrentUsername } from "@/api/client"
import { getDailyLogDrawers, getQuote, postQuote } from "@/api/social.api"
import { SkeletonProjectPage } from "@/components/project/skeletons/SkeletonProjectPage"
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
        data: drawerPage,
        fetchNextPage: fetchNextDrawerPage,
        isPending: isDrawerPending,
        refetch: refetchDrawer,
    } = useInfiniteQuery({
        queryKey: ["daily", "log", "details", "drawer", username],
        queryFn: (page) => getDailyLogDrawers(username, page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
        // enabled: pageType === "following",   // 나중에 백엔드에서 Explore 용 view 따로 만들고 enabled 조건 추가
    })

    const hasNextPage =
        drawerPage?.pages[drawerPage?.pages?.length - 1].next !== null
    const isLogDetailsEmpty = drawerPage?.pages[0]?.results?.length === 0

    const [hasData, setHasData] = useState(true)
    const timer = useRef(null)

    const handleDataCheck = () => {
        setHasData(true)
    }

    useEffect(() => {
        setHasData(true)
        if (timer.current) clearTimeout(timer.current)

        timer.current = setTimeout(async () => {
            setHasData(false)
        }, 200)
    }, [selectedDate, username])

    return isQuotePending | isDrawerPending ? (
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
                {drawerPage?.pages.map((group) =>
                    group.results.map(
                        (drawer) =>
                            drawer && (
                                <DrawerBundle
                                    key={drawer.id}
                                    drawer={drawer}
                                    selectedDate={selectedDate}
                                    pageType={pageType}
                                    onDataCheck={handleDataCheck}
                                />
                            ),
                    ),
                )}

                {!hasData && <NoContent>{t("no_content")}</NoContent>}

                <ImpressionArea
                    onImpressionStart={() => fetchNextDrawerPage()}
                    timeThreshold={200}>
                    {hasNextPage && "next"}
                    {!hasNextPage && !isLogDetailsEmpty && "no_more"}
                    {isLogDetailsEmpty && "empty"}
                </ImpressionArea>
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

    font-size: larger;

    display: flex;
    align-items: center;
    justify-content: center;
`

export default LogDetails
