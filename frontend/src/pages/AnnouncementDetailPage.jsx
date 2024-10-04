import { useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import PageBack from "@components/common/PageBack"
import PageTitle from "@components/common/PageTitle"

import { getAnnouncement } from "@api/announcements.api"

const AnnouncementDetailPage = () => {
    const { id } = useParams()
    const theme = useTheme()

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
            <Content
                className="markdown-body announcement_detail_content"
                dangerouslySetInnerHTML={{ __html: data.content }}
            />
        </>
    )
}

const Content = styled.div`
    background-color: ${(p) => p.theme.thirdBackgroundColor};
    padding: 1em;
    border-radius: 16px;
`

export default AnnouncementDetailPage
