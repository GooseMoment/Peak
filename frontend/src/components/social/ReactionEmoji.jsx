import { useState } from "react"
import styled from "styled-components"

const ReactionEmoji = ({emoji}) => {
    const [emojiClick, setEmojiClick] = useState(false)
    
    const handleEmoji = () => {
        setEmojiClick(!emojiClick)
    }
    
    return <EmojiBox onClick={handleEmoji} style={{backgroundColor: emojiClick? "#FFD7C7" : "#F2F2F2"}}>
        {emoji.emoji} {emoji.reactionNum}
    </ EmojiBox>
}

const EmojiBox = styled.div`
display: inline-block;
text-algin: center;

margin-right: 0.5em;
padding: 0.5em;
height: 1em;

border-radius: 0.5em;
`

export default ReactionEmoji