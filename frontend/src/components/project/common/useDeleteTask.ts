import { Dispatch, SetStateAction } from "react"
import { useNavigate } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"

import { type MinimalTaskWithID, deleteTask } from "@api/tasks.api"

import { useClientSetting } from "@utils/clientSettings"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

interface useDeleteTaskProps {
    task: MinimalTaskWithID
    setIsAlertOpen: Dispatch<SetStateAction<boolean>>
    goBack?: boolean
}

export const useDeleteTask = ({
    task,
    setIsAlertOpen,
    goBack = false,
}: useDeleteTaskProps) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.delete" })
    const [setting] = useClientSetting()
    const navigate = useNavigate()

    const handleAlert = () => {
        if (setting.delete_task_after_alert) {
            setIsAlertOpen(true)
        } else {
            handleDelete()
        }
    }

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteTask(task.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: task.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: task.drawer.id }],
            })

            if (task.drawer.project.type === "goal") {
                queryClient.invalidateQueries({
                    queryKey: [
                        "drawers",
                        { projectID: task.drawer.project.id },
                    ],
                })
                queryClient.invalidateQueries({
                    queryKey: ["projects", task.drawer.project.id],
                })
            }

            toast.success(t("delete_success", { task_name: task.name }))
        },
        onError: () => {
            toast.error(t("delete_error", { task_name: task.name }))
        },
    })

    const handleDelete = () => {
        if (goBack) navigate(`/app/projects/${task.drawer.project.id}`)
        else setIsAlertOpen(false)

        deleteMutation.mutate()
    }

    return {
        handleAlert,
        handleDelete,
    }
}
