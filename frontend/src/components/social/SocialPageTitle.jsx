import { useNavigate } from "react-router-dom"

import styled, { useTheme } from "styled-components"

import PageTitle from "@components/common/PageTitle"

import { useTranslation } from "react-i18next"

const SocialPageTitle = ({ active }) => {
    const theme = useTheme()
    const { t } = useTranslation("", { keyPrefix: "social" })

    if (active === "following")
        return (
            <PageTitleGroup>
                <PageTitleButton to="../following">
                    {t("following_title")}
                </PageTitleButton>
                <PageTitleButton to="../explore" $color={theme.secondTextColor}>
                    {t("explore_title")}
                </PageTitleButton>
            </PageTitleGroup>
        )

    return (
        <PageTitleGroup>
            <PageTitleButton to="../explore">
                {t("explore_title")}
            </PageTitleButton>
            <PageTitleButton to="../following" $color={theme.secondTextColor}>
                {t("following_title")}
            </PageTitleButton>
        </PageTitleGroup>
    )
}

const PageTitleGroup = styled.div`
    display: flex;
    gap: 0.7em;
    user-select: none;
    -webkit-user-select: none;
`

const PageTitleButton = ({ $color, to, children }) => {
    const navigate = useNavigate()
    return (
        <PageTitle
            $cursor="pointer"
            $color={$color}
            onClick={() => navigate(to)}>
            {children}
        </PageTitle>
    )
}

export default SocialPageTitle
