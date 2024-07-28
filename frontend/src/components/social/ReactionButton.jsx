import { useState } from "react"
import styled from "styled-components"

const ReactionButton = ({emoji}) => {
    const [emojiClick, setEmojiClick] = useState(false)
    
    const handleEmoji = () => {
        setEmojiClick(prev => !prev)
    }
    // onClick={handleEmoji} 
    return <EmojiBox $bgcolor={emojiClick? "#FFD7C7" : "#F2F2F2"}>
        <Emoji src={emoji[0].img_uri} />
        {/* <EmojiCounts>{emoji[1]}</EmojiCounts> */}
        <EmojiCounts>99</EmojiCounts>
    </ EmojiBox>
}

const EmojiBox = styled.div`
    margin-right: 0.5em;
    height: 2em;
    width: 4em;
    padding: 0.2em;

    border-radius: 0.5em;
    background-color: ${props => props.$bgcolor};

    font-size: 1em;

    display: flex;
    flex: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
`

const Emoji = styled.img`
    width: 1.6em;
    height: 1.6em;
`

const EmojiCounts = styled.div`
    width: 1.4em;
    height: 1.6em;
    
    font-size: 0.9em;

    display: flex;
    align-items: center;
    justify-content: center;
`

export default ReactionButton