import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useRouteLoaderData } from "react-router-dom"
import { toast } from "react-toastify"
import { styled, css } from "styled-components"

import SocialCalendar from "@components/social/SocialCalendar"
import DailyLogPreview from "@components/social/DailyLogPreview"
import DailyLogDetail from "@components/social/LogDetail/DailyLogDetail"
import SocialPageTitle from "@components/social/SocialPageTitle"

import queryClient from "@queries/queryClient"

import {
    getDailyComment,
    getDailyLogDetails,
    getDailyLogsPreview,
    postDailyComment,
} from "@api/social.api"

const compareDailyLogs = (a, b) => {
    if (!a.recent_task === !b.recent_task) {
        // (when there is no completed task) Show the user with the earliest username in alphabetical order first
        if (!a.recent_task) return a.username > b.username ? 1 : -1
        if (a.recent_task.is_read !== b.recent_task.is_read)
            return a.recent_task.is_read - b.recent_task.is_read
        return a.recent_task.is_read
            ? // Show the earliest completed tasks first
              new Date(a.recent_task.completed_at) -
                  new Date(b.recent_task.completed_at)
            : // Show more recently completed tasks first when not read yet
              new Date(b.recent_task.completed_at) -
                  new Date(a.recent_task.completed_at)
    }
    // Show user with recent work first
    return !a.recent_task - !b.recent_task
}

const SocialFollowingPage = () => {
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)

    const [selectedDate, setSelectedDate] = useState(initial_date.toISOString())
    const [selectedUsername, setSelectedUsername] = useState(null)

    const { user } = useRouteLoaderData("app")

    const { data: dailyLogs, isError: dailyLogsError } = useQuery({
        queryKey: ["daily", "logs", user.username, selectedDate],
        queryFn: () => getDailyLogsPreview(user.username, selectedDate),
        enabled: !!selectedDate,
    })

    const dailyLogDetailUsername = selectedUsername
        ? selectedUsername
        : user.username

    const { data: dailyComment, isError: dailyCommentError } = useQuery({
        queryKey: ["daily", "content", dailyLogDetailUsername, selectedDate],
        queryFn: () => getDailyComment(dailyLogDetailUsername, selectedDate),
        enabled: !!selectedDate,
    })

    const dailyCommentMutation = useMutation({
        mutationFn: ({ day, content }) => {
            return postDailyComment(day, content)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["daily", "content", user.username, selectedDate],
            })
        },
        onError: () => {
            toast.error(e)
        },
    })

    const { data: dailyLogDetails, isError: dailyLogDetailsError } = useQuery({
        queryKey: [
            "daily",
            "log",
            "details",
            dailyLogDetailUsername,
            selectedDate,
        ],
        queryFn: () => getDailyLogDetails(dailyLogDetailUsername, selectedDate),
        enabled: !!selectedDate,
    })

    return (
        <>
            <SocialPageTitle active="following" />

            <Wrapper>
                <Container>
                    <CalendarContainer>
                        <SocialCalendar
                            newLogDates={mockNewLogDates}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    </CalendarContainer>

                    {/* DailyLogsPreview를 별도의 컴포넌트 파일로 구분할까 고민중 */}
                    <DailyLogsPreviewContainer>
                        {dailyLogs
                            ?.sort(compareDailyLogs)
                            .map((dailyFollowerLog, index) => (
                                <DailyLogPreview
                                    key={index}
                                    dailyLog={dailyFollowerLog}
                                    selectedUsername={selectedUsername}
                                    setSelectedUsername={setSelectedUsername}
                                />
                            ))}
                    </DailyLogsPreviewContainer>
                </Container>

                <Container $isSticky={true}>
                    {dailyComment ? (
                        <DailyLogDetail
                            dailyComment={dailyComment}
                            userLogDetails={dailyLogDetails}
                            userLogsDetail={mockDailyFollowerLogsDetail[0]}
                            user={user}
                            saveDailyComment={dailyCommentMutation.mutate}
                            day={selectedDate}
                        />
                    ) : null}
                </Container>
            </Wrapper>
            {/* <ReactQueryDevtools initialIsOpen></ReactQueryDevtools> */}
        </>
    )
}

const Wrapper = styled.div`
    display: flex;
    gap: 5rem;
`

const Container = styled.div`
    width: 50%;
    min-width: 27.5rem;
    ${(props) =>
        props.$isSticky
            ? css`
                  /* align-self: flex-start; */
                  position: sticky;
                  top: 2.5rem;
                  gap: 0rem;
              `
            : css`
                  gap: 1rem;
              `}
    margin-bottom: auto;

    padding: 0 1rem 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
`

const CalendarContainer = styled.div`
    width: 80%;
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;
`

const DailyLogsPreviewContainer = styled.div``

const mockNewLogDates = [
    "2024-05-12T15:00:00.000Z",
    "2024-05-11T15:00:00.000Z",
    "2024-05-09T00:00:00.000Z",
]

const mockDailyFollowerLogsDetail = [
    {
        user: {
            username: "minyoy",
            profileImgURI:
                "https://avatars.githubusercontent.com/u/65756020?v=4",
        },
        dailyComment: {
            name: "오늘도 열시미 살아보았나 내가 보기엔 아닌 거 같은데 너가 보기엔 어떻니",
            reaction: [
                { emoji: "🥳", reactionNum: 2 },
                { emoji: "😅", reactionNum: 3 },
            ],
        },
        dailyProjects: [
            {
                projectID: "개발",
                projectColor: "2E61DC",
                dailytasks: [
                    {
                        id: "TEMP11",
                        name: "빨래하기",
                        completed_at: new Date(2024, 2, 2, 7, 4, 1),
                        reaction: [{ emoji: "🥳", reactionNum: 2 }],
                    },
                    {
                        id: "TEMP12",
                        name: "총장하기",
                        completed_at: null,
                        reaction: [{ emoji: null, reactionNum: 4 }],
                    },
                ],
            },
            {
                projectID: "수강신청",
                projectColor: "ff0022",
                dailytasks: [
                    {
                        id: "TEMP15",
                        name: "빨래하기",
                        completed_at: new Date(2024, 2, 2, 7, 4, 1),
                        reaction: [
                            { emoji: "🥳", reactionNum: 2 },
                            { emoji: "😅", reactionNum: 3 },
                        ],
                    },
                ],
            },
        ],
    },
]

export default SocialFollowingPage
