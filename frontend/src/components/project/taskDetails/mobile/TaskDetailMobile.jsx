import { useEffect, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"

import TaskCommonDetailMobile from "@components/project/taskDetails/mobile/TaskCommonDetailMobile"

import { getTask } from "@api/tasks.api"

const TaskDetailMobile = ({ closeDetail }) => {
    const [_, __, color] = useOutletContext()
    const { task_id } = useParams()

    const {
        data: task,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["task", { taskID: task_id }],
        queryFn: () => getTask(task_id),
    })

    const [newTask, setNewTask] = useState(task)

    useEffect(() => {
        if (task && task.reminders?.length !== 0) {
            const deltaArray = task.reminders.map((reminder) => reminder.delta)
            setNewTask(Object.assign({}, task, { reminders: deltaArray }))
        } else {
            setNewTask(task)
        }
    }, [task])

    if (isLoading || isError) {
        return null
    }

    return (
        <TaskCommonDetailMobile
            newTask={newTask}
            setNewTask={setNewTask}
            color={color}
            onClose={closeDetail}
        />
    )
}

export default TaskDetailMobile
