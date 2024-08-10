import { Suspense, useMemo, useState } from "react"
import { NavLink, Outlet } from "react-router-dom"

import styled, { css } from "styled-components"

import { LoaderCircleFull } from "@components/common/LoaderCircle"
import MildButton from "@components/common/MildButton"
import PageTitle from "@components/common/PageTitle"
import ConfirmationSignOut from "@components/settings/ConfirmationSignOut"

import { cubicBeizer } from "@assets/keyframes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const pathRoot = "/app/settings/"

const SettingsPage = () => {
    const { t } = useTranslation("settings", { keyPrefix: "menus" })

    const menuItems = useMemo(() => getMenuItems(t), [t])

    const [isSignOutConfirmationOpen, setSignOutConfirmationOpen] =
        useState(false)

    const openSignOutConfirmation = () => {
        setSignOutConfirmationOpen(true)
    }

    return (
        <>
            <PageTitle>{t("title")}</PageTitle>
            <MenuBox>
                {menuItems.map((menuItem) => {
                    return (
                        <Menu to={pathRoot + menuItem.to} key={menuItem.to}>
                            <FeatherIcon icon={menuItem.icon} />
                            {menuItem.display}
                        </Menu>
                    )
                })}
                <MenuSignOut onClick={openSignOutConfirmation} key="sign-out">
                    <FeatherIcon icon="log-out" />
                    {t("sign_out")}
                </MenuSignOut>
            </MenuBox>
            <Suspense fallback={<LoaderCircleFull />}>
                <Outlet />
            </Suspense>
            {isSignOutConfirmationOpen && (
                <ConfirmationSignOut
                    onClose={() => setSignOutConfirmationOpen(false)}
                />
            )}
        </>
    )
}

const getMenuItems = (t) => [
    {
        icon: "user",
        display: t("account"),
        to: "account",
    },
    {
        icon: "settings",
        display: t("general"),
        to: "general",
    },
    {
        icon: "lock",
        display: t("privacy"),
        to: "privacy",
    },
    {
        icon: "globe",
        display: t("languages_and_time"),
        to: "languages-and-time",
    },
    {
        icon: "bell",
        display: t("notifications"),
        to: "notifications",
    },
    {
        icon: "sun",
        display: t("appearance"),
        to: "appearance",
    },
    {
        icon: "heart",
        display: t("reactions"),
        to: "reactions",
    },
    {
        icon: "shield",
        display: t("blocks"),
        to: "blocks",
    },
    {
        icon: "info",
        display: t("info"),
        to: "info",
    },
]

const MenuBox = styled.div`
    display: flex;
    flex-wrap: wrap;

    gap: 0.5em;

    margin-bottom: 2em;
`

const menuStyle = css`
    border: 1.5px solid ${(p) => p.theme.textColor};
    border-radius: 16px;
    padding: 0.5em 0.75em;

    font-weight: 500;

    transition: background-color 0.15s ${cubicBeizer};
`

const Menu = styled(NavLink)`
    ${menuStyle}

    &:hover {
        background-color: ${(p) => p.theme.secondBackgroundColor};
    }

    &.active {
        color: ${(p) => p.theme.black};
        background-color: ${(p) => p.theme.primaryColors.success};
    }
`

const MenuSignOut = styled(MildButton)`
    ${menuStyle}

    border-color: ${(p) => p.theme.primaryColors.danger};

    color: ${(p) => p.theme.primaryColors.danger};

    &:hover {
        background-color: ${(p) => p.theme.secondBackgroundColor};
    }
`

export default SettingsPage