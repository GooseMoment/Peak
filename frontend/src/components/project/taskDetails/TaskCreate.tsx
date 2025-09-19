import { useState } from "react"

import { useMutation } from "@tanstack/react-query"

import TaskForm from "@components/project/taskDetails/TaskForm"
import createInitialTask from "@components/tasks/utils/createInitialTask"

import { type Drawer } from "@api/drawers.api"
import { type MinimalTask, postTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

/// id 없고, 다 옵셔널이어도 상관없음
const TaskCreate = ({ drawer }: { drawer: Drawer }) => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })

    const [newTask, setNewTask] = useState<MinimalTask>(() =>
        createInitialTask(drawer),
    )

    const [newColor, setNewColor] = useState(drawer.project.color)

    const postMutation = useMutation({
        mutationFn: (data: MinimalTask) => {
            const taskData = {
                ...data,
                drawer: data.drawer.id,
            }
            return postTask(taskData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: drawer.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: drawer.project.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["projects", drawer.project.id],
            })
            toast.success(t("edit.create_success"))
        },
        onError: () => {
            toast.error(t("edit.create_error"))
        },
    })

    const handleChange = (diff: Partial<MinimalTask>) => {
        setNewTask(Object.assign({}, newTask, diff))
    }

    return (
        <TaskForm
            newTask={newTask}
            handleChange={handleChange}
            newColor={newColor}
            setNewColor={setNewColor}
            save={() => postMutation.mutateAsync(newTask)}
            isPending={postMutation.isPending}
            isCreating
        />
    )
}

export default TaskCreate
