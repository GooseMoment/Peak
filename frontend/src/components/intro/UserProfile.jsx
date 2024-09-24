import styled from "styled-components"

import { ifMobile } from "@utils/useScreenType"

const UserProfile = ({ username, colors, profileImg }) => {
    return (
        <Profile>
            <ProfileImgBorder $colors={colors}>
                <ProfileImg src={profileImg} />
            </ProfileImgBorder>
            <ProfileName>{username}</ProfileName>
        </Profile>
    )
}

const Profile = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5em;

    align-items: center;
`

const ProfileImgBorder = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    height: 5em;
    width: 5em;
    aspect-ratio: 1/1;
    box-sizing: border-box;

    padding: 0.2em;
    background: conic-gradient(${(p) => p.$colors.join(", ")});
    background-clip: padding-box;
    border-radius: 50%;

    ${ifMobile} {
        height: 4em;
        width: 4em;
    }
`

const ProfileImg = styled.img`
    position: relative;

    height: calc(100% - 0.5em);

    padding: 0.2em;
    background-color: ${(p) => p.theme.thirdBackgroundColor};
    background-clip: padding-box;
    border-radius: 50%;
`

const ProfileName = styled.div`
    font-weight: 600;
    text-align: center;
`

export default UserProfile
