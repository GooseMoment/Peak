import { useEffect, useMemo, useState } from "react"

import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import type { Emoji, TaskReaction } from "@api/social.api"
import type { User } from "@api/users.api"

import { useTranslation } from "react-i18next"

export interface TaskReactionGroup {
    emojiName: string
    imageEmoji: Emoji | null
    count: number
    users: User[]
    currentUserReactionID?: TaskReaction["id"]
}

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
    const { t } = useTranslation("translation")

    const [selected, setSelected] = useState(
        group.currentUserReactionID !== undefined,
    )

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

    if (correctedCount === 0) {
        return null
    }

    return (
        <ReactionButtonContainer onClick={onClick} $selected={selected}>
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
            <EmojiCount $selected={selected}>{correctedCount}</EmojiCount>
            <Tooltip>
                {group.imageEmoji && (
                    <div>
                        <TooltipImg
                            draggable="false"
                            src={group.imageEmoji.img}
                            alt={group.imageEmoji.name}
                        />
                        <TooltipImgName>{group.imageEmoji.name}</TooltipImgName>
                    </div>
                )}
                {group.imageEmoji === null && (
                    <TooltipUnicode>{group.emojiName}</TooltipUnicode>
                )}
                <TooltipUserList>
                    {group.users.slice(0, 3).map((user) => (
                        <TooltipUser key={user.username}>
                            <img src={user.profile_img} />
                            <p>{user.username}</p>
                        </TooltipUser>
                    ))}
                    {group.count > 3 && (
                        <TooltipUserMore>
                            {t("social.reactions.more", {
                                count: group.count - 3,
                            })}
                        </TooltipUserMore>
                    )}
                </TooltipUserList>
            </Tooltip>
        </ReactionButtonContainer>
    )
}

const Tooltip = styled.div`
    pointer-events: none;

    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 10px;
    border-radius: 10px;
    font-size: 0.75em;
    background-color: ${(p) => p.theme.thirdBackgroundColor};

    display: flex;
    align-items: center;
    gap: 1em;

    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
`

const TooltipImgName = styled.p`
    font-size: 0.7rem;
`

const TooltipImg = styled.img`
    max-height: 2rem;
    height: auto;
`

const TooltipUnicode = styled.p`
    font-size: 2.2rem;
`

const TooltipUserList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25em;
`

const TooltipUserMore = styled.div`
    font-size: 0.9em;
    color: ${(p) => p.theme.secondTextColor};
`

const TooltipUser = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25em;

    & img {
        height: 1.5em;
        width: 1.5em;
        border-radius: 50%;
    }

    & p {
        font-weight: 500;
    }
`

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

    &:hover ${Tooltip} {
        opacity: 1;
        visibility: visible;
        bottom: 40px;
    }
`

const Img = styled.img`
    height: 1.3em;
    min-width: 1.3em;
`

const UnicodeEmoji = styled.p`
    font-size: 1.2em;
`

const EmojiCount = styled.p<{ $selected?: boolean }>`
    font-weight: 600;
    min-width: 0.9em;
    text-align: right;

    color: ${(p) =>
        p.$selected ? p.theme.social.activeColor : p.theme.textColor};

    transition: color 0.1s ease;
`

export const ReactionButtonGroup = styled.div`
    margin-left: auto;
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
`
