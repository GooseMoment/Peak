import { Link } from "react-router-dom"

import styled, { css } from "styled-components"

import { ifMobile } from "@utils/useScreenType"

import { skeletonCSS } from "@assets/skeleton"

const ContentTitle = ({ type, actionUser, payload, skeleton }) => {
    let title = ""

    if (socialTypes.includes(type)) {
        const actionUserProfileURL = "/app/users/@" + actionUser?.username
        title = (
            <ContentTitleLink to={actionUserProfileURL}>
                @{actionUser?.username}
            </ContentTitleLink>
        )
    } else if (type === "task_reminder") {
        const taskURL =
            "/app/projects/" +
            payload?.project_id +
            "/tasks/" +
            payload?.task +
            "/detail"
        title = (
            <ContentTitleLink to={taskURL}>
                {payload?.task_name}
            </ContentTitleLink>
        )
    } else {
        title = ""
    }

    return <TitleBox $skeleton={skeleton}>{title}</TitleBox>
}

const socialTypes = [
    "comment",
    "reaction",
    "follow",
    "follow_request",
    "follow_request_accepted",
    "peck",
]

const TitleBox = styled.h3`
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
            ${skeletonCSS}
        `}
`

const ContentTitleLink = styled(Link)`
    color: inherit;
    text-decoration: none;
`

export default ContentTitle
