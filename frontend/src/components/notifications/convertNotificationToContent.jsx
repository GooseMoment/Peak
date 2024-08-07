import { Link } from "react-router-dom"

import styled from "styled-components"

import { Trans } from "react-i18next"

const socialTypes = [
    "comment",
    "reaction",
    "follow",
    "follow_request",
    "follow_request_accepted",
    "peck",
]

const convertNotificationToContent = (t, type, payload, actionUser) => {
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
            {
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
            }
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
                        i18nKey="content_reaction_quote"
                        // TODO: change to payload.quote?.date
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
            detail = <ContentDetailLink to={`/app/users/@${actionUser.username}`}>
                {t("content_follow_request")}
            </ContentDetailLink>
            break
        case "follow_request_accepted":
            detail = t("content_follow_request_accepted")
            break
        default:
            detail = ""
    }

    return {
        title,
        detail,
    }
}

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

export default convertNotificationToContent
