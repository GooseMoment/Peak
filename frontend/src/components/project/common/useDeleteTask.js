import { useNavigate } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"

import { deleteTask } from "@api/tasks.api"
import { useClientSetting } from "@utils/clientSettings"

import queryClient from "@queries/queryClient"

import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

export const useDeleteTask = ({ task, projectType, setIsAlertOpen, goBack = false }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.delete" })
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
    
    const handleDelete = () => {
        if (goBack)
            navigate(`/app/projects/${task.project_id}`)
        else
            setIsAlertOpen(false)

        deleteMutation.mutate()
    }

    return {
        handleAlert,
        handleDelete,
    }
}
