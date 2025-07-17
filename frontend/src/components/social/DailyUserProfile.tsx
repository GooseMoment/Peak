import { Link } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import PageBack from "@components/common/PageBack"
import PageTitle from "@components/common/PageTitle"

import { getUserByUsername } from "@api/users.api"

interface DailyUserProfileProps {
    username: string
    loading?: boolean
    back?: boolean
}

const DailyUserProfile = ({
    username,
    back = false,
}: DailyUserProfileProps) => {
    const {
        data: user,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["users", username],
        queryFn: () => getUserByUsername(username),
    })

    if (isPending || isError) {
        return (
            <Header>
                <HeaderTexts>
                    <PageBack defaultTo="/app/social" />
                </HeaderTexts>
            </Header>
        )
    }

    const userPagePath = `/app/users/@${user.username}`
    return (
        <Header>
            <HeaderTexts>
                {back && <PageBack defaultTo="/app/social" />}
                <Link to={userPagePath}>
                    <UsernameTitle $cursor="pointer">
                        {user.username}
                    </UsernameTitle>
                </Link>
                {!back && <Link to={userPagePath}>{user.display_name}</Link>}
            </HeaderTexts>
            <ProfileWrapper to={userPagePath}>
                <ProfileImg src={user.profile_img} />
            </ProfileWrapper>
        </Header>
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

const ProfileImg = styled.img`
    aspect-ratio: 1;
    width: 100%;

    border-radius: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
`

export default DailyUserProfile
