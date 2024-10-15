import { useState } from "react"
import { useLocation, useOutletContext } from "react-router-dom"

import TaskCommonDetail from "./TaskCommonDetail"

const TaskCreate = () => {
    const [_, __, color] = useOutletContext()
    const { state } = useLocation()

    const [newTask, setNewTask] = useState({
        name: "",
        assigned_at: null,
        due_type: null,
        due_date: null,
        due_datetime: null,
        reminders: [],
        priority: 0,
        project_id: state?.project_id,
        project_name: state?.project_name,
        drawer: state?.drawer_id,
        drawer_name: state?.drawer_name,
        memo: "",
        privacy: "public",
    })

    return (
        <TaskCommonDetail
            newTask={newTask}
            setNewTask={setNewTask}
            color={color}
            isCreating
        />
    )
}

export default TaskCreate
