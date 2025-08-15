import { ReactNode } from "react"
import { Link } from "react-router-dom"

import styled, { css } from "styled-components"

import FollowButton from "@components/users/FollowButton"

import { getCurrentUsername } from "@api/client"
import { User } from "@api/users.api"

import { skeletonCSS } from "@assets/skeleton"

interface ListUserProfileProp {
    user?: User
    children?: ReactNode
}

const ListUserProfile = ({ user, children }: ListUserProfileProp) => {
    if (!user) {
        return (
            <UserContainer>
                <Profile>
                    <ProfileImgSkeleton />
                    <Username $loading />
                </Profile>
            </UserContainer>
        )
    }

    return (
        <UserContainer>
            <Profile>
                <ProfileImg src={user.profile_img} />
                <Link to={`/app/users/@${user.username}`}>
                    <Username>@{user?.username}</Username>
                </Link>
            </Profile>
            <div>
                {children ||
                    (user.username !== getCurrentUsername() && (
                        <FollowButton username={user.username} />
                    ))}
            </div>
        </UserContainer>
    )
}

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 1em;
    border-bottom: 1px ${(p) => p.theme.grey} solid;

    &:last-of-type {
        border-bottom-width: 0px;
    }
`

const Profile = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;
`

const ProfileImg = styled.img`
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    width: 3em;
`

const ProfileImgSkeleton = styled.div`
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    width: 3em;

    ${skeletonCSS()}
`

const Username = styled.div<{ $loading?: boolean }>`
    font-weight: 600;
    color: ${(p) => p.theme.textColor};

    width: 7.5em;
    white-space: nowrap;
    overflow-x: clip;
    text-overflow: ellipsis;

    ${(p) =>
        p.$loading &&
        css`
            height: 1em;
            width: 5em;
            ${skeletonCSS()}
        `}
`

export default ListUserProfile
