import { useEffect, useMemo, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import SubSection from "@components/intro/SubSection"
import { today } from "@components/intro/todays"
import { getProjectColor } from "@components/project/common/palettes"
import { Modal as EmojiModalWindow } from "@components/social/interaction/reaction/EmojiModal"
import EmojiPickerButton from "@components/social/interaction/reaction/EmojiPickerButton"
import ReactionButton from "@components/social/interaction/reaction/ReactionButton"
import TaskFrame from "@components/tasks/TaskFrame"

import { getEmojis } from "@api/social.api"

import { useTranslation } from "react-i18next"

const DemoCheer = () => {
    const theme = useTheme()
    const { t } = useTranslation("intro", {
        keyPrefix: "section_cheer.demo_cheer",
    })

    const [selectedEmojis, setSelectedEmojis] = useState([])

    const { data: emojis, isPending } = useQuery({
        queryKey: ["emojis"],
        queryFn: async () => {
            const emojis = await getEmojis()
            setSelectedEmojis(emojis.slice(0, 2))
            return emojis
        },
        staleTime: 1000 * 60 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    const task = useMemo(() => makeTask(t, theme), [t, theme])

    useEffect(() => {
        // in case IntroPage was not initially loaded.
        // e.g. Navigated from SignPage
        if (emojis) {
            setSelectedEmojis(emojis.slice(0, 2))
        }
    }, [])

    const onPickEmoji = (emoji) => {
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

    const onClickEmoji = ({ emoji }) => {
        // emoji: string (emoji.name)

        setSelectedEmojis(
            selectedEmojis.map((e) => {
                if (e.name === emoji) {
                    e.selected = !e.selected
                }

                return e
            }),
        )
    }

    return (
        <SubSection>
            <TaskFrame task={task} color={task.color} isSocial />
            <ReactionButtonGroup>
                {selectedEmojis.map((emoji) => (
                    <ReactionButton
                        key={emoji.name}
                        emoji={emoji}
                        emojiCount={
                            emoji.selected
                                ? emoji.name.length + 1
                                : emoji.name.length
                        }
                        isSelected={emoji.selected}
                        saveReaction={onClickEmoji}
                    />
                ))}
                {isPending ||
                    (selectedEmojis.length < 7 && (
                        <CustomizedPickerButton setPickedEmoji={onPickEmoji} />
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

export const ReactionButtonGroup = styled.div`
    display: flex;
    gap: 0.5em;
    margin-top: 0.25em;
`

export default DemoCheer
