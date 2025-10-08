import { useState } from "react"

import { useMutation } from "@tanstack/react-query"

import DeleteAlert from "@components/common/DeleteAlert"
import { useDeleteTask } from "@components/project/common/useDeleteTask"
import TaskForm from "@components/project/taskDetails/TaskForm"

import {
    type MinimalTask,
    type MinimalTaskWithID,
    patchTask,
} from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import { type PaletteColorName } from "@assets/palettes"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

/// id가 꼭 있어야하고 다른건 다 옵셔널이어도 상관없음
const TaskDetail = ({ task }: { task: MinimalTaskWithID }) => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })

    const [newTask, setNewTask] = useState<MinimalTaskWithID>(task)
    const [newColor, setNewColor] = useState<PaletteColorName>(
        task.drawer ? task.drawer.project.color : "grey",
    )

    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)

    const { handleAlert, handleDelete } = useDeleteTask({
        task: newTask,
        setIsAlertOpen: setIsAlertOpen,
        goBack: true,
    })

    const patchMutation = useMutation({
        mutationFn: (data: MinimalTaskWithID) => {
            const taskData = {
                ...data,
                drawer: data.drawer.id,
            }
            return patchTask(data.id, taskData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: newTask.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: task.drawer.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: newTask.drawer.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["today"],
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
            <TaskForm
                newTask={newTask}
                handleChange={handleChange}
                newColor={newColor}
                setNewColor={setNewColor}
                save={() => patchMutation.mutateAsync(newTask)}
                isPending={patchMutation.isPending}
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

export default TaskDetail
