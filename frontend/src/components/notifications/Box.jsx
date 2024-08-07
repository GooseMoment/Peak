import { forwardRef } from "react"

import styled, { css, keyframes } from "styled-components"

import Ago from "./Ago"
import Content from "./Content"
import Images from "./Images"

import { cubicBeizer } from "@assets/keyframes"

const Box = forwardRef(
    ({ notification, highlight = false, skeleton = false }, ref) => {
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

        return (
            <Frame ref={ref} $highlight={highlight}>
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
                    actionUser={actionUser}
                />
                <Ago
                    skeleton={skeleton}
                    created_at={notification?.created_at}
                />
            </Frame>
        )
    },
)

const blink = (p) => keyframes`
    0% {
        border-color: transparent;
    }
    20%, 80% {
        border-color: ${p.theme.accentColor};
    }
    100% {
        border-color: transparent;
    }
`

const Frame = styled.article`
    box-sizing: border-box;

    display: flex;
    gap: 2.5em;

    min-width: 400px;
    height: 7em;
    padding: 1em;
    margin: 1em;
    margin-bottom: 2em;

    border-radius: 10px;

    background-color: ${(p) => p.theme.backgroundColor};
    border: transparent 0.25em solid;

    ${(p) =>
        p.$highlight &&
        css`
            animation: ${blink(p)} 1.5s ${cubicBeizer};
            animation-delay: 0.5s;
        `}

    box-shadow: ${(p) => p.theme.notifications.boxShadowColor} 0px 8px 24px;
`

export default Box
