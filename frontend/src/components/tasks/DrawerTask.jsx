import { useState } from "react"

import { useMutation } from "@tanstack/react-query"

import DragAndDownBox from "@components/project/dragAndDown/DragAndDownBox"
import Task from "@components/tasks/Task"
import DeleteAlert from "@components/common/DeleteAlert"

import { deleteTask } from "@api/tasks.api"

import useScreenType from "@utils/useScreenType"
import { useClientSetting } from "@utils/clientSettings"

import queryClient from "@queries/queryClient"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

const DrawerTask = ({ task, color, projectType }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.delete" })
    const { isMobile } = useScreenType()
    const [setting] = useClientSetting()

    const [isAlertOpen, setIsAlertOpen] = useState(false)

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteTask(task.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: task.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: task.drawer }],
            })

            if (projectType === "goal") {
                queryClient.invalidateQueries({
                    queryKey: ["drawers", { projectID: task.project_id }],
                })    
                queryClient.invalidateQueries({
                    queryKey: ["projects", task.project_id],
                })
            }

            toast.success(
                t("delete_success", { task_name: task.name }),
            )
        },
        onError: () => {
            toast.error(t("delete_error", { task_name: task.name }))
        },
    })

    const handleAlert = () => {
        if (setting.delete_task_after_alert) {
            setIsAlertOpen(true)
        } else {
            handleDelete()
        }
    }

    const handleDelete = () => {
        deleteMutation.mutate()
        setIsAlertOpen(false)
    }

    return (
        <DragAndDownBox
            task={task}
            color={color}>
            <TaskBox>
                <Task task={task} color={color} />
                {isMobile ? null : <DeleteIcon>
                    <FeatherIcon icon="trash-2" onClick={handleAlert} />
                </DeleteIcon>}
            </TaskBox>
            {isAlertOpen && (
                <DeleteAlert
                    title={t("alert_task_title", {
                        task_name: task.name,
                    })}
                    onClose={() => {
                        setIsAlertOpen(false)
                    }}
                    func={handleDelete}
                    />
            )}
        </DragAndDownBox>
    )
}

const DeleteIcon = styled.div`
    display: none;
    cursor: pointer;
    margin-left: 1em;

    & svg {
        top: 0;
        stroke: ${(p)=>p.theme.project.danger};
    }
`

const TaskBox = styled.div`
    display: flex;
    align-items: center;

    &:hover {
        ${DeleteIcon} {
            display: block;
        }
    }
`

export default DrawerTask
