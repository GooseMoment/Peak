import { useMutation } from "@tanstack/react-query"

import TaskFrame from "./TaskFrame"

import { type Task, TaskPost, patchTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

const TaskBlock = ({ task }: { task: Task }) => {
    const mutation = useMutation({
        mutationFn: (data: Partial<TaskPost>) => {
            return patchTask(task.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: task.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: task.drawer.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: task.drawer.project.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["projects", task.drawer.project.id],
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
            isLoading={mutation.isPending}
            toComplete={toComplete}
            showTaskDetail
        />
    )
}

export default TaskBlock
