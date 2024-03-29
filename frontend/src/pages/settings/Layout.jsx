import { Outlet, useLocation, useNavigate } from "react-router-dom"

import { SidebarBox } from "@components/sidebar/Sidebar"
import { ItemBox, MiddleBox } from "@components/sidebar/Middle"
import SidebarLink from "@components/sidebar/SidebarLink"
import ModalPortal from "@components/common/ModalPortal"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"
import { useRef } from "react"

const pathRoot = "/app/settings/"

const Layout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const previousPathname = useRef(location.state?.background?.pathname)

    const goPreviousOrIndex = () => {
        navigate(previousPathname.current || "/app/")
    }

    const content = <ModalFrame>
        <Sidebar>
            <MiddleBox>
                {menuItems.map(menuItem => (
                    <SidebarLink key={menuItem.to} to={pathRoot + menuItem.to}>
                        <ItemBox><FeatherIcon icon={menuItem.icon} />{menuItem.display}</ItemBox>
                    </SidebarLink>
                ))}
            </MiddleBox>
            <FooterBox>
                <SidebarLink to="/app/sign_out">
                    <ItemBox><FeatherIcon icon="log-out" />Sign out</ItemBox>
                </SidebarLink>
            </FooterBox>
        </Sidebar>
        <Main>
            <Outlet />
        </Main>
    </ModalFrame>

    return <>
        <ModalPortal closeModal={goPreviousOrIndex}>
            {content}
        </ModalPortal>
        <p>배경</p>
        {/* TODO: background skelton */}
    </>
}

const menuItems = [
    {
        icon: "user",
        display: "Account",
        to: "account",
    },
    {
        icon: "lock",
        display: "Privacy",
        to: "privacy",
    },
    {
        icon: "globe",
        display: "Languages & Region",
        to: "languages-and-region",
    },
    {
        icon: "bell",
        display: "Notifications",
        to: "notifications",
    },
    {
        icon: "sun",
        display: "Appearance",
        to: "appearance",
    },
    {
        icon: "shield",
        display: "Blocks",
        to: "blocks",
    },
]

const ModalFrame = styled.div`
    display: flex;
    overflow: hidden; // to make sidebar obey parent's radius

    background-color: white;
    width: 70vw;
    height: 70vh;

    @media screen and (max-width: 800px) {
        width: 90vw;
        height: 90vh;
    }

    border-radius: 10px;
    box-sizing: border-box;
`

const Sidebar = styled(SidebarBox)`
    position: sticky;
    z-index: unset;
    width: 16rem;
    height: 100%;
    padding-top: 1em;
    padding-bottom: 1em;

    box-sizing: border-box;
`

const FooterBox = styled(MiddleBox)`
    flex-grow: 1;
`

const Main = styled.main`
    box-sizing: border-box;
    padding: 2em;
`

export default Layout