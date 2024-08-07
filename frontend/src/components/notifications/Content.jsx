import { Link } from "react-router-dom"

import styled, { css } from "styled-components"

import { skeletonCSS } from "@assets/skeleton"

import { Trans, useTranslation } from "react-i18next"

const socialTypes = [
    "comment",
    "reaction",
    "follow",
    "follow_request",
    "follow_request_accepted",
    "peck",
]

const Content = ({ type, payload, actionUser, skeleton = false }) => {
    const { t } = useTranslation(null, { keyPrefix: "notifications" })

    let title = null
    let detail = null

    if (socialTypes.includes(type)) {
        const actionUserProfileURL = "/app/users/@" + actionUser?.username
        title = (
            <ContentTitleLink to={actionUserProfileURL}>
                @{actionUser?.username}
            </ContentTitleLink>
        )
    } else {
        title = ""
    }

    switch (type) {
        case "task_reminder":
            const taskURL =
                "/app/projects/" +
                payload?.project_id +
                "/?task_id=" +
                payload?.task
            title = (
                <ContentTitleLink to={taskURL}>
                    {payload?.task_name}
                </ContentTitleLink>
            )
            detail = t("content_task_reminder", { delta: payload?.delta })
            break
        case "comment":
            detail = (
                <ContentDetailLink
                    to={`/app/projects/${payload.task?.project_id}`}
                >
                    <Trans
                        t={t}
                        i18nKey="content_comment_task"
                        values={{
                            task_name: payload.task?.name,
                            comment: payload.comment,
                        }}
                        components={{ ellipsis: <Ellipsis /> }}
                    />
                </ContentDetailLink>
            )
            break
        case "reaction":
            if (payload.parent_type === "task") {
                detail = (
                    <ContentDetailLink
                        to={`/app/projects/${payload.task?.project_id}`}
                    >
                        <Trans
                            t={t}
                            i18nKey="content_reaction_task"
                            values={{ task_name: payload.task?.name }}
                            components={{ ellipsis: <Ellipsis /> }}
                        />
                    </ContentDetailLink>
                )
                break
            }

            detail = (
                <ContentDetailLink to={"/app/social/following/"}>
                    <Trans
                        t={t}
                        i18nKey="content_reaction_daily_comment"
                        values={{ date: payload.daily_comment?.date }}
                        components={{ ellipsis: <Ellipsis /> }}
                    />
                </ContentDetailLink>
            )
            break
        case "peck":
            detail = (
                <ContentDetailLink
                    to={`/app/projects/${payload.task?.project_id}`}
                >
                    <Trans
                        t={t}
                        i18nKey="content_peck"
                        values={{
                            task_name: payload.task?.name,
                            count: payload.count,
                        }}
                        components={{ ellipsis: <Ellipsis /> }}
                    />
                </ContentDetailLink>
            )
            break
        case "follow":
            detail = t("content_follow")
            break
        case "follow_request":
            detail = t("content_follow_request")
            break
        case "follow_request_accepted":
            detail = t("content_follow_request_accepted")
            break
        default:
            detail = ""
    }

    return (
        <Container>
            <ContentTitle $skeleton={skeleton}>{title}</ContentTitle>
            <ContentDetail $skeleton={skeleton}>{detail}</ContentDetail>
        </Container>
    )
}

const Container = styled.div`
    flex-grow: 20;

    display: flex;
    flex-direction: column;
    gap: 1em;
    justify-content: center;
`

const ContentTitle = styled.h3`
    font-weight: bold;

    ${(props) =>
        props.$skeleton &&
        css`
            width: 140px;
            height: 1em;
            ${skeletonCSS}
        `}
`

const ContentDetail = styled.p`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

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

const ContentDetailLink = styled(Link)`
    color: inherit;
    display: flex;
    gap: 0;
`

const Ellipsis = styled.span`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    display: inline-block;
    box-sizing: border-box;
    max-width: 10em;
`

export default Content
