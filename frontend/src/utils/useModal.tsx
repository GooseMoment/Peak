import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"

import styled, { css } from "styled-components"

import useStopScroll from "@utils/useStopScroll"

import { cubicBeizer, scaleDown, scaleUp } from "@assets/keyframes"

import { createPortal } from "react-dom"

interface useModalOptions {
    beforeOpen?: () => void
    afterOpen?: () => void
    beforeClose?: () => void
    afterClose?: () => void
}

interface Modal {
    id?: string
    isOpen: boolean
    isClosing: boolean
    openModal: () => void
    closeModal: () => void
    toggleModal: () => void
}

const el = document.getElementById("window-container")!
const root = document.getElementById("root")!

export default function useModal(options: useModalOptions = {}): Modal {
    const id = useRef<string>()
    const [isOpen, setIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    useStopScroll(isOpen)

    useEffect(() => {
        if (!id.current) {
            id.current = Math.random().toString(36).slice(2, 9)
        }
    }, [])

    const handleOutsideClick = (e: MouseEvent) => {
        if (e.target !== el) {
            return
        }

        e.stopPropagation()
        closeModal()
    }

    useEffect(() => {
        if (isOpen) {
            el.addEventListener("click", handleOutsideClick)
        }

        return () => {
            el.removeEventListener("click", handleOutsideClick)
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            root.classList.add("has-modal")
        }

        if (isClosing) {
            el.classList.add("closing")
        }

        return () => {
            el.classList.remove("closing")
            root.classList.remove("has-modal")
        }
    }, [isOpen, isClosing])

    const openModal = () => {
        options.beforeOpen?.()
        setIsOpen(true)
        options.afterOpen?.()
    }

    const closeModal = () => {
        setIsClosing(true)
        options.beforeClose?.()
        setTimeout(() => {
            setIsOpen(false)
            options.afterClose?.()
            setIsClosing(false)
        }, 100)
    }

    const toggleModal = () => {
        if (isOpen) {
            closeModal()
        } else {
            openModal()
        }
    }

    return {
        id: id.current,
        isOpen,
        isClosing,
        openModal,
        closeModal,
        toggleModal,
    }
}

const ModalContext = createContext<{ modal?: Modal }>({
    modal: undefined,
})

export function Portal({
    modal,
    children,
}: {
    children: ReactNode
    modal: Modal
}) {
    if (!modal.isOpen) return null

    return createPortal(
        <ModalContext.Provider value={{ modal }}>
            <AnimationProvider id={modal.id} $closing={modal.isClosing}>
                {children}
            </AnimationProvider>
        </ModalContext.Provider>,
        el,
    )
}

export function useModalContext() {
    return useContext(ModalContext).modal
}

const AnimationProvider = styled.div<{ $closing?: boolean }>`
    ${(props) =>
        props.$closing
            ? css`
                  animation: ${scaleDown} 0.5s ${cubicBeizer} forwards;
              `
            : css`
                  animation: ${scaleUp} 0.5s ${cubicBeizer};
              `}
`
