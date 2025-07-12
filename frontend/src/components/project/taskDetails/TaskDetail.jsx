import { useState } from "react"

import TaskCommonDetail from "@components/project/taskDetails/TaskCommonDetail"
import { initializeTask } from "@components/project/taskDetails/initializeTask"

const TaskDetail = ({ projectType, color, task }) => {
    const [newTask, setNewTask] = useState(() => initializeTask(task))
    const [newColor, setNewColor] = useState(color)

    return (
        <TaskCommonDetail
            newTask={newTask}
            setNewTask={setNewTask}
            projectType={projectType}
            newColor={newColor}
            setNewColor={setNewColor}
        />
    )
}

export default TaskDetail
