import { Dispatch, KeyboardEvent, SetStateAction, useRef } from "react"

import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Contents from "@components/project/taskDetails/Contents"
import TaskNameInput from "@components/tasks/TaskNameInput"

import { type MinimalReminder, postReminder } from "@api/notifications.api"
import type { MinimalTask, Task } from "@api/tasks.api"

import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { PaletteColorName } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

interface TaskCommonDetailProps {
    newTask: MinimalTask
    handleChange: (diff: Partial<MinimalTask>) => void
    newColor: PaletteColorName
    setNewColor: Dispatch<SetStateAction<PaletteColorName>>
    save: () => Promise<Task>
    isPending: boolean
    handleAlert?: () => void
    isCreating?: boolean
}

/// 다 옵셔널이어도 상관없음
const TaskForm = ({
    newTask,
    handleChange,
    newColor,
    setNewColor,
    save,
    isPending,
    handleAlert,
    isCreating = false,
}: TaskCommonDetailProps) => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })
    const inputRef = useRef<HTMLInputElement>(null)

    const { closeModal } = useModalWindowCloseContext()
    const { isDesktop } = useScreenType()

    const postReminderMutation = useMutation({
        mutationFn: (data: { task: string; delta_list: MinimalReminder[] }) => {
            return postReminder(data)
        },
        onSuccess: (_result, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: variables.task }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: newTask.drawer?.id }],
            })
            closeModal()
        },
        onError: () => {
            if (isCreating) {
                toast.error(t("edit.create_error"))
            }
            toast.error(t("edit.edit_error"))
        },
    })

    const setFunc = (diff: Partial<MinimalTask>) => {
        handleChange(diff)

        if (isDesktop) {
            inputRef.current?.focus()
        }
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
                delta_list: newTask.reminders,
            })
        }
    }

    const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.repeat) {
            return
        }

        if (isPending) {
            return
        }

        if (e.key === "Enter") {
            e.preventDefault()
            submit()
        }
    }

    if (!newTask) {
        return null
    }

    return (
        <TaskDetailBox onKeyDown={onEnter}>
            <TaskNameBox>
                <TaskNameInput
                    task={newTask}
                    name={newTask.name || ""}
                    setName={(name: string) => handleChange({ name })}
                    color={newColor}
                    inputRef={inputRef}
                    setFunc={setFunc}
                />
                <Icons>
                    {isCreating || (
                        <FeatherIcon
                            icon="trash-2"
                            onClick={handleAlert && handleAlert}
                        />
                    )}
                    <FeatherIcon icon="x" onClick={closeModal} />
                </Icons>
            </TaskNameBox>

            <Contents
                task={newTask}
                setFunc={setFunc}
                setNewColor={setNewColor}
            />

            <ButtonGroup $justifyContent="flex-end" $margin="1em 2em 2em">
                <Button
                    disabled={isPending}
                    loading={isPending}
                    onClick={submit}>
                    {t(isCreating ? "edit.button_add" : "edit.button_save")}
                </Button>
            </ButtonGroup>
        </TaskDetailBox>
    )
}

export const TaskDetailBox = styled.div`
    width: 50em;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.borderColor};
    border-radius: 15px;

    &::after {
        content: " ";
        display: block;
        height: 0;
        clear: both;
    }
`

const TaskNameBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1.8em 1.8em 1em;
`

const Icons = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;

    & svg {
        cursor: pointer;
        stroke: ${(p) => p.theme.primaryColors.danger};
    }
`

export default TaskForm
