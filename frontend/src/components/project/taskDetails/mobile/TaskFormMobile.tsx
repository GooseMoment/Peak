import { useEffect, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import ModalBottomSheet from "@components/common/ModalBottomSheet"
import ContentsMobile from "@components/project/taskDetails/mobile/ContentsMobile"
import type { TaskContent } from "@components/tasks/Contents"
import TaskNameInput from "@components/tasks/TaskNameInput"

import { type TaskReminderDelta, postReminder } from "@api/notifications.api"
import type { MinimalTask, Task } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import { opacityUp } from "@assets/keyframes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

interface TaskFormMobileProps {
    newTask: MinimalTask
    handleChange: (diff: Partial<MinimalTask>) => void
    save: () => Promise<Task>
    isPending: boolean
    onClose: () => void
    handleAlert?: () => void
    isCreating?: boolean
}

const TaskFormMobile = ({
    newTask,
    handleChange,
    save,
    isPending,
    onClose,
    handleAlert,
    isCreating = false,
}: TaskFormMobileProps) => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })
    const inputRef = useRef<HTMLInputElement>(null)

    const theme = useTheme()

    const [title, setTitle] = useState<string | null>(null)
    const [activeContent, setActiveContent] = useState<TaskContent | null>(null)

    useEffect(() => {
        if (activeContent === null) {
            if (isCreating) setTitle(t("edit.create_title"))
            else setTitle(t("edit.edit_title"))
        } else if (activeContent) {
            setTitle(t(`${activeContent}.title`))
        }
    }, [activeContent])

    const postReminderMutation = useMutation({
        mutationFn: (data: {
            task: string
            reminders: TaskReminderDelta[]
        }) => {
            const deltaList = data.reminders.map((reminder) => reminder.delta)
            return postReminder({ task: data.task, delta_list: deltaList })
        },
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: variables.task }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: newTask.drawer?.id }],
            })
            onClose()
        },
    })

    const setFunc = (diff: Partial<MinimalTask>) => {
        handleChange(diff)
    }

    const submit = async () => {
        if (newTask.name === undefined || newTask.name.trim() === "") {
            toast.error(t("edit.create_no_name"))
            inputRef.current?.focus()
            return
        }

        const createdTask = await save()

        if (newTask.reminders !== undefined) {
            postReminderMutation.mutate({
                task: createdTask.id,
                reminders: newTask.reminders,
            })
        }
    }

    if (!newTask) {
        return null
    }

    return (
        <ModalBottomSheet
            onClose={onClose}
            title={title}
            icon={
                isCreating ? null : (
                    <FeatherIcon
                        icon="trash-2"
                        stroke={theme.project.danger}
                        onClick={handleAlert}
                    />
                )
            }
            handleBack={activeContent ? () => setActiveContent(null) : null}>
            <TaskCommonDetailMobileBox>
                <TaskNameInput
                    task={newTask}
                    name={newTask.name || ""}
                    setName={(name: string) => handleChange({ name })}
                    color={newTask.drawer.project.color}
                    inputRef={inputRef}
                    setFunc={setFunc}
                    isCreating
                />
                <AnimatedContent $active={activeContent}>
                    <ContentsMobile
                        task={newTask}
                        setFunc={setFunc}
                        activeContent={activeContent}
                        setActiveContent={setActiveContent}
                    />
                </AnimatedContent>
                {!activeContent && (
                    <ButtonGroup
                        $justifyContent="flex-end"
                        $margin="2em 0em 1em">
                        <Button
                            disabled={isPending}
                            loading={isPending}
                            onClick={submit}>
                            {t(
                                isCreating
                                    ? "edit.button_add"
                                    : "edit.button_save",
                            )}
                        </Button>
                    </ButtonGroup>
                )}
            </TaskCommonDetailMobileBox>
        </ModalBottomSheet>
    )
}

const TaskCommonDetailMobileBox = styled.div`
    width: 90%;
    margin: 1.2em;
`

const AnimatedContent = styled.div<{ $active: string | null }>`
    animation: ${(props) => props.$active && opacityUp} 0.3s ease-in-out;
`

export default TaskFormMobile
