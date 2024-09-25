import { useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import PageTitle from "@components/common/PageTitle"

import { getAnnouncement } from "@api/announcements.api"

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
            <div
                className="announcement_detail_content"
                dangerouslySetInnerHTML={{ __html: data.content }}
            />
        </>
    )
}

export default AnnouncementDetailPage
