import { useMemo } from "react"

import styled, { css } from "styled-components"

import convertNotificationToContent from "@components/notifications/convertNotificationToContent"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"

import { skeletonCSS } from "@assets/skeleton"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const Content = ({
    type,
    payload,
    actionUser,
    createdAt,
    skeleton = false,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "notifications" })
    const locale = useClientLocale()
    const tz = useClientTimezone()

    const { title, detail } = useMemo(
        () =>
            convertNotificationToContent(
                t,
                locale,
                tz,
                type,
                payload,
                actionUser,
            ),
        [t, locale, tz, type, payload, actionUser],
    )

    const datetime = DateTime.fromISO(createdAt).setLocale(locale).setZone(tz)

    return (
        <Container>
            <ContentTop>
                <ContentTitle $skeleton={skeleton}>{title}</ContentTitle>
                <label title={datetime.toLocaleString(DateTime.DATETIME_MED)}>
                    <Time $skeleton={skeleton}>{datetime.toRelative()}</Time>
                </label>
            </ContentTop>
            <ContentDetail $skeleton={skeleton}>{detail}</ContentDetail>
        </Container>
    )
}

const Container = styled.div`
    flex-grow: 20;
    position: relative;

    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: 1em;
    justify-content: center;

    width: 80%;
`

const ContentTop = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
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

const Time = styled.time`
    font-size: 0.75em;
    display: block;
    word-break: keep-all;
    white-space: nowrap;

    cursor: help;

    ${(props) =>
        props.$skeleton &&
        css`
            width: 70px;
            height: 1em;
            ${skeletonCSS}
        `}
`

const ContentDetail = styled.div`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: clip;

    ${(props) =>
        props.$skeleton &&
        css`
            width: 140px;
            height: 1em;
            ${skeletonCSS}
        `}
`

export default Content
