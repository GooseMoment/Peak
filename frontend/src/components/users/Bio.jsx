import { Section, SectionTitle } from "./Section"
import { skeletonBreathingCSS } from "@assets/skeleton"

import styled, { css } from "styled-components"

const Bio = ({bio, isMine, isPending}) => {
    return <Section>
        <SectionTitle>Bio</SectionTitle>
        <BioBox $empty={!bio} $skeleton={isPending}>
            {
                isPending && " " ||
                bio ||
                (isMine ? "Click 'Edit Profile' to write your bio!" : "Empty here")
            }
        </BioBox>
    </Section>
}

const BioBox = styled.div`
    background-color: ${p => p.theme.thirdBackgroundColor};
    border-radius: 16px;

    line-height: 1.5em;

    width: 100%;
    box-sizing: border-box;
    padding: 1.25em;

    white-space: pre-wrap;

    ${p => p.$empty && css`
        font-style: italic;
        color: ${p => p.theme.grey};
    `}

    ${p => p.$skeleton && css`
        height: 5em;
        ${skeletonBreathingCSS}
    `}
`

export default Bio
