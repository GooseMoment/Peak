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

import { useTranslation } from "react-i18next"

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
    const { t } = useTranslation("translation", { keyPrefix: "notifications" })

    const isImageEmoji = !!notification.task_reaction.image_emoji

    return (
        <Body>
            <BodyTitle>{t("body_task_reaction")}</BodyTitle>
            <SectionTitle>{t("emoji")}</SectionTitle>
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
            <SectionTitle>{t("your_task")}</SectionTitle>
            <TaskBox
                task={notification.task_reaction.task}
                isFollowingPage
                color="black"
            />
        </Body>
    )
}

function BodyFollow({ notification }: { notification: NotificationFollowing }) {
    const { t } = useTranslation("translation", { keyPrefix: "notifications" })

    return (
        <Body>
            <BodyTitle>{t("body_follow")}</BodyTitle>
            <SectionTitle>{t("follow_back")}</SectionTitle>
            <FollowButton username={notification.following.follower.username} />
        </Body>
    )
}

function BodyFollowRequest({
    notification,
}: {
    notification: NotificationFollowing
}) {
    const { t } = useTranslation("translation", { keyPrefix: "notifications" })
    return (
        <Body>
            <BodyTitle>{t("body_follow_request")}</BodyTitle>
            <SectionTitle>{t("approve_follow_request")}</SectionTitle>
            <FollowRequestAction user={notification.following.follower} />
            <SectionTitle>{t("follow_back")}</SectionTitle>
            <FollowButton username={notification.following.follower.username} />
        </Body>
    )
}

function BodyFollowRequestAccepted() {
    const { t } = useTranslation("translation", { keyPrefix: "notifications" })

    return (
        <Body>
            <BodyTitle>{t("body_follow_request_accepted")}</BodyTitle>
        </Body>
    )
}

function BodyTaskReminder({
    notification,
}: {
    notification: NotificationTaskReminder
}) {
    const { t } = useTranslation("translation", { keyPrefix: "notifications" })
    const { data } = useSuspenseQuery({
        queryKey: ["tasks", notification.task_reminder.task],
        queryFn: () => getTask(notification.task_reminder.task),
    })

    return (
        <Body>
            <BodyTitle>
                {t("body_task_reminder", {
                    count: notification.task_reminder.delta,
                })}
            </BodyTitle>
            <SectionTitle>{t("your_task")}</SectionTitle>
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
