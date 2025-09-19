import styled from "styled-components"

import TaskBox from "@components/social/logDetails/TaskBox"

import type {
    Notification,
    NotificationTaskReaction,
} from "@api/notifications.api"

export default function NotificationBody({
    notification,
}: {
    notification: Notification
}) {
    if (notification.type === "task_reaction") {
        return <BodyTaskReaction notification={notification} />
    }

    return null
}

function BodyTaskReaction({
    notification,
}: {
    notification: NotificationTaskReaction
}) {
    const isImageEmoji = !!notification.task_reaction.image_emoji

    return (
        <>
            <ParagraphTitle>내 작업에 반응했습니다.</ParagraphTitle>
            <EmojiBox>
                <div>
                    {isImageEmoji ? (
                        <EmojiImage
                            src={notification.task_reaction.image_emoji?.img}
                        />
                    ) : (
                        <UnicodeEmoji>
                            {notification.task_reaction.unicode_emoji}
                        </UnicodeEmoji>
                    )}
                </div>
                {isImageEmoji && <p>{notification.task_reaction.emoji_name}</p>}
            </EmojiBox>
            <ParagraphTitle>내 작업:</ParagraphTitle>
            <TaskBox
                task={notification.task_reaction.task}
                isFollowingPage
                color="black"
            />
        </>
    )
}

const ParagraphTitle = styled.h4`
    margin-top: 0.5em;
    font-size: 0.95em;
    margin-bottom: 0.5em;
`

const EmojiBox = styled.div`
    background-color: ${(p) => p.theme.thirdBackgroundColor};
    border: 1px solid ${(p) => p.theme.primaryColors.link};
    border-radius: 16px;
    width: 100%;
    box-sizing: border-box;
    padding: 1.25em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;

    p {
        font-size: 0.9em;
    }
`

const EmojiImage = styled.img`
    height: 2em;
    vertical-align: text-bottom;
    transition: transform 0.2s var(--cubic);

    &:hover {
        transform: scale(1.25);
    }
`

const UnicodeEmoji = styled.span`
    display: block;
    font-size: 2em;
    line-height: 1em;

    transition: transform 0.2s var(--cubic);

    &:hover {
        transform: scale(1.25);
    }
`
