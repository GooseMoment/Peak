import styled, { css, keyframes } from "styled-components"

import FeatherIcon from "feather-icons-react"

const TaskCircle = ({
    completed = false,
    color = "FF4A03",
    hasDate = null,
    isInput = false,
    isLoading = false,
    onClick,
}) => {
    return (
        <Circle
            $completed={completed}
            $color={color}
            $hasDate={hasDate}
            $isInput={isInput}
            $isLoading={isLoading}
            $clickable={!isLoading && onClick}
            onClick={onClick}
        >
            {completed && <FeatherIcon icon="check" />}
        </Circle>
    )
}

const Circle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    top: ${(props) => {
        if (props.$isInput) {
            return 0.1 // optical center
        }

        if (props.$hasDate) {
            return 0.3
        }

        return null
    }}em;

    height: 1.2em;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 3px solid
        ${(props) => (props.$completed ? props.theme.grey : `#${props.$color}`)};
    position: relative;
    margin-right: 0.6em;
    font-size: 1em;

    & svg {
        width: 1em;
        height: 1em;
        stroke: ${(p) => p.theme.grey};
        stroke-width: 0.2em;
        margin-right: 0;
        top: 0;

        margin-top: 0.1rem;
        animation: none;
    }

    ${({ $isLoading }) =>
        $isLoading
            ? css`
                  border: 3px dashed
                      ${(props) =>
                          props.$completed
                              ? props.theme.grey
                              : `#${props.$color}`};
                  animation: ${rotateAnimation} 6s linear infinite;

                  & svg {
                      animation: ${reverseRotateAnimation} 6s linear infinite;
                  }
              `
            : null}

    ${(p) =>
        p.$clickable &&
        css`
            cursor: pointer;
        `}
`

const rotateAnimation = keyframes`
    100% {
        transform: rotate(360deg);
    }
`

const reverseRotateAnimation = keyframes`
    100% {
        transform: rotate(-360deg);
    }
`

export default TaskCircle
