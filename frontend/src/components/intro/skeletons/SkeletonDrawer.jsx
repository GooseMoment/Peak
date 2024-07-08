import styled from "styled-components"

const SkeletonDrawer = () => {
    return <Frame>
        <DrawerName />
        <SkeletonTask />
        <SkeletonTask />
        <SkeletonTask />
    </Frame>
}

const SkeletonTask = () => {
    return <TaskBox>
        <Circle />
        <Bar />
    </TaskBox>
}

const Frame = styled.div`
    position: relative;

    width: 100%;
    margin: 2em 0;

    display: flex;
    flex-direction: column;
    gap: 1em;
`

const DrawerName = styled.div`
    width: 100%;
    height: 1.5em;

    box-sizing: border-box;
    border: 3px solid #74d548;
    border-radius: 16px;
`

const TaskBox = styled.div`
    display: flex;
    gap: 0.5em;
    padding: 0 0.5em;
`

const Circle = styled.div`
    height: 1em;
    aspect-ratio: 1/1;
    box-sizing: border-box;

    border: 2px solid #74d548;
    border-radius: 50%;
`

const Bar = styled.div`
    width: 100%;
    height: 1em;
    border-radius: 4px;

    background-color: ${p => p.theme.grey};
`

export default SkeletonDrawer
