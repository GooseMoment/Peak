import { Link } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import PageTitle from "@components/common/PageTitle"

import { getMe } from "@api/users.api"

import { ifMobile } from "@utils/useScreenType"

import { skeletonBreathingCSS } from "@assets/skeleton"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Header = () => {
    const { data: me, isFetching } = useQuery({
        queryKey: ["users", "me"],
        queryFn: () => getMe(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    const { t } = useTranslation("home", { keyPrefix: "page" })

    return (
        <Frame>
            <PageTitle>{t("title")}</PageTitle>
            <HeaderIcons>
                {isFetching ? (
                    <HeaderProfileLoading />
                ) : (
                    <Link to={`/app/users/@${me.username}`}>
                        <HeaderProfile src={me.profile_img} />
                    </Link>
                )}
                <Link to="/app/notifications">
                    <FeatherIcon icon="bell" />
                </Link>
                <Link to="/app/settings/profile">
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

const HeaderProfile = styled.img`
    aspect-ratio: 1/1;
    height: 1.5em;
    width: 1.5em;
    border-radius: 50%;
    padding: 0 0.25em;
`

const HeaderProfileLoading = styled.div`
    aspect-ratio: 1/1;
    height: 1.5em;
    width: 1.5em;
    border-radius: 50%;
    margin: 0 0.25em;
    box-sizing: border-box;

    ${skeletonBreathingCSS}
`

export default Header
