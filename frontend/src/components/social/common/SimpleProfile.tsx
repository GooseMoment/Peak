import { Link } from "react-router-dom"

import { styled } from "styled-components"

import { User } from "@api/users.api"

interface SimpleProfileProp {
    user: User
}

const SimpleProfile = ({ user }: SimpleProfileProp) => {
    if (!user) {
        return null
    }

    return (
        <Profile to={`/app/users/@${user.username}`}>
            <SimpleProfileImg $ratio={75} src={user.profile_img} />
            <Username>@{user.username}</Username>
        </Profile>
    )
}

const Profile = styled(Link)`
    height: 5em;
    width: 5em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const SimpleProfileImg = styled.img<{ $ratio?: number }>`
    aspect-ratio: 1;
    width: ${(props) => (props.$ratio === undefined ? 100 : props.$ratio)}%;

    border-radius: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
`

const Username = styled.div`
    margin-top: auto;
    width: 100%;

    overflow-x: clip;
    text-overflow: ellipsis;

    text-align: center;
    white-space: nowrap;

    color: ${(p) => p.theme.textColor};
`

export default SimpleProfile
