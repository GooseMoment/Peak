import { memo, useCallback } from "react"

import { useQuery } from "@tanstack/react-query"
import styled, { LightDark, useTheme } from "styled-components"

import { ReactionButtonContainer } from "@components/social/reactions/ReactionButton"

import { Emoji, getEmojis } from "@api/social.api"

import useModal, { Portal } from "@utils/useModal"

import { skeletonBreathingCSS } from "@assets/skeleton"

import EmojiPicker, {
    type EmojiClickData,
    Theme as EmojiPickerTheme,
    EmojiStyle,
} from "emoji-picker-react"
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
    const modal = useModal()
    const theme = useTheme()

    const { data: imageEmojis } = useQuery({
        queryKey: ["emojis"],
        queryFn: () => getEmojis(),
        staleTime: 1000 * 60 * 30,
        select(data) {
            return data.map(convertEmojiToCustomEmoji)
        },
    })

    const handleEmoji = useCallback(
        (emoji: EmojiClickData) => {
            onSelectEmoji(emoji.emoji, emoji.isCustom)
            modal.closeModal()
        },
        [onSelectEmoji, modal],
    )

    return (
        <div className={className}>
            <PickerButton
                onClick={modal.toggleModal}
                aria-haspopup="dialog"
                aria-expanded={modal.isOpen}>
                <FeatherIcon icon={modal.isOpen ? "x" : "plus"} />
            </PickerButton>
            <Portal modal={modal}>
                <MemoizedPicker
                    themeType={theme.type}
                    handleEmoji={handleEmoji}
                    imageEmojis={imageEmojis}
                />
            </Portal>
        </div>
    )
}

const MemoizedPicker = memo(function MemoizedPicker({
    themeType,
    handleEmoji,
    imageEmojis,
}: {
    themeType: LightDark
    handleEmoji: (emoji: EmojiClickData) => void
    imageEmojis?: CustomEmoji[]
}) {
    return (
        <EmojiPicker
            open
            lazyLoadEmojis
            skinTonesDisabled
            emojiStyle={EmojiStyle.NATIVE}
            onEmojiClick={handleEmoji}
            customEmojis={imageEmojis}
            theme={
                themeType === "dark"
                    ? EmojiPickerTheme.DARK
                    : EmojiPickerTheme.LIGHT
            }
        />
    )
})

const PickerButton = styled(ReactionButtonContainer)`
    border-color: ${(p) => p.theme.textColor};
    border-width: 1.5px;
    width: 2em;
    padding: 0.25em;

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
