import styled from "styled-components"

const EmojiButton = ({emoji, isHover, setIsHover, setIsModalOpen}) => {

    return <EmojiBox 
        onMouseEnter={e => setIsHover(emoji)}
        onClick={() => setIsModalOpen(false)}
        $bgcolor = {isHover===emoji ? "#FFD7C7" : "inherit" }
    >
        <Emoji src={emoji} />
    </EmojiBox>
}

const EmojiBox = styled.div`
margin: 0.5rem 0.2 rem 0.5rem;
padding: 0.5rem;

font-size: 1.2rem;

text-align: center;

border-radius: 0.5rem;

background-color: ${props => props.$bgcolor};
`

const Emoji = styled.img`
    height: 1.5em;
    width: 1.5em;
`

export default EmojiButton