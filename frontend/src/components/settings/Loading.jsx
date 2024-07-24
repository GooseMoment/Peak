import styled, { keyframes } from "styled-components"

const Loading = () => {
    return <Container>
        <DotSpinner>
            {[...Array(8)].map((e, i) => <DotSpinnerDot key={i} />)}
        </DotSpinner>
    </Container>
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;
`

const pulse = keyframes`
    0%, 100% {
        transform: scale(0);
        opacity: 0.5;
    }

    50% {
        transform: scale(1);
        opacity: 1;
    }
`

const uibSize = "2.8rem"
const uibSpeed = ".9s"

const DotSpinner = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: ${uibSize};
    width: ${uibSize};  
`

const DotSpinnerDot = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    width: 100%;

    &::before {
        content: '';
        height: 20%;
        width: 20%;
        border-radius: 50%;
        background-color: ${p => p.theme.accentColor};
        transform: scale(0);
        opacity: 0.5;
        animation: ${pulse} calc(${uibSpeed} * 1.111) ease-in-out infinite;
    }

    &:nth-child(2) {
        transform: rotate(45deg);

        &::before {
            animation-delay: calc(${uibSpeed} * -0.875);
        }
    }

    &:nth-child(3) {
        transform: rotate(90deg);

        &::before {
            animation-delay: calc(${uibSpeed} * -0.75);
        }
    }

    &:nth-child(4) {
        transform: rotate(135deg);

        &::before {
            animation-delay: calc(${uibSpeed} * -0.625);
        }
    }

    &:nth-child(5) {
        transform: rotate(180deg);

        &::before {
            animation-delay: calc(${uibSpeed} * -0.5);
        }
    }

    &:nth-child(6) {
        transform: rotate(225deg);

        &::before {
            animation-delay: calc(${uibSpeed} * -0.375);
        }
    }

    &:nth-child(7) {
        transform: rotate(270deg);

        &::before {
            animation-delay: calc(${uibSpeed} * -0.25);
        }
    }

    &:nth-child(8) {
        transform: rotate(315deg);

        &::before {
            animation-delay: calc(${uibSpeed} * -0.125);
        }
    }
`

export default Loading
