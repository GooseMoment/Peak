import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import DeleteAlert from "@components/common/DeleteAlert"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Contents from "@components/project/taskDetails/Contents"
import TaskNameInput from "@components/tasks/TaskNameInput"

import { postReminder } from "@api/notifications.api"
import { deleteTask, patchTask, postTask } from "@api/tasks.api"

import { useClientSetting } from "@utils/clientSettings"
import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCommonDetail = ({
    newTask,
    setNewTask,
    projectID = null,
    projectType = null,
    color,
    isCreating = false,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })
    const inputRef = useRef(null)

    const navigate = useNavigate()
    const [setting] = useClientSetting()

    const { closeModal } = useModalWindowCloseContext()
    const { isDesktop } = useScreenType()

    const [isAlertOpen, setIsAlertOpen] = useState(false)

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
            closeModal()
        },
    })

    const handleChange = (diff) => {
        setNewTask(Object.assign({}, newTask, diff))

        if (isDesktop) {
            inputRef.current.focus()
        }
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

    const onEnter = (e) => {
        if (e.repeat) {
            return
        }

        if (mutation.isPending) {
            return
        }

        if (e.key === "Enter") {
            e.preventDefault()
            submit()
        }
    }

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
        <TaskDetailBox onKeyDown={onEnter}>
            <TaskNameBox>
                <TaskNameInput
                    task={newTask}
                    name={newTask?.name}
                    setName={(name) => handleChange({ name })}
                    inputRef={inputRef}
                    color={color}
                    setFunc={handleChange}
                />
                <Icons>
                    {isCreating || (
                        <FeatherIcon icon="trash-2" onClick={handleAlert} />
                    )}
                    <FeatherIcon icon="x" onClick={closeModal} />
                </Icons>
            </TaskNameBox>
            <Contents task={newTask} setFunc={handleChange} />
            <ButtonGroup $justifyContent="flex-end" $margin="1em 2em 2em">
                <Button
                    disabled={mutation.isPending}
                    loading={mutation.isPending}
                    onClick={submit}>
                    {t(isCreating ? "edit.button_add" : "edit.button_save")}
                </Button>
            </ButtonGroup>
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

export default TaskCommonDetail
