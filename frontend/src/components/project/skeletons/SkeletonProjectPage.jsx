import styled, { keyframes } from "styled-components"

import { ifMobile } from "@utils/useScreenType"

import { skeletonCSS } from "@assets/skeleton"

export const SkeletonProjectPage = () => {
    return (
        <>
            <ProjectTitle />
            <SkeletonDrawer taskCount={3} />
            <SkeletonDrawer taskCount={3} />
            <SkeletonDrawer taskCount={3} />
        </>
    )
}

export const SkeletonDrawer = ({ taskCount }) => {
    return (
        <Frame>
            <DrawerName />
            <SkeletonTasks taskCount={taskCount} />
        </Frame>
    )
}

const SkeletonTasks = ({ taskCount }) => {
    const skeletonCount = taskCount > 10 ? 10 : taskCount

    return (
        <Tasks>
            {[...Array(skeletonCount)].map((e, i) => (
                <TaskBox key={i}>
                    <Circle />
                    <Bar />
                </TaskBox>
            ))}
            <CreateEmptyBox />
            <FlexCenterBox>
                {taskCount > 10 && <MoreButtonEmptyBox />}
            </FlexCenterBox>
        </Tasks>
    )
}

export const SkeletonInboxPage = () => {
    return <ProjectTitle />
}

export const SkeletionInboxTask = () => {
    return (
        <Tasks>
            <SkeletonTasks taskCount={15} />
        </Tasks>
    )
}

const Frame = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1.5em 0em 0em;
`

const Tasks = styled(Frame)`
    margin-top: 1em;
`

const ProjectTitle = styled.div`
    width: 100%;
    height: 3em;
    margin-bottom: 3em;
    border-radius: 15px;
    ${skeletonCSS("-100px", "300px", "2s")}
`

const breathingBorder = (p) => keyframes`
    0%, 100% {
        border-color: ${p.theme.skeleton.defaultColor};
    }
    40% {
        border-color: ${p.theme.skeleton.shineColor};
    }
`

const DrawerName = styled.div`
    width: 100%;
    height: 3.5em;

    box-sizing: border-box;
    border-radius: 15px;
    border: 0.25em solid ${(p) => p.theme.skeleton.defaultColor};
    animation: ${(p) => breathingBorder(p)} 2s infinite linear;
`

const TaskBox = styled.div`
    display: flex;
    align-items: center;
    margin-left: 2.45em;
    gap: 0.8em;
    padding: 1.04em 0.5em;

    ${ifMobile} {
        margin-left: 0.8em;
    }
`

const Circle = styled.div`
    height: 1.5em;
    aspect-ratio: 1/1;
    box-sizing: border-box;

    border-radius: 50%;
    ${skeletonCSS}
`

const Bar = styled.div`
    width: 100%;
    height: 1.43em;
    border-radius: 4px;
    ${skeletonCSS("-100px", "300px", "2s")}
`

const CreateEmptyBox = styled.div`
    width: 100%;
    height: 1.1em;
    margin-top: 1.8em;
`

const FlexCenterBox = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 1em;
`

const MoreButtonEmptyBox = styled.div`
    height: 2.35em;
    width: 25em;
    border-radius: 10px;
    border: 3px solid ${(p) => p.theme.skeleton.defaultColor};
    animation: ${(p) => breathingBorder(p)} 2s infinite linear;
`
