import { useRef, useState } from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"
import CommentModal from "@components/social/CommentModal"

import FeatherIcon from "feather-icons-react"

const CommentButton = ({ parentType, parent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
    const buttonRef = useRef(null)

    // TODO: comment 있으면 이모지 다른 모양으로?
    const handleOpenModal = () => {
        if (!isModalOpen) {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect()
                setModalPosition({
                    top: rect.top,
                    left: rect.left,
                })
            }
        }
        setIsModalOpen((prev) => !prev)
    }

    return (
        <>
            <ButtonBox onClick={handleOpenModal} ref={buttonRef}>
                <FeatherIcon icon={"message-square"} />
            </ButtonBox>
            {isModalOpen && (
                <CommentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen((prev) => !prev)}
                    position={modalPosition}
                    parentType={parentType}
                    parent={parent}
                />
            )}
        </>
    )
}

const ButtonBox = styled(MildButton)`
    height: 2em;
    width: 1.5em;

    display: flex;
    align-items: center;
    justify-content: center;

    & svg {
        top: unset;
        margin-right: unset;
    }
`

export default CommentButton
