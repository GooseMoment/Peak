import { useState } from "react"

import styled from "styled-components"

import ReactionButtonOrigial from "@components/social/interaction/reaction/ReactionButton"

const ReactionButton = ({ emoji, emojiCount }) => {
    const [selected, setSelected] = useState(emoji.selected)

    const simulateSave = () => {
        setSelected((prev) => !prev)
    }

    return (
        <ReactionButtonOrigial
            emoji={emoji}
            emojiCount={selected ? emojiCount + 1 : emojiCount}
            isSelected={selected}
            saveReaction={simulateSave}
        />
    )
}

export const ReactionButtonGroup = styled.div`
    display: flex;
    gap: 0.5em;
    margin-top: 0.25em;
`

export default ReactionButton
