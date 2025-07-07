import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import PageBack from "@components/common/PageBack"
import PageTitle from "@components/common/PageTitle"
import DateBar from "@components/social/common/DateBar"
import { SimpleProfileImg } from "@components/social/common/SimpleProfile"
import LogDetails from "@components/social/logDetails/LogDetails"

import { getUserByUsername } from "@api/users.api"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const SocialDailyPage = () => {
    const navigate = useNavigate()
    const { username: usernameWithAt } = useParams()
    const location = useLocation()
    const { selectedDate: receivedDate } = location.state || {}
    const { t } = useTranslation("translation")

    useEffect(() => {
        if (usernameWithAt!.at(0) !== "@") {
            navigate("/app/social/daily/@" + usernameWithAt)
        }
    }, [usernameWithAt, navigate])

    const username = usernameWithAt!.slice(1)

    const {
        data: user,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["users", username],
        queryFn: () => getUserByUsername(username),
    })

    useEffect(() => {
        if (isError) {
            toast.error(t("common.error_load"))
        }
    }, [isError])

    const [selectedDate, setSelectedDate] = useState(
        receivedDate ||
            DateTime.now()
                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                .toISO(),
    )

    if (isPending || isError) {
        return (
            <>
                <Header>
                    <HeaderTexts>
                        <PageBack defaultTo="/app/social" />
                    </HeaderTexts>
                </Header>

                <LoaderCircleFull />
            </>
        )
    }

    const userPagePath = `/app/users/@${user.username}`

    return (
        <>
            <Header>
                <HeaderTexts>
                    <PageBack defaultTo="/app/social" />
                    <Link to={userPagePath}>
                        <UsernameTitle $cursor="pointer">
                            {user.username}
                        </UsernameTitle>
                    </Link>
                </HeaderTexts>

                <ProfileWrapper to={userPagePath}>
                    <SimpleProfileImg src={user.profile_img} />
                </ProfileWrapper>
            </Header>

            <DateBar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />

            <LogDetails
                username={user.username}
                selectedDate={selectedDate}
                displayProfile={false}
            />
        </>
    )
}

const Header = styled.div`
    width: 100%;

    display: flex;
    justify-content: space-between;
`

const HeaderTexts = styled.div`
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

const ProfileWrapper = styled(Link)`
    width: 4rem;
`

export default SocialDailyPage
