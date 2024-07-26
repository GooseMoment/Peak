import { Section, SectionTitle } from "./Section"

import styled, { css } from "styled-components"

const Bio = ({bio, isMine}) => {
    return <Section>
        <SectionTitle>Bio</SectionTitle>
        <BioBox $empty={!bio}>
            {bio || (isMine ? "Click 'Edit Profile' to write your bio!" : "Empty here")}
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
`

export default Bio
