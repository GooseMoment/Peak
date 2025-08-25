import { Link } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled, { css } from "styled-components"

import PageBack from "@components/common/PageBack"
import PageTitle from "@components/common/PageTitle"

import { getUserByUsername } from "@api/users.api"

interface DailyUserProfileProps {
    username: string
    back?: boolean
}

export default function DailyUserProfile({
    username,
    back = false,
}: DailyUserProfileProps) {
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
            <Box>
                <Texts>
                    {back && <PageBack defaultTo="/app/social" />}
                    <UsernameTitle $loading />
                    {!back && <DisplayNameSkeleton />}
                </Texts>
                <ProfileImgSkeleton />
            </Box>
        )
    }

    const userPagePath = `/app/users/@${user.username}`
    return (
        <Box>
            <Texts>
                {back && <PageBack defaultTo="/app/social" />}
                <Link to={userPagePath}>
                    <UsernameTitle $cursor="pointer">
                        {user.username}
                    </UsernameTitle>
                </Link>
                {!back && <Link to={userPagePath}>{user.display_name}</Link>}
            </Texts>
            <ProfileImgWrapper to={userPagePath}>
                <ProfileImg src={user.profile_img} />
            </ProfileImgWrapper>
        </Box>
    )
}

const Box = styled.div`
    width: 100%;

    display: flex;
    justify-content: space-between;
`

const Texts = styled.div`
    width: 70%;

    display: flex;
    flex-direction: column;
    justify-content: left;
`

const UsernameTitle = styled(PageTitle)<{ $loading?: boolean }>`
    overflow-x: clip;
    text-overflow: ellipsis;

    white-space: nowrap;

    ${(p) =>
        p.$loading &&
        css`
            width: 5em;
            height: 1.5em;
            border-radius: 7px;
            background-color: ${(p) => p.theme.skeleton.defaultColor};
        `}
`

const DisplayNameSkeleton = styled.div`
    width: 5em;
    height: 1em;
    border-radius: 7px;
    background-color: ${(p) => p.theme.skeleton.defaultColor};
`

const ProfileImgWrapper = styled(Link)`
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

const ProfileImgSkeleton = styled.div`
    width: 4rem;
    height: 4rem;
    border-radius: 100%;
    background-color: ${(p) => p.theme.skeleton.defaultColor};
`
