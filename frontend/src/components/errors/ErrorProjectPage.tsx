import styled from "styled-components"

export const ErrorBox = styled.div`
    display: flex;
    justify-content: center;
    font-size: 1.8em;
    font-weight: 700;
    padding: 0.6em;
    border-radius: 15px;
    margin: 1em;
    color: ${(p) => p.theme.white};
    background-color: ${(p) => p.theme.primaryColors.danger};
    cursor: pointer;

    & svg {
        top: 0;
    }
`

export const TaskErrorBox = styled(ErrorBox)`
    font-size: 1.4em;
    margin: 1em 0em;
`
