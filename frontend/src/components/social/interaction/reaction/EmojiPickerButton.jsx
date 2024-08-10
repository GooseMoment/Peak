import { useRef, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import MildButton from "@components/common/MildButton"
import EmojiModal from "@components/social/interaction/reaction/EmojiModal"

import { getEmojis } from "@api/social.api"

import FeatherIcon from "feather-icons-react"

const EmojiPickerButton = ({ setPickedEmoji }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
    const buttonRef = useRef(null)

    const { data: serverEmojis, isFetching } = useQuery({
        queryKey: ["emojis"],
        queryFn: () => getEmojis(),
        staleTime: 5 * 60 * 60 * 1000,
    })

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

    const handleEmoji = (emoji) => {
        setPickedEmoji(emoji)
        setIsModalOpen(false)
    }

    return (
        <>
            <PickerButton onClick={handleOpenModal} ref={buttonRef}>
                <FeatherIcon icon={isModalOpen ? "x-square" : "plus-square"} />
            </PickerButton>
            <EmojiModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen((prev) => !prev)}
                emojis={serverEmojis ? Object.values(serverEmojis) : null}
                onSelect={handleEmoji}
                position={modalPosition}
            />
        </>
    )
}

const PickerButton = styled(MildButton)`
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

export default EmojiPickerButton
