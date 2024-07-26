import { useState, useRef } from "react"
import styled from "styled-components"
import FeatherIcon from "feather-icons-react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { getEmojis } from "@api/social.api"

import EmojiButton from "@components/social/EmojiButton"
import EmojiModal from "@components/social/EmojiModal"


const EmojiPickerButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedEmoji, setSelectedEmoji] = useState(false)
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
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                });
            }
        }
        setIsModalOpen(prev => !prev)
    }

    const handleSelectEmoji = (emoji) => {
        if (emoji === selectedEmoji) setSelectedEmoji(false)
        else setSelectedEmoji(emoji)
        setIsModalOpen(false)
    }

    return <>
        <PickerButton onClick={handleOpenModal} ref={buttonRef}>
            <FeatherIcon icon={isModalOpen ? "x-square" : "plus-square"}/>
        </PickerButton>
        {selectedEmoji && (
                <div>
                    <img src={selectedEmoji.img_uri} alt={selectedEmoji.name} />
                    <span>{selectedEmoji.name}</span>
                </div>
        )}

        <EmojiModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(prev => !prev)}
            emojis={serverEmojis?Object.values(serverEmojis):null}
            onSelect={handleSelectEmoji}
            position={modalPosition}
        /> 
    </>
}

const PickerButton = styled.div`
display: flex;
align-items: center;
justify-content: center;

background-color: inherit;
border: 0;

height: 1em;
width: 1.5em;
padding: 0.5em;
`

export default EmojiPickerButton