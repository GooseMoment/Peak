import { styled } from "styled-components"

export const SimpleProfileImg = styled.img<{ $ratio?: number }>`
    aspect-ratio: 1;
    width: ${(props) => (props.$ratio === undefined ? 100 : props.$ratio)}%;

    border-radius: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
`
