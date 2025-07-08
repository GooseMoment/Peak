import { Link } from "react-router-dom"

import styled, { css } from "styled-components"

import { type Notification } from "@api/notifications.api"
import { type User } from "@api/users.api"

import { ifMobile } from "@utils/useScreenType"

import { skeletonCSS } from "@assets/skeleton"

interface ContentTitleProps {
    notification: Notification
    relatedUser?: User
}

const ContentTitle = ({ notification, relatedUser }: ContentTitleProps) => {
    if (relatedUser) {
        const profileURL = "/app/users/@" + relatedUser.username
        return (
            <TitleBox>
                <ContentTitleLink to={profileURL}>
                    @{relatedUser.username}
                </ContentTitleLink>
            </TitleBox>
        )
    } else if (notification.type === "task_reminder") {
        const taskURL = "/app/projects/" + notification.task_reminder.project_id
        return (
            <TitleBox>
                <ContentTitleLink to={taskURL}>
                    {notification.task_reminder.task_name}
                </ContentTitleLink>
            </TitleBox>
        )
    }

    return <ContentTitleSkeleton />
}

export const ContentTitleSkeleton = () => {
    return <TitleBox $skeleton />
}

const TitleBox = styled.h3<{ $skeleton?: boolean }>`
    font-weight: bold;

    ${ifMobile} {
        font-size: 0.9em;
    }

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: clip;
    min-width: 0;

    ${(props) =>
        props.$skeleton &&
        css`
            width: 140px;
            height: 1em;
            ${skeletonCSS()}
        `}
`

const ContentTitleLink = styled(Link)`
    color: inherit;
    text-decoration: none;
`

export default ContentTitle
