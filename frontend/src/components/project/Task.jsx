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

    const taskDetailPath = `/app/projects/${task.project_id}/tasks/${task.id}/detail`

    return <TaskFrame taskDetailPath={taskDetailPath} setFunc={mutation.mutate} task={task} color={color} />
}

export default Task
