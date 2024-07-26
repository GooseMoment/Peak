import { useState, useRef } from "react"
import styled from "styled-components"
import FeatherIcon from "feather-icons-react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { getEmojis } from "@api/social.api"

import EmojiButton from "@components/social/EmojiButton"
import EmojiModal from "@components/social/EmojiModal"

// const EmojiModal = ({isModalOpen, setIsModalOpen}) => {
//     if(!isModalOpen) 
//         return null

//     const [isHover, setIsHover] = useState(false)
//     const emojis = [
//         "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "🥲", "😚", "🤗", "🙂", "🤩", "🤔"
//     ]

//     return <EmojiLists>
//         {
//             emojis.map(emoji =>
//                     <EmojiButton key={emoji} emoji={emoji} isHover={isHover} setIsHover={setIsHover} setIsModalOpen={setIsModalOpen}/>
//             )
//         }
//     </EmojiLists>
// }

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
        setSelectedEmoji(emoji)
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

const ModalContainer = styled.div`
z-index: 999;
position: absolute;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
`

const EmojiLists = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: center;

max-width: 20rem;
max-height: 20rem;
overflow-y: auto;

// IE and Edge
-ms-overflow-style: none;
// Firefox
scrollbar-width: none;
// Chrome, Safari, Opera
&::-webkit-scrollbar {
    display: none;
}
    
border-radius: 1rem;
border: 1px solid #E6E6E6;
background-color: #FEFDFC;
box-shadow: 0.3rem 0.3rem 0.5rem #e6e6e6;

margin-top: 15%;
margin-left: 60%;
padding: 1rem 0 1rem;
`

export default EmojiPickerButton