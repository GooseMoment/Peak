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

export const LoaderCircleBold = styled(LoaderCircle)`
    width: 2em;
    opacity: 1;
    border-width: 3px;
`

const FullContainer = styled.div<{ $width: string; $height: string }>`
    width: ${(p) => p.$width};
    height: ${(p) => p.$height};

    box-sizing: content-box;

    display: flex;
    justify-content: center;
    align-items: center;
`

export function LoaderCircleFull({ width = "100%", height = "100%" }) {
    return (
        <FullContainer $width={width} $height={height}>
            <LoaderCircleBold />
        </FullContainer>
    )
}

export default LoaderCircle
