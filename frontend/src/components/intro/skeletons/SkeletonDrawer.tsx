import styled from "styled-components"

import { usePaletteColor } from "@assets/palettes"

export default function SkeletonDrawer() {
    const color = usePaletteColor("yellow")

    return (
        <Frame>
            <DrawerName color={color} />
            <SkeletonTask />
            <SkeletonTask />
            <SkeletonTask />
        </Frame>
    )
}

function SkeletonTask() {
    const color = usePaletteColor("yellow")

    return (
        <TaskBox>
            <Circle color={color} />
            <Bar />
        </TaskBox>
    )
}

const Frame = styled.div`
    position: relative;

    width: 100%;
    margin: 2em 0;

    display: flex;
    flex-direction: column;
    gap: 1em;
`

const DrawerName = styled.div<{ color: string }>`
    width: 100%;
    height: 1.5em;

    box-sizing: border-box;
    border: 3px solid ${(p) => p.color};
    border-radius: 8px;
`

const TaskBox = styled.div`
    display: flex;
    gap: 0.5em;
    padding: 0 0.5em;
`

const Circle = styled.div<{ color: string }>`
    height: 1em;
    aspect-ratio: 1/1;
    box-sizing: border-box;

    border: 2.75px solid ${(p) => p.color};
    border-radius: 50%;
`

const Bar = styled.div`
    width: 100%;
    height: 1em;
    border-radius: 4px;

    background-color: ${(p) => p.theme.secondBackgroundColor};
`
