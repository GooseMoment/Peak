import { type TouchEvent, useEffect, useMemo, useState } from "react"
import { useRef } from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"
import AnimatedCount from "@components/social/interaction/reactions/AnimatedCount"
import ReactionGroupTooltip, {
    type TaskReactionGroup,
    TooltipBox,
} from "@components/social/interaction/reactions/ReactionGroupTooltip"

import type { TaskReaction } from "@api/social.api"

interface ReactionButtonProps {
    group: TaskReactionGroup
    onPost: (emojiName: string, isCustom: boolean) => void
    onDelete: (id: TaskReaction["id"]) => void
}

export default function ReactionButton({
    group,
    onPost,
    onDelete,
}: ReactionButtonProps) {
    const [selected, setSelected] = useState(
        group.currentUserReactionID !== undefined,
    )

    const [mobileHovered, setMobileHovered] = useState(false)
    const mobileHoveredTimeout = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setSelected(group.currentUserReactionID !== undefined)
    }, [group.currentUserReactionID])

    const onClick = () => {
        if (selected) {
            if (group.currentUserReactionID !== undefined) {
                onDelete(group.currentUserReactionID)
            }
        } else {
            onPost(group.emojiName, !!group.imageEmoji)
        }
        setSelected(!selected)
    }

    const correctedCount = useMemo(() => {
        if (!group.currentUserReactionID && selected) {
            return group.count + 1
        }

        if (group.currentUserReactionID && !selected) {
            return group.count - 1
        }

        return group.count
    }, [group.count, group.currentUserReactionID, selected])

    const onTouchStart = (e: TouchEvent) => {
        e.preventDefault()

        if (mobileHoveredTimeout.current) {
            clearTimeout(mobileHoveredTimeout.current)
        }

        mobileHoveredTimeout.current = setTimeout(() => {
            setMobileHovered(true)
        }, 300)
    }

    const onTouchEnd = () => {
        if (mobileHoveredTimeout.current) {
            clearTimeout(mobileHoveredTimeout.current)
        }
        setMobileHovered(false)
    }

    if (correctedCount === 0) {
        return null
    }

    return (
        <ReactionButtonContainer
            onClick={onClick}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            $selected={selected}>
            {group.imageEmoji && (
                <Img
                    draggable="false"
                    alt={group.imageEmoji.name}
                    src={group.imageEmoji.img}
                />
            )}
            {group.imageEmoji === null && (
                <UnicodeEmoji>{group.emojiName}</UnicodeEmoji>
            )}
            <AnimatedCount count={correctedCount} selected={selected} />
            <ReactionGroupTooltip group={group} visible={mobileHovered} />
        </ReactionButtonContainer>
    )
}

export const ReactionButtonContainer = styled(MildButton)<{
    $selected?: boolean
}>`
    position: relative;
    height: 2em;
    padding: 0.25em 0.5em;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25em;

    border-radius: 16px;
    background-color: ${(p) =>
        p.$selected
            ? p.theme.social.activeBackgroundColor
            : p.theme.thirdBackgroundColor};

    border: 1.25px solid
        ${(p) => (p.$selected ? p.theme.social.activeColor : "transparent")};

    transition:
        background-color 0.1s ease,
        border-color 0.1s ease;

    @media (hover: hover) {
        &:hover ${TooltipBox} {
            opacity: 1;
            visibility: visible;
            bottom: 40px;
        }
    }
`

const Img = styled.img`
    height: 1.3em;
    min-width: 1.3em;

    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
`

const UnicodeEmoji = styled.p`
    font-size: 1.2em;
    user-select: none;
    -webkit-user-select: none;
`

export const ReactionButtonGroup = styled.div`
    margin-left: auto;
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
`
