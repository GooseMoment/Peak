import styled from "styled-components"

import MildButton from "@components/common/MildButton"

import type { Emoji } from "@api/social.api"
import type { User } from "@api/users.api"

interface ReactionButtonProps {
    imageEmoji: Emoji | null
    unicodeEmoji: string | null
    users: User[]
    count: number
    isSelected?: boolean
}

export default function ReactionButton({
    imageEmoji,
    unicodeEmoji,
    users,
    count,
    isSelected,
}: ReactionButtonProps) {
    return (
        <ReactionButtonContainer $selected={isSelected}>
            {imageEmoji && <Img src={imageEmoji.img} />}
            {unicodeEmoji && <UnicodeEmoji>{unicodeEmoji}</UnicodeEmoji>}
            <EmojiCount $selected={isSelected}>{count}</EmojiCount>
            <Tooltip>
                {imageEmoji && (
                    <div>
                        <TooltipImg
                            src={imageEmoji.img}
                            alt={imageEmoji.name}
                        />
                        <TooltipImgName>{imageEmoji.name}</TooltipImgName>
                    </div>
                )}
                {unicodeEmoji && (
                    <TooltipUnicode>{unicodeEmoji}</TooltipUnicode>
                )}
                <TooltipUserList>
                    {users.slice(0, 3).map((user) => (
                        <TooltipUser key={user.username}>
                            <img src={user.profile_img} />
                            <p>{user.username}</p>
                        </TooltipUser>
                    ))}
                    {count > 3 && (
                        <TooltipUserMore>그 외 {count - 3}명</TooltipUserMore>
                    )}
                </TooltipUserList>
            </Tooltip>
        </ReactionButtonContainer>
    )
}

const Tooltip = styled.div`
    position: absolute;
    bottom: 20px;
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
