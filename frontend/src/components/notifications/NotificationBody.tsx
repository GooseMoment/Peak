import { useSuspenseQuery } from "@tanstack/react-query"
import styled from "styled-components"

import TaskBox from "@components/social/logDetails/TaskBox"
import TaskBlock from "@components/tasks/TaskBlock"
import FollowButton from "@components/users/FollowButton"
import FollowRequestAction from "@components/users/FollowRequestAction"

import type {
    Notification,
    NotificationFollowing,
    NotificationTaskReaction,
    NotificationTaskReminder,
} from "@api/notifications.api"
import { getTask } from "@api/tasks.api"

export default function NotificationBody({
    notification,
}: {
    notification: Notification
}) {
    if (notification.type === "task_reaction") {
        return <BodyTaskReaction notification={notification} />
    } else if (notification.type === "follow") {
        return <BodyFollow notification={notification} />
    } else if (notification.type === "follow_request") {
        return <BodyFollowRequest notification={notification} />
    } else if (notification.type === "follow_request_accepted") {
        return <BodyFollowRequestAccepted />
    } else if (notification.type === "task_reminder") {
        return <BodyTaskReminder notification={notification} />
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
        <Body>
            <BodyTitle>내 작업에 반응했습니다.</BodyTitle>
            <SectionTitle>에모지</SectionTitle>
            <EmojiBox>
                <div>
                    {isImageEmoji ? (
                        <EmojiImage
                            src={notification.task_reaction.image_emoji?.img}
                            alt={notification.task_reaction.emoji_name}
                            title={notification.task_reaction.emoji_name}
                        />
                    ) : (
                        <UnicodeEmoji>
                            {notification.task_reaction.unicode_emoji}
                        </UnicodeEmoji>
                    )}
                </div>
                {isImageEmoji && <p>{notification.task_reaction.emoji_name}</p>}
            </EmojiBox>
            <SectionTitle>내 작업</SectionTitle>
            <TaskBox
                task={notification.task_reaction.task}
                isFollowingPage
                color="black"
            />
        </Body>
    )
}

function BodyFollow({ notification }: { notification: NotificationFollowing }) {
    return (
        <Body>
            <BodyTitle>나를 팔로우합니다.</BodyTitle>
            <SectionTitle>맞팔로우 하기</SectionTitle>
            <FollowButton username={notification.following.follower.username} />
        </Body>
    )
}

function BodyFollowRequest({
    notification,
}: {
    notification: NotificationFollowing
}) {
    return (
        <Body>
            <BodyTitle>팔로우 요청을 받았습니다.</BodyTitle>
            <SectionTitle>팔로우 요청 승인하기</SectionTitle>
            <FollowRequestAction user={notification.following.follower} />
            <SectionTitle>맞팔로우 하기</SectionTitle>
            <FollowButton username={notification.following.follower.username} />
        </Body>
    )
}

function BodyFollowRequestAccepted() {
    return (
        <Body>
            <BodyTitle>내 팔로우 요청을 수락했습니다.</BodyTitle>
        </Body>
    )
}

function BodyTaskReminder({
    notification,
}: {
    notification: NotificationTaskReminder
}) {
    const { data } = useSuspenseQuery({
        queryKey: ["tasks", notification.task_reminder.task],
        queryFn: () => getTask(notification.task_reminder.task),
    })

    return (
        <Body>
            <BodyTitle>
                작업 마감 {notification.task_reminder.delta}분 전 알림입니다.
            </BodyTitle>
            <SectionTitle>내 작업</SectionTitle>
            <TaskBlock task={data} />
        </Body>
    )
}

const Body = styled.div`
    display: flex;
    flex-direction: column;
`

const BodyTitle = styled.h3`
    font-size: 0.95em;
`

const SectionTitle = styled.h4`
    margin-top: 1em;
    border-top: 1px solid ${(p) => p.theme.secondTextColor};
    padding-top: 1em;

    font-size: 0.95em;
    font-weight: 600;

    margin-bottom: 1em;
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
