import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"

import { ModalChildrenAnimationWrapper } from "@utils/useModal"
import useStopVerticalScroll from "@utils/useStopVerticalScroll"

import { createPortal } from "react-dom"

const CloseContext = createContext({ closeModal: () => {} })

/**
 * @deprecated use {@link useModalContext} with {@link useModal}
 */
export const useModalWindowCloseContext = () => {
    return useContext(CloseContext)
}

const el = document.getElementById("window-container")

// see: https://github.com/remix-run/react-router/discussions/9864#discussioncomment-6350903

/**
 * @deprecated use {@link useModal} and {@link Portal} instead
 */
const ModalWindow = ({
    children,
    afterClose,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    additional = false,
    closeESC = true,
}) => {
    const [closing, setClosing] = useState(false)

    const closeWithTransition = useCallback(() => {
        setClosing(true)
        setTimeout(() => afterClose(), 100)
    }, [afterClose])

    useStopVerticalScroll(true)

    const handleOutsideClick = useCallback(
        (e) => {
            if (e.target !== el) {
                return
            }

            e.stopPropagation()
            closeWithTransition()
        },
        [closeWithTransition],
    )

    const handleKeyDown = useCallback(
        (e) => {
            if (closeESC && e.key === "Escape") {
                e.preventDefault()
                closeWithTransition()
            }
        },
        [closeESC, closeWithTransition],
    )

    useEffect(() => {
        el.addEventListener("click", handleOutsideClick)
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            el.removeEventListener("click", handleOutsideClick)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [additional, handleKeyDown, handleOutsideClick])

    return createPortal(
        <CloseContext.Provider value={{ closeModal: closeWithTransition }}>
            <ModalChildrenAnimationWrapper
                onKeyDown={handleKeyDown}
                $closing={closing}>
                {children}
            </ModalChildrenAnimationWrapper>
        </CloseContext.Provider>,
        el,
    )
}

export default ModalWindow
