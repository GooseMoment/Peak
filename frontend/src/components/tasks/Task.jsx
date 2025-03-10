import { useMutation } from "@tanstack/react-query"

import TaskFrame from "./TaskFrame"

import { patchTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

const Task = ({ task, color }) => {
    const mutation = useMutation({
        mutationFn: (data) => {
            return patchTask(task.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: task.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: task.drawer }],
            })
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: task.project_id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["project", task.project_id],
            })
            queryClient.invalidateQueries({
                queryKey: ["today", "overdue"],
            })
            queryClient.invalidateQueries({
                queryKey: ["today", "assigned"],
            })
        },
    })

    const toComplete = () => {
        let completed_at = null
        if (!task.completed_at) {
            completed_at = new Date().toISOString()
        }
        mutation.mutate({ completed_at })
    }

    return (
        <TaskFrame
            task={task}
            color={color}
            isLoading={mutation.isPending}
            toComplete={toComplete}
            showTaskDetail
        />
    )
}

export default Task
