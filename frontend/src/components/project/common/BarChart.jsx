import styled, { css } from "styled-components"
import { cubicBeizer } from "@assets/keyframes"

const BarChart = ({ isCompleted, color, drawers, projectTaskCount, displayDrawersCount, calculatePercent }) => {
    return (
        isCompleted ? 
        <BarChartBox
            $percent={100}
            $isCompleted={true}
            $color={color}
        >
            <PercentText>100%</PercentText>
        </BarChartBox>
        :
        drawers?.map((drawer, i) =>
            drawer.completed_task_count + drawer.uncompleted_task_count == 0 || (
                <BarChartBox
                    key={drawer.id}
                    $color={color}
                    $start={i === 0}
                    $end={i === displayDrawersCount}
                    $isOne={displayDrawersCount === 0}
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
                        )}%
                    </PercentText>
                    <BarProgress
                        $start={i === 0}
                        $end={i === displayDrawersCount}
                        $color={color}
                        $percent={calculatePercent(
                            drawer.completed_task_count,
                            drawer.uncompleted_task_count +
                                drawer.completed_task_count,
                        )}
                    />
                    <ToolTipText>
                        {drawer.name}
                    </ToolTipText>
                </BarChartBox>)
    ))
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

const BarChartBox = styled.div`
    position: relative;
    display: flex;
    width: ${(props) => props.$percent}%;
    height: 3em;
    box-shadow: 0 0 0 3px #${(props) => props.$color} inset;
    background-color: ${(p) => p.theme.backgroundColor};
    border-radius: ${props=>props.$isOne && 15}px;
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

const BarProgress = styled.div`
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
        css`
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
        `}
`

export default BarChart
