import { useState } from "react"

import FilterButtonGroup from "@components/notifications/FilterButtonGroup"
import Box from "@components/notifications/Box"

import styled from "styled-components"


const NotificationsPage = () => {
    const [activeFilter, setActiveFilter] = useState("all")

    return <>
    <PageTitle>Notifications</PageTitle>
    <FilterButtonGroup filters={filters} active={activeFilter} setActive={setActiveFilter} />

    {mockNotifications.map(notification => <Box key={notification.type} notification={notification} />)}
    </>
}

const PageTitle = styled.h1`
font-size: 2em;
font-weight: bold;
margin-bottom: 0.5em;
`

const filters = {
    "all": {
        display: "All", types: ["task", "reaction", "reaction_group", "follow", "follow_request", "follow_request_accepted", "pecked", "trending_up", "trending_down"]
    },
    "tasks": {
        display: "Tasks", types: ["task"]
    },
    "reactions": {
        display: "Reactions", types: ["reaction", "reaction_group"]
    },
    "follow": {
        display: "Follow", types: ["follow", "follow_request", "follow_request_accepted"]
    }
}

const mockNotifications = [
    {type: "task", notifiedAt: new Date(), isRead: false, payload: { // payload: task
        id: "QWERTY", name: "설거지 하기", due: new Date(2024, 3, 3), projectID: "홍대라이프", memo: "여기에 메모 입력", prority: 3
    }},
    {type: "reaction", notifiedAt: new Date(2024, 2, 14, 14, 11, 13), isRead: false, payload: {
        user: {
            username: "minyoy", profileImgURI: "https://avatars.githubusercontent.com/u/65756020?v=4"
        },
        task: {
            id: "QWERTY", name: "설거지 하기", due: new Date(2024, 2, 14, 18, 0, 0), projectID: "홍대라이프", memo: "여기에 메모 입력", prority: 3
        },
        emoji: "🥳", // Real character or just code (e.g. :celebration:) for system emojis?
    }},
    {type: "reaction_group", notifiedAt: new Date(2024, 2, 14, 10, 33, 41), isRead: true, payload: {
        user: {
            username: "minyoy", profileImgURI: "https://avatars.githubusercontent.com/u/65756020?v=4"
        },
        taskEmojiPairs: [
            {
                task: {
                    id: "QWERTY", name: "설거지 하기", due: new Date(2024, 2, 14, 18, 0, 0), projectID: "홍대라이프", memo: "여기에 메모 입력", prority: 3
                },
                emoji: "🥳",
            },
            {
                task: {
                    id: "ASDFGH", name: "김치찌개 째기", due: new Date(2024, 2, 14, 18, 0, 0), projectID: "홍대라이프", memo: "여기에 메모 입력", prority: 3
                },
                emoji: "😅",
            },
            {
                task: {
                    id: "ZXCVBN", name: "환승연애3 보기", due: new Date(2024, 2, 14, 18, 0, 0), projectID: "홍대라이프", memo: "여기에 메모 입력", prority: 3
                },
                emoji: "❤️",
            },
        ]
    }},
    {type: "follow", notifiedAt: new Date(2024, 2, 14, 9, 11, 13), isRead: true, payload: {
        user: {
            username: "aksae", profileImgURI: "https://avatars.githubusercontent.com/u/39623851?v=4"
        },
        followBack: false,
    }},
    {type: "follow_request", notifiedAt: new Date(2024, 2, 14, 9, 11, 13), isRead: true, payload: {
        user: {
            username: "aksae", profileImgURI: "https://avatars.githubusercontent.com/u/39623851?v=4"
        },
        accepted: null,
    }},
    {type: "follow_request_accepted", notifiedAt: new Date(2024, 2, 14, 7, 11, 13), isRead: true, payload: {
        user: {
            username: "aksae", profileImgURI: "https://avatars.githubusercontent.com/u/39623851?v=4"
        },
    }},
    {type: "pecked", notifiedAt: new Date(2024, 2, 14, 1, 11, 13), isRead: false, payload: {
        user: {
            username: "minyoy", profileImgURI: "https://avatars.githubusercontent.com/u/65756020?v=4"
        },
        task: {
            id: "QWERTY", name: "설거지 하기", due: new Date(2024, 2, 14, 18, 0, 0), projectID: "홍대라이프", memo: "여기에 메모 입력", prority: 3
        },
        streak: 5,
    }},
    {type: "trending_up", notifiedAt: new Date(2024, 2, 13, 1, 3, 4), isRead: true, payload: {
        than: "last month",
        figure: "x3",
    }},
    {type: "trending_down", notifiedAt: new Date(2024, 2, 12, 15, 3, 2), isRead: true, payload: {
        than: "last week",
    }},
]

export default NotificationsPage