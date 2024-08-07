import { useMemo } from "react"

import styled, { css } from "styled-components"

import convertNotificationToContent from "@components/notifications/convertNotificationToContent"

import { skeletonCSS } from "@assets/skeleton"

import { useTranslation } from "react-i18next"

const Content = ({ type, payload, actionUser, skeleton = false }) => {
    const { t } = useTranslation(null, { keyPrefix: "notifications" })
    const { title, detail } = useMemo(
        () => convertNotificationToContent(t, type, payload, actionUser),
        [t, type, payload, actionUser],
    )

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
    overflow-x: clip;
    white-space: nowrap;

    ${(props) =>
        props.$skeleton &&
        css`
            width: 140px;
            height: 1em;
            ${skeletonCSS}
        `}
`

export default Content
