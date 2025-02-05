import { useEffect, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import ModalBottomSheet, { Header } from "@components/common/ModalBottomSheet"
import DeleteAlert from "@components/common/DeleteAlert"
import ContentsMobile from "@components/project/taskDetails/mobile/ContentsMobile"
import TaskNameInput from "@components/tasks/TaskNameInput"
import { useDeleteTask } from "@components/project/common/useDeleteTask"

import { postReminder } from "@api/notifications.api"
import { patchTask, postTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import FeatherIcon from "feather-icons-react"

const TaskCommonDetailMobile = ({
    newTask,
    setNewTask,
    projectType = null,
    color,
    onClose,
    isCreating = false,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })
    const inputRef = useRef(null)

    const theme = useTheme()

    const [title, setTitle] = useState(null)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [activeContent, setActiveContent] = useState(null)

    const { handleAlert, handleDelete } = useDeleteTask({
        task: newTask,
        projectType: projectType,
        setIsAlertOpen: setIsAlertOpen,
        goBack: true,
    })

    useEffect(() => {
        if (activeContent === null) {
            if (isCreating) setTitle(t("edit.create_title"))
            else setTitle(t("edit.edit_title"))
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
            headerContent={
                <Header
                    title={title}
                    icon={isCreating ? null : 
                        <FeatherIcon icon="trash-2" stroke={theme.project.danger} onClick={handleAlert}/>}
                    closeSheet={onClose}
                    handleBack={
                        activeContent ? () => setActiveContent(null) : null
                    }
                />
            }
            blocking={!isAlertOpen}
            onClose={onClose}>
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
                            {t(
                                isCreating
                                    ? "edit.button_add"
                                    : "edit.button_save",
                            )}
                        </Button>
                    </ButtonGroup>
                )}
            </TaskCommonDetailMobileBox>
            {isAlertOpen && (
                <DeleteAlert
                    title={t("delete.alert_task_title", {
                        task_name: newTask.name,
                    })}
                    onClose={() => {
                        setIsAlertOpen(false)
                    }}
                    func={handleDelete}
                />
            )}
        </ModalBottomSheet>
    )
}

const TaskCommonDetailMobileBox = styled.div`
    width: 90%;
    margin: 1.2em;
`

export default TaskCommonDetailMobile
