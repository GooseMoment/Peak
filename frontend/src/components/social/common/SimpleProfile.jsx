import { css, styled, useTheme } from "styled-components"

const SimpleProfile = ({ user, ringColor }) => {
    const theme = useTheme()

    return (
        <Profile>
            <ProfileImgWrapper $color={ringColor}>
                <img src={user.profile_img} />
            </ProfileImgWrapper>
            <Username $color={theme.textColor}>@{user.username}</Username>
        </Profile>
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

const ProfileImgWrapper = styled.div`
    aspect-ratio: 1;
    width: 3.7em;

    border-radius: 100%;
    ${(props) =>
        props.$color
            ? css`
                  outline: solid 0.2em ${(props) => props.$color};
              `
            : null}

    display: flex;
    justify-content: center;
    align-items: center;

    & svg {
        stroke: 0.5em;
    }

    & img,
    & svg {
        border-radius: 100%;
        aspect-ratio: 1;
        width: ${(props) => props.$color ? 3.3 : 3.5}em;
    }
`

const Username = styled.div`
    margin-top: auto;
    width: 100%;

    overflow-x: clip;
    text-overflow: ellipsis;

    text-align: center;
    white-space: nowrap;

    color: ${(props) => props.$color}
`

export default SimpleProfile
