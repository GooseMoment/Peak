import { useState, useEffect, useRef } from "react"

import styled from "styled-components"

import { useMutation } from "@tanstack/react-query"

import Button, { ButtonGroup } from "@components/common/Button"
import TaskNameInput from "@components/tasks/TaskNameInput"
import ModalBottomSheet, { Header } from "@components/common/ModalBottomSheet"
import ContentsMobile from "@components/project/taskDetails/mobile/ContentsMobile"

import { postReminder } from "@api/notifications.api"
import { patchTask, postTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCommonDetailMobile = ({
    newTask,
    setNewTask,
    color,
    onClose,
    isCreating = false,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })
    const inputRef = useRef(null)

    const [title, setTitle] = useState(null)
    const [activeContent, setActiveContent] = useState(null)

    useEffect(() => {
        if (activeContent === null) {
            if (isCreating)
                setTitle(t("edit.create_title"))
            else
                setTitle(t("edit.edit_title"))
        } else if (activeContent) {
            setTitle(t(activeContent + ".title"))
        }
    }, [activeContent])

    const mutation = useMutation({
        mutationFn: (data) => {
            if (isCreating) {
                return postTask(data)
            }
            return patchTask(newTask.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: newTask.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: newTask.drawer }],
            })
            if (isCreating) {
                queryClient.invalidateQueries({
                    queryKey: ["drawers", { projectID: newTask.project_id }],
                })
                queryClient.invalidateQueries({
                    queryKey: ["projects", newTask.project_id],
                })
                toast.success(t("edit.create_success"))
            } else {
                toast.success(t("edit.edit_success"))
            }
        },
        onError: () => {
            if (isCreating) {
                toast.error(t("edit.create_error"))
                return
            }
            toast.error(t("edit.edit_error"))
        },
    })

    const postReminderMutation = useMutation({
        mutationFn: (data) => {
            return postReminder(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: newTask.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: newTask.drawer }],
            })
            onClose()
        },
    })

    const handleChange = (diff) => {
        setNewTask(Object.assign({}, newTask, diff))
    }

    const submit = async () => {
        if (newTask.name.trim() === "") {
            toast.error(t("edit.create_no_name"))
            inputRef.current.focus()
            return
        }

        const createdTask = await mutation.mutateAsync(newTask)

        postReminderMutation.mutate({
            task: createdTask.id,
            delta_list: newTask.reminders,
        })
    }

    if (!newTask) {
        return null
    }

    return (
        <ModalBottomSheet
            onClose={onClose}
            headerContent={
                <Header
                    title={title}
                    closeSheet={onClose}
                    handleBack={
                        activeContent ? () => setActiveContent(null) : null
                    }
                />
            }>
            <TaskCommonDetailMobileBox>
                <TaskNameInput
                    task={newTask}
                    name={newTask.name}
                    setName={(name) => handleChange({ name })}
                    inputRef={inputRef}
                    color={color}
                    setFunc={handleChange}
                    isCreate
                />
                <ContentsMobile
                    newTask={newTask}
                    editNewTask={handleChange}
                    activeContent={activeContent}
                    setActiveContent={setActiveContent}
                />
                {!activeContent && (
                    <ButtonGroup
                        $justifyContent="flex-end"
                        $margin="2em 0em 1em">
                        <Button
                            disabled={mutation.isPending}
                            loading={mutation.isPending}
                            onClick={submit}>
                            {t(isCreating ? "edit.button_add" : "edit.button_save")}
                        </Button>
                    </ButtonGroup>
                )}
            </TaskCommonDetailMobileBox>
        </ModalBottomSheet>
    )
}

const TaskCommonDetailMobileBox = styled.div`
    margin: 1em 1.2em;
`

export default TaskCommonDetailMobile
