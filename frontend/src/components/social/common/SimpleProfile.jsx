import { css, styled } from "styled-components"

const SimpleProfile = ({ user, ringColor }) => {
    return (
        <Profile>
            <ProfileImgWrapper $color={ringColor}>
                <img src={user.profile_img} />
            </ProfileImgWrapper>
            <Username>@{user.username}</Username>
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
    gap: 0.3em;
`

const ProfileImgWrapper = styled.div`
    height: 3.7em;

    & img {
    }

    & svg {
        stroke: 1em;
    }

    & img,
    & svg {
        border-radius: 100%;

        width: 3.4em;
        height: 3.4em;

        ${(props) =>
            props.$color
                ? css`
                      /* border: solid 0.2em #fefdfc; */
                      /* 0 0 0 0.2em #fefdfc, */
                      box-shadow: 0 0 0 0.2em #fefdfc, 0 0 0 0.4em ${(props) => props.$color};
                  `
                : null}
    }
`

const Username = styled.div`
    width: 100%;

    overflow-x: clip;
    text-overflow: ellipsis;

    text-align: center;
    white-space: nowrap;
`

export default SimpleProfile
