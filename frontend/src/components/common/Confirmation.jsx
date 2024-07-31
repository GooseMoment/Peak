import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { ButtonGroup } from "@components/common/Button"
import { cubicBeizer, slideDown, slideUp } from "@assets/keyframes"

import styled, { css } from "styled-components"

const el = document.querySelector("#confirmation")

const Confirmation = ({ question, buttons, onClose }) => {
    const [visible, setVisible] = useState(true)
    const [closing, setClosing] = useState(false)

    useEffect(() => {
        el.addEventListener("click", handleOutsideClick)

        return () => {
            el.removeEventListener("click", handleOutsideClick)
        }
    }, [])

    const handleOutsideClick = e => {
        if (e.target !== el) {
            return
        }

        e.stopPropagation()
        closeWithDelay()
    }

    const close = () => {
        setVisible(false)
        onClose()
    }

    const closeWithDelay = () => {
        setClosing(true)
        setTimeout(close, 100)
    }

    return createPortal(visible && <Frame $closing={closing}>
        <Question>{question}</Question>     
        <ButtonGroup>
            {buttons}
        </ButtonGroup>
    </Frame>, el)
}

const Frame = styled.div`
    height: fit-content;
    width: fit-content;

    box-sizing: border-box;
    padding: 1em;
    border-radius: 16px;

    color: ${p => p.theme.textColor};
    background-color: ${p => p.theme.backgroundColor};

    animation: ${slideUp} 0.5s ${cubicBeizer} forwards;

    ${p => p.$closing && css`
        animation: ${slideDown} 0.5s ${cubicBeizer} forwards;
    `}
`

const Question = styled.div`
    font-weight: bold;

    margin-bottom: 1.25em;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default Confirmation
