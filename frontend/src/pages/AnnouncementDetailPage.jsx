import { useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import HeartButton from "@components/announcements/HeartButton"
import { LoaderCircleFull } from "@components/common/LoaderCircle"
import PageBack from "@components/common/PageBack"
import PageTitle from "@components/common/PageTitle"

import { getAnnouncement } from "@api/announcements.api"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"

const AnnouncementDetailPage = () => {
    const { id } = useParams()
    const theme = useTheme()
    const tz = useClientTimezone()
    const locale = useClientLocale()

    if (theme.type === "light") {
        import("github-markdown-css/github-markdown-light.css")
    } else if (theme.type === "dark") {
        import("github-markdown-css/github-markdown-dark.css")
    } else {
        import("github-markdown-css/github-markdown.css")
    }

    const { data, isLoading } = useQuery({
        queryKey: ["announcements", id],
        queryFn: () => getAnnouncement(id),
        refetchOnWindowFocus: false,
    })

    if (isLoading) {
        return <LoaderCircleFull />
    }

    return (
        <>
            <PageBack defaultTo="/app/announcements">Back to the list</PageBack>
            <PageTitle>{data.title}</PageTitle>
            <ContentDate>
                {DateTime.fromISO(data.created_at)
                    .setLocale(locale)
                    .setZone(tz)
                    .toLocaleString()}
            </ContentDate>
            <Content
                className="markdown-body announcement_detail_content"
                dangerouslySetInnerHTML={{ __html: data.content }}
            />
            <HeartButton announcement={data} />
        </>
    )
}

const ContentDate = styled.time`
    display: block;
    font-size: 0.75em;
    margin-bottom: 1em;
`

const Content = styled.div`
    background-color: ${(p) => p.theme.thirdBackgroundColor};
    padding: 1em;
    border-radius: 16px;
`

export default AnnouncementDetailPage
