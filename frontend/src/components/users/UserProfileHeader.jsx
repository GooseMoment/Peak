import { useEffect, useState } from "react"

import Button from "@components/common/Button"
import FollowsCount from "@components/users/FollowsCount"
import FollowButton from "@components/users/FollowButton"

import { cubicBeizer } from "@assets/keyframes"
import { skeletonBreathingCSS } from "@assets/skeleton"

import styled, { css } from "styled-components"
import { useTranslation } from "react-i18next"

const UserProfileHeader = ({user, isMine, isPending}) => {
    const { t } = useTranslation(null, {keyPrefix: "users"})
    const [imgLoaded, setImgLoaded] = useState(false)

    useEffect(() => {
        setImgLoaded(false)
    }, [user?.profile_img])

    return <>
        <Banner $headerColor={user?.header_color} />
        <Profile>
            <ProfileImg $display={imgLoaded} src={user?.profile_img} onLoad={() => setImgLoaded(true)} />
            <ProfileImgEmpty $display={!imgLoaded} />
            <ProfileTexts>
                <Names>
                    <DisplayName $skeleton={isPending}>{user?.display_name || user?.username}</DisplayName>
                    <Username $skeleton={isPending}>{user && "@" + user.username}</Username>
                </Names>
                <Datas>
                    <FollowsCount user={user} isPending={isPending} />
                </Datas>
            </ProfileTexts>
            <ProfileButtons>
                {isMine ? 
                    <a href="#/settings/account"><Button>{t("button_edit_profile")}</Button></a> : <FollowButton disabled={!user} user={user} /> 
                }
            </ProfileButtons>
        </Profile>
    </>

}

const Banner = styled.div`
    background-color: ${p => p.$headerColor ? "#" + p.$headerColor : p.theme.skeleton.defaultColor};
    height: 15em;
    width: 100vw;
    margin: -3em -10em;

    transition: background-color 0.25s ${cubicBeizer};
`

const Profile = styled.div`
    position: relative;
    box-sizing: border-box;
    margin-top: -5em;

    display: flex;
    gap: 2em;
`

const ProfileImg = styled.img`
    background-color: ${p => p.theme.thirdBackgroundColor};

    border-radius: 50%;
    height: 10em;
    aspect-ratio: 1/1;

    display: ${p => p.$display ? "unset" : "none"};
    opacity: ${p => p.$display ? 1 : 0};

    transition: opcity 0.5s ${cubicBeizer};
`

const ProfileImgEmpty = styled.div`
    background-color: ${p => p.theme.thirdBackgroundColor};

    border-radius: 50%;
    height: 10em;
    aspect-ratio: 1/1;

    display: ${p => p.$display ? "unset" : "none"};

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
    color: ${p => p.theme.white};
    text-shadow: 1px 1px 20px #000;

    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const DisplayName = styled.h1`
    color: ${p => p.theme.white};
    text-shadow: 1px 1px 10px #000;

    font-weight: 700;
    font-size: 2em;

    ${p => p.$skeleton && css`
        height: 1em;
        width: 5em;
    `}
`

const Username = styled.div`
    ${p => p.$skeleton && css`
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
