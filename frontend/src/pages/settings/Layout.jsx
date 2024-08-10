import { useMemo } from "react"
import { NavLink, Outlet } from "react-router-dom"

import styled from "styled-components"

import PageTitle from "@components/common/PageTitle"

import { cubicBeizer } from "@assets/keyframes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const pathRoot = "/app/settings/"

const Layout = () => {
    const { t } = useTranslation("", { keyPrefix: "settings.sidebar" })

    const menuItems = useMemo(() => getMenuItems(t), [t])

    return (
        <>
            <PageTitle>설정</PageTitle>
            <MenuBox>
                {menuItems.map((menuItem) => {
                    return (
                        <Menu to={pathRoot + menuItem.to} key={menuItem.to}>
                            <FeatherIcon icon={menuItem.icon} />
                            {menuItem.display}
                        </Menu>
                    )
                })}
            </MenuBox>
            <Outlet />
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

const Menu = styled(NavLink)`
    width: fit-content;
    border: 1px solid ${(p) => p.theme.textColor};
    border-radius: 16px;
    padding: 0.5em 0.75em;

    transition: background-color 0.15s ${cubicBeizer};

    &:hover {
        background-color: ${(p) => p.theme.secondBackgroundColor};
    }

    &.active {
        color: ${(p) => p.theme.black};
        background-color: ${(p) => p.theme.primaryColors.success};
    }
`

export default Layout
