import styled, { css, keyframes } from "styled-components"

import FeatherIcon from "feather-icons-react"

const TaskCircle = ({
    completed = false,
    color,
    hasDate = null,
    isInput = false,
    isLoading = false,
    onClick = null,
}) => {
    return (
        <Circle
            $completed={completed}
            $color={color}
            $hasDate={hasDate}
            $isInput={isInput}
            $isLoading={isLoading}
            $clickable={!isLoading && onClick}
            onClick={onClick}>
            {completed && <FeatherIcon icon="check" />}
        </Circle>
    )
}

const getTopOffset = ({ $isInput, $hasDate }) => {
    if ($isInput) return '0.05em'
    if ($hasDate) return '0.3em'
    return '0'
}

const getCircleColor = ({ $completed, $color, theme }) =>
    $completed ? theme.grey : $color ?? theme.goose

const Circle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    top: ${(props) => getTopOffset(props)};
    height: 1.2em;
    aspect-ratio: 1;
    border-radius: 50%;
    margin-right: 0.6em;
    font-size: 1em;

    border: 3px ${(p) => p.$isLoading ? "dashed" : "solid"} ${(p) => getCircleColor(p)};

    ${({ $isLoading }) =>
        $isLoading
            ? css`
                  animation: ${rotateAnimation} 6s linear infinite;

                  & svg {
                      animation: ${reverseRotateAnimation} 6s linear infinite;
                  }
              `
            : null}

    ${({ $clickable }) =>
        $clickable &&
        css`
            cursor: pointer;
        `}

    & svg {
        width: 1em;
        height: 1em;
        stroke: ${(p) => p.theme.grey};
        stroke-width: 0.2em;
        margin-right: 0;
        margin-top: 0.1rem;
        top: 0;
        animation: none;
    }
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
