import styled, { css } from "styled-components"

import { type Drawer } from "@api/drawers.api"

import { cubicBeizer } from "@assets/keyframes"

const BarChart = ({
    isCompleted,
    color,
    drawers,
    projectTaskCount,
}: {
    isCompleted: boolean
    color: string
    drawers: Drawer[]
    projectTaskCount: number
}) => {
    if (isCompleted) {
        return (
            <BarChartBox $percent={100} $color={color} $isCompleted={true}>
                <PercentText>100%</PercentText>
            </BarChartBox>
        )
    }

    return drawers?.map((drawer) => {
        if (drawer.completed_task_count + drawer.uncompleted_task_count == 0) {
            return null
        }

        return (
            <BarChartBox
                key={drawer.id}
                $percent={calculatePercent(
                    drawer.uncompleted_task_count + drawer.completed_task_count,
                    projectTaskCount,
                )}
                $color={color}>
                <PercentText>
                    {calculatePercent(
                        drawer.completed_task_count,
                        projectTaskCount,
                    )}
                    %
                </PercentText>
                <BarProgress
                    $color={color}
                    $percent={calculatePercent(
                        drawer.completed_task_count,
                        drawer.uncompleted_task_count +
                            drawer.completed_task_count,
                    )}
                />
                <ToolTipText>{drawer.name}</ToolTipText>
            </BarChartBox>
        )
    })
}

const calculatePercent = (ratio: number, base: number) => {
    if (base === 0) return 0

    const calculated = Math.floor((ratio / base) * 100)

    if (isNaN(calculated)) return 0
    return calculated
}

const ToolTipText = styled.div`
    display: none;
    position: absolute;
    white-space: nowrap;
    left: 50%;
    font-size: 0.9em;
    color: ${(p) => p.theme.textColor};
    font-weight: 500;
    transform: translate(-50%, 380%);
`

const PercentText = styled.div`
    visibility: hidden;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 130%);
    color: ${(p) => p.theme.textColor};
    font-size: 0.8em;
`

const BarProgress = styled.div<{
    $percent: number
    $color: string
}>`
    display: ${(props) => (props.$percent === 0 ? "none" : "flex")};
    width: 100%;
    background: linear-gradient(
        ${(props) => props.$color},
        ${(props) => props.$color}
    );
    background-size: ${(props) => props.$percent}%;
    background-repeat: no-repeat;
`

const BarChartBox = styled.div<{
    $percent: number
    $color: string
    $isOne?: boolean
    $isCompleted?: boolean
}>`
    position: relative;
    display: flex;
    width: ${(props) => props.$percent}%;
    height: 3em;
    box-shadow: 0 0 0 3px ${(props) => props.$color} inset;
    background-color: ${(p) => p.theme.backgroundColor};
    border-radius: ${(props) => props.$isOne && 15}px;
    margin: 1em 0em;
    transition: transform 0.4s ${cubicBeizer};
    cursor: pointer;

    z-index: 1;

    ${(props) =>
        props.$isCompleted &&
        css<{ $color: string }>`
            background-color: ${(props) => props.$color};
            border-radius: 15px;
        `}

    &:first-child {
        &,
        ${BarProgress} {
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
        }
    }

    &:last-child {
        &,
        ${BarProgress} {
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
        }
    }

    &:hover {
        transform: scale(1.05);
        z-index: 2;

        ${PercentText} {
            visibility: visible;
        }

        ${ToolTipText} {
            display: block;
        }
    }
`

export default BarChart
