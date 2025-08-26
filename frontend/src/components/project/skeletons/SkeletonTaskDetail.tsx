import styled, { css } from "styled-components"

import { skeletonBreathingCSS, skeletonCSS } from "@assets/skeleton"

const SkeletonTaskDetail = () => {
    return (
        <>
            <TaskBox>
                <Circle />
                <Bar $isTask />
            </TaskBox>
            <ContentsBlock>
                {[...Array(6)].map((e, i) => (
                    <ContentsBox key={i}>
                        <IconBar />
                        <VLine $end={i === 0 || i === 5} />
                        <Bar $isTask={false} />
                    </ContentsBox>
                ))}
            </ContentsBlock>
        </>
    )
}

const TaskBox = styled.div`
    display: flex;
    align-items: center;
    margin: 1.8em;
    gap: 0.8em;
`

const Circle = styled.div`
    height: 1.5em;
    aspect-ratio: 1/1;
    box-sizing: border-box;

    border-radius: 50%;
    ${skeletonCSS()}
`

const ContentsBlock = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2.5em;
    margin-left: 3.8em;
    gap: 1.4em;
`

const ContentsBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1em;
`

const IconBar = styled.div`
    width: 1.3em;
    height: 1.3em;
    border-radius: 4px;
    ${skeletonBreathingCSS}
`

const VLine = styled.div<{ $end: boolean }>`
    border-left: thin solid ${(p) => p.theme.skeleton.defaultColor};
    height: 1em;
    transform: scale(1, 5);

    ${({ $end }) =>
        $end
            ? css`
                  transform: scale(1, 1.2);
              `
            : null}
`

const Bar = styled.div<{ $isTask: boolean }>`
    width: ${(props) => (props.$isTask ? 91.4 : 85)}%;
    height: 1.4em;
    border-radius: 4px;
    background-color: ${(p) => p.theme.skeleton.defaultColor};
    ${skeletonCSS("-100px", "500px", "1.8s")}
`

export default SkeletonTaskDetail
