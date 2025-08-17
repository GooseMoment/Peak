import { useState } from "react"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import ModalWindow from "@components/common/ModalWindow"
import { ReactionButtonContainer } from "@components/social/interaction/reactions/ReactionButton"

import { Emoji, getEmojis } from "@api/social.api"

import { skeletonBreathingCSS } from "@assets/skeleton"

import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
import type { CustomEmoji } from "emoji-picker-react/dist/config/customEmojiConfig"
import FeatherIcon from "feather-icons-react"

function convertEmojiToCustomEmoji(emoji: Emoji): CustomEmoji {
    return {
        names: [emoji.name],
        id: emoji.name,
        imgUrl: emoji.img,
    }
}

interface EmojiPickerButtonProps {
    onSelectEmoji: (emoji: string, isCustom: boolean) => void
    className?: string
}

export default function EmojiPickerButton({
    onSelectEmoji,
    className,
}: EmojiPickerButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { data: imageEmojis } = useQuery({
        queryKey: ["emojis"],
        queryFn: () => getEmojis(),
        staleTime: 1000 * 60 * 30,
        select(data) {
            return data.map(convertEmojiToCustomEmoji)
        },
    })

    const handleEmoji = (emoji: EmojiClickData) => {
        onSelectEmoji(emoji.emoji, emoji.isCustom)
        setIsModalOpen(false)
    }

    return (
        <div className={className}>
            <PickerButton onClick={() => setIsModalOpen(!isModalOpen)}>
                <FeatherIcon icon="plus" />
            </PickerButton>
            {isModalOpen && (
                <ModalWindow afterClose={() => setIsModalOpen(false)}>
                    <EmojiPicker
                        open
                        onEmojiClick={handleEmoji}
                        customEmojis={imageEmojis}
                    />
                </ModalWindow>
            )}
        </div>
    )
}

const PickerButton = styled(ReactionButtonContainer)`
    background-color: ${(p) => p.theme.secondTextColor};
    color: ${(p) => p.theme.backgroundColor};

    & svg {
        top: 0;
        margin-right: 0;
        stroke-width: 3.5px;
    }
`

export const PickerButtonSkeleton = styled(PickerButton)`
    width: 3.75em;
    border-color: transparent;

    ${skeletonBreathingCSS}
`
