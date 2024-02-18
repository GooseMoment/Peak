import styled from "styled-components"
import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"

const Box = ({notification}) => {

    const purified = purifyNotificationForDisplay(notification)

    return <BoxFrame>
        <BoxIcon smallIcon={purified.smallIcon}>
            {purified.icon}
        </BoxIcon>
        <BoxTexts>
            <BoxTitle>{purified.title}</BoxTitle>
            <BoxDetail>{purified.detail}</BoxDetail>
        </BoxTexts>
        <div>
            <BoxAgo>{purified.ago}</BoxAgo>
            <FeatherIcon icon="more-horizontal" />
        </div>
    </BoxFrame>
}

const purifyNotificationForDisplay = (notification) => {
    const socialTypesSmallIcon = {
        "reaction": notification.payload.emoji ? <BoxIconSmallEmoji>{notification.payload.emoji}</BoxIconSmallEmoji> : null,
        "reaction_group": null,
        "follow": <FeatherIcon icon="plus-circle" />,
        "follow_request": <FeatherIcon icon="send" />, 
        "follow_request_accepted": <FeatherIcon icon="check-circle" />, 
        "pecked": <FeatherIcon icon="help-circle" />, // TODO: replace to pecked icon 
    }

    let purified = {
        title: "",
        icon: null,
        smallIcon: null,
        detail: "",
        ago: "",
    }

    purified.ago = DateTime.fromJSDate(notification.notifiedAt).setLocale("en").toRelative()

    console.log(Object.keys(socialTypesSmallIcon))

    if (notification.type in socialTypesSmallIcon) {
        purified.title = "@" + notification.payload.user.username
        purified.icon = <img src={notification.payload.user.profileImgURI} />
        purified.smallIcon = socialTypesSmallIcon[notification.type]
    }

    if (notification.type === "reaction") {
        purified.detail = `reacted to ${notification.payload.task.name}`
    }

    else if (notification.type === "reaction_group") {
        purified.detail = "reacted to " + notification.payload.taskEmojiPairs.
            map(pair => pair.emoji + ' "' + pair.task.name + '"').join(', ')
    }

    else if (notification.type === "follow") {
        purified.detail = "followed you"
    }

    else if (notification.type === "follow_request") {
        purified.detail = "sent follow request"
    }

    else if (notification.type === "follow_request_accepted") {
        purified.detail = "accepted follow request"
    }

    else if (notification.type === "pecked") {
        purified.detail = "pecked you"
    }
    
    else if (notification.type === "task") {
        purified.title = `Time to "${notification.payload.name}"`
        purified.icon = <FeatherIcon icon="clock" />
        purified.detail = "Due to " + DateTime.fromJSDate(notification.payload.due).setLocale("en").toRelative() +
            " | " + notification.payload.memo
    }

    else if (notification.type === "trending_up") {
        purified.title = "More than " + notification.payload.than
        purified.icon = <FeatherIcon icon="trending-up" />
        purified.detail = notification.payload.figure + " more completion ratio? Keep it up!"
    }

    else if (notification.type === "trending_down") {
        purified.title = "Less than " + notification.payload.than
        purified.icon = <FeatherIcon icon="trending-down" />
        purified.detail = "Too much tasks? Cheer up!"
    }

    return purified
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
    margin-right: 0;
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

& svg {
    transform: translateX(20%);
    width: 80%;
    height: 80%;
}
`

const BoxIconSmallEmoji = styled.p`
transform: translate(20%, 20%);
width: 80%;
height: 80%;
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

export default Box