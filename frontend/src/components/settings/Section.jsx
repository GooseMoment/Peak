import styled from "styled-components"

const Section = styled.section`
    margin-top: 2em;

    &::after {
        display: block;
        height: 0;
        content: " ";
        clear: both;
    }
`

export const Name = styled.h2`
    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
`

export const Description = styled.span`
    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;

    display: block;
    margin-top: 1em;
    font-weight: 400;
    font-size: 0.8em;
    line-height: 140%;
    color: grey;
`

export const Value = styled.div`
    margin-top: 1.5em;
`

export default Section
