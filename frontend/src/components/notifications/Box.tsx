import { Suspense, forwardRef } from "react"
import { Ref } from "react"

import styled, { css, keyframes } from "styled-components"

import Avatar from "@components/notifications/Avatar"
import Content, { ContentSkeleton } from "@components/notifications/Content"

import {
    type Notification,
    getRelatedUserFromNotification,
} from "@api/notifications.api"

import { ifMobile } from "@utils/useScreenType"

import { cubicBeizer } from "@assets/keyframes"

interface BoxProps {
    notification: Notification
    highlight?: boolean
}

const Box = forwardRef(function BoxInternal(
    { notification, highlight = false }: BoxProps,
    ref: Ref<HTMLElement>,
) {
    const relatedUser = getRelatedUserFromNotification(notification)

    return (
        <Frame ref={ref} $highlight={highlight}>
            <Avatar
                projectColor={
                    (notification.type === "task_reminder" &&
                        notification.task_reminder.project_color) ||
                    undefined
                }
                relatedUser={relatedUser}
                emoji={
                    (notification.type === "reaction" &&
                        notification.reaction.emoji) ||
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
    )
})

export const BoxSkeleton = () => {
    return (
        <Frame>
            <Avatar skeleton />
            <ContentSkeleton />
        </Frame>
    )
}

const blink = keyframes`
    0% {
        border-color: transparent;
    }
    20%, 80% {
        border-color: ${(p) => p.theme.accentColor};
    }
    100% {
        border-color: transparent;
    }
`

const Frame = styled.article<{ $highlight?: boolean }>`
    position: relative;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    gap: 1.5em;

    min-width: 0; // for children's text-overflow: ellipsis
    height: 7em;
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

    ${(p) =>
        p.$highlight &&
        css`
            animation: ${blink} 1.5s ${cubicBeizer};
            animation-delay: 0.5s;
        `}
`

export default Box
