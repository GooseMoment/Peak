import styled from "styled-components"

interface PageTitleProp {
    $color?: string
    $cursor?: string
}

const PageTitle = styled.h1<PageTitleProp>`
    font-size: 1.75em;
    font-weight: bold;
    margin-bottom: 0.5em;
    color: ${(props) => props.$color || props.theme.textColor};
    cursor: ${(props) => props.$cursor || "auto"};

    user-select: none;
    -webkit-user-drag: none;
`

export default PageTitle
