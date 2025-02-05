import { Link } from "react-router-dom"

import { useInfiniteQuery } from "@tanstack/react-query"
import styled from "styled-components"

import PageBack from "@components/common/PageBack"
import PageTitle from "@components/common/PageTitle"

import { getAnnouncements } from "@api/announcements.api"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"

const getPageFromURL = (url) => {
    if (!url) return null

    const u = new URL(url)
    const cursor = u.searchParams.get("page")
    return cursor
}

const AnnouncementListPage = () => {
    const locale = useClientLocale()
    const tz = useClientTimezone()

    const { data, isFetching } = useInfiniteQuery({
        queryKey: ["announcements", { locale }],
        queryFn: ({ pageParam }) => getAnnouncements(locale, false, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
        refetchOnWindowFocus: false,
    })

    if (isFetching) {
        return (
            <>
                <PageBack defaultTo="/app/home">Back to Home</PageBack>
                <PageTitle>Announcements</PageTitle>
            </>
        )
    }

    return (
        <>
            <PageBack defaultTo="/app/home">Back to Home</PageBack>
            <PageTitle>Announcements</PageTitle>
            {data.pages.map((group) =>
                group.results.map((item) => (
                    <AnnouncementBox key={item.id}>
                        <AnnouncementTitle to={`/app/announcements/${item.id}`}>
                            {item.title}
                        </AnnouncementTitle>
                        <AnnouncementDate>
                            {DateTime.fromISO(item.created_at)
                                .setLocale(locale)
                                .setZone(tz)
                                .toLocaleString(DateTime.DATETIME_SHORT)}
                        </AnnouncementDate>
                    </AnnouncementBox>
                )),
            )}
        </>
    )
}

const AnnouncementBox = styled.article`
    border-bottom: 1px solid ${(p) => p.theme.textColor};
    padding: 1em 0.5em;

    &:last-child {
        border-bottom: none;
    }
`

const AnnouncementTitle = styled(Link)`
    display: block;
    font-weight: 600;
    margin-bottom: 0.25em;

    overflow-x: clip;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const AnnouncementDate = styled.time`
    font-size: 0.75em;
`

export default AnnouncementListPage
