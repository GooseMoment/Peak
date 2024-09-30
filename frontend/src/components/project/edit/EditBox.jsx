import styled from "styled-components"

import { ifMobile, ifTablet } from "@utils/useScreenType"

const EditBox = styled.div`
    box-sizing: border-box;
    width: 35em;

    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.borderColor};
    border-radius: 15px;

    padding: 1.5em 2em;

    ${ifTablet} {
        width: 30em;
    }

    ${ifMobile} {
        padding: 1.25em;
        width: 90vw;
    }
`

export default EditBox
