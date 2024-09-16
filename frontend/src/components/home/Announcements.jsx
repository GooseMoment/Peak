import styled from "styled-components"

import Module, { Title } from "@components/home/Module"

const mockData = [
    {
        id: "1",
        title: "Introducing Repeat",
    },
    {
        id: "2",
        title: "Server Maintenance will be held at May 15th",
    },
]

const Announcements = () => {
    const data = mockData

    return (
        <Module>
            <Title to="/app/announcements">Announcements</Title>
            {data?.map((item) => (
                <Announcement key={item.id}>{item.title}</Announcement>
            ))}
        </Module>
    )
}

const Announcement = styled.div`
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
