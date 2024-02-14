import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

const Notifications = () => {
    return <>
    <PageTitle>Notifications</PageTitle>
    <FilterGroup>
        <FilterButton>All</FilterButton>
        <FilterButton>Tasks</FilterButton>
        <FilterButton $active>Reactions</FilterButton>
        <FilterButton>Follow</FilterButton>
    </FilterGroup>

    {mockNotifications.map(notification => <Box notification={notification} />)}
    </>
}

const PageTitle = styled.h1`
font-size: 2em;
font-weight: bold;
margin-bottom: 0.5em;
`

const FilterGroup = styled.div`
display: inline-flex;
justify-content: space-between;
gap: 0.25em;

background-color: #F3F3F3;
border-radius: 60px;
padding: 0.3em;
`

const FilterButton = styled.button`
flex: 1 1 auto;

color: inherit;
border: none;
font: inherit;
outline: inherit;

font-size: 0.9rem;
font-weight: 500;
border-radius: 50px;
padding: 0.5rem 0.75rem;

background-color: ${props => props.$active ? "white" : "inherit"};
filter: ${props => props.$active ? "drop-shadow(2px 2px 3px #00000041)" : "none"};
`

const mockNotifications = [
    {type: "task", notifiedAt: new Date(), isRead: false, payload: { // payload: task
        id: "QWERTY", name: "설거지 하기", due: new Date(2024, 2, 14, 18, 0, 0), projectID: "홍대라이프", memo: "여기에 메모 입력", prority: 3
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
    {type: "reaction_set", notifiedAt: new Date(2024, 2, 14, 10, 33, 41), isRead: true, payload: {
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
    {type: "follow_request_accpeted", notifiedAt: new Date(2024, 2, 14, 7, 11, 13), isRead: true, payload: {
        user: {
            username: "aksae", profileImgURI: "https://avatars.githubusercontent.com/u/39623851?v=4"
        },
    }},
    {type: "peaked", notifiedAt: new Date(2024, 2, 14, 1, 11, 13), isRead: false, payload: {
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

const notificationToNotiDisplay = (notification) => {
    let notiDisplay = {
        icon: null,
        title: "",
        detail: "",
        ago: "",
    }

    // TODO

    return notiDisplay
}

const Box = ({notification}) => {
    return <BoxFrame>
        <BoxIcon smallIcon="🥳">
            <img src="https://avatars.githubusercontent.com/u/65756020?v=4" />
        </BoxIcon>
        <BoxTexts>
            <BoxTitle>@minyoy</BoxTitle>
            <BoxDetail>18:00 | memo here</BoxDetail>
        </BoxTexts>
        <div>
            <BoxAgo>3 minutes ago</BoxAgo>
            <FeatherIcon icon="more-horizontal" />
        </div>
    </BoxFrame>
}

const BoxFrame = styled.article`
display: flex;
gap: 1em;

border-bottom: 1px solid black;
padding: 1.5em 2em;
`

const BoxIcon = ({children, smallIcon}) => {
    return <BoxIconFrame>
        {children}
        {smallIcon ? <BoxIconSmall>
            <span>{smallIcon}</span>
        </BoxIconSmall> : null}
    </BoxIconFrame>
}

const BoxIconFrame = styled.div`
position: relative;
width: auto;
height: 3em;

& img {
    border-radius: 50%;
}

& svg {
    stroke: 2em;
}

& img, & svg {
    width: auto;
    height: 3em;
}
`

const BoxIconSmall = styled.div`
display: flex;
justify-content: center;
align-items: center;

position: absolute;
right: -2px;
bottom: -2px;

background-color: white;
box-sizing: border-box;
border-radius: 100%;

width: 1.25em;
height: 1.25em;

& span {
    vertical-align: -0.25em;
}
`

const BoxTexts = styled.div`
flex-grow: 999;
display: flex;
flex-direction: column;
gap: 0.5em;
justify-content: space-between;
`

const BoxTitle = styled.h3`
font-size: 1em;
font-weight: 600;
`

const BoxDetail = styled.p`
font-size: 1em;
font-weight: 400;
`

const BoxAgo = styled.time`
font-size: 0.5em;
`

export default Notifications