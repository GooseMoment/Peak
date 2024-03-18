import { useState } from "react"

import { Link } from "react-router-dom";
import styled from "styled-components"

import SocialCalendar from "@components/social/SocialCalendar";
import LogBox from "@components/social/LogBox";
import LogDetail from "@components/social/LogDetail/LogDetail";

const SocialFollowingPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedIndex, setSelectedIndex] = useState(null)

    return <>
        <PageTitle>
            <PageTitleButton to="/social/following">Following</PageTitleButton>
            <PageTitleButton to="/social/explore" style={{ color: "#A4A4A4" }}>Explore</PageTitleButton>
        </PageTitle>
        <div style={{whiteSpace: 'nowrap'}}>
        <SocialContainer>
            <SocialCalendar
                newLogDates={mockNewLogDates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            >
            </SocialCalendar>
            <SocialBoxContainer>
                {mockDailyFollowersLog.map((dailyFollowersLog) => (
                    <LogBox userLogSimple={dailyFollowersLog} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                ))}
            </SocialBoxContainer>

            {/* {selectedDate.toLocaleDateString()} */}
        </SocialContainer>
        <SocialContainer style={{width: '350pt', marginLeft: '2rem'}}>
            <LogDetail userLogsDetail={mockDailyFollowerLogsDetail[0]} isSelf={true}/>
        </SocialContainer>
        </div>

    </>
}

const PageTitle = styled.h1``

const PageTitleButton = styled(Link)`
display: inline-block;
font-size: 2em;
font-weight: bold;
color: black;
text-decoration: none;
margin-bottom: 0.5em;
margin-right: 0.7em;
`

const SocialContainer = styled.div`
display: inline-block;
margin-right: 1em;
height: 85vh;
overflow: hidden;
`

const SocialBoxContainer = styled.div`
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
            // name: null,
            reaction: [
                {emoji: "🥳", reactionNum: 2},
                {emoji: "😅", reactionNum: 3}
            ]
        },
        dailyProjects: [
            {
                projectID: "개발", projectColor: "#2E61DC",
                dailytasks: [
                    { id: "TEMP1", name: "빨래하기", completedAt: new Date(2024, 2, 2, 7, 4, 1), reaction: [ { emoji: "🥳", reactionNum: 2 } ] },
                    { id: "TEMP2", name: "총장하기", completedAt: null, reaction: [ { emoji: null, reactionNum: 4 } ] }
                ]
            },
            {
                projectID: "수강신청", projectColor: "#ff0022",
                dailytasks: [
                    { id: "TEMP1", name: "빨래하기", completedAt: new Date(2024, 2, 2, 7, 4, 1), reaction: [ { emoji: "🥳", reactionNum: 2 }, { emoji: "😅", reactionNum: 3 } ] },
                ]
            },
        ]
    }
]

export default SocialFollowingPage