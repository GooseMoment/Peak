import { Section, SectionTitle } from "./Section"

import styled from "styled-components"

const Bio = ({bio}) => {
    return <Section>
        <SectionTitle>Bio</SectionTitle>
        <BioBox>{bio}</BioBox>
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
`

export default Bio
