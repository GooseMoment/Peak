import { Link } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled, { css } from "styled-components"

import PageBack from "@components/common/PageBack"
import PageTitle from "@components/common/PageTitle"

import { getUserByUsername } from "@api/users.api"

interface DailyUserProfileContainerProps {
    username: string
    back?: boolean
}

export default function DailyUserProfileContainer({
    username,
    back = false,
}: DailyUserProfileContainerProps) {
    const search = new URLSearchParams(location.search)
    const from = search.get("from")

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
                    {back && <PageBack defaultTo="/app/social/${from}" />}
                    <UsernameTitle $loading />
                    {!back && <DisplayNameSkeleton />}
                </Texts>
                <ProfileImgSkeleton />
            </Box>
        )
    }

    return (
        <DailyUserProfile
            username={user.username}
            displayName={user.display_name}
            profileImg={user.profile_img}
            back={back}
        />
    )
}

interface DailyUserProfileProps {
    username: string
    displayName: string
    profileImg: string
    back?: boolean
    noLink?: boolean
}

export function DailyUserProfile({
    username,
    displayName,
    profileImg,
    back,
    noLink,
}: DailyUserProfileProps) {
    const userPagePath = noLink ? "#" : `/app/users/@${username}`
    return (
        <Box>
            <Texts>
                {back && <PageBack defaultTo={`/app/social`} />}
                <Link to={userPagePath}>
                    <UsernameTitle $cursor={noLink ? "default" : "pointer"}>
                        @{username}
                    </UsernameTitle>
                </Link>
                {!back && <Link to={userPagePath}>{displayName}</Link>}
            </Texts>
            <ProfileImgWrapper to={userPagePath}>
                <ProfileImg src={profileImg} />
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
