import { useMemo, useState } from "react"

import { useQuery } from "@tanstack/react-query"

import SubSection from "@components/intro/SubSection"
import { today } from "@components/intro/todays"
import EmojiPickerButton from "@components/social/reactions/EmojiPickerButton"
import ReactionButton from "@components/social/reactions/ReactionButton"
import { ReactionButtonGroup } from "@components/social/reactions/ReactionContainer"
import type { TaskReactionGroup } from "@components/social/reactions/ReactionGroupTooltip"
import { DemoTaskFrame } from "@components/tasks/TaskFrame"

import { getEmojis } from "@api/social.api"

import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

const DemoCheer = () => {
    const { t } = useTranslation("intro", {
        keyPrefix: "section_cheer.demo_cheer",
    })

    const [reactionGroups, setReactionGroups] = useState<
        Record<string, TaskReactionGroup>
    >(() => {
        return {
            "👍": { emojiName: "👍", imageEmoji: null, count: 3, users: [] },
            "🎉": { emojiName: "🎉", imageEmoji: null, count: 2, users: [] },
        }
    })

    const task = useMemo(() => makeTask(t), [t])

    const { data: imageEmojis, isSuccess } = useQuery({
        queryKey: ["emojis"],
        queryFn: () => getEmojis(),
    })

    const onPost = (emojiName: string, isCustom: boolean) => {
        setReactionGroups((prev) => {
            const group = prev[emojiName] || {
                emojiName,
                imageEmoji:
                    isCustom && isSuccess
                        ? imageEmojis.find((emoji) => emoji.name === emojiName)
                        : null,
                count: 1,
                users: [],
                currentUserReactionID: emojiName,
            }
            return {
                ...prev,
                [emojiName]: {
                    ...group,
                },
            }
        })
    }

    const onDelete = (emojiName: string) => {
        setReactionGroups((prev) => {
            const group = prev[emojiName]
            if (!group) return prev

            if (group.currentUserReactionID && group.count === 1) {
                const { [emojiName]: _, ...others } = prev
                return others
            }

            return {
                ...prev,
                [emojiName]: { ...group },
            }
        })
    }

    const onSelectEmoji = (emojiName: string, isCustom: boolean) => {
        if (reactionGroups[emojiName]?.count > 0) {
            onDelete(emojiName)
        } else {
            onPost(emojiName, isCustom)
        }
    }

    return (
        <SubSection>
            <DemoTaskFrame task={task} color="blue" />
            <ReactionButtonGroup>
                {Object.entries(reactionGroups).map(([key, group]) => (
                    <ReactionButton
                        key={key}
                        group={group}
                        onPost={onPost}
                        onDelete={onDelete}
                    />
                ))}
                <EmojiPickerButton onSelectEmoji={onSelectEmoji} />
            </ReactionButtonGroup>
        </SubSection>
    )
}

const makeTask = (t: TFunction<"intro", "section_cheer.demo_cheer">) => ({
    name: t("task_name"),
    completed_at: today,
    due_type: null,
    due_date: null,
    due_datetime: null,
    priority: 0,
})

export default DemoCheer
