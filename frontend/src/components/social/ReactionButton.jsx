import styled from "styled-components"

const ReactionButton = ({ emoji, isSelected, saveReaction }) => {
    const handleReaction = () => {
        const emojiID = emoji[0].id
        const action = isSelected ? "delete" : "post"
        saveReaction({ action, emojiID })
    }

    return (
        <EmojiBox
            $bgcolor={isSelected ? "#FFD7C7" : "#F2F2F2"}
            onClick={handleReaction}
        >
            <Emoji src={emoji[0].img_uri} />
            <EmojiCounts>{emoji[1]}</EmojiCounts>
        </EmojiBox>
    )
}

const EmojiBox = styled.div`
    height: 2em;
    width: 4em;

    border-radius: 0.5em;
    background-color: ${(props) => props.$bgcolor};

    display: flex;
    justify-content: center;
    align-items: center;
`

const Emoji = styled.img`
    margin-left: 0.4em;
    width: 1.3em;
    height: 1.3em;
`

const EmojiCounts = styled.div`
    flex-grow: 1;
    margin-right: 0.1em;
    font-size: 0.9em;

    display: flex;
    align-items: center;
    justify-content: center;
`

export default ReactionButton
