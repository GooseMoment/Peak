import { Link } from "react-router-dom"

import styled from "styled-components"

import { DateTime } from "luxon"

const socialTypes = [
    "comment",
    "reaction",
    "follow",
    "follow_request",
    "follow_request_accepted",
    "peck",
]

const convertNotificationToContent = (
    t,
    locale,
    tz,
    type,
    payload,
    actionUser,
) => {
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

                if (payload.delta === 0) {
                    detail = t("content_task_reminder_now")
                } else {
                    detail = t("content_task_reminder", { delta: payload?.delta })
                }
            }
            break
        case "comment":
            if (payload.parent_type === "task") {
                detail = (
                    <ContentDetailLink
                        to={`/app/projects/${payload.task?.project_id}`}
                    >
                        <Ellipsis>{payload.comment}</Ellipsis>
                        <Parent>
                            RE:{" "}
                            <ParentContent>{payload.task.name}</ParentContent>
                        </Parent>
                    </ContentDetailLink>
                )
            } else {
                const date = DateTime.fromISO(payload.daily_comment?.date)
                    .setLocale(locale)
                    .setZone(tz)

                const diffNow = date.diffNow(["days"])
                const relativeDate = date.toRelative({ unit: "days" })
                detail = (
                    <ContentDetailLink
                        to={`/app/social/following`}
                    >
                        <Ellipsis>{payload.comment}</Ellipsis>
                        <Parent>
                            RE:
                            {t("content_comment_quote", {
                                date:
                                    Math.abs(diffNow.days) > 7
                                        ? date.toLocaleString()
                                        : relativeDate,
                            })}
                        </Parent>
                    </ContentDetailLink>
                )
            }
            break
        case "reaction":
            if (payload.parent_type === "task") {
                detail = (
                    <ContentDetailLink
                        to={`/app/projects/${payload.task?.project_id}`}
                    >
                        <Parent>
                            <ParentContent>{payload.task.name}</ParentContent>
                        </Parent>
                    </ContentDetailLink>
                )
            } else {
                // TODO: change to payload.quote?.date
                const date = DateTime.fromISO(payload.daily_comment?.date)
                    .setLocale(locale)
                    .setZone(tz)

                const diffNow = date.diffNow(["days"])
                const relativeDate = date.toRelative({ unit: "days" })

                detail = (
                    <ContentDetailLink to={"/app/social/following/"}>
                        <Parent>
                            {t("content_reaction_quote", {
                                date:
                                    Math.abs(diffNow.days) > 7
                                        ? date.toLocaleString()
                                        : relativeDate,
                            })}
                        </Parent>
                    </ContentDetailLink>
                )
            }
            break
        case "peck":
            detail = (
                <ContentDetailLink
                    to={`/app/projects/${payload.task?.project_id}`}
                >
                    {t("content_peck", { count: payload.count })}
                    <Parent>
                        RE: <ParentContent>{payload.task.name}</ParentContent>
                    </Parent>
                </ContentDetailLink>
            )
            break
        case "follow":
            detail = t("content_follow")
            break
        case "follow_request":
            detail = (
                <ContentDetailLink to={`/app/users/@${actionUser.username}`}>
                    {t("content_follow_request")}
                </ContentDetailLink>
            )
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
    flex-direction: column;
    gap: 1em;
`

const Ellipsis = styled.span`
    text-overflow: ellipsis;
    overflow-x: clip;
    white-space: nowrap;

    display: inline-block;
    box-sizing: border-box;
    max-width: 100%;
`

const Parent = styled.div``

const ParentContent = styled.span`
    color: ${(p) => p.theme.secondTextColor};
    font-style: italic;

    display: inline-block;
    text-overflow: ellipsis;
    overflow-x: clip;
    white-space: nowrap;

    max-width: 100%;
`

export default convertNotificationToContent
