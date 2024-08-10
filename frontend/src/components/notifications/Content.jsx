import styled, { css } from "styled-components"

import ContentDetail from "@components/notifications/ContentDetail"
import ContentTitle from "@components/notifications/ContentTitle"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"
import { ifMobile } from "@utils/useScreenType"

import { skeletonCSS } from "@assets/skeleton"

import { DateTime } from "luxon"

const Content = ({
    type,
    payload,
    actionUser,
    createdAt,
    skeleton = false,
}) => {
    const locale = useClientLocale()
    const tz = useClientTimezone()

    const datetime = DateTime.fromISO(createdAt).setLocale(locale).setZone(tz)

    return (
        <Container>
            <ContentTop>
                <ContentTitle
                    skeleton={skeleton}
                    type={type}
                    payload={payload}
                    actionUser={actionUser}
                />
                <label title={datetime.toLocaleString(DateTime.DATETIME_MED)}>
                    <Time $skeleton={skeleton}>
                        {datetime.toRelative({ style: "narrow" })}
                    </Time>
                </label>
            </ContentTop>
            <ContentDetail
                skeleton={skeleton}
                type={type}
                payload={payload}
                actionUser={actionUser}
            />
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

const Time = styled.time`
    font-size: 0.75em;
    display: block;
    word-break: keep-all;
    white-space: nowrap;

    cursor: help;

    ${ifMobile} {
        font-size: 0.65em;
    }

    ${(props) =>
        props.$skeleton &&
        css`
            width: 70px;
            height: 1em;
            ${skeletonCSS}
        `}
`

export default Content
