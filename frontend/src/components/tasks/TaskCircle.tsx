import styled, { css, keyframes, useTheme } from "styled-components"

import { type PaletteColorName } from "@assets/palettes"
import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"

interface TaskCircleProps {
    color: PaletteColorName
    isCompleted?: boolean
    hasDate?: boolean
    isInput?: boolean
    isLoading?: boolean
    onClick?: () => void
}

interface CircleProps {
    color: string
    $isCompleted: boolean
    $hasDate: boolean
    $isInput: boolean
    $isLoading: boolean
    $clickable: boolean
}

const TaskCircle = ({
    color,
    isCompleted = false,
    hasDate = false,
    isInput = false,
    isLoading = false,
    onClick,
}: TaskCircleProps) => {
    const theme = useTheme()

    return (
        <Circle
            color={getPaletteColor(theme.type, color)}
            $isCompleted={isCompleted}
            $hasDate={hasDate}
            $isInput={isInput}
            $isLoading={isLoading}
            $clickable={!isLoading && onClick != undefined}
            onClick={onClick && onClick}>
            {isCompleted && <FeatherIcon icon="check" />}
        </Circle>
    )
}

const getTopOffset = ($isInput: boolean, $hasDate: boolean) => {
    if ($isInput) return "0.05em"
    if ($hasDate) return "0.3em"
    return "0"
}

const Circle = styled.div<CircleProps>`
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    top: ${(props) => getTopOffset(props.$isInput, props.$hasDate)};
    height: 1.2em;
    aspect-ratio: 1;
    border-radius: 50%;
    margin-right: 0.6em;
    font-size: 1em;

    border: 3px ${(p) => (p.$isLoading ? "dashed" : "solid")};
    border-color: ${(p) =>
        p.$isCompleted ? p.theme.grey : (p.color ?? p.theme.goose)};

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
