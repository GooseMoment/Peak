import { type ReactNode, useEffect, useState } from "react"

import styled, { css } from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"

import useStopScroll from "@utils/useStopScroll"

import { cubicBeizer, slideDown, slideUp } from "@assets/keyframes"

import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"

const el = document.querySelector("#confirmation")!

interface ConfirmationProp {
    question: string
    buttons: ("close" | ReactNode)[]
    onClose: () => void
}

const Confirmation = ({ question, buttons, onClose }: ConfirmationProp) => {
    const { t } = useTranslation("translation")

    const [visible, setVisible] = useState(true)
    const [closing, setClosing] = useState(false)

    useStopScroll(true)

    useEffect(() => {
        el.addEventListener("click", handleOutsideClick)

        return () => {
            el.removeEventListener("click", handleOutsideClick)
        }
    }, [])

    const handleOutsideClick = (e: Event) => {
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

    return createPortal(
        visible && (
            <Frame
                $closing={closing}
                className={closing ? "closing" : undefined}>
                <Question>{question}</Question>
                <ButtonGroup $margin="none" $justifyContent="">
                    {buttons?.map((button) =>
                        button === "close" ? (
                            <Button key="close" onClick={closeWithDelay}>
                                {t("common.button_no")}
                            </Button>
                        ) : (
                            button
                        ),
                    )}
                </ButtonGroup>
            </Frame>
        ),
        el,
    )
}

const Frame = styled.div<{ $closing?: boolean }>`
    height: fit-content;
    width: fit-content;

    max-width: 30em;

    box-sizing: border-box;
    padding: 1.5em;
    border-radius: 16px;

    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};

    animation: ${slideUp} 0.5s ${cubicBeizer} forwards;

    ${(p) =>
        p.$closing &&
        css`
            animation: ${slideDown} 0.5s ${cubicBeizer} forwards;
        `}
`

const Question = styled.div`
    font-weight: 500;
    line-height: 1.3;
    text-align: center;

    margin-bottom: 1.25em;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default Confirmation
