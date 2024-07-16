import styled, { keyframes } from "styled-components"

const LoaderCircle = () => {
    return (
        <Loader/>
    )
}

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

const Loader = styled.div`
  width: 0.5em;
  height: 0.5em;
  border: 2.5px solid ${p => p.theme.textColor};
  opacity: 0.25;
  border-left-color: transparent;
  border-radius: 50%;

  animation: ${Spin} 1s linear infinite;

`

export default LoaderCircle