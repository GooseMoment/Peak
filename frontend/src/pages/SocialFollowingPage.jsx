import { useEffect, useState } from "react"
import { useRouteLoaderData } from "react-router-dom"

import styled from "styled-components"
import moment from "moment";

import SocialCalendar from "@components/social/SocialCalendar";
import DailyLogPreview from "@components/social/DailyLogPreview";
import LogDetail from "@components/social/LogDetail/LogDetail";
import SocialPageTitle from "@components/social/SocialPageTitle";

import { getDailyReport } from "@api/social.api";

const SocialFollowingPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [dailyReport, setDailyReport] = useState([])
    
    const {user} = useRouteLoaderData("app")

    const getPreview = async(date) => {
        const day = moment(date).format('YYYY-MM-DD')
        try {
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
                <SocialCalendar
                    newLogDates={mockNewLogDates}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                >
                </SocialCalendar>
                <DailyLogContainer>
                    {dailyReport.map((dailyFollowersLog) => (
                        <DailyLogPreview key={dailyFollowersLog.id} userLogSimple={dailyFollowersLog} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                    ))}
                </DailyLogContainer>
            </Container>
            <Container>
                <LogDetail userLogsDetail={mockDailyFollowerLogsDetail[0]} isSelf={true} />
            </Container>

        </Wrapper>
    </>
}

const Wrapper = styled.div`
    white-space: nowrap;
`

const Container = styled.div`
display: inline-block;
margin-right: 2em;
height: 85vh;
width: 50%;
overflow: hidden;
`

const DailyLogContainer = styled.div`
max-height: 50%;
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

const mockNewLogDates = [
    "27-02-2024", "01-03-2024", "22-03-2024",
];

const mockDailyFollowersLog = [
    {
        index: 0,
        isRead: false,
        user: {
            username: "minyoy", profileImgURI: "https://avatars.githubusercontent.com/u/65756020?v=4"
        },
        task: {
            id: "TEMP1", name: "빨래 하기", completedAt: new Date(2024, 2, 2, 17, 4, 1), projectID: "홍대라이프", projectColor: "#2E61DC", reactionNum: 3
        }
    },
    {
        index: 1,
        isRead: false,
        user: {
            username: "aksae", profileImgURI: "https://avatars.githubusercontent.com/u/39623851?v=4"
        },
        task: {
            id: "TEMP2", name: "ㅆㅣ...", completedAt: new Date(2024, 2, 2, 7, 4, 1), projectID: "개발", projectColor: "#ff0022", reactionNum: 3
        }
    },
    {
        index: 2,
        isRead: true,
        user: {
            username: "supercalifragilisticexpialidocious", profileImgURI: "https://avatars.githubusercontent.com/u/39623851?v=4"
        },
        task: {
            id: "TEMP3", name: "우산 타고 날아가기", completedAt: new Date(2024, 2, 1, 19, 4, 1), projectID: "개발", projectColor: "#ff7f00", reactionNum: 3
        }
    },
    {
        index: 3,
        isRead: true,

        user: {
            username: "supercalifragilisticexpialidocious", profileImgURI: "https://avatars.githubusercontent.com/u/39623851?v=4"
        },
        task: {
            id: "TEMP4", name: "아주아주아주아주멀리그리고높이이카루스처럼태양을향해한번더날아가기", completedAt: new Date(2024, 2, 1, 19, 4, 1), projectID: "개발", projectColor: "#ff7f00", reactionNum: 3
        }
    },
]

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