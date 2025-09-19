import { useState } from "react"

import { useMutation } from "@tanstack/react-query"

import TaskFormMobile from "@components/project/taskDetails/mobile/TaskFormMobile"
import createInitialTask from "@components/tasks/utils/createInitialTask"

import type { Drawer } from "@api/drawers.api"
import { type MinimalTask, postTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCreateMobile = ({
    drawer,
    closeCreate,
}: {
    drawer: Drawer
    closeCreate: () => void
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })

    const [newTask, setNewTask] = useState<MinimalTask>(() =>
        createInitialTask(drawer),
    )

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
        <TaskFormMobile
            newTask={newTask}
            handleChange={handleChange}
            save={() => postMutation.mutateAsync(newTask)}
            isPending={postMutation.isPending}
            onClose={closeCreate}
            isCreating
        />
    )
}

export default TaskCreateMobile
