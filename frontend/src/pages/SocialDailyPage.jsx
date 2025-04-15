import { useState } from "react"
import { useLocation, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import PageBack from "@components/common/PageBack"
import PageTitle from "@components/common/PageTitle"
import DateBar from "@components/social/common/DateBar"
import SimpleProfile from "@components/social/common/SimpleProfile"
import LogDetails from "@components/social/logDetails/LogDetails"

import { getUserByUsername } from "@api/users.api"

const SocialDailyPage = () => {
    const { username } = useParams()
    const location = useLocation()
    const { selectedDate: receivedDate } = location.state || {}

    const {
        data: user,
        // isPending: userPending,
        // isError: userError,
    } = useQuery({
        queryKey: ["users", username.slice(1)],
        queryFn: () => getUserByUsername(username.slice(1)),
    })

    const initialDate = new Date()
    initialDate.setHours(0, 0, 0, 0)

    const [selectedDate, setSelectedDate] = useState(
        receivedDate || initialDate.toISOString(),
    )

    return (
        <Frame>
            <Header>
                <HeaderFrame>
                    {/* TODO: 뒤로가기 제대로 동작하는지 다시 확인 */}
                    <PageBack defaultTo="/app/social" />
                    <UsernameTitle>{username}</UsernameTitle>
                </HeaderFrame>

                <ProfileWrapper>
                    <SimpleProfile user={user} />
                </ProfileWrapper>
            </Header>

            <DateBar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />

            <LogDetails
                username={username.slice(1)}
                selectedDate={selectedDate}
                displayProfile={false}
            />
        </Frame>
    )
}

const Frame = styled.div`
    display: flex;
    flex-direction: column;
`

const Header = styled.div`
    width: 100%;

    display: flex;
    justify-content: space-between;
`

const HeaderFrame = styled.div`
    width: 70%;

    display: flex;
    flex-direction: column;
    justify-content: left;
`

const UsernameTitle = styled(PageTitle)`
    overflow-x: clip;
    text-overflow: ellipsis;

    white-space: nowrap;
`

const ProfileWrapper = styled.div`
    width: 50px;
`

export default SocialDailyPage
