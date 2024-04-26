import { Link } from "react-router-dom";
import styled from "styled-components";

import PageTitle from "@components/common/PageTitle";

const SocialPageTitle = ({active}) => {

    if (active === "following")
        return <StyledPageTitle>
            <PageTitleButton to="../following">Following</PageTitleButton>
            <PageTitleButton to="../explore" $color="#A4A4A4">Explore</PageTitleButton>
        </StyledPageTitle>

    return <StyledPageTitle>
        <PageTitleButton to="../explore">Explore</PageTitleButton>
        <PageTitleButton to="../following" $color="#A4A4A4">Following</PageTitleButton>
    </StyledPageTitle>

}

const StyledPageTitle = styled(PageTitle)`
    white-space: nowrap;
`

const PageTitleButton = styled(Link)`
    display: inline-block;
    margin-bottom: 0.5em;
    margin-right: 0.7em;

    white-space: nowrap;
    color: ${props => props.$color || "black"};
    font-size: 1em;
    font-weight: bold;
    text-decoration: none;
`

export default SocialPageTitle