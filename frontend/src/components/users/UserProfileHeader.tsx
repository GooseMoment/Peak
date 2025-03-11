import { useState } from "react"
import { Link } from "react-router-dom"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import styled, { css, useTheme } from "styled-components"

import Button from "@components/common/Button"
import Confirmation from "@components/common/Confirmation"
import MildButton from "@components/common/MildButton"
import FollowButton from "@components/users/FollowButton"
import FollowsCount from "@components/users/FollowsCount"

import { getCurrentUsername } from "@api/client"
import type { Block, Following } from "@api/social"
import { deleteBlock, putBlock } from "@api/social.api"
import { type User } from "@api/users.api"

import { ifMobile, ifTablet } from "@utils/useScreenType"

import { cubicBeizer } from "@assets/keyframes"
import { Menu, MenuItem } from "@assets/menu"
import { getPaletteColor } from "@assets/palettes"
import { skeletonBreathingCSS, skeletonCSS } from "@assets/skeleton"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

interface UserProfileHeaderProp {
    user?: User
    followingYou: Following // TODO: replace object to Following
    block?: Block | null
    isMine: boolean
    isLoading: boolean
}

const UserProfileHeader = ({
    user,
    followingYou,
    block,
    isMine,
    isLoading,
}: UserProfileHeaderProp) => {
    const { t } = useTranslation("translation", { keyPrefix: "users" })
    const theme = useTheme()
    const client = useQueryClient()

    const [isBlockConfirmationOpen, setBlockConfirmationOpen] = useState(false)

    const closeConfirmation = () => {
        setBlockConfirmationOpen(false)
    }

    const blockMut = useMutation<
        Block | null,
        Error,
        { prev: boolean; user: User }
    >({
        mutationFn({ prev, user }) {
            if (prev) {
                return deleteBlock(user.username)
            }
            return putBlock(user.username)
        },
        onSuccess(_, { prev, user }) {
            const currentUsername = getCurrentUsername()
            client.invalidateQueries({ queryKey: ["blocks"] })
            client.invalidateQueries({
                queryKey: ["followings", currentUsername, user.username],
            })
            client.invalidateQueries({
                queryKey: ["followings", user.username, currentUsername],
            })
            toast.success(
                t(prev ? "success_unblock" : "success_block", {
                    username: user.username,
                }),
            )
        },
        onError(_, { prev }) {
            toast.error(t(prev ? "error_unblock" : "error_block"))
        },
        onSettled() {
            closeConfirmation()
        },
    })

    if (!user || isLoading) {
        return (
            <>
                <Banner $headerColor={getPaletteColor(theme.type, "grey")} />
                <Profile>
                    <ProfileImgSkeleton />
                    <ProfileTexts>
                        <Names>
                            <DisplayName $loading />
                            <Username $loading />
                        </Names>
                        <Datas>
                            <FollowsCount isLoading />
                        </Datas>
                    </ProfileTexts>
                </Profile>
            </>
        )
    }

    return (
        <>
            <Banner
                $headerColor={getPaletteColor(theme.type, user.header_color)}>
                {followingYou?.status === "accepted" ? (
                    <FollowsYou>{t("follows_you")}</FollowsYou>
                ) : (
                    <div />
                )}
                {isMine && (
                    <Link to="/app/settings/profile">
                        <Button>{t("button_edit_profile")}</Button>
                    </Link>
                )}
                {!isMine && (
                    <FollowButtonWrapper>
                        <FollowButton user={user} />
                        <Menu
                            align="end"
                            transition
                            menuButton={
                                <MildButton>
                                    <FeatherIcon icon="more-horizontal" />
                                </MildButton>
                            }>
                            <MenuItem
                                onClick={() => setBlockConfirmationOpen(true)}>
                                <FeatherIcon
                                    icon={block ? "x-circle" : "slash"}
                                />
                                {block
                                    ? t("button_unblock")
                                    : t("button_block")}
                            </MenuItem>
                        </Menu>
                    </FollowButtonWrapper>
                )}
            </Banner>
            <Profile>
                <ProfileImg src={user.profile_img} />
                <ProfileTexts>
                    <Names>
                        <DisplayName>
                            {user.display_name || user.username}
                        </DisplayName>
                        <Username>{"@" + user.username}</Username>
                    </Names>
                    <Datas>
                        <FollowsCount user={user} />
                    </Datas>
                </ProfileTexts>
            </Profile>
            {isBlockConfirmationOpen && (
                <Confirmation
                    question={t(
                        block ? "confirmation_unblock" : "confirmation_block",
                        {
                            username: user.username,
                        },
                    )}
                    buttons={[
                        <Button
                            state="danger"
                            key="block"
                            loading={blockMut.isPending}
                            disabled={blockMut.isPending}
                            onClick={() =>
                                blockMut.mutate({ prev: !!block, user })
                            }>
                            {block ? t("button_unblock") : t("button_block")}
                        </Button>,
                    ]}
                    onClose={closeConfirmation}
                />
            )}
        </>
    )
}

const Banner = styled.div<{ $headerColor: string }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    row-gap: 1em;

    box-sizing: border-box;
    width: 100%;
    height: 5em; // for loading state

    border-radius: 16px;
    margin-bottom: 2em;
    padding: 1em;

    background-color: ${(p) => p.$headerColor};
    transition: background-color 0.25s ${cubicBeizer};
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

const FollowButtonWrapper = styled.div`
    display: flex;
    gap: 0.5em;
    align-items: center;

    & svg {
        color: ${(p) => p.theme.textColor};
    }
`

const Profile = styled.div`
    position: relative;
    box-sizing: border-box;

    display: flex;
    gap: 2em;

    ${ifTablet} {
        gap: 1em;
    }

    ${ifMobile} {
        flex-direction: column;
    }
`

const ProfileImgStyle = css`
    background-color: ${(p) => p.theme.thirdBackgroundColor};

    border-radius: 50%;
    height: 10em;
    aspect-ratio: 1/1;

    ${ifTablet} {
        height: 8em;
        width: 8em;
    }
`

const ProfileImg = styled.img`
    ${ProfileImgStyle}
    transition: opcity 0.5s ${cubicBeizer};
`

const ProfileImgSkeleton = styled.div`
    ${ProfileImgStyle}
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

    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const DisplayName = styled.h1<{ $loading?: boolean }>`
    color: ${(p) => p.theme.textColor};
    text-shadow: none;

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
        max-width: unset;
    }

    ${(p) =>
        p.$loading &&
        css`
            height: 1em;
            width: 5em;
            ${skeletonCSS()}
        `}
`

const Username = styled.div<{ $loading?: boolean }>`
    color: ${(p) => p.theme.textColor};

    ${(p) =>
        p.$loading &&
        css`
            height: 1em;
            width: 5em;
            margin-left: -10px;
            ${skeletonCSS()}
        `}
`

const Datas = styled.div``

export default UserProfileHeader
