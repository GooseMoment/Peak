import styled from "styled-components"

import { ifTablet } from "@utils/useScreenType"

const Box = styled.h1`
    display: flex;
    align-items: center;
    gap: 0.25em;

    z-index: 999;
    color: ${(p) => p.theme.introTextColor};

    font-size: 2em;
    font-weight: bold;
`

const By = styled.span`
    font-weight: 300;

    ${ifTablet} {
        display: none;
    }
`

const LogoBox = styled.img`
    height: 1em;
    border-radius: 6px;
`

const Brand = () => {
    return (
        <Box>
            <LogoBox src="/logo.svg" draggable="false" />
            Peak <By>by GooseMoment</By>
        </Box>
    )
}

export default Brand
export { Box }
