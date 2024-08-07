import { useState, useRef } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import EmojiModal from "@components/social/EmojiModal"
import MildButton from "@components/common/MildButton"

import { getEmojis } from "@api/social.api"

const EmojiPickerButton = ({pickedEmoji, setPickedEmoji}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalPosition, setModalPosition] = useState({top: 0, left: 0})
    const buttonRef = useRef(null)

    // TODO: EmojiModal에서 시행?
    const { data: serverEmojis, isError: emojiError, isFetching } = useQuery({
        queryKey: ["emojis"],
        queryFn: () => getEmojis(),
        staleTime: 60*60*5*1000,
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