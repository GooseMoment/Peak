import { useState } from "react"

import styled, { useTheme } from "styled-components"

import { Portal } from "react-portal"

const EmojiModal = ({ isOpen, onClose, emojis, onSelect, position }) => {
    if (!isOpen || !emojis) return null

    const theme = useTheme()

    const [emojiSearchQuery, setEmojiSearchQuery] = useState("")

    const filteredEmojis = emojis.filter((emoji) =>
        emoji.name.toLowerCase().includes(emojiSearchQuery.toLowerCase()),
    )

    return (
        <Portal>
            <Wrapper>
                <EmojiModalOverlay onClick={onClose} />
                <Modal $posY={position.top} $posX={position.left} $bgColor={theme.backgroundColor} $shadowColor={theme.social.modalShadowColor}>
                    <EmojiSearchBox
                        type="text"
                        placeholder="Search emojis"
                        value={emojiSearchQuery}
                        onChange={(e) => setEmojiSearchQuery(e.target.value)}
                        $bgColor={theme.secondBackgroundColor}
                        color={theme.secondTextColor}
                    />
                    <EmojiList>
                        {filteredEmojis.map((emoji) => (
                            <EmojiListCell
                                key={emoji.id}
                                onClick={() => onSelect(emoji)}
                                $hoverColor={theme.social.modalCellHoverColor}
                            >
                                <EmojiCell
                                    src={emoji.img}
                                    alt={emoji.name}
                                />
                            </EmojiListCell>
                        ))}
                    </EmojiList>
                </Modal>
            </Wrapper>
        </Portal>
    )
}

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
    top: ${(props) => props.$posY}px;
    left: calc(${(props) => props.$posX}px - 33em); // 32 + 1(shadow)
    width: 30em;
    height: 24em;
    
    box-shadow: 0.2em 0.3em 0.5em ${(props) => props.$shadowColor};
    border: 0.1em solid ${(props) => props.$shadowColor};
    border-radius: 1em;
    background: ${(props) => props.$bgColor};
    padding: 1em;

    overflow-y: auto;
    z-index: 10;
    pointer-events: auto;
`

const EmojiSearchBox = styled.input`
    margin-bottom: 1em;
    width: 27em;
    height: 2em;

    border-radius: 0.4em;
    background-color: ${(props) => props.$bgColor};
    padding: 0 0.8em 0;

    font-size: inherit;
    line-height: 1.3em;
`

const EmojiList = styled.div`
    width: 100%;

    display: flex;
    flex-wrap: wrap;
    justify-content: left;
`

const EmojiListCell = styled.li`
    aspect-ratio: 1/1;
    width: calc(100% / 8);

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.$hoverColor};
    }
`

const EmojiCell = styled.img`
    width: 2.4em;
    height: 2.4em;
    
    padding: 0.2em;
`

export default EmojiModal
