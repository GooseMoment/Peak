import { useMemo } from "react"
import { Outlet } from "react-router-dom"

import styled from "styled-components"

import { ItemBox, MiddleBox } from "@components/sidebar/Middle"
import { SidebarBox } from "@components/sidebar/Sidebar"
import SidebarLink from "@components/sidebar/SidebarLink"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const pathRoot = "/app/settings/"

const Layout = () => {
    const { t } = useTranslation("", { keyPrefix: "settings.sidebar" })

    const menuItems = useMemo(() => getMenuItems(t), [t])

    return (
        <>
            <Sidebar>
                <MiddleBox>
                    {menuItems.map((menuItem) => (
                        <SidebarLink
                            key={menuItem.to}
                            to={pathRoot + menuItem.to}
                        >
                            <ItemBox>
                                <FeatherIcon icon={menuItem.icon} />
                                {menuItem.display}
                            </ItemBox>
                        </SidebarLink>
                    ))}
                </MiddleBox>
                <FooterBox>
                    <SidebarLink to="/app/sign_out">
                        <ItemBox>
                            <FeatherIcon icon="log-out" />
                            {t("sign_out")}
                        </ItemBox>
                    </SidebarLink>
                </FooterBox>
            </Sidebar>
            <Main>
                <Outlet />
            </Main>
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

const ModalFrame = styled.div`
    display: flex;
    overflow: hidden; // to make sidebar obey parent's radius

    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};
    height: 70vh;

    @media screen and (max-width: 800px) {
        width: 90vw;
        height: 90vh;
    }

    border-radius: 10px;
    box-sizing: border-box;
`

const Sidebar = styled(SidebarBox)`
    overflow-y: auto;

    position: sticky;
    z-index: unset;
    width: 14rem;
    height: 100%;
    padding-top: 1em;
    padding-bottom: 1em;

    box-sizing: border-box;
`

const FooterBox = styled(MiddleBox)`
    flex-grow: 1;
`

const Main = styled.main`
    overflow-y: auto;

    box-sizing: border-box;
    padding: 2em;
    width: 32rem;
`

export default Layout
