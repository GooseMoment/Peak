import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"

import styled from "styled-components"

const el = document.getElementById("modal")
const root = document.getElementById("root")

// see: https://github.com/remix-run/react-router/discussions/9864#discussioncomment-6350903

const ModalPortal = ({ children, closeModal, isAdditional, isRouteModal }) => {
    const isOpen = useRef(false)
    const navigate = useNavigate()

    useEffect(() => {
        el.addEventListener("click", handleOutsideClick)

        if (!isAdditional) {
            el.classList.add("with-animation")
            el.classList.add("has-modal")
            root.classList.add("has-modal")
        }
        isOpen.current = true

        return () => {
            el.removeEventListener("click", handleOutsideClick)

            if (!isAdditional) {
                el.classList.remove("has-modal")
                root.classList.remove("has-modal")
            }
        }
    }, [])

    const handleOutsideClick = e => {
        if (e.target !== el) {
            return
        }
        
        if (!isOpen) {
            return
        }

        e.stopPropagation()
        isOpen.current = false

        if (isRouteModal) {
            navigate(-1)
        }

        closeModal()
    }

    if (isRouteModal) {
        return createPortal(<ModalFrame>{children}</ModalFrame>, el)
    }

    return createPortal(children, el)
}

const ModalFrame = styled.div`
    background-color: red;
`

export default ModalPortal