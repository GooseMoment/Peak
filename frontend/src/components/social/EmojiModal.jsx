import React from 'react';
import { Portal } from 'react-portal';
import './EmojiModal.css';
import styled from 'styled-components';

const EmojiModal = ({ isOpen, onClose, emojis, onSelect, position }) => {
    if (!isOpen) return null

    return (
        <Portal>
            <Wrapper>
                <EmojiModalOverlay onClick={onClose} />
                <Modal style={{
                        top: position.top,
                        left: position.left,
                    }} >
                    <EmojiList>
                        emojis && {Object.values(emojis).map(emoji => (
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
    background: white;
    padding: 1.5em;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-height: 80vh;
    overflow-y: auto;
    z-index: 10;
    pointer-events: auto;
`

const EmojiList = styled.div`
    
`

export default EmojiModal;