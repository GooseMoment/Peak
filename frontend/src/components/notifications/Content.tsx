import { Link } from "react-router-dom"

import styled, { css } from "styled-components"

import ContentDetail, {
    ContentDetailSkeleton,
} from "@components/notifications/ContentDetail"
import ContentTitle, {
    ContentTitleSkeleton,
} from "@components/notifications/ContentTitle"

import { type Notification } from "@api/notifications.api"
import { type User } from "@api/users.api"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import { skeletonCSS } from "@assets/skeleton"

import { DateTime } from "luxon"

interface ContentProps {
    notification: Notification
    relatedUser?: User
}

const Content = ({ notification, relatedUser }: ContentProps) => {
    const locale = useClientLocale()
    const tz = useClientTimezone()

    const datetime = DateTime.fromISO(notification.created_at)
        .setLocale(locale)
        .setZone(tz)

    return (
        <Container>
            <ContentTop>
                <ContentTitle
                    notification={notification}
                    relatedUser={relatedUser}
                />
                <Link to={`${notification.id}`}>
                    <Time
                        title={datetime.toLocaleString(DateTime.DATETIME_MED)}>
                        {datetime.toRelative({ style: "narrow" })}
                    </Time>
                </Link>
            </ContentTop>
            <ContentDetail notification={notification} />
        </Container>
    )
}

export const ContentSkeleton = () => {
    return (
        <Container>
            <ContentTop>
                <ContentTitleSkeleton />
                <label>
                    <Time $skeleton />
                </label>
            </ContentTop>
            <ContentDetailSkeleton />
        </Container>
    )
}

const Container = styled.div`
    flex-grow: 20;
    position: relative;

    min-width: 0; // for children's text-overflow: ellipsis

    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: 1em;
    justify-content: center;
`

const ContentTop = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`

const Time = styled.time<{ $skeleton?: boolean }>`
    font-size: 0.75em;
    display: block;
    word-break: keep-all;
    white-space: nowrap;
    cursor: pointer;

    ${ifMobile} {
        font-size: 0.65em;
    }

    ${(props) =>
        props.$skeleton &&
        css`
            width: 70px;
            height: 1em;
            ${skeletonCSS()}
            cursor: default;
        `}
`

export default Content
