import { Suspense, forwardRef } from "react"

import styled, { css, keyframes } from "styled-components"

import Content from "@components/notifications/Content"
import Images from "@components/notifications/Images"

import { ifMobile } from "@utils/useScreenType"

import { cubicBeizer } from "@assets/keyframes"

const Box = forwardRef(function BoxInternal(
    { notification, highlight = false, skeleton = false },
    ref,
) {
    const actionUser =
        notification?.reaction?.user ||
        notification?.peck?.user ||
        notification?.comment?.user ||
        (notification?.type === "follow" &&
            notification?.following?.follower) ||
        (notification?.type === "follow_request" &&
            notification?.following?.follower) ||
        (notification?.type === "follow_request_accepted" &&
            notification?.following?.followee)

    const payload =
        notification?.task_reminder ||
        notification?.reaction ||
        notification?.peck ||
        notification?.following ||
        notification?.comment

    const skeletons = (
        <>
            <Images skeleton />
            <Content skeleton />
        </>
    )

    return (
        <Frame ref={ref} $highlight={highlight}>
            <Suspense fallback={skeletons}>
                <Images
                    skeleton={skeleton}
                    project_color={payload?.project_color}
                    profile_img={actionUser?.profile_img}
                    reaction={notification?.reaction}
                />
                <Content
                    skeleton={skeleton}
                    payload={payload}
                    type={notification?.type}
                    createdAt={notification?.created_at}
                    actionUser={actionUser}
                />
            </Suspense>
        </Frame>
    )
})

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

const Frame = styled.article`
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
