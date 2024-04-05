import { Link } from "react-router-dom";
import styled from "styled-components";

import PageTitle from "@components/common/PageTitle";

const SocialPageTitle = ({active}) => {

    if (active === "following")
        return <PageTitle>
            <PageTitleButton to="../following">Following</PageTitleButton>
            <PageTitleButton to="../explore" $color="#A4A4A4">Explore</PageTitleButton>
        </PageTitle>

    return <PageTitle>
        <PageTitleButton to="../explore">Explore</PageTitleButton>
        <PageTitleButton to="../following" $color="#A4A4A4">Following</PageTitleButton>
    </PageTitle>

}

const PageTitleButton = styled(Link)`
    display: inline-block;
    font-size: 1em;
    font-weight: bold;
    color: ${props => props.$color || "black"};
    text-decoration: none;
    margin-bottom: 0.5em;
    margin-right: 0.7em;
`

export default SocialPageTitle