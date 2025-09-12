import { useState } from "react"

import { DemoTaskFrame } from "@components/tasks/TaskFrame"

import { type DemoMinimalTask } from "@api/tasks.api"

import { PaletteColorName } from "@assets/palettes"

const DemoTask = ({
    task,
    color,
}: {
    task: DemoMinimalTask
    color: PaletteColorName
}) => {
    const [completed, setCompleted] = useState(task?.completed_at)
    const taskAssigned = Object.assign({}, task, { completed_at: completed })

    const toComplete = () => {
        setCompleted(!completed ? new Date().toISOString() : null)
    }

    return (
        <DemoTaskFrame
            task={taskAssigned}
            color={color}
            toComplete={toComplete}
        />
    )
}

export default DemoTask
