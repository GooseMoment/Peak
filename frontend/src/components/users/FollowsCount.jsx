import { useEffect, useState } from "react"

import styled, { css } from "styled-components"

import ModalWindow from "@components/common/ModalWindow"
import FollowList from "@components/users/FollowList"

import { skeletonCSS } from "@assets/skeleton"

import { useTranslation } from "react-i18next"

const FollowsCount = ({ user, isPending }) => {
    const { t } = useTranslation(null, { keyPrefix: "users" })
    const [window, setWindow] = useState("")

    const closeModal = () => {
        setWindow("")
    }

    useEffect(() => {
        closeModal()
    }, [user])

    if (isPending) {
        return (
            <Items>
                <Item>
                    {t("followers")} <Count $skeleton />
                </Item>
                <Item>
                    {t("followings")} <Count $skeleton />
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

const Count = styled.span`
    font-weight: 700;

    ${(p) =>
        p.$skeleton &&
        css`
            height: 1em;
            width: 1.5em;
            ${skeletonCSS}
        `}
`

export default FollowsCount
