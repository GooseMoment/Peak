import { useEffect, useRef, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import DeleteAlert from "@components/common/DeleteAlert"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import SkeletonTaskDetail from "@components/project/skeletons/SkeletonTaskDetail"
import Contents from "@components/project/taskDetails/Contents"
import TaskNameInput from "@components/tasks/TaskNameInput"

import { deleteTask, getTask, patchTask } from "@api/tasks.api"

import { useClientSetting } from "@utils/clientSettings"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskDetail = () => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const inputRef = useRef(null)

    const [projectID, color] = useOutletContext()
    const { task_id } = useParams()
    const navigate = useNavigate()
    const [setting] = useClientSetting()

    const [taskName, setTaskName] = useState("")
    const [isAlertOpen, setIsAlertOpen] = useState(false)

    const { closeModal } = useModalWindowCloseContext()

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

    if (isLoading) {
        return (
            <TaskDetailBox>
                <SkeletonTaskDetail />
            </TaskDetailBox>
        )
    }

    if (isError) {
        return (
            <TaskDetailBox>
                <ErrorBox onClick={refetch}>{t("error_load_task")}</ErrorBox>
            </TaskDetailBox>
        )
    }

    return (
        <TaskDetailBox>
            <TaskNameBox>
                <TaskNameInput
                    task={task}
                    setFunc={patchMutation.mutate}
                    inputRef={inputRef}
                    newTaskName={taskName}
                    setNewTaskName={setTaskName}
                    color={color}
                />
                <Icons>
                    <FeatherIcon icon="trash-2" onClick={handleAlert} />
                    <FeatherIcon icon="x" onClick={closeModal} />
                </Icons>
            </TaskNameBox>
            <Contents task={task} setFunc={patchMutation.mutate} />
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
        </TaskDetailBox>
    )
}

const TaskDetailBox = styled.div`
    width: 50em;
    height: 23.5em;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.borderColor};
    border-radius: 15px;
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

export default TaskDetail
