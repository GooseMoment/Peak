import { useEffect, useState } from "react"
import { useRouteLoaderData } from "react-router-dom"

import { styled, css } from "styled-components"
import moment from "moment";

import SocialCalendar from "@components/social/SocialCalendar";
import DailyLogPreview from "@components/social/DailyLogPreview";
import DailyLogDetail from "@components/social/LogDetail/DailyLogDetail";
import SocialPageTitle from "@components/social/SocialPageTitle";

import { getDailyReport, getDailyComment } from "@api/social.api";

const sortDailyLogs = (report) => {
    return report.slice().sort((a, b) => {
        if (a.is_read !== b.is_read)
            return a.is_read - b.is_read
        return new Date(a.completed_at) - new Date(b.completed_at)
    })
}

const SocialFollowingPage = () => {
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)

    const [selectedDate, setSelectedDate] = useState(initial_date.toISOString())
    const [selectedUsername, setSelectedUsername] = useState(null)
    const [dailyReport, setDailyReport] = useState([])
    const [dailyComment, setDailyComment] = useState(null)

    const {user} = useRouteLoaderData("app")

    const getPreview = async(date) => {
        if(date) try {
            const res = await getDailyReport(user.username, date)
            setDailyReport(res)
        } catch (e) {
            throw alert(e)
        }
    }

    const getLogDetail = async(date, followee) => {
        if(date && followee) try {
            const res = await getDailyComment(user.username, followee, date)
            setDailyComment(res)
        } catch (e) {
            throw alert(e)
        }
    }

    useEffect(() => {
        getPreview(selectedDate)
    }, [selectedDate])

    useEffect(() => {
        getLogDetail(selectedDate, selectedUsername)
    }, [selectedUsername])

    return <>
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

                <DailyLogsPreviewContainer>
                    {sortDailyLogs(dailyReport).map((dailyFollowersLog) => (
                        <DailyLogPreview key={dailyFollowersLog.username} userLogSimple={dailyFollowersLog} selectedIndex={selectedUsername} setSelectedIndex={setSelectedUsername} />
                    ))}
                </DailyLogsPreviewContainer>
            </Container>

            <Container $isSticky={true}>
                {
                    (dailyComment&&dailyComment.comment)?
                        <DailyLogDetail dailyComment={dailyComment} userLogsDetail={mockDailyFollowerLogsDetail[0]} isSelf={true} />
                    :null
                }
            </Container>
        </Wrapper>
    </>
}

const Wrapper = styled.div`
    display: flex;
`

const Container = styled.div`
    width: 50%;
    min-width: 27.5rem;
    max-width: 40rem;
    ${props => props.$isSticky ? css`
        /* align-self: flex-start; */
        position: sticky;
        top: 2.5rem;
        gap: 0rem;
    ` : css`
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
    margin-left: auto;
    margin-right: auto;
`

const DailyLogsPreviewContainer = styled.div``

const mockNewLogDates = [
    "2024-05-12T15:00:00.000Z", "2024-05-11T15:00:00.000Z", "2024-05-09T00:00:00.000Z"
];

const mockDailyFollowerLogsDetail = [
    {
        user: {
            username: "minyoy", profileImgURI: "https://avatars.githubusercontent.com/u/65756020?v=4",
        },
        dailyComment: {
            name: "오늘도 열시미 살아보았나 내가 보기엔 아닌 거 같은데 너가 보기엔 어떻니",
            reaction: [
                { emoji: "🥳", reactionNum: 2 },
                { emoji: "😅", reactionNum: 3 }
            ]
        },
        dailyProjects: [
            {
                projectID: "개발", projectColor: "2E61DC",
                dailytasks: [
                    { id: "TEMP11", name: "빨래하기", completed_at: new Date(2024, 2, 2, 7, 4, 1), reaction: [{ emoji: "🥳", reactionNum: 2 }] },
                    { id: "TEMP12", name: "총장하기", completed_at: null, reaction: [{ emoji: null, reactionNum: 4 }] }
                ]
            },
            {
                projectID: "수강신청", projectColor: "ff0022",
                dailytasks: [
                    { id: "TEMP15", name: "빨래하기", completed_at: new Date(2024, 2, 2, 7, 4, 1), reaction: [{ emoji: "🥳", reactionNum: 2 }, { emoji: "😅", reactionNum: 3 }] },
                ]
            },
        ]
    }
]

export default SocialFollowingPage