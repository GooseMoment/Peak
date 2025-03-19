import { styled } from "styled-components"

const SimpleProfile = ({ user, showUsername = false }) => {
    return user && showUsername ? (
        <Profile>
            <ProfileImg $ratio={75} src={user?.profile_img} />
            <Username>@{user?.username}</Username>
        </Profile>
    ) : (
        <ProfileImg $ratio={100} src={user?.profile_img} />
    )
}

const Profile = styled.div`
    height: 5em;
    width: 5em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const ProfileImg = styled.img`
    aspect-ratio: 1;
    width: ${(props) => props.$ratio}%;

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
