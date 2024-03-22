import styled, { keyframes } from "styled-components"

const Showcase = ({activities}) => {
    return <Box>
        <DisplayArea>
            <ScreenTop />
            <ScreenBottom />

            {/* 무한 스크롤을 위해 ActivitiesBox가 두 개 필요 */}
            <ActivitiesBox>{activities}</ActivitiesBox>
            <ActivitiesBox>{activities}</ActivitiesBox>
        </DisplayArea>
    </Box>
}

const Box = styled.section`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 3rem;
    color: #FE4902;

    grid-area: 1 / 1 / 2 / 2;

    overflow-y: hidden;

    @media screen and (max-width: 800px) {
        & {
            display: none;
        }
    }
`

const DisplayArea = styled.div`
    position: relative;

    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
    gap: 1rem;

    height: 40%;
    width: 100%;
`

const ScreenTop = styled.div`
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 7.5%;

    top: 0;
    background: linear-gradient(180deg, #FFD7C7 29.5%, rgba(255, 215, 199, 0) 100%);
`

const ScreenBottom = styled(ScreenTop)`
    top: unset;
    bottom: 0;
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

    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    min-width: 100%;
    gap: 2rem;

    animation: ${scroll} 50s linear infinite;
`

export default Showcase