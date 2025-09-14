import { useEffect, useState } from "react"

import styled, { css } from "styled-components"

import FollowList from "@components/users/FollowList"

import { User } from "@api/users.api"

import useModal, { Portal } from "@utils/useModal"

import { skeletonCSS } from "@assets/skeleton"

import { useTranslation } from "react-i18next"

interface FollowsCount {
    user?: User
    isLoading?: boolean
}

const FollowsCount = ({ user, isLoading = false }: FollowsCount) => {
    const { t } = useTranslation("translation", { keyPrefix: "users" })
    const followModal = useModal()
    const [listType, setListType] = useState<"followers" | "followings">(
        "followers",
    )

    const openFollowModal = (type: "followers" | "followings") => {
        setListType(type)
        followModal.openModal()
    }

    useEffect(() => {
        followModal.closeModal()
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
            <Item onClick={() => openFollowModal("followers")}>
                {t("followers")} <Count>{user.followers_count}</Count>
            </Item>
            <Item onClick={() => openFollowModal("followings")}>
                {t("followings")} <Count>{user.followings_count}</Count>
            </Item>

            <Portal modal={followModal}>
                <FollowList list={listType} user={user} />
            </Portal>
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
