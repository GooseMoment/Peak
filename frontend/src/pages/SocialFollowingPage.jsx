import { useEffect, useState } from "react"
import { useRouteLoaderData } from "react-router-dom"

import { styled, css } from "styled-components"
import moment from "moment";

import SocialCalendar from "@components/social/SocialCalendar";
import DailyLogPreview from "@components/social/DailyLogPreview";
import LogDetail from "@components/social/LogDetail/LogDetail";
import SocialPageTitle from "@components/social/SocialPageTitle";

import { getDailyReport } from "@api/social.api";

const SocialFollowingPage = () => {
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)

    const [selectedDate, setSelectedDate] = useState(initial_date.toISOString())
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [dailyReport, setDailyReport] = useState([])
    
    const {user} = useRouteLoaderData("app")

    const getPreview = async(date) => {
        const day = date
        console.log(day)
        if(date) try {
            const res = await getDailyReport(user.username, day)
            setDailyReport(res)
        } catch (e) {
            throw alert(e)
        }
    }

    useEffect(() => {
        getPreview(selectedDate)
    }, [selectedDate])

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

                <DailyLogContainer>
                    {dailyReport.map((dailyFollowersLog) => (
                        <DailyLogPreview key={dailyFollowersLog.username} userLogSimple={dailyFollowersLog} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                    ))}
                </DailyLogContainer>
            </Container>

            <Container $isSticky={true}>
                <LogDetail userLogsDetail={mockDailyFollowerLogsDetail[0]} isSelf={true} />
            </Container>
        </Wrapper>
    </>
}

const Wrapper = styled.div`
    display: flex;
`

const Container = styled.div`
    width: 50%;
    min-width: 32.5rem;
    max-width: 40rem;
    ${props => props.$isSticky ? css`
        /* align-self: flex-start; */
        position: sticky;
        top: 2.5rem;
    ` : null}
    margin-bottom: auto;

    padding: 0 1rem 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    overflow: hidden;
`

const CalendarContainer = styled.div`
    width: 80%;
    margin-left: auto;
    margin-right: auto;
`

const DailyLogContainer = styled.div`
`

const mockNewLogDates = [
    "2024-04-09", "2024-04-10", "2024-04-11",
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
                projectID: "개발", projectColor: "#2E61DC",
                dailytasks: [
                    { id: "TEMP11", name: "빨래하기", completedAt: new Date(2024, 2, 2, 7, 4, 1), reaction: [{ emoji: "🥳", reactionNum: 2 }] },
                    { id: "TEMP12", name: "총장하기", completedAt: null, reaction: [{ emoji: null, reactionNum: 4 }] }
                ]
            },
            {
                projectID: "수강신청", projectColor: "#ff0022",
                dailytasks: [
                    { id: "TEMP15", name: "빨래하기", completedAt: new Date(2024, 2, 2, 7, 4, 1), reaction: [{ emoji: "🥳", reactionNum: 2 }, { emoji: "😅", reactionNum: 3 }] },
                ]
            },
        ]
    }
]

export default SocialFollowingPage