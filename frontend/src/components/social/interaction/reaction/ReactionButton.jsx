import styled, { useTheme } from "styled-components"

const ReactionButton = ({ emoji, emojiCount, isSelected, saveReaction }) => {
    const theme = useTheme()

    const handleReaction = () => {
        const action = isSelected ? "delete" : "post"
        saveReaction({ action, emoji:emoji.name })
    }

    return (
        <EmojiBox
            $bgcolor={isSelected ? theme.social.activeBackgroundColor : theme.thirdBackgroundColor}
            onClick={handleReaction}
        >
            <Emoji src={emoji.img} />
            <EmojiCounts>{emojiCount}</EmojiCounts>
        </EmojiBox>
    )
}

// common Button을 상속받는게 더 복잡해질 것 같아 디자인만 유지하겠습니다.
const EmojiBox = styled.div`
    height: 2em;
    width: 4em;

    border-radius: 10px;
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
