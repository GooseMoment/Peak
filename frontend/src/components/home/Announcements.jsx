import { Link } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import Module, { Title } from "@components/home/Module"

import { getAnnouncements } from "@api/announcements.api"

import { useClientLocale } from "@utils/clientSettings"

const Announcements = () => {
    const locale = useClientLocale()

    const { data, isLoading } = useQuery({
        queryKey: ["announcements", "pinned_only"],
        queryFn: () => getAnnouncements(locale, true),
    })

    if (isLoading) {
        return null
    }

    return (
        <Module>
            <Title to="/app/announcements">Announcements</Title>
            {data.results?.map((item) => (
                <Announcement to={`/app/announcements/${item.id}`} key={item.id}>{item.title}</Announcement>
            ))}
        </Module>
    )
}

const Announcement = styled(Link)`
    display: block;

    border-radius: 0.5em;
    padding: 0.75em;
    margin-bottom: 0.75em;
    font-size: 0.85em;
    font-weight: 500;
    background-color: ${(p) => p.theme.thirdBackgroundColor};
    overflow-x: clip;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
`

export default Announcements
