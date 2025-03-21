import { useEffect, useState } from "react"

import styled, { css } from "styled-components"

import ModalWindow from "@components/common/ModalWindow"
import FollowList from "@components/users/FollowList"

import { User } from "@api/users.api"

import { skeletonCSS } from "@assets/skeleton"

import { useTranslation } from "react-i18next"

interface FollowsCount {
    user?: User
    isLoading?: boolean
}

const FollowsCount = ({ user, isLoading = false }: FollowsCount) => {
    const { t } = useTranslation("translation", { keyPrefix: "users" })
    const [window, setWindow] = useState<"" | "followers" | "followings">("")

    const closeModal = () => {
        setWindow("")
    }

    useEffect(() => {
        closeModal()
    }, [user])

    if (!user || isLoading) {
        return (
            <Items>
                <Item>
                    {t("followers")} <Count $loading />
                </Item>
                <Item>
                    {t("followings")} <Count $loading />
                </Item>
            </Items>
        )
    }

    return (
        <Items>
            <Item onClick={() => setWindow("followers")}>
                {t("followers")} <Count>{user.followers_count}</Count>
            </Item>
            <Item onClick={() => setWindow("followings")}>
                {t("followings")} <Count>{user.followings_count}</Count>
            </Item>
            {window !== "" && (
                <ModalWindow afterClose={closeModal}>
                    {window === "followers" && (
                        <FollowList list="followers" user={user} />
                    )}
                    {window === "followings" && (
                        <FollowList list="followings" user={user} />
                    )}
                </ModalWindow>
            )}
        </Items>
    )
}

const Items = styled.div`
    display: flex;
    gap: 1em;
`

const Item = styled.div`
    cursor: pointer;

    display: flex;
    gap: 0.5em;
`

const Count = styled.span<{ $loading?: boolean }>`
    font-weight: 700;

    ${(p) =>
        p.$loading &&
        css`
            height: 1em;
            width: 1.5em;
            ${skeletonCSS()}
        `}
`

export default FollowsCount
