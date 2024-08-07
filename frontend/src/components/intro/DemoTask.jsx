import { useState } from "react"

import TaskFrame from "@components/tasks/TaskFrame"

const DemoTask = ({ task, color }) => {
    const [completed, setCompleted] = useState(task?.completed_at)
    const taskAssigned = Object.assign({}, task, { completed_at: completed })

    const toComplete = () => {
        setCompleted(!completed)
    }

    return <TaskFrame setFunc={toComplete} task={taskAssigned} color={color} />
}

export default DemoTask
