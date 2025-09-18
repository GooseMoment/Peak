import {
    ReactNode,
    createContext,
    startTransition,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"

import styled, { css } from "styled-components"

import useStopVerticalScroll from "@utils/useStopVerticalScroll"

import { scaleDown, scaleUp } from "@assets/keyframes"

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

export default function useModal(options: useModalOptions = {}): Modal {
    const id = useRef<string>()
    const [isOpen, setIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false) // for ChildrenAnimationWrapper

    useStopVerticalScroll(isOpen)

    useEffect(() => {
        if (!id.current) {
            id.current = Math.random().toString(36).slice(2, 9)
        }
    }, [])

    const openModal = useCallback(() => {
        options.beforeOpen?.()
        startTransition(() => {
            setIsOpen(true)
        })
    }, [options])

    const closeModal = useCallback(() => {
        setIsClosing(true)
        options.beforeClose?.()
        setTimeout(() => {
            setIsOpen(false)
            options.afterClose?.()
            setIsClosing(false)
        }, 100)
    }, [options])

    const toggleModal = useCallback(() => {
        if (isOpen) {
            closeModal()
        } else {
            openModal()
        }
    }, [isOpen, closeModal, openModal])

    const handleOutsideClick = useCallback(
        (e: MouseEvent) => {
            if (e.target !== el) {
                return
            }

            e.stopPropagation()
            closeModal()
        },
        [closeModal],
    )

    useEffect(() => {
        if (isOpen) {
            options.afterOpen?.() // keep afterOpen here to ensure it runs after the modal is visible
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            el.addEventListener("click", handleOutsideClick)
        }

        return () => {
            el.removeEventListener("click", handleOutsideClick)
        }
    }, [isOpen])

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
    children?: ReactNode
    modal: Modal
}) {
    if (!modal.isOpen) {
        return null
    }

    return createPortal(
        <ModalContext.Provider value={{ modal }}>
            <ModalChildrenAnimationWrapper
                id={modal.id}
                $closing={modal.isClosing}>
                {children}
            </ModalChildrenAnimationWrapper>
        </ModalContext.Provider>,
        el,
    )
}

export function useModalContext() {
    return useContext(ModalContext).modal
}

export const ModalChildrenAnimationWrapper = styled.div<{ $closing?: boolean }>`
    ${(props) =>
        props.$closing
            ? css`
                  animation: 0.5s var(--cubic) forwards ${scaleDown};
              `
            : css`
                  animation: 0.5s var(--cubic) ${scaleUp};
              `}
`
