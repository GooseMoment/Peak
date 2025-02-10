import { useState } from "react"
import { useLocation, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import PageBack from "@components/common/PageBack"
import PageTitle from "@components/common/PageTitle"
import SimpleProfile from "@components/social/common/SimpleProfile"
import LogDetails from "@components/social/logDetails/LogDetails"

import { getUserByUsername } from "@api/users.api"

import { useTranslation } from "react-i18next"

const SocialDailyPage = () => {
    const { username } = useParams()
    const location = useLocation()
    const { selectedDate: receivedDate } = location.state || {}

    const { t } = useTranslation("", { keyPrefix: "common.header" })

    const {
        data: user,
        isPending: userPending,
        isError: userError,
    } = useQuery({
        queryKey: ["users", username],
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
                    <PageBack defaultTo="/app/social">{t("back")}</PageBack>
                    <UsernameTitle>{username}</UsernameTitle>
                </HeaderFrame>

                <ProfileWrapper>
                    <SimpleProfile user={user} />
                </ProfileWrapper>
            </Header>

            <LogDetails
                username={username.slice(1)}
                selectedDate={selectedDate}
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
    width: 20%;
`

export default SocialDailyPage
