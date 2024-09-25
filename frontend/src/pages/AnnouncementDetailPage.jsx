import { useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import PageTitle from "@components/common/PageTitle"

import { getAnnouncement } from "@api/announcements.api"
import styled from "styled-components"

const AnnouncementDetailPage = () => {
    const { id } = useParams()

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
            <PageTitle>{data.title}</PageTitle>
            <Content
                className="announcement_detail_content"
                dangerouslySetInnerHTML={{ __html: data.content }}
            />
        </>
    )
}

const Content = styled.div`
    background-color: ${p => p.theme.thirdBackgroundColor};
    padding: 1em;
    border-radius: 16px;
`

export default AnnouncementDetailPage
