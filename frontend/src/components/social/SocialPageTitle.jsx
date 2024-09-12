import { useNavigate } from "react-router-dom"

import styled, { useTheme } from "styled-components"

import PageTitle from "@components/common/PageTitle"

const SocialPageTitle = ({ active }) => {
    const theme = useTheme()

    if (active === "following")
        return (
            <PageTitleGroup>
                <PageTitleButton to="../following">Following</PageTitleButton>
                <PageTitleButton to="../explore" $color={theme.secondTextColor}>
                    Explore
                </PageTitleButton>
            </PageTitleGroup>
        )

    return (
        <PageTitleGroup>
            <PageTitleButton to="../explore">Explore</PageTitleButton>
            <PageTitleButton to="../following" $color={theme.secondTextColor}>
                Following
            </PageTitleButton>
        </PageTitleGroup>
    )
}

const PageTitleGroup = styled.div`
    display: flex;
    gap: 0.7em;
    user-select: none;
`

const PageTitleButton = ({ $color, to, children }) => {
    const navigate = useNavigate()
    return (
        <PageTitle
            $cursor="pointer"
            $color={$color}
            onClick={() => navigate(to)}
        >
            {children}
        </PageTitle>
    )
}

export default SocialPageTitle
