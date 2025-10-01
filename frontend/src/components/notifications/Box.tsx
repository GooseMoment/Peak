import { Suspense } from "react"
import { Link } from "react-router-dom"

import styled from "styled-components"

import Avatar from "@components/notifications/Avatar"
import Content, { ContentSkeleton } from "@components/notifications/Content"

import {
    type Notification,
    getRelatedUserFromNotification,
} from "@api/notifications.api"

import { ifMobile } from "@utils/useScreenType"

export default function Box({ notification }: { notification: Notification }) {
    const relatedUser = getRelatedUserFromNotification(notification)

    return (
        <Link to={`/app/notifications/${notification.id}`} draggable="false">
            <Frame>
                <Avatar
                    projectColor={
                        (notification.type === "task_reminder" &&
                            notification.task_reminder.project_color) ||
                        undefined
                    }
                    relatedUser={relatedUser}
                    emoji={
                        (notification.type === "task_reaction" &&
                            (notification.task_reaction.image_emoji ||
                                notification.task_reaction.unicode_emoji)) ||
                        undefined
                    }
                />
                <Suspense
                    key="notification-box-content"
                    fallback={<ContentSkeleton />}>
                    <Content
                        notification={notification}
                        relatedUser={relatedUser}
                    />
                </Suspense>
            </Frame>
        </Link>
    )
}

export function BoxSkeleton() {
    return (
        <Frame>
            <Avatar skeleton />
            <ContentSkeleton />
        </Frame>
    )
}

const Frame = styled.article`
    position: relative;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    gap: 1.5em;

    min-width: 0; // for children's text-overflow: ellipsis
    min-height: 7em;
    padding: 1em;
    margin: 1em;
    margin-bottom: 2em;

    border-radius: 10px;

    background-color: ${(p) => p.theme.backgroundColor};
    border: transparent 0.25em solid;

    box-shadow: ${(p) => p.theme.notifications.boxShadowColor} 0px 8px 24px;

    ${ifMobile} {
        margin: 1em 0 1.5em 0;
        min-height: 7.5em;
        height: fit-content;
        padding: 0.5em;
    }
`
