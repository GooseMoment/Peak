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

    let detail = null

    switch (type) {
        case "task_reminder":
            if (payload.delta === 0) {
                detail = t("content_task_reminder_now")
            } else {
                detail = t("content_task_reminder", {
                    delta: payload?.delta,
                })
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
                // TODO: replace daily_comment to quote
                const displayDate = getDisplayDateFromQuote(payload?.daily_comment, locale, tz)

                detail = (
                    <ContentDetailLink to={`/app/social/following`}>
                        <Ellipsis>{payload.comment}</Ellipsis>
                        <Parent>
                            RE:
                            {t("content_comment_quote", {
                                date: displayDate,
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
                // TODO: change to payload?.quote
                const displayDate = getDisplayDateFromQuote(payload?.daily_comment, locale, tz)

                detail = (
                    <ContentDetailLink to={"/app/social/following/"}>
                        <Parent>
                            {t("content_reaction_quote", {
                                date: displayDate,
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

    return <DetailBox>{detail}</DetailBox>
}

const getDisplayDateFromQuote = (quote, locale, tz) => {
    const date = DateTime.fromISO(quote.date).setLocale(locale).setZone(tz)

    const diffNow = date.diffNow(["days"])
    const relativeDate = date.toRelative({ unit: "days" })

    return Math.abs(diffNow.days) > 7 ? date.toLocaleString() : relativeDate
}

const DetailBox = styled.div`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: clip;

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

    padding-right: 10px;
    margin-right: -10px;

    max-width: 100%;
`

export default ContentDetail
