import { useState } from "react"

import { initializeTask } from "@components/project/taskDetails/initializeTask"
import TaskCommonDetailMobile from "@components/project/taskDetails/mobile/TaskCommonDetailMobile"

const TaskDetailMobile = ({ closeDetail, color, task }) => {
    const [newTask, setNewTask] = useState(() => initializeTask(task))

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
