import styled, { css } from "styled-components"

import { cubicBeizer } from "@assets/keyframes"

const BarChart = ({ project, drawers }) => {
    let projectTaskCount =
        project.completed_task_count + project.uncompleted_task_count

    const isCompleted = () => {
        let totalUncompletedTaskCount = 0
        for (let i = 0; i < drawers.length; i++) {
            totalUncompletedTaskCount += drawers[i].uncompleted_task_count
        }

        if (totalUncompletedTaskCount) return false
        else return true
    }

    const calculateDisplayCount = () => {
        let count = 0

        for (let i = 0; i < drawers.length; i++) {
            if (
                drawers[i].completed_task_count +
                    drawers[i].uncompleted_task_count !==
                0
            )
                count += 1
        }
        return count && count - 1
    }

    const calculatePercent = (ratio, base) => {
        if (base === 0) return 0

        let calculated = Math.floor((ratio / base) * 100)

        if (isNaN(calculated)) return 0
        return calculated
    }

    return (
        <FlexBox>
            {projectTaskCount === 0 ? null : isCompleted() ? (
                <BarChartBox
                    $percent={100}
                    $isCompleted={true}
                    $color={project.color}
                >
                    <PercentText>100%</PercentText>
                </BarChartBox>
            ) : (
                drawers?.map(
                    (drawer, i) =>
                        drawer.completed_task_count +
                            drawer.uncompleted_task_count ===
                            0 || (
                            <BarChartBox
                                key={i}
                                $start={i === 0}
                                $end={i === calculateDisplayCount()}
                                $color={project.color}
                                $percent={calculatePercent(
                                    drawer.uncompleted_task_count +
                                        drawer.completed_task_count,
                                    projectTaskCount,
                                )}
                            >
                                <PercentText>
                                    {calculatePercent(
                                        drawer.completed_task_count,
                                        projectTaskCount,
                                    )}
                                    %
                                </PercentText>
                                <BarData
                                    $start={i === 0}
                                    $end={i === calculateDisplayCount()}
                                    $color={project.color}
                                    $percent={calculatePercent(
                                        drawer.completed_task_count,
                                        drawer.uncompleted_task_count +
                                            drawer.completed_task_count,
                                    )}
                                />
                                <ToolTipText>{drawer.name}</ToolTipText>
                            </BarChartBox>
                        ),
                )
            )}
        </FlexBox>
    )
}

const FlexBox = styled.div`
    display: flex;
    gap: 0.3em;
`

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
    color: ${(p) => p.theme.white};
    font-size: 0.8em;
`

const BarChartBox = styled.div`
    position: relative;
    display: flex;
    box-shadow: 0 0 0 3px #${(props) => props.$color} inset;
    width: ${(props) => props.$percent}%;
    height: 3em;
    margin: 1em 0em;
    transition: transform 0.4s ${cubicBeizer};
    cursor: pointer;

    ${(props) =>
        props.$isCompleted &&
        css`
            background-color: #${(props) => props.$color};
            border-radius: 15px;
        `}

    ${(props) =>
        props.$start &&
        css`
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
        `}

    ${(props) =>
        props.$end &&
        css`
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
        `}

    &:hover {
        transform: scale(1.05);

        ${PercentText} {
            visibility: visible;
        }

        ${ToolTipText} {
            display: block;
        }
    }
`

const BarData = styled.div`
    display: ${(props) => (props.$percent === 0 ? "none" : "flex")};
    width: 100%;
    background: linear-gradient(
        #${(props) => props.$color},
        #${(props) => props.$color}
    );
    background-size: ${(props) => props.$percent}%;
    background-repeat: no-repeat;

    ${(props) =>
        props.$start &&
        css`
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
        `}

    ${(props) =>
        props.$end &&
        props.$percent === 100 &&
        css`
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
        `}
`

export default BarChart
