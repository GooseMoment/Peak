import { useEffect, useState } from "react"

import Button from "@components/common/Button"
import FollowsCount from "@components/users/FollowsCount"
import FollowButton from "@components/users/FollowButton"

import { cubicBeizer } from "@assets/keyframes"
import { skeletonBreathingCSS } from "@assets/skeleton"

import styled, { css } from "styled-components"
import { useTranslation } from "react-i18next"

const UserProfileHeader = ({ user, followingYou, isMine, isPending }) => {
    const { t } = useTranslation(null, { keyPrefix: "users" })
    const [imgLoaded, setImgLoaded] = useState(false)

    useEffect(() => {
        setImgLoaded(false)
    }, [user?.profile_img])

    return (
        <>
            <Banner $headerColor={user?.header_color} />
            {followingYou?.status === "accepted" && (
                <FollowsYou>{t("follows_you")}</FollowsYou>
            )}
            <Profile>
                <ProfileImg
                    $display={imgLoaded}
                    src={user?.profile_img}
                    onLoad={() => setImgLoaded(true)}
                />
                <ProfileImgEmpty $display={!imgLoaded} />
                <ProfileTexts>
                    <Names>
                        <DisplayName $skeleton={isPending}>
                            {user?.display_name || user?.username}
                        </DisplayName>
                        <Username $skeleton={isPending}>
                            {user && "@" + user.username}
                        </Username>
                    </Names>
                    <Datas>
                        <FollowsCount user={user} isPending={isPending} />
                    </Datas>
                </ProfileTexts>
                <ProfileButtons>
                    {isMine ? (
                        <a href="#/settings/account">
                            <Button>{t("button_edit_profile")}</Button>
                        </a>
                    ) : (
                        <FollowButton disabled={!user} user={user} />
                    )}
                </ProfileButtons>
            </Profile>
        </>
    )
}

const Banner = styled.div`
    background-color: ${(p) =>
        p.$headerColor ? "#" + p.$headerColor : p.theme.skeleton.defaultColor};
    height: 15em;
    width: 100%;

    transform: scale(10, 1) translateY(-5em);

    transition: background-color 0.25s ${cubicBeizer};
`

const FollowsYou = styled.div`
    position: absolute;
    top: 2em;

    font-size: 0.75em;
    font-weight: bold;
    width: fit-content;

    color: ${(p) => p.theme.white};
    background-color: ${(p) => p.theme.black};
    padding: 0.6em 0.75em;
    border-radius: 8px;
`

const Profile = styled.div`
    position: relative;
    box-sizing: border-box;
    margin-top: -10em;

    display: flex;
    gap: 2em;
`

const ProfileImg = styled.img`
    background-color: ${(p) => p.theme.thirdBackgroundColor};

    border-radius: 50%;
    height: 10em;
    aspect-ratio: 1/1;

    display: ${(p) => (p.$display ? "unset" : "none")};
    opacity: ${(p) => (p.$display ? 1 : 0)};

    transition: opcity 0.5s ${cubicBeizer};
`

const ProfileImgEmpty = styled.div`
    background-color: ${(p) => p.theme.thirdBackgroundColor};

    border-radius: 50%;
    height: 10em;
    aspect-ratio: 1/1;

    display: ${(p) => (p.$display ? "unset" : "none")};

    ${skeletonBreathingCSS}
`

const ProfileTexts = styled.div`
    padding: 1em 0;

    display: flex;
    flex-direction: column;
    justify-content: start;

    gap: 1.75em;

    flex-grow: 3;
`

const Names = styled.div`
    color: ${(p) => p.theme.white};
    text-shadow: 1px 1px 20px #000;

    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const DisplayName = styled.h1`
    color: ${(p) => p.theme.white};
    text-shadow: 1px 1px 10px #000;

    font-weight: 700;
    font-size: 2em;

    ${(p) =>
        p.$skeleton &&
        css`
            height: 1em;
            width: 5em;
        `}
`

const Username = styled.div`
    ${(p) =>
        p.$skeleton &&
        css`
            height: 1em;
            width: 5em;
        `}
`

const Datas = styled.div``

const ProfileButtons = styled.div`
    padding: 1.25em 0;

    display: flex;
    justify-content: flex-start;
    align-items: self-start;
`

export default UserProfileHeader
