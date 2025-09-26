import { useState } from "react"

import { useMutation } from "@tanstack/react-query"

import DeleteAlert from "@components/common/DeleteAlert"
import { useDeleteTask } from "@components/project/common/useDeleteTask"
import TaskFormMobile from "@components/project/taskDetails/mobile/TaskFormMobile"

import {
    type MinimalTask,
    type MinimalTaskWithID,
    patchTask,
} from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskDetailMobile = ({
    task,
    closeDetail,
}: {
    task: MinimalTaskWithID
    closeDetail: () => void
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })

    const [newTask, setNewTask] = useState<MinimalTaskWithID>(task)
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)

    const { handleAlert, handleDelete } = useDeleteTask({
        task: newTask,
        setIsAlertOpen: setIsAlertOpen,
        goBack: true,
    })

    const patchMutation = useMutation({
        mutationFn: (data: MinimalTaskWithID) => {
            const { id, user, created_at, updated_at, deleted_at, ...rest } =
                data

            const taskData = {
                ...rest,
                drawer: data.drawer.id,
            }
            return patchTask(data.id, taskData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: newTask.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: newTask.drawer }],
            })
            toast.success(t("edit.edit_success"))
        },
        onError: () => {
            toast.error(t("edit.edit_error"))
        },
    })

    const handleChange = (diff: Partial<MinimalTask>) => {
        setNewTask(Object.assign({}, newTask, diff))
    }

    return (
        <>
            <TaskFormMobile
                newTask={newTask}
                handleChange={handleChange}
                save={() => patchMutation.mutateAsync(newTask)}
                isPending={patchMutation.isPending}
                onClose={closeDetail}
                handleAlert={handleAlert}
            />

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
        </>
    )
}

export default TaskDetailMobile
