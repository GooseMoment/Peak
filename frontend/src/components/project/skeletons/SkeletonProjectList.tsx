import styled from "styled-components"

import useScreenType, { ifMobile } from "@utils/useScreenType"

import { skeletonBreathingCSS, skeletonCSS } from "@assets/skeleton"

const SkeletonProjectList = () => {
    return [...Array(10)].map((e, i) => <SkeletonProjectName key={i} />)
}

const SkeletonProjectName = () => {
    const { isMobile } = useScreenType()

    return (
        <SkeletonProjectNameBox>
            <FlexBox>
                <Circle />
                <Bar />
            </FlexBox>
            {isMobile && <SubBar />}
        </SkeletonProjectNameBox>
    )
}

const SkeletonProjectNameBox = styled.div`
    margin-bottom: 1.6em;
`

const FlexBox = styled.div`
    display: flex;
    align-items: center;
    height: 3em;
    gap: 0.8em;
    margin: 0.8em 0.12em;
    margin-right: 0em;

    ${ifMobile} {
        height: 1.65em;
        margin: 0.7em 0.12em 1em;
    }
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
    height: 1.65em;
    background-color: ${(p) => p.theme.skeleton.defaultColor};
    ${skeletonCSS("-100px", "360px", "1.8s")}
`

const SubBar = styled.div`
    width: 40%;
    height: 1em;
    background-color: ${(p) => p.theme.skeleton.defaultColor};
    ${skeletonCSS("-100px", "360px", "1.8s")}
`

export default SkeletonProjectList
