import styled, { keyframes } from "styled-components"
import { skeletonCSS } from "@assets/skeleton"

export const SkeletonProjectPage = () => {
    return (
        <>
            <ProjectTitle/>
            <SkeletonDrawer/>
            <SkeletonDrawer/>
            <SkeletonDrawer/>
        </>
    )
}

export const SkeletonDrawer = () => {
    return (
        <Frame>
            <DrawerName/>
            <SkeletonTasks/>
        </Frame>
    )
}

const SkeletonTasks = () => {
    return (
        <>
            {[...Array(3)].map((e, i) => <TaskBox key={i}>
                <Circle/>
                <Bar/>
            </TaskBox>)}
        </>
    )
}

const Frame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
    margin: 2em 0em;
    margin-bottom: 3em;
`

const ProjectTitle = styled.div`
    width: 100%;
    height: 3em;
    margin-bottom: 3em;
    border-radius: 15px;
    ${skeletonCSS("-100px", "300px", "2s")}
`

const breathing = p => keyframes`
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
    border: 0.25em solid ${p=>p.theme.skeleton.defaultColor};
    animation: ${p => breathing(p)} 2s infinite linear;
`

const TaskBox = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.5em;
    margin-left: 1.2em;
    gap: 0.8em;
    padding: 0 0.5em;
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
    height: 1.4em;
    border-radius: 4px;
    ${skeletonCSS("-100px", "300px", "2s")}
`