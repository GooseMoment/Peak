import styled from "styled-components"

import { ifMobile } from "@utils/useScreenType"

export const Section = styled.section`
    position: relative;
    margin: 3em 0;
`

export const SectionTitle = styled.h2`
    font-size: 1em;
    font-weight: 600;

    margin-left: 1.25em;
    margin-bottom: 1em;

    ${ifMobile} {
        margin-left: 0.5em;
    }
`
