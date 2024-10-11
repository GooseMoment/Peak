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

import { getCursorFromURL } from "@utils/pagination"

import queryClient from "@queries/queryClient"

import { ImpressionArea } from "@toss/impression-area"
import { toast } from "react-toastify"

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
        queryFn: (page) => getDailyLogDrawers(targetUser, page.pageParam),
        initialPageParam: "",
        getNextPageParam: (lastPage) => getCursorFromURL(lastPage.next),
    })

    const hasNextPage =
        drawerPage?.pages[drawerPage?.pages?.length - 1].next !== null
    const isNotificationEmpty = drawerPage?.pages[0]?.results?.length === 0

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
                        drawerPage && (
                            <LogDetails
                                user={quote?.user}
                                quote={quote}
                                saveQuote={saveQuote}
                                selectedDate={selectedDate}
                                logDetails={drawerPage}
                                isFollowingPage
                            />
                        )
                    )}
                    <ImpressionArea
                        onImpressionStart={() => fetchNextDrawerPage()}
                        timeThreshold={200}>
                        {hasNextPage && "next"}
                        {!hasNextPage && !isNotificationEmpty && "no_more"}
                    </ImpressionArea>

                    {isNotificationEmpty && "empty"}
                </StickyContainer>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    display: flex;
    gap: 2rem;
    gap: 2rem;
`

const Container = styled.div`
    width: 50%;
    min-width: 27.5rem;
    margin-bottom: auto;

    padding: 0 1rem 0;
    overflow: hidden;
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
    width: 80%;
    max-width: 40rem;
`

const mockNewLogDates = [
    "2024-05-12T15:00:00.000Z",
    "2024-05-11T15:00:00.000Z",
    "2024-09-01T15:00:00.000Z",
]

export default SocialFollowingPage
