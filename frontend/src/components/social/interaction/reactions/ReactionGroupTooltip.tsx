import styled, { css } from "styled-components"

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

export default function ReactionGroupTooltip({
    group,
    visible,
}: {
    group: TaskReactionGroup
    visible?: boolean
}) {
    const { t } = useTranslation("translation")
    return (
        <TooltipBox $visible={visible}>
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
        </TooltipBox>
    )
}

export const TooltipBox = styled.div<{ $visible?: boolean }>`
    pointer-events: none;

    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 10px;
    border-radius: 10px;
    font-size: 0.75em;
    background-color: ${(p) => p.theme.thirdBackgroundColor};

    display: flex;
    align-items: center;
    gap: 1em;

    transition: all 0.2s ease;

    opacity: 0;
    visibility: hidden;
    bottom: 30px;

    ${(p) =>
        p.$visible &&
        css`
            opacity: 1;
            visibility: visible;
            bottom: 40px;
        `}
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
