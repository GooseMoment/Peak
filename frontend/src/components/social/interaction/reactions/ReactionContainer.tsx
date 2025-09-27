import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import styled from "styled-components"

import EmojiPickerButton, {
    PickerButtonSkeleton,
} from "@components/social/interaction/reactions/EmojiPickerButton"
import ReactionButton from "@components/social/interaction/reactions/ReactionButton"
import type { TaskReactionGroup } from "@components/social/interaction/reactions/ReactionGroupTooltip"

import { getCurrentUsername } from "@api/client"
import {
    TaskReaction,
    TaskReactionPost,
    deleteTaskReaction,
    getTaskReactions,
    postTaskReaction,
} from "@api/social.api"
import type { Task } from "@api/tasks.api"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const me = getCurrentUsername()

function groupTaskReactions(data: TaskReaction[]) {
    const groups: Record<TaskReactionGroup["emojiName"], TaskReactionGroup> = {}

    for (let i = 0; i < data.length; i++) {
        const key = data[i].emoji_name

        if (i === 0 || groups[key] === undefined) {
            groups[key] = {
                emojiName: key,
                imageEmoji: data[i].image_emoji,
                count: 0,
                users: [],
            }
        }

        groups[key].count += 1
        groups[key].users.push(data[i].user)

        if (data[i].user.username === me) {
            groups[key].currentUserReactionID = data[i].id
        }
    }

    return groups
}

export default function ReactionContainer({ task }: { task: Task }) {
    const client = useQueryClient()
    const { t } = useTranslation("translation")
    const {
        data: groups,
        isSuccess,
        isPending,
    } = useQuery({
        queryKey: ["tasks", task.id, "reactions"],
        queryFn() {
            return getTaskReactions(task.id)
        },
        select: groupTaskReactions,
    })

    const postMutation = useMutation({
        mutationFn({
            taskID,
            emoji,
        }: {
            taskID: string
            emoji: TaskReactionPost
        }) {
            return postTaskReaction(taskID, emoji)
        },
        onSuccess() {
            client.invalidateQueries({
                queryKey: ["tasks", task.id, "reactions"],
            })
        },
        onError() {
            toast.error(t("common.error_perform"))
        },
    })

    const deleteMutation = useMutation({
        mutationFn({ reactionID }: { reactionID: TaskReaction["id"] }) {
            return deleteTaskReaction(reactionID)
        },
        onSuccess() {
            client.invalidateQueries({
                queryKey: ["tasks", task.id, "reactions"],
            })
        },
        onError() {
            toast.error(t("common.error_perform"))
        },
    })

    const onPost = (emojiName: string, isCustom: boolean) => {
        postMutation.mutate({
            taskID: task.id,
            emoji: isCustom
                ? { image_emoji: emojiName }
                : { unicode_emoji: emojiName },
        })
    }

    const onDelete = (reactionID: TaskReaction["id"]) => {
        deleteMutation.mutate({ reactionID })
    }

    const onSelectEmoji = (emojiName: string, isCustom: boolean) => {
        if (!isSuccess) {
            return
        }

        const reactionID = groups[emojiName]?.currentUserReactionID
        if (reactionID) {
            onDelete(reactionID)
        } else {
            onPost(emojiName, isCustom)
        }
    }

    return (
        <ReactionButtonGroup>
            {isSuccess &&
                Object.entries(groups).map(([key, group]) => (
                    <ReactionButton
                        key={key}
                        group={group}
                        onPost={onPost}
                        onDelete={onDelete}
                    />
                ))}
            {isSuccess && !!task.completed_at && (
                <EmojiPickerButton onSelectEmoji={onSelectEmoji} />
            )}
            {isPending && <PickerButtonSkeleton />}
        </ReactionButtonGroup>
    )
}

export const ReactionButtonGroup = styled.div`
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
    justify-content: right;
`
