import { useMemo, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import ReactionButton, {
    ReactionButtonGroup,
} from "@components/intro/ReactionButton"
import SubSection from "@components/intro/SubSection"
import { today } from "@components/intro/todays"
import { getProjectColor } from "@components/project/Creates/palettes"
import { Modal as EmojiModalWindow } from "@components/social/interaction/reaction/EmojiModal"
import TaskFrame from "@components/tasks/TaskFrame"

import EmojiPickerButton from "../social/interaction/reaction/EmojiPickerButton"

import { getEmojis } from "@api/social.api"

import { useTranslation } from "react-i18next"

const DemoCheer = () => {
    const theme = useTheme()
    const { t } = useTranslation("intro", {
        keyPrefix: "section_cheer.demo_cheer",
    })

    const [selectedEmojis, setSelectedEmojis] = useState([])

    const { isPending } = useQuery({
        queryKey: ["emojis"],
        queryFn: async () => {
            const emojis = await getEmojis()
            setSelectedEmojis(emojis.slice(0, 2))
            return emojis
        },
        staleTime: 1000 * 60 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    const task = useMemo(() => makeTask(t, theme), [t, theme])

    const onClickEmoji = (emoji) => {
        emoji.selected = true

        const found = selectedEmojis.find((e) => e.name === emoji.name)
        if (found) {
            setSelectedEmojis(
                selectedEmojis.map((e) => {
                    if (e.name === emoji.name) {
                        return emoji
                    }

                    return e
                }),
            )
            return
        }

        setSelectedEmojis([...selectedEmojis, emoji])
    }

    return (
        <SubSection>
            <TaskFrame task={task} color={task.color} />
            <ReactionButtonGroup>
                {selectedEmojis.map((emoji) => (
                    <ReactionButton
                        key={emoji.name}
                        emoji={emoji}
                        emojiCount={emoji.name.length}
                    />
                ))}
                {isPending ||
                    (selectedEmojis.length < 7 && (
                        <CustomizedPickerButton setPickedEmoji={onClickEmoji} />
                    ))}
            </ReactionButtonGroup>
        </SubSection>
    )
}

const makeTask = (t, theme) => ({
    name: t("task_name"),
    completed_at: today,
    color: getProjectColor(theme.type, "green"),
})

const CustomizedPickerButton = styled(EmojiPickerButton)`
    ${EmojiModalWindow} {
        top: 30dvh !important;
        left: auto !important;
    }
`

export default DemoCheer
