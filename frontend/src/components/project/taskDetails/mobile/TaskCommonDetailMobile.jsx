import { useEffect, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import ModalBottomSheet, { Header } from "@components/common/ModalBottomSheet"
import DeleteAlert from "@components/common/DeleteAlert"
import ContentsMobile from "@components/project/taskDetails/mobile/ContentsMobile"
import TaskNameInput from "@components/tasks/TaskNameInput"

import { postReminder } from "@api/notifications.api"
import { patchTask, postTask, deleteTask } from "@api/tasks.api"

import { useClientSetting } from "@utils/clientSettings"
import { useNavigate } from "react-router-dom"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import FeatherIcon from "feather-icons-react"

const TaskCommonDetailMobile = ({
    newTask,
    setNewTask,
    projectID = null,
    projectType = null,
    color,
    onClose,
    isCreating = false,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })
    const inputRef = useRef(null)

    const theme = useTheme()
    const navigate = useNavigate()
    const [setting] = useClientSetting()

    const [title, setTitle] = useState(null)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [activeContent, setActiveContent] = useState(null)

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

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteTask(newTask.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: newTask.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: newTask.drawer }],
            })

            if (projectType === "goal") {
                queryClient.invalidateQueries({
                    queryKey: ["drawers", { projectID: projectID }],
                })
                queryClient.invalidateQueries({
                    queryKey: ["projects", projectID],
                })
            }

            toast.success(
                t("delete.delete_success", { task_name: newTask.name }),
            )
        },
        onError: () => {
            toast.error(t("delete.delete_error", { task_name: newTask.name }))
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

    // #TODO: AlertOpen 되게 하기
    const handleAlert = () => {
        if (setting.delete_task_after_alert) {
            setIsAlertOpen(true)
        } else {
            handleDelete()
        }
    }

    const handleDelete = () => {
        navigate(`/app/projects/${projectID}`)
        deleteMutation.mutate()
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
                    icon={isCreating ? null : 
                        <FeatherIcon icon="trash-2" stroke={theme.project.danger} onClick={handleDelete}/>}
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
                            {t(
                                isCreating
                                    ? "edit.button_add"
                                    : "edit.button_save",
                            )}
                        </Button>
                    </ButtonGroup>
                )}
            </TaskCommonDetailMobileBox>
            {/*isAlertOpen && (
                <DeleteAlert
                    title={t("delete.alert_task_title", {
                        task_name: newTask.name,
                    })}
                    onClose={() => {
                        setIsAlertOpen(false)
                    }}
                    func={handleDelete}
                />
            )*/}
        </ModalBottomSheet>
    )
}

const TaskCommonDetailMobileBox = styled.div`
    width: 90%;
    margin: 1.2em;
`

export default TaskCommonDetailMobile
