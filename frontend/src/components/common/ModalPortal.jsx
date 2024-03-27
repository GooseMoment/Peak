import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const el = document.getElementById("modal")

const ModalPortal = ({ children, closeModal }) => {
    const isOpen = useRef(false)

    useEffect(() => {
        el.addEventListener("click", handleOutsideClick)
        isOpen.current = true

        return () => {
            el.removeEventListener("click", handleOutsideClick)
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
        closeModal()
    }

    return createPortal(children, el)
}

export default ModalPortal