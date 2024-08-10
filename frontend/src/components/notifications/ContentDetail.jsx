import { Link } from "react-router-dom"

import styled, { css } from "styled-components"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import { skeletonCSS } from "@assets/skeleton"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const ContentDetail = ({ type, payload, actionUser }) => {
    const { t } = useTranslation(null, { keyPrefix: "notifications" })
    const locale = useClientLocale()
    const tz = useClientTimezone()

    switch (type) {
        case "task_reminder":
            if (payload.delta === 0) {
                return <DetailBox>{t("content_task_reminder_now")}</DetailBox>
            }

            return (
                <DetailBox>
                    {t("content_task_reminder", {
                        delta: payload?.delta,
                    })}
                </DetailBox>
            )
        case "comment":
            if (payload.parent_type === "task") {
                return (
                    <DetailBox>
                        <DetailLink to="/app/social/following">
                            <UserContent>{payload.comment}</UserContent>
                        </DetailLink>
                        <DetailLink to={getPathToTaskDetail(payload.task)}>
                            RE:
                            <ParentContent>{payload.task.name}</ParentContent>
                        </DetailLink>
                    </DetailBox>
                )
            } else {
                const displayDate = getDisplayDateFromQuote(
                    payload?.quote,
                    locale,
                    tz,
                )

                return (
                    <DetailBox>
                        <DetailLink to="/app/social/following">
                            <UserContent>{payload.comment}</UserContent>
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
        case "reaction":
            if (payload.parent_type === "task") {
                return (
                    <DetailBox>
                        <DetailLink to={getPathToTaskDetail(payload.task)}>
                            <ParentContent>{payload.task.name}</ParentContent>
                        </DetailLink>
                    </DetailBox>
                )
            } else {
                // TODO: change to payload?.quote
                const displayDate = getDisplayDateFromQuote(
                    payload?.quote,
                    locale,
                    tz,
                )

                return (
                    <DetailBox>
                        <DetailLink to="/app/social/following">
                            {t("content_comment_quote", {
                                date: displayDate,
                            })}
                        </DetailLink>
                    </DetailBox>
                )
            }
        case "peck": {
            return (
                <DetailBox>
                    <DetailLink to="/app/social/following">
                        {t("content_peck", { count: payload.count })}
                    </DetailLink>
                    <DetailLink to={getPathToTaskDetail(payload.task)}>
                        RE:
                        <ParentContent>{payload.task.name}</ParentContent>
                    </DetailLink>
                </DetailBox>
            )
        }
        case "follow":
            return <DetailBox>{t("content_follow")}</DetailBox>
        case "follow_request":
            return (
                <DetailBox>
                    <DetailLink to={`/app/users/@${actionUser.username}`}>
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

const getDisplayDateFromQuote = (quote, locale, tz) => {
    const date = DateTime.fromISO(quote.date).setLocale(locale).setZone(tz)

    const diffNow = date.diffNow(["days"])
    const relativeDate = date.toRelative({ unit: "days" })

    return Math.abs(diffNow.days) > 7 ? date.toLocaleString() : relativeDate
}

const getPathToTaskDetail = (task) => {
    return `/app/projects/${task.project_id}/tasks/${task.id}/detail`
}

const ellipsis = css`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: clip;
    min-width: 0;
`

const DetailBox = styled.div`
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
            ${skeletonCSS}
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
