import styled from "styled-components"

import { skeletonCSS } from "@assets/skeleton"

export const SkeletonDueTasks = ({ taskCount }) => {
    const skeletonCount = taskCount > 10 ? 10 : taskCount

    return [...Array(skeletonCount)].map((e, i) => (
        <SkeletonDueTasksBox key={i}>
            <TaskBox>
                <Circle />
                <Bar />
            </TaskBox>
            <DueBar />
        </SkeletonDueTasksBox>
    ))
}

const SkeletonDueTasksBox = styled.div`
    margin-top: 1.5em;
    height: 2.6em;
`

const TaskBox = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.5em;
    margin-left: 0.6em;
    gap: 0.7em;
    padding: 0 0.5em;
`

const Circle = styled.div`
    height: 1.5em;
    aspect-ratio: 1/1;
    box-sizing: border-box;
    margin-top: 0.3em;
    border-radius: 50%;
    ${skeletonCSS}
`

const Bar = styled.div`
    width: 100%;
    height: 1.4em;
    border-radius: 4px;
    ${skeletonCSS("-100px", "300px", "2s")}
`

const DueBar = styled.div`
    width: 13%;
    height: 0.8em;
    margin-left: 3.3em;
    border-radius: 4px;
    ${skeletonCSS("-100px", "300px", "2s")}
`
