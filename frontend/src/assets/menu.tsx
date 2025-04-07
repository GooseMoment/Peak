import styled from "styled-components"

import {
    Menu as DefaultMenu,
    MenuItem as DefaultMenuItem,
} from "@szhsin/react-menu"
import "@szhsin/react-menu/dist/index.css"
import "@szhsin/react-menu/dist/transitions/zoom.css"

export const Menu = styled(DefaultMenu)`
    padding-right: 13px;

    & ul {
        position: absolute;
        background-color: ${(p) => p.theme.secondBackgroundColor};
        color: ${(p) => p.theme.textColor};
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        font-size: 0.85em;
    }
`

export const MenuItem = styled(DefaultMenuItem)`
    &:hover {
        background-color: ${(p) => p.theme.thirdBackgroundColor};
    }

    & svg {
        top: 0;
        bottom: 2px;
        margin-right: 0.75em;
    }
`
