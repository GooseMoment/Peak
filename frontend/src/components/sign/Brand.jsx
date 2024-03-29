import styled from "styled-components"

import logo from "@assets/logo.svg"

const Box = styled.h1`
    display: flex;
    align-items: center;
    gap: 0.25em;

    z-index: 999;
    position: absolute;
    color: #FE4902;

    font-size: 2em;
    font-weight: bold;

    top: 2rem;
    left: 2rem;

    @media screen and (max-width: 800px) {
        & {
            color: black;
        }
    }
`

const By = styled.span`
    font-weight: 300;

    @media screen and (max-width: 800px) {
        & {
            display: none;
        }
    }
`

const LogoBox = styled.img`
    height: 1em;
`

const Brand = () => {
    return <Box>
        <LogoBox src={logo} draggable="false"/>Peak <By>by GooseMoment</By>
    </Box>
}

export default Brand