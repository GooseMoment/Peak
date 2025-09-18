import { Link } from "react-router-dom"

import styled, { css } from "styled-components"

import type { Notification } from "@api/notifications.api"
import type { Quote } from "@api/social.api"
import type { Task } from "@api/tasks.api"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import { skeletonCSS } from "@assets/skeleton"

import { DateTime, type Zone } from "luxon"
import { useTranslation } from "react-i18next"

const ContentDetail = ({ notification: n }: { notification: Notification }) => {
    const { t } = useTranslation("translation", { keyPrefix: "notifications" })
    const locale = useClientLocale()
    const tz = useClientTimezone()

    switch (n.type) {
        case "task_reminder":
            if (n.task_reminder.delta === 0) {
                return <DetailBox>{t("content_task_reminder_now")}</DetailBox>
            }

            return (
                <DetailBox>
                    {t("content_task_reminder", {
                        delta: n.task_reminder.delta,
                    })}
                </DetailBox>
            )
        case "comment":
            if (n.comment.parent_type === "task") {
                return (
                    <DetailBox>
                        <DetailLink to="/app/social/following">
                            <UserContent>{n.comment.comment}</UserContent>
                        </DetailLink>
                        <DetailLink to={getPathToTaskDetail(n.comment.task)}>
                            RE:
                            <ParentContent>{n.comment.task.name}</ParentContent>
                        </DetailLink>
                    </DetailBox>
                )
            } else {
                const displayDate = getDisplayDateFromQuote(
                    n.comment.quote,
                    locale,
                    tz,
                )

                return (
                    <DetailBox>
                        <DetailLink to="/app/social/following">
                            <UserContent>{n.comment.comment}</UserContent>
                        </DetailLink>
                        <DetailLink to="/app/social/following">
                            RE:{" "}
                            {t("content_comment_quote", {
                                date: displayDate,
                            })}
                        </DetailLink>
                    </DetailBox>
                )
            }
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
        case "peck": {
            return (
                <DetailBox>
                    <DetailLink to="/app/social/following">
                        {t("content_peck", { count: n.peck.count })}
                    </DetailLink>
                    <DetailLink to={getPathToTaskDetail(n.peck.task)}>
                        RE:
                        <ParentContent>{n.peck.task.name}</ParentContent>
                    </DetailLink>
                </DetailBox>
            )
        }
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

const getDisplayDateFromQuote = (
    quote: Quote,
    locale: string,
    tz: string | Zone,
) => {
    const date = DateTime.fromISO(quote.date).setLocale(locale).setZone(tz)

    const diffNow = date.diffNow(["days"])
    const relativeDate = date.toRelative({ unit: "days" })

    return Math.abs(diffNow.days) > 7 ? date.toLocaleString() : relativeDate
}

const getPathToTaskDetail = (task: Task) => {
    return `/app/projects/${task.drawer.project.id}`
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

const UserContent = styled.span`
    display: inline-block;
    ${ellipsis}
`

const ParentContent = styled.span`
    color: ${(p) => p.theme.secondTextColor};
    font-style: italic;

    display: inline-block;
    ${ellipsis}
`

export default ContentDetail
