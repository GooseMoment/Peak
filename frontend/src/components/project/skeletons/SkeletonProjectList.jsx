import styled from "styled-components"

import { skeletonBreathingCSS, skeletonCSS } from "@assets/skeleton"

const SkeletonProjectList = () => {
    return [...Array(10)].map((e, i) => <SkeletonProjectName key={i} />)
}

const SkeletonProjectName = () => {
    return (
        <FlexBox>
            <Circle />
            <Bar />
        </FlexBox>
    )
}

const FlexBox = styled.div`
    display: flex;
    height: 3.7em;
    align-items: center;
    margin-left: 0.65em;
    gap: 1em;
`

const Circle = styled.div`
    height: 1.3em;
    aspect-ratio: 1;
    border-radius: 50%;
    stroke: none;
    ${skeletonBreathingCSS}
`

const Bar = styled.div`
    width: 100%;
    height: 2em;
    background-color: ${(p) => p.theme.skeleton.defaultColor};
    ${skeletonCSS("-100px", "360px", "1.8s")}
`

export default SkeletonProjectList
