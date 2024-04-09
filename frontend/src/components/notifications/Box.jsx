import { useState } from "react"
import { Link } from "react-router-dom"

import { Frame, Icon, IconSmallEmoji, ProfileImg, Texts, TextsTitle, TextsDetail, AgoAndMore, Ago } from "./Elements"

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
        purified.detail = <>
            pecked {payload.count} times to {" "}
            {/* TODO: correct daily report link */}
            <Link to="/app/social/following">{payload.task.name}</Link>
        </>
    }
    
    else if (notification.type === "task_reminder") {
        purified.title = `Time to "${payload.name}"`
        purified.icon = <FeatherIcon icon="clock" />
        purified.detail = "Due to " + DateTime.fromJSDate(payload.due).setLocale("en").toRelative() +
            " | " + payload.memo
    }

    return purified
}


export default Box