import { Section, SectionTitle } from "./Section"

import styled from "styled-components"

const Bio = ({bio}) => {
    return <Section>
        <SectionTitle>Bio</SectionTitle>
        <BioBox>{bio}</BioBox>
    </Section>
}

const BioBox = styled.div`
    background-color: ${p => p.theme.secondBackgroundColor};
    border-radius: 16px;

    width: 100%;
    box-sizing: border-box;
    padding: 1.25em;

    white-space: pre;
`

export default Bio
