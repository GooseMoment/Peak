import { useState } from "react"

import styled from "styled-components"

import SocialCalendar from "@components/social/SocialCalendar"
import SocialPageTitle from "@components/social/SocialPageTitle"

const SocialExplorePage = () => {
    const [activeFilter, setActiveFilter] = useState("all")

    return (
        <>
            <SocialPageTitle active="explore" />

            <SocialCalendar />
        </>
    )
}

export default SocialExplorePage
