import styled from "styled-components";

const ToolTip = ({ message, children }) => {
    return (
        <Container>
            {children}
            <ToolTipBox>{message}</ToolTipBox>
        </Container>
    )
}

const ToolTipBox = styled.div`
    display: none;
    z-index: 200;
    position: absolute;
    top: -10%;
    left: 50%;
    transform: translateX(-55%);

    background: #333333;
    opacity: 70%;
    padding: 0.3em 0.6em;
    font-size: 0.8em;
    color: white;
    border-radius: 5px;

    &::before {
        position: absolute;
        content: "";
        background: #333333;
        height: 0.6em;
        width: 0.7em;
        bottom: -0.3em;
        left: 50%;
        transform: translate(-50%) rotate(45deg);
    }
`
const Container = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;

  &:hover {
    ${ToolTipBox} {
      display: block;
    }
  }
`

export default ToolTip
