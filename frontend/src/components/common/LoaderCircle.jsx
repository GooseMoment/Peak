import styled, { keyframes } from "styled-components"

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`

const LoaderCircle = styled.div`
    aspect-ratio: 1/1;
    width: 0.5em;

    border: 2.5px solid ${(p) => p.theme.textColor};
    opacity: 0.25;
    border-left-color: transparent;
    border-radius: 50%;

    animation: ${spin} 1s linear infinite;
`

export default LoaderCircle
