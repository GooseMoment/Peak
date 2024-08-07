import styled from "styled-components"

const Section = styled.section`
    position: relative;

    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};
    padding: 3em 10em;

    @media screen and (max-width: 1000px) {
        padding: 3em 2em;
    }
`
export default Section

export const SectionTitle = styled.h2`
    font-size: 1.5em;
    font-weight: 600;
`

export const SectionDescription = styled.p`
    font-size: 1em;
    margin-top: 0.75em;
`
