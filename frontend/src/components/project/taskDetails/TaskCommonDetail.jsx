import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import DeleteAlert from "@components/common/DeleteAlert"
import Button from "@components/common/Button"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Contents from "@components/project/taskDetails/Contents"
import TaskNameInput from "@components/tasks/TaskNameInput"

import { postTask, deleteTask, patchTask } from "@api/tasks.api"
import { postReminder } from "@api/notifications.api"

import { useClientSetting } from "@utils/clientSettings"
import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCommonDetail = ({ newTask, setNewTask, projectID=null, color, isCreating=false }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
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
                toast.success(t("task_create_success"))
            }
        },
        onError: () => {
            if (isCreating) {
                toast.error(t("task_create_error"))
                return
            }
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
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: projectID }],
            })
            queryClient.invalidateQueries({
                queryKey: ["projects", projectID],
            })
            toast.success(
                t("delete.task_delete_success", { task_name: newTask.name }),
            )
        },
        onError: () => {
            toast.error(t("delete.task_delete_error", { task_name: newTask.name }))
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
            toast.error(t("task_create_no_name"))
            inputRef.current.focus()
            return
        }

        const createdTask = await mutation.mutateAsync(newTask)

        if (newTask.reminders) {
            newTask.reminders.forEach((delta) => {
                postReminderMutation.mutate({ task: createdTask.id, delta: delta })
            })
        }
        closeModal()
    }

    const onEnter = (e) => {
        if (e.repeat) {
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

    return (
        newTask && <TaskDetailBox onKeyDown={onEnter}>
            <TaskNameBox>
                <TaskNameInput
                    task={newTask}
                    name={newTask?.name}
                    setName={(name) => handleChange({ name })}
                    inputRef={inputRef}
                    color={color}
                />
                <Icons>
                    {isCreating || <FeatherIcon icon="trash-2" onClick={handleAlert} />}
                    <FeatherIcon icon="x" onClick={closeModal} />
                </Icons>
            </TaskNameBox>
            <Contents task={newTask} setFunc={handleChange} />
            <StyledButton disabled={mutation.isPending} loading={mutation.isPending} onClick={submit}>
                {t(isCreating ? "button_add": "button_save")}
            </StyledButton>
            {isAlertOpen && (
                <DeleteAlert
                    title={t("delete.alert_task_title", {
                        task_name: newTask.name,
                    })}
                    onClose={() => {
                        setIsAlertOpen(false)
                    }}
                    func={handleDelete}/>
            )}
        </TaskDetailBox>
    )
}

const TaskDetailBox = styled.div`
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

const StyledButton = styled(Button)`
    float: right;
    margin: 1em;
    margin-right: 2.5em;
    margin-bottom: 1.5em;
`

export default TaskCommonDetail
