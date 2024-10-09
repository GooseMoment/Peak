import { useRef, useState, useEffect } from "react"
import { useOutletContext, useParams, useNavigate } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import DeleteAlert from "@components/common/DeleteAlert"
import TaskNameInput from "@components/tasks/TaskNameInput"
import ContentsMobile from "./ContentsMobile"

import { getTask, patchTask, deleteTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import { useClientSetting } from "@utils/clientSettings"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskDetailMobile = ({ closeDetail }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })

    const inputRef = useRef(null)

    const [projectID, color] = useOutletContext()
    const { task_id } = useParams()
    const navigate = useNavigate()
    const [setting] = useClientSetting()

    const [taskName, setTaskName] = useState("")
    const [isAlertOpen, setIsAlertOpen] = useState(false)

    const {
        data: task,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["task", { taskID: task_id }],
        queryFn: () => getTask(task_id),
    })

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchTask(task_id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: task_id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: task.drawer }],
            })
            inputRef.current.focus()
        },
    })

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteTask(task_id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: task_id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: task.drawer }],
            })
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: projectID }],
            })
            queryClient.invalidateQueries({
                queryKey: ["projects", projectID],
            })
            toast.success(
                t("delete.task_delete_success", { task_name: task.name }),
            )
        },
        onError: () => {
            toast.error(t("delete.task_delete_error", { task_name: task.name }))
        },
    })

    useEffect(() => {
        setTaskName(task?.name)
    }, [task])

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
        task && <TaskDetailMobileBox>
            <TaskNameInput
                task={task}
                setFunc={patchMutation.mutate}
                inputRef={inputRef}
                newTaskName={taskName}
                setNewTaskName={setTaskName}
                color={color}
            />
            <ContentsMobile newTask={task} editNewTask={patchMutation.mutate}/>
            {isAlertOpen && (
                <DeleteAlert
                    title={t("delete.alert_task_title", {
                        task_name: task.name,
                    })}
                    onClose={() => {
                        setIsAlertOpen(false)
                    }}
                    func={handleDelete}
                />
            )}
        </TaskDetailMobileBox>
    )
}

const TaskDetailMobileBox = styled.div`
    margin: 1em 1.2em;
`

export default TaskDetailMobile
