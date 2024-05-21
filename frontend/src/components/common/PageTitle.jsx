import styled from "styled-components"

const PageTitle = styled.h1`
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 0.5em;
    color: ${props => props.$color || props.theme.textColor};
    cursor: ${props => props.$cursor || "auto"};
`

export default PageTitle