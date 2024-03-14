import { useState, useRef } from "react";
import styled from "styled-components";
import FeatherIcon from "feather-icons-react";
import { createPortal } from "react-dom";

import EmojiButton from "@components/social/EmojiButton";

const EmojiModal = ({isModalOpen, setIsModalOpen}) => {
    if(!isModalOpen) 
        return null

    const [isHover, setIsHover] = useState(false)
    const emojis = [
        "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "🥲", "😚", "🤗", "🙂", "🤩", "🤔"
    ]

    return <EmojiLists>
        {
            emojis.map(emoji =>
                    <EmojiButton emoji={emoji} isHover={isHover} setIsHover={setIsHover} setIsModalOpen={setIsModalOpen}/>
            )
        }
    </EmojiLists>
}

const EmojiAddButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const modalBackground = useRef()

    return <>
        <AddEmojiButton onClick={() => setIsModalOpen(!isModalOpen)}>
            <FeatherIcon icon={isModalOpen ? "x-square" : "plus-square"}/>    
        </AddEmojiButton>
        {
            isModalOpen &&
            <ModalContainer 
                ref={modalBackground} 
                onClick={ e => {
                    if (e.target === modalBackground.current) {
                        setIsModalOpen(false)
                    }
                }}
            >
                <EmojiModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>   
            </ModalContainer>
        }
    </>
}

const AddEmojiButton = styled.div`
display: inline-block;

background-color: inherit;
border: 0;

height: 1em;
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

export default EmojiAddButton