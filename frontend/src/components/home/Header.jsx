import { Link } from "react-router-dom"

import styled from "styled-components"

import PageTitle from "@components/common/PageTitle"

import { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"

const Header = () => {
    return (
        <Frame>
            <PageTitle>Home</PageTitle>
            <HeaderIcons>
                <Link to="/app/notifications">
                    <FeatherIcon icon="bell" />
                </Link>
                <Link to="/app/settings/account">
                    <FeatherIcon icon="settings" />
                </Link>
            </HeaderIcons>
        </Frame>
    )
}

const Frame = styled.header`
    display: flex;
    justify-content: space-between;

    margin-bottom: 1em;
`

const HeaderIcons = styled.div`
    display: none;
    margin-bottom: 0.5em;

    font-size: 1.25em;

    & svg {
        top: 0;
        margin: 0;
        padding: 0.25em 0.5em;
    }

    ${ifMobile} {
        display: flex;
    }
`

export default Header
