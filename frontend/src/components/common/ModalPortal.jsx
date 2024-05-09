import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { cubicBeizer, scaleDown, scaleUp } from "@assets/keyframes"
import useDelayUnmount from "@utils/useDelayUnmount"

import styled, { css } from "styled-components"

const el = document.getElementById("modal")
const root = document.getElementById("root")

// see: https://github.com/remix-run/react-router/discussions/9864#discussioncomment-6350903

const ModalPortal = ({ children, closeModal, additional=false, closeESC=true }) => {
    const [isOpen, setIsOpen] = useState(true)
    
    const shouldRender = !additional ? useDelayUnmount(isOpen, 100, closeModal) : true

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.querySelector('html').scrollTop = window.scrollY;
            return () => document.body.style.overflow = null;
    }, [])

    useEffect(() => {
        el.addEventListener("click", handleOutsideClick)
        document.addEventListener("keydown", handleKeyDown)

        if (!additional) {
            el.classList.add("with-animation")
            el.classList.add("has-modal")
            root.classList.add("has-modal")
        }

        return () => {
            el.removeEventListener("click", handleOutsideClick)
            document.removeEventListener("keydown", handleKeyDown)

            if (!additional) {
                el.classList.remove("has-modal")
                root.classList.remove("has-modal")
            }
        }
    }, [])

    const handleOutsideClick = e => {
        if (e.target !== el) {
            return
        }

        e.stopPropagation()
        setIsOpen(false)
    }

    const handleKeyDown = e => {
        if (e.key === "Escape") {
            e.preventDefault()
            setIsOpen(false)
        }
    }

    return createPortal(
        <AnimationProvider onKeyDown={handleKeyDown} $open={isOpen}>{ shouldRender ? children : null}</AnimationProvider>, el
    )
}

const AnimationProvider = styled.div`
    ${props => props.$open ? css`
        animation: ${scaleUp} 0.5s ${cubicBeizer};
    ` : css`
        animation: ${scaleDown} 0.5s ${cubicBeizer} forwards;
    `}
`

export default ModalPortal