import { Link } from "react-router-dom"

import styled, { css } from "styled-components"

import type { Notification } from "@api/notifications.api"
import type { Task } from "@api/tasks.api"

import { ifMobile } from "@utils/useScreenType"

import { skeletonCSS } from "@assets/skeleton"

import { useTranslation } from "react-i18next"

export default function ContentDetail({
    notification: n,
}: {
    notification: Notification
}) {
    const { t } = useTranslation("translation", { keyPrefix: "notifications" })
    switch (n.type) {
        case "task_reminder":
            return (
                <DetailBox>
                    {t("content_task_reminder", {
                        count: n.task_reminder.delta,
                    })}
                </DetailBox>
            )
        case "task_reaction":
            return (
                <DetailBox>
                    <DetailLink to={getPathToTaskDetail(n.task_reaction.task)}>
                        <ParentContent>
                            {n.task_reaction.task.name}
                        </ParentContent>
                    </DetailLink>
                </DetailBox>
            )
        case "follow":
            return <DetailBox>{t("content_follow")}</DetailBox>
        case "follow_request":
            return (
                <DetailBox>
                    <DetailLink
                        to={`/app/users/@${n.following.follower.username}`}>
                        {t("content_follow_request")}
                    </DetailLink>
                </DetailBox>
            )
        case "follow_request_accepted":
            return <DetailBox>{t("content_follow_request_accepted")}</DetailBox>
        default:
    }

    return null
}

export const ContentDetailSkeleton = () => {
    return <DetailBox $skeleton />
}

const getPathToTaskDetail = (task: Task) => {
    return `/app/projects/${task.drawer.project.id}?taskId=${task.id}`
}

const ellipsis = css`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: clip;
    min-width: 0;
`

const DetailBox = styled.div<{ $skeleton?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 1em;

    ${ifMobile} {
        font-size: 0.9em;
    }

    ${(props) =>
        props.$skeleton &&
        css`
            width: 140px;
            height: 1em;
            ${skeletonCSS()}
        `}
`

const DetailLink = styled(Link)`
    display: flex;
    gap: 0.25em;
`

const ParentContent = styled.span`
    color: ${(p) => p.theme.secondTextColor};
    font-style: italic;

    display: inline-block;
    ${ellipsis}
`
