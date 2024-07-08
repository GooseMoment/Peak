import TaskFrame from "./TaskFrame"
import { patchTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"
import { useMutation } from "@tanstack/react-query"

const Task = ({task, color}) => {
    const mutation = useMutation({
        mutationFn: (data) => {
            return patchTask(task.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['task', {taskID: task.id}]})
            queryClient.invalidateQueries({queryKey: ['tasks', {drawerID: task.drawer}]})
        },
    })

    const toComplete = () => {
        let completed_at = null
        if (!task.completed_at) {
            completed_at = new Date().toISOString()
        }
        mutation.mutate({completed_at})
    }

    const taskDetailPath = `/app/projects/${task.project_id}/tasks/${task.id}/detail`

    return <TaskFrame 
        task={task} color={color} 
        isLoading={mutation.isPending}
        toComplete={toComplete}
        taskDetailPath={taskDetailPath} 
    />
}

export default Task
