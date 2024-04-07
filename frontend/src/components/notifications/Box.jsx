import { useState } from "react"
import { Link } from "react-router-dom"

import { cubicBeizer } from "@assets/keyframes"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"
import { DateTime } from "luxon"

const Box = ({notification}) => {

    const [isHover, setIsHover] = useState(false)

    const purified = purifyNotificationForDisplay(notification)

    return <Frame>
        <Icon smallIcon={purified.smallIcon}>
            {purified.icon}
        </Icon>
        <Texts>
            <TextsTitle>{purified.title}</TextsTitle>
            <TextsDetail>{purified.detail}</TextsDetail>
        </Texts>
        <AgoAndMore>
            <Ago onMouseEnter={e => setIsHover(true)} onMouseLeave={e => setIsHover(false)} dateTime={notification.created_at}>
                {isHover ? purified.datetime.toLocaleString(DateTime.DATETIME_MED) : purified.datetime.toRelative()}
            </Ago>
            <FeatherIcon icon="more-horizontal" />
        </AgoAndMore>
    </Frame>
}

const purifyNotificationForDisplay = (notification) => {
    const socialTypesSmallIcon = {
        "reaction": notification.reaction?.emoji ? <IconSmallEmoji src={notification.reaction.emoji.img_uri} /> : null,
        "follow": <FeatherIcon icon="plus-circle" />,
        "follow_request": <FeatherIcon icon="send" />, 
        "follow_request_accepted": <FeatherIcon icon="check-circle" />, 
        "peck": <FeatherIcon icon="help-circle" />, // TODO: replace to pecked icon 
    }

    let purified = {
        title: "",
        icon: null,
        smallIcon: null,
        detail: "",
        datetime: "",
    }

    const payload = notification.task_reminder || notification.reaction || notification.peck || notification.following 
    const createdAt = new Date(notification.created_at)

    purified.datetime = DateTime.fromJSDate(createdAt).setLocale("en")

    if (notification.type in socialTypesSmallIcon) {
        purified.title = "@" + payload.user.username
        purified.icon = <ProfileImg src={payload.user.profile_img_uri} />
        purified.smallIcon = socialTypesSmallIcon[notification.type]
    }

    if (notification.type === "reaction") {

        if (payload.task) {
            purified.detail = <>
                reacted to {" "}
                {/* TODO: correct daily report link */}
                <Link to="/app/social/following">{payload.task.name}</Link>
            </>
        } else if (payload.daily_comment) {
            purified.detail = <>
                reacted to {" "}
                <Link to="/app/social/following">{payload.daily_comment.comment}</Link>
            </>
        }
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

    else if (notification.type === "peck") {
        purified.detail = "pecked you"
    }
    
    else if (notification.type === "task_reminder") {
        purified.title = `Time to "${payload.name}"`
        purified.icon = <FeatherIcon icon="clock" />
        purified.detail = "Due to " + DateTime.fromJSDate(payload.due).setLocale("en").toRelative() +
            " | " + payload.memo
    }

    return purified
}

const Frame = styled.article`
display: flex;
gap: 2em;

border-bottom: 1px solid black;
padding: 2em 2em;
`

const Icon = ({children, smallIcon}) => {
    return <IconFrame>
        {children}
        {smallIcon ? <IconSmall>
            <span>{smallIcon}</span>
        </IconSmall> : null}
    </IconFrame>
}

const IconFrame = styled.div`
position: relative;
width: auto;
height: 3em;

& svg {
    stroke: 2em;
    margin-right: 0;

    width: auto;
    height: 3em;
}
`

const ProfileImg = styled.img`
    width: 3em;
    height: 3em;
    border-radius: 50%;
`

const IconSmall = styled.div`
display: flex;
justify-content: center;
align-items: center;

position: absolute;
right: -2px;
bottom: -2px;

background-color: white;
box-sizing: border-box;

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

const IconSmallEmoji = styled.img`
transform: translate(20%, 20%);

width: 2.5em;
height: auto;

&:hover {
    transform: translate(20%, 20%) scale(1.3);
}

transition: transform 0.5s ${cubicBeizer};
`

const Texts = styled.div`
flex-grow: 999;
display: flex;
flex-direction: column;
gap: 0.5em;
justify-content: space-between;
`

const TextsTitle = styled.h3`
font-size: 1em;
font-weight: 600;
`

const TextsDetail = styled.p`
font-size: 1em;
font-weight: 400;
`

const AgoAndMore = styled.div`
display: flex;
gap: 0.5em;

font-size: 0.75em;
color: grey;
`

const Ago = styled.time``

export default Box