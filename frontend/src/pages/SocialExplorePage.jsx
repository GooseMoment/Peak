import { useState } from "react"
import { Link } from "react-router-dom";

import SocialCalendar from "@/components/social/SocialCalendar";
import styled from "styled-components"

const SocialExplorePage = () => {
    const [activeFilter, setActiveFilter] = useState("all")

    return <>

    <PageTitle>
        <PageTitleButton to="/social/explore"> Explore </PageTitleButton>
        <PageTitleButton to="/social/following" style={{color: "#A4A4A4"}}> Following </PageTitleButton>
    </PageTitle>
    
    <SocialCalendar />

    </>
}

const PageTitle = styled.h1`
`

const PageTitleButton = styled(Link)`
display: inline-block;
font-size: 2em;
font-weight: bold;
color: black;
text-decoration: none;
margin-bottom: 0.5em;
margin-right: 0.7em;
`

export default SocialExplorePage