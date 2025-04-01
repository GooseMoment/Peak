import { createContext, useContext, useEffect, useState } from "react"

import styled, { css } from "styled-components"

import useStopScroll from "@utils/useStopScroll"

import { cubicBeizer, scaleDown, scaleUp } from "@assets/keyframes"

import { createPortal } from "react-dom"

const CloseContext = createContext({ closeModal: () => {} })

export const useModalWindowCloseContext = () => {
    return useContext(CloseContext)
}

const el = document.getElementById("window-container")
const root = document.getElementById("root")

// see: https://github.com/remix-run/react-router/discussions/9864#discussioncomment-6350903

const ModalWindow = ({
    children,
    afterClose,
    additional = false,
    closeESC = true,
}) => {
    const [closing, setClosing] = useState(false)

    const closeWithTransition = () => {
        setClosing(true)
        setTimeout(() => afterClose(), 100)
    }

    useStopScroll(true)

    useEffect(() => {
        el.addEventListener("click", handleOutsideClick)
        document.addEventListener("keydown", handleKeyDown)

        if (!additional) {
            root.classList.add("has-modal")
        }

        return () => {
            el.removeEventListener("click", handleOutsideClick)
            document.removeEventListener("keydown", handleKeyDown)

            if (!additional) {
                root.classList.remove("has-modal")
            }
        }
    }, [])

    const handleOutsideClick = (e) => {
        if (e.target !== el) {
            return
        }

        e.stopPropagation()
        closeWithTransition()
    }

    const handleKeyDown = (e) => {
        if (closeESC && e.key === "Escape") {
            e.preventDefault()
            closeWithTransition()
        }
    }

    return createPortal(
        <CloseContext.Provider value={{ closeModal: closeWithTransition }}>
            <AnimationProvider
                onKeyDown={handleKeyDown}
                $closing={closing}
                className={!additional && closing && "closing"}>
                {children}
            </AnimationProvider>
        </CloseContext.Provider>,
        el,
    )
}

const AnimationProvider = styled.div`
    ${(props) =>
        props.$closing
            ? css`
                  animation: ${scaleDown} 0.5s ${cubicBeizer} forwards;
              `
            : css`
                  animation: ${scaleUp} 0.5s ${cubicBeizer};
              `}
`

export default ModalWindow
