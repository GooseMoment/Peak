import { Link } from "react-router-dom"

import styled from "styled-components"
import FollowButton from "@components/users/FollowButton"

const ListUserProfile = ({user, children}) => {
    return <UserContainer>
        <Profile>
            <ProfileImg src={user?.profile_img} />
            <Link to={`/app/users/@${user?.username}`}>
                <Username>@{user?.username}</Username>
            </Link> 
        </Profile>
        <div>
            {children || <FollowButton user={user} />}
        </div>
    </UserContainer>
}

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 1em;
    border-bottom: 1px ${p => p.theme.grey} solid;

    &:last-child {
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

const Username = styled.div`
    font-weight: 600;
    color: ${p => p.theme.textColor};
`

export default ListUserProfile
