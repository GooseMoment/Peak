import styled from "styled-components"

import { LoaderCircleBold } from "./LoaderCircle"

import { createPortal } from "react-dom"

const el = document.querySelector("#confirmation")!

export default function ModalLoader() {
    return createPortal(
        <Box>
            <LoaderCircleBold />
        </Box>,
        el,
    )
}

const Box = styled.div`
    background-color: ${(p) => p.theme.backgroundColor};
    height: 5em;
    width: 5em;

    aspect-ratio: 1/1;

    border-radius: 20px;

    display: flex;
    justify-content: center;
    align-items: center;
`
