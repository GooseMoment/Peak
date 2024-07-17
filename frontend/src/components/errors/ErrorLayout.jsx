import { Link } from "react-router-dom"

import RoadSign from "@assets/errors/RoadSign"

import styled from "styled-components"

const Error = ({code, text, bottomText, bottomLinkTo, bottomA=false}) => {
    return <Container>
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
    height: 100vh;
    padding: 10em 0 5em 0;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

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
