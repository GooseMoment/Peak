import React from 'react';
import { Portal } from 'react-portal';
import './EmojiModal.css';
import styled from 'styled-components';
import { useState } from 'react';

const EmojiModal = ({ isOpen, onClose, emojis, onSelect, position }) => {
    if (!isOpen || !emojis) return null

    const [emojiSearchQuery, setEmojiSearchQuery] = useState('')

    const filteredEmojis = emojis.filter(emoji =>
        emoji.name.toLowerCase().includes(emojiSearchQuery.toLowerCase())
    );

    return (
        <Portal>
            <Wrapper>
                <EmojiModalOverlay onClick={onClose} />
                <Modal $posY={position.top} $posX={position.left}>
                    <EmojiSearchBox 
                        type='text'
                        placeholder='Search emojis'
                        value={emojiSearchQuery}
                        onChange={(e) => setEmojiSearchQuery(e.target.value)}
                    />
                    <EmojiList>
                        {filteredEmojis.map(emoji => (
                            <li key={emoji.id} onClick={() => onSelect(emoji)}>
                                <img src={emoji.img_uri} alt={emoji.name} />
                                <span>{emoji.name}</span>
                            </li>
                        ))}
                    </EmojiList>
                </Modal>
            </Wrapper>
        </Portal>
    );
};

const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`

const EmojiModalOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
`

const Modal = styled.div`
    position: absolute;
    top: ${props => props.$posY}px;
    left: calc(${props => props.$posX}px - 34em); // 33 + 1(shadow)
    background: white;
    padding: 1em;
    border-radius: 1em;
    border: 0.2em solid rgba(123, 123, 123, 0.1);
    box-shadow: 0.2em 0.2em 0.4em rgba(0, 0, 0, 0.1);
    width: 30em;
    height: 24em;
    overflow-y: auto;
    z-index: 10;
    pointer-events: auto;
`

const EmojiSearchBox = styled.input`
    font-size: inherit;
    width: 27em;
    height: 2em;
    line-height: 1.3em;
    padding: 0 0.8em 0;
    border-radius: 0.4em;
    background-color: #f2f2f2;
`

const EmojiList = styled.div`
    
`

export default EmojiModal;