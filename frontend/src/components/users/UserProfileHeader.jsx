import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import styled, { css, useTheme } from "styled-components"

import Button from "@components/common/Button"
import FollowButton from "@components/users/FollowButton"
import FollowsCount from "@components/users/FollowsCount"
import { getProjectColor } from "@components/project/Creates/palettes"

import useScreenType, { ifMobile, ifTablet } from "@utils/useScreenType"

import { cubicBeizer } from "@assets/keyframes"
import { skeletonBreathingCSS } from "@assets/skeleton"

import { useTranslation } from "react-i18next"

const UserProfileHeader = ({ user, followingYou, isMine, isPending }) => {
    const { t } = useTranslation(null, { keyPrefix: "users" })
    const theme = useTheme()
    const [imgLoaded, setImgLoaded] = useState(false)
    const { isDesktop } = useScreenType()

    const followButton = isMine ? (
        <Link to="/app/settings/account">
            <Button>{t("button_edit_profile")}</Button>
        </Link>
    ) : (
        <FollowButton disabled={!user} user={user} />
    )

    useEffect(() => {
        setImgLoaded(false)
    }, [user?.profile_img])

    // TODO: Edit this and Banner style.
    useEffect(() => {
        document.body.style.overflowX = "clip"
        return () => {
            document.body.style.overflowX = "unset"
        }
    }, [])

    return (
        <>
            <Banner $headerColor={getProjectColor(theme.type, user?.header_color)} />
            <OverBanner>
                {followingYou?.status === "accepted" ? (
                    <FollowsYou>{t("follows_you")}</FollowsYou>
                ) : (
                    <div />
                )}
                {!isDesktop && followButton}
            </OverBanner>
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
                {isDesktop && <ProfileButtons>{followButton}</ProfileButtons>}
            </Profile>
        </>
    )
}

const Banner = styled.div`
    background-color: ${(p) =>
        p.$headerColor ? p.$headerColor : p.theme.skeleton.defaultColor};
    height: 15em;
    width: 100%;

    transform: scale(10, 1) translateY(-5em);

    transition: background-color 0.25s ${cubicBeizer};
`

const OverBanner = styled.div`
    position: absolute;
    top: 2em;

    box-sizing: border-box;

    display: flex;
    justify-content: space-between;

    ${ifTablet} {
        width: calc(100% - 10em);
    }

    ${ifMobile} {
        width: calc(100% - 3em);
    }
`

const FollowsYou = styled.div`
    font-size: 0.75em;
    font-weight: bold;
    height: fit-content;
    width: fit-content;

    color: ${(p) => p.theme.white};
    background-color: ${(p) => p.theme.black};
    padding: 0.6em 0.75em;
    border-radius: 8px;

    overflow-x: clip;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const Profile = styled.div`
    position: relative;
    box-sizing: border-box;
    margin-top: -10em;

    display: flex;
    gap: 2em;

    ${ifTablet} {
        gap: 1em;
    }

    ${ifMobile} {
        flex-direction: column;
    }
`

const ProfileImg = styled.img`
    background-color: ${(p) => p.theme.thirdBackgroundColor};

    border-radius: 50%;
    height: 10em;
    aspect-ratio: 1/1;

    display: ${(p) => (p.$display ? "unset" : "none")};
    opacity: ${(p) => (p.$display ? 1 : 0)};

    transition: opcity 0.5s ${cubicBeizer};

    ${ifTablet} {
        height: 8em;
        width: 8em;
    }
`

const ProfileImgEmpty = styled.div`
    background-color: ${(p) => p.theme.thirdBackgroundColor};

    border-radius: 50%;
    height: 10em;
    aspect-ratio: 1/1;

    display: ${(p) => (p.$display ? "unset" : "none")};

    ${skeletonBreathingCSS}

    ${ifTablet} {
        height: 8em;
        width: 8em;
    }
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

    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const DisplayName = styled.h1`
    color: ${(p) => p.theme.white};
    text-shadow: 1px 1px 10px #000;

    margin-left: -10px;
    padding-left: 10px;

    font-weight: 700;
    font-size: 1.75em;

    max-width: 10em;
    overflow-x: clip;
    white-space: nowrap;
    text-overflow: ellipsis;

    ${ifTablet} {
        max-width: 7em;
    }

    ${ifMobile} {
        color: ${(p) => p.theme.textColor};
        text-shadow: none;
        max-width: unset;
    }

    ${(p) =>
        p.$skeleton &&
        css`
            height: 1em;
            width: 5em;
        `}
`

const Username = styled.div`
    text-shadow: 1px 1px 20px #000;

    ${ifMobile} {
        color: ${(p) => p.theme.textColor};
        text-shadow: none;
    }

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
