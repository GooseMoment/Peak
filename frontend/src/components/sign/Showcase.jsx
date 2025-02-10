import styled, { keyframes } from "styled-components"

import { ifTablet } from "@utils/useScreenType"

const Showcase = ({ activities }) => {
    return (
        <Box>
            <DisplayArea>
                <ScreenTop />
                <ScreenBottom />

                {/* 무한 스크롤을 위해 ActivitiesBox가 두 개 필요 */}
                <ActivitiesBox>{activities}</ActivitiesBox>
                <ActivitiesBox>{activities}</ActivitiesBox>
            </DisplayArea>
        </Box>
    )
}

const Box = styled.section`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 3rem;
    color: ${(p) => p.theme.introTextColor};

    grid-area: 1 / 1 / 2 / 2;

    overflow-y: hidden;

    ${ifTablet} {
        display: none;
    }
`

const DisplayArea = styled.div`
    position: relative;

    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
    gap: 2rem;

    height: 70%;
    width: 100%;
`

const ScreenTop = styled.div`
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 35%;

    top: 0;
    background: linear-gradient(
        180deg,
        ${(p) => p.theme.introBackgroundColor} 29.5%,
        rgba(255, 215, 199, 0) 100%
    );
`

const ScreenBottom = styled(ScreenTop)`
    top: unset;
    bottom: -0.1em;
    transform: rotate(180deg);
`

const scroll = keyframes`
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(calc(-100% - 2rem));
    }
`

const ActivitiesBox = styled.div`
    user-select: none;
    -webkit-user-select: none;

    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    min-width: 100%;
    gap: 2rem;

    animation: ${scroll} 50s linear infinite;
`

export default Showcase
