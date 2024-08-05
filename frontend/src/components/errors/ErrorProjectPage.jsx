import styled from "styled-components"

export const ErrorBox = styled.div`
    display: flex;
    justify-content: center;
    font-size: ${p => p.$isTasks ? '1.4' : '1.8'}em;
    font-weight: 700;
    padding: 0.6em;
    border-radius: 15px;
    margin: ${p => p.$isTasks ? '1em 0em' : '0em 0em 1em'};
    background-color: ${p=>p.theme.primaryColors.danger};
    cursor: pointer;
`