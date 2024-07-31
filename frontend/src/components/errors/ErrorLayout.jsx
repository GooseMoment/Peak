import { Link } from "react-router-dom"

import RoadSign from "@assets/errors/RoadSign"

import styled from "styled-components"

const Error = ({code, text, bottomText, bottomLinkTo, bottomA=false, height="100vh"}) => {
    return <Container $height={height}>
        <Main>
            <RoadSign text={code} /> 
            <Text>{text}</Text> 
        </Main>
        <BottomText>
            {bottomLinkTo ? bottomA ? 
                <a href={bottomLinkTo}>{bottomText}</a> : <Link to={bottomLinkTo}>{bottomText}</Link>
                : bottomText
            }
        </BottomText>
    </Container>
}

const Container = styled.div`
    width: 100%;
    height: ${p => p.$height};
    padding: 5em 0;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5em;

    color: ${p => p.theme.textColor};
`

const Main = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5em; 
`

const Text = styled.h1`
    font-size: 1em;
    font-weight: bold;
`

const BottomText = styled.div`
    font-size: 1em;
`

export default Error
