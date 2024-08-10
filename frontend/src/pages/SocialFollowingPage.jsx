import { useState } from "react"

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { styled } from "styled-components"

import { SkeletonProjectPage } from "@components/project/skeletons/SkeletonProjectPage"
import SocialCalendar from "@components/social/SocialCalendar"
import SocialPageTitle from "@components/social/SocialPageTitle"
import LogDetails from "@components/social/logDetails/LogDetails"
import LogsPreview from "@components/social/logsPreview/LogsPreview"

import { getCurrentUsername } from "@api/client"
import {
    getDailyLogDrawers,
    getDailyLogsPreview,
    getQuote,
    postQuote,
} from "@api/social.api"

import queryClient from "@queries/queryClient"

import { toast } from "react-toastify"

const getCursorFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const cursor = u.searchParams.get("cursor")
    return cursor
}

const getPageFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const page = u.searchParams.get("page")
    return page
}

const SocialFollowingPage = () => {
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)

    const [selectedDate, setSelectedDate] = useState(initial_date.toISOString())
    const [selectedUser, setSelectedUser] = useState(null)

    const me = getCurrentUsername()

    const targetUser = selectedUser ? selectedUser : me

    const { data: dailyLogs } = useQuery({
        queryKey: ["daily", "logs", me, selectedDate],
        queryFn: () => getDailyLogsPreview(me, selectedDate),
        enabled: !!selectedDate && !!me,
    })

    const { data: quote, isPending: isQuotePending } = useQuery({
        queryKey: ["quote", targetUser, selectedDate],
        queryFn: () => getQuote(targetUser, selectedDate),
        enabled: !!selectedDate && !!me,
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

    const {
        data: drawerPage,
        fetchNextPage: fetchNextDrawerPage,
        isPending: isDrawerPending,
        refetch: refetchDrawer,
    } = useInfiniteQuery({
        queryKey: ["daily", "log", "details", "drawer", targetUser],
        queryFn: (pages) =>
            getDailyLogDrawers(targetUser, pages.pageParam || 1),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const hasNextPage =
        drawerPage?.pages[drawerPage?.pages?.length - 1].next !== null

    const saveQuote = (content) => {
        QuoteMutation.mutate({ day: selectedDate, content })
    }

    return (
        <>
            <SocialPageTitle active="following" />

            <Wrapper>
                <Container>
                    <CalendarWrapper>
                        <SocialCalendar
                            newLogDates={mockNewLogDates}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    </CalendarWrapper>
                    {dailyLogs && (
                        <LogsPreview
                            logs={dailyLogs}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />
                    )}
                </Container>

                {/* TODO: 날짜가 선택되지 않았을 때 */}
                <StickyContainer>
                    {isQuotePending || isDrawerPending ? (
                        <SkeletonProjectPage />
                    ) : (
                        drawerPage?.pages?.map((group, index) => (
                            <LogDetails
                                key={index}
                                user={quote?.user}
                                quote={quote}
                                saveQuote={saveQuote}
                                logDetails={group?.results}
                                isFollowing={true}
                            />
                        ))
                    )}
                </StickyContainer>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    display: flex;
    gap: 2rem;
`

const Container = styled.div`
    width: 50%;
    min-width: 27.5rem;
    margin-bottom: auto;

    padding: 0 1rem 0;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
`

const StickyContainer = styled(Container)`
    position: sticky;
    top: 2.5rem;
    gap: 0rem;
`

const CalendarWrapper = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    max-width: 40rem;
`

const mockNewLogDates = [
    "2024-05-12T15:00:00.000Z",
    "2024-05-11T15:00:00.000Z",
    "2024-05-09T00:00:00.000Z",
]

export default SocialFollowingPage
