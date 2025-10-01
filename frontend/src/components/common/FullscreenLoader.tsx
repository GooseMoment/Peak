import styled from "styled-components"

import LoaderCircle from "@components/common/LoaderCircle"

export default function FullscreenLoader() {
    return (
        <Container>
            <Box>
                <Logo>
                    <Img src="/logo.svg" draggable="false" />
                    <Name>Peak</Name>
                </Logo>
                <Loader />
            </Box>
        </Container>
    )
}

const Container = styled.div`
    box-sizing: border-box;
    width: 100dvw;
    height: 100dvh;

    display: flex;
    justify-content: center;
    align-items: center;
`

const Box = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 1.5em;
`

const Logo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 0.75em;
`

const Img = styled.img`
    aspect-ratio: 1/1;
    height: 3em;

    border-radius: 6px;
`

const Name = styled.h1`
    font-size: 1.5em;
    font-weight: bold;

    color: ${(p) => p.theme.textColor};
`

const Loader = styled(LoaderCircle)`
    width: 2em;
    opacity: 0.7;
    border-width: 3px;
`
