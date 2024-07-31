import { useState, useRef } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import EmojiModal from "@components/social/EmojiModal"

import { getEmojis } from "@api/social.api"

const EmojiPickerButton = ({pickedEmoji, setPickedEmoji}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalPosition, setModalPosition] = useState({top: 0, left: 0})
    const buttonRef = useRef(null)

    const { data: serverEmojis, isError: emojiError, isFetching } = useQuery({
        queryKey: ["emojis"],
        queryFn: () => getEmojis(),
    })

    const handleOpenModal = () => {
        if(!isModalOpen) {
            if(buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setModalPosition({
                    top: rect.top,
                    left: rect.left,
                });
            }
        }
        setIsModalOpen(prev => !prev)
    }

    const handleEmoji = (emoji) => {
        setPickedEmoji(emoji)
        setIsModalOpen(false)
    }

    return <>
        <PickerButton onClick={handleOpenModal} ref={buttonRef}>
            <FeatherIcon icon={isModalOpen ? "x-square" : "plus-square"} />
        </PickerButton>
        <EmojiModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(prev => !prev)}
            emojis={serverEmojis?Object.values(serverEmojis):null}
            onSelect={handleEmoji}
            position={modalPosition}
        /> 
    </>
}

const PickerButton = styled.div`
height: 1.2em;
width: 1.5em;
padding: 0.5em;

border: 0;
background-color: inherit;

display: flex;
align-items: center;
justify-content: center;
`

export default EmojiPickerButton